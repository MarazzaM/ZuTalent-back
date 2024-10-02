import { Injectable, BadRequestException } from '@nestjs/common';
import { POD, podEntriesFromSimplifiedJSON } from "@pcd/pod";
import { ScoreService } from '../score/score.service';

@Injectable()
export class PodService {
  private readonly ZUPASS_SIGNING_KEY = process.env.ZUPASS_SIGNING_KEY;
  private readonly MIN_REQUIRED_SCORE = Number(process.env.MIN_REQUIRED_SCORE) || 20;

  constructor(private readonly scoreService: ScoreService) {}

  async createOrRetrievePodpcd(owner: string, wallet: string): Promise<string> {
    if (!this.ZUPASS_SIGNING_KEY) {
      throw new Error('Server configuration error: Signing key not set');
    }
    try {       
      // Check the wallet's score
      const passportData = await this.scoreService.getPassportById(wallet);
      if (passportData.passport.score >= this.MIN_REQUIRED_SCORE) {
        // Continue with POD creation
      } else {
        throw new BadRequestException(`Insufficient score: Minimum required score is ${this.MIN_REQUIRED_SCORE}`);
      }
      
      const pod = POD.sign(
        podEntriesFromSimplifiedJSON(JSON.stringify({
          zupass_display: "Jupiter",
          zupass_title: "Jupiter",
          zupass_image_url: "https://jup.io/favicon.ico",
          timestamp: new Date().toISOString(),
          issuedBy: "Jupiter",
          owner: owner,
          wallet: wallet
        })),
        this.ZUPASS_SIGNING_KEY
      );
      return pod.serialize();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // Re-throw BadRequestException
      }
      console.error('Error creating or retrieving POD:', error);
      throw new Error('Failed to create or retrieve POD');
    }
  }
}