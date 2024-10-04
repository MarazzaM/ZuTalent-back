import { Injectable } from '@nestjs/common';
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { sha256 } from 'js-sha256';
import { POD } from "@pcd/pod";
import { ScoreService } from "../score/score.service";
// Add these imports
import axios from 'axios';

@Injectable()
export class AttestationService {
  private readonly provider: ethers.JsonRpcProvider;
  private readonly signer: ethers.Wallet;
  private readonly eas: EAS;

  constructor(
    private readonly configService: ConfigService,
    private readonly scoreService: ScoreService
  ) {
    const PRIVATE_KEY = this.configService.get<string>('PRIVATE_KEY')!;
    const ALCHEMY_URL = this.configService.get<string>('ALCHEMY_URL')!;
    const EAS_CONTRACT_ADDRESS = this.configService.get<string>('EAS_CONTRACT_ADDRESS')!;

    this.provider = new ethers.JsonRpcProvider(ALCHEMY_URL);
    this.signer = new ethers.Wallet(PRIVATE_KEY, this.provider);
    this.eas = new EAS(EAS_CONTRACT_ADDRESS);
  }

  private generateNullifier(ticketData: any, ): string {
    // Extract relevant data from the ticket
    const owner = ticketData._content._map.get('owner')?.value?.value || '';
    const timestamp = ticketData._content._map.get('timestamp')?.value?.value || '';
    const wallet = ticketData._content._map.get('wallet')?.value?.value || '';

    // Combine the data into a single string
    const dataToHash = `${owner}|${timestamp}|${wallet}|${ticketData._signerPublicKey}`;

    // Generate a SHA-256 hash of the combined data
    const nullifier = sha256(dataToHash);

    return nullifier;
  }

  async createAttestation(ticketData: any) {
    try {
      console.log("ticketData", ticketData);
      
      // Access the wallet data
      const wallet = ticketData.entries.wallet?.value 
      console.log("Wallet:", wallet);
      
      // Fetch passport data using the wallet address
      const passportData = await this.scoreService.getPassportById(wallet);
      const score = passportData?.passport.score;

      console.log("Passport data:", passportData);

      // Extract the POD data from the ticketData object
      const podData = {
        entries: ticketData.entries,
        signature: ticketData.signature,
        signerPublicKey: ticketData.signerPublicKey
      };

      // Serialize and deserialize the POD data
      const serializedPodData = JSON.stringify(podData);
      const podObject = POD.deserialize(serializedPodData);
      console.log("Pod object:", podObject);

    // Access the wallet data
    const nullifier = this.generateNullifier(podObject);
      
    await this.eas.connect(this.signer);
    const schemaUID = "0x4007ca3e517687c2e3776271b5a8b83c2d730cd39481e9d1b6e9308e0ac6c0a6";
    const schemaEncoder = new SchemaEncoder("uint8 score,bytes32 nullifier");
    console.log("Nullifier:", nullifier);
    const hashedNullifier = ethers.keccak256(ethers.toUtf8Bytes(nullifier));

    // Check for existing attestations
    const existingAttestations = await this.checkExistingAttestations(hashedNullifier);
    if (existingAttestations.length > 0) {
      console.log("Attestation already exists for this nullifier");
      return {
        message: "Attestation already exists for this nullifier",
        existingAttestation: existingAttestations[0],
        intendedData: {
          score: score,
          nullifier: hashedNullifier
        }
      };
    }

    const encodedData = schemaEncoder.encodeData([
      { name: "score", value: score.toString(), type: "uint8" },
      { name: "nullifier", value: hashedNullifier, type: "bytes32" }
    ]);
    const tx = await this.eas.attest({
      schema: schemaUID,
      data: {
        recipient: "0x0000000000000000000000000000000000000000",
        expirationTime: 0n,
        revocable: true,
        data: encodedData,
      },
    });

    const newAttestationUID = await tx.wait();
    console.log("New attestation UID:", newAttestationUID);

    return {
      message: "New attestation created",
      attestationUID: newAttestationUID,
      data: {
        score: score,
        nullifier: hashedNullifier
      }
    };
  } catch (error) {
    console.error("Error creating attestation:", error);
    throw error;
  }
}

private async checkExistingAttestations(hashedNullifier: string): Promise<any[]> {
  const query = `
    query Attestations($where: AttestationWhereInput) {
      attestations(where: $where) {
        id
        attester
        recipient
        decodedDataJson
      }
    }
  `;

  const variables = {
    where: {
      decodedDataJson: {
        contains: hashedNullifier
      },
      schemaId: {
        equals: "0x4007ca3e517687c2e3776271b5a8b83c2d730cd39481e9d1b6e9308e0ac6c0a6"
      }
    }
  };

  try {
    const response = await axios.post('https://base-sepolia.easscan.org/graphql', {
      query,
      variables
    });

    return response.data.data.attestations;
  } catch (error) {
    console.error("Error checking existing attestations:", error);
    return [];
    }
  }
}