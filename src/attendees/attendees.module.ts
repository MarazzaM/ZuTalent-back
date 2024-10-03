import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AttendeesService } from './attendees.service';
import { AttendeesController } from './attendees.controller';

@Module({
  imports: [ConfigModule],
  controllers: [AttendeesController],
  providers: [AttendeesService],
})
export class AttendeesModule {}
