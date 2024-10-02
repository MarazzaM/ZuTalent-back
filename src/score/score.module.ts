import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [ScoreController],
  providers: [ScoreService],
})
export class ScoreModule {}
