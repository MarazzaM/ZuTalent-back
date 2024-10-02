import { Controller, Get, Param } from '@nestjs/common';
import { ScoreService } from './score.service';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get('passport/:id')
  async getPassport(@Param('id') id: string) {
    return this.scoreService.getPassportById(id);
  }
}
