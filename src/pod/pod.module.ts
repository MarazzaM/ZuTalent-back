import { Module } from '@nestjs/common';
import { PodService } from './pod.service';
import { PodController } from './pod.controller';
import { PrivyModule } from '../privy/privy.module';
import { ScoreModule } from 'src/score/score.module';

@Module({
  imports: [PrivyModule, ScoreModule],
  controllers: [PodController],
  providers: [PodService],
})
export class PodModule {}
