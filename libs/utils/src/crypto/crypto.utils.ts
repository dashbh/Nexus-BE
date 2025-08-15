// Cryptographic utility functions
import { randomBytes, createHash, pbkdf2Sync } from 'crypto';

/**
 * Generates a random UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generates a correlation ID for request tracking
 */
export function generateCorrelationId(): string {
  return generateUUID();
}

/**
 * Hashes a password using PBKDF2
 */
export function hashPassword(
  password: string,
  salt?: string,
): { hash: string; salt: string } {
  const passwordSalt = salt || randomBytes(32).toString('hex');
  const hash = pbkdf2Sync(password, passwordSalt, 10000, 64, 'sha512').toString(
    'hex',
  );
  return { hash, salt: passwordSalt };
}

/**
 * Verifies a password against its hash
 */
export function verifyPassword(
  password: string,
  hash: string,
  salt: string,
): boolean {
  const verifyHash = pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString(
    'hex',
  );
  return hash === verifyHash;
}

/**
 * Generates a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

/**
 * Creates a SHA-256 hash of input
 */
export function createSHA256Hash(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}
