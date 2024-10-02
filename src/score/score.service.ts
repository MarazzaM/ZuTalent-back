import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ScoreService {
  private readonly apiUrl = 'https://api.talentprotocol.com/api/v2';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getPassportById(id: string) {
    const apiKey = this.configService.get<string>('TALENT_PROTOCOL_API');
    
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/passports/${id}`, {
          headers: {
            'X-API-KEY': apiKey,
          },
        })
      );
      return response.data;
    } catch (error) {
      // Handle error (e.g., log it, throw a custom exception, etc.)
      throw new Error(`Failed to fetch passport data: ${error.message}`);
    }
  }
}
