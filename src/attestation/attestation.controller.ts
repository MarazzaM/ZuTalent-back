import { Controller, Post, Body } from '@nestjs/common';
import { AttestationService } from './attestation.service';

@Controller('attestation')
export class AttestationController {
  constructor(private readonly attestationService: AttestationService) {}

  @Post()
  async createAttestation(@Body() ticketData: any) {
    return await this.attestationService.createAttestation(ticketData);
  }
}
