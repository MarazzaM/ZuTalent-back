import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import attendees from './attendees.json';

@Injectable()
export class AttendeesService {
  private attendeesList: string[] = attendees;

  constructor(private configService: ConfigService) {}

  getAttendeeUrl(email: string): { url: string } | never {
    const normalizedEmail = email.toLowerCase();
    const isAttendee = this.attendeesList.some(
      (attendeeEmail) => attendeeEmail.toLowerCase() === normalizedEmail
    );

    if (isAttendee) {
      const zupassFeedUrl = this.configService.get<string>('ZUPASS_FEED_URL');
      return { url: `${zupassFeedUrl}` };
    }

    throw new NotFoundException(`Attendee with email ${email} not found`);
  }
}
