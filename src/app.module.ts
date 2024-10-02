import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrivyModule } from './privy/privy.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { PodModule } from './pod/pod.module';
import { ScoreModule } from './score/score.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    PrivyModule,
    PodModule,
    ScoreModule,    
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}