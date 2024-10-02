import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrivyClient } from '@privy-io/server-auth';

@Injectable()
export class PrivyService {
  private readonly privyClient: PrivyClient;

  constructor(private configService: ConfigService) {
    const appId = this.configService.get<string>('PRIVY_APP_ID');
    const appSecret = this.configService.get<string>('PRIVY_APP_SECRET');

    if (!appId || !appSecret) {
      throw new Error('Privy environment variables are not set.');
    }

    this.privyClient = new PrivyClient(appId, appSecret);
  }

  getPrivyClient(): PrivyClient {
    return this.privyClient;
  }
}