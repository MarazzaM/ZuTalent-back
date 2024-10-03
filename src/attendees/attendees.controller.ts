import { Controller, Get, Param } from '@nestjs/common';
import { AttendeesService } from './attendees.service';

@Controller('attendees')
export class AttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Get(':email')
  getAttendeeUrl(@Param('email') email: string): { url: string } {
    return this.attendeesService.getAttendeeUrl(email);
  }
}
