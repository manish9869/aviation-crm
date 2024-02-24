import { sha256 } from 'js-sha256';

export class ShaGeneratorHelper {
  generateSHA256(codeToHash: string): string {
    return sha256(codeToHash);
  }
}
