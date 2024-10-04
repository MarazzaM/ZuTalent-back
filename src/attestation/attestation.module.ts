import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AttestationService } from './attestation.service';
import { AttestationController } from './attestation.controller';
import { ScoreModule } from '../score/score.module'; 

@Module({
  imports: [
    ConfigModule,
    ScoreModule, 
  ],
  controllers: [AttestationController],
  providers: [AttestationService],
  exports: [AttestationService],
})
export class AttestationModule {}
