import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AttestationService } from './attestation.service';
import { AttestationController } from './attestation.controller';
import { ScoreModule } from '../score/score.module'; 
import { PrivyModule } from '../privy/privy.module'; 

@Module({
  imports: [
    ConfigModule,
    ScoreModule, 
    PrivyModule, 
  ],
  controllers: [AttestationController],
  providers: [AttestationService],
  exports: [AttestationService],
})
export class AttestationModule {}
