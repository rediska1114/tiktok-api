import { createCipheriv } from 'crypto';

const AES_KEY = 'webapp1.0+202106';
const AES_IV = 'webapp1.0+202106';

/**
 * Generate XTTPParams
 * @param {any} params - The params you want to encrypt
 * @returns {string}
 */
export function generateXTTParams(params: any): string {
  const cipher = createCipheriv('aes-128-cbc', AES_KEY, AES_IV);
  return Buffer.concat([cipher.update(params), cipher.final()]).toString(
    'base64',
  );
}
