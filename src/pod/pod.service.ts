import { Injectable } from '@nestjs/common';
import { POD, podEntriesFromSimplifiedJSON } from "@pcd/pod";


@Injectable()
export class PodService {
  private readonly ZUPASS_SIGNING_KEY = process.env.ZUPASS_SIGNING_KEY;

  async createOrRetrievePodpcd( owner: string, wallet: string): Promise<string> {
    if (!this.ZUPASS_SIGNING_KEY) {
      throw new Error('Server configuration error: Signing key not set');
    }
    try {
      console.log("Owner:", owner);
      console.log("Wallet:", wallet);
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
      console.error('Error creating or retrieving POD:', error);
      throw new Error('Error creating or retrieving POD');
    }
  }
}