import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AttestationService } from './attestation.service';
import { PrivyGuard } from '../privy/privy.guard';

@Controller('attestation')
export class AttestationController {
  constructor(private readonly attestationService: AttestationService) {}

  @Post()
  @UseGuards(PrivyGuard) 
  async createAttestation(@Body() ticketData: any) {
    return await this.attestationService.createAttestation(ticketData);
  }
}
