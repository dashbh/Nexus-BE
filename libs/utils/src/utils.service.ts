import { Injectable } from '@nestjs/common';
import { randomBytes, createHash, pbkdf2Sync } from 'crypto';

@Injectable()
export class UtilsService {
  /**
   * Generates a random UUID v4
   */
  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Generates a correlation ID for request tracking
   */
  generateCorrelationId(): string {
    return this.generateUUID();
  }

  /**
   * Hashes a password using PBKDF2
   */
  hashPassword(
    password: string,
    salt?: string,
  ): { hash: string; salt: string } {
    const passwordSalt = salt || randomBytes(32).toString('hex');
    const hash = pbkdf2Sync(
      password,
      passwordSalt,
      10000,
      64,
      'sha512',
    ).toString('hex');
    return { hash, salt: passwordSalt };
  }

  /**
   * Verifies a password against its hash
   */
  verifyPassword(password: string, hash: string, salt: string): boolean {
    const verifyHash = pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString(
      'hex',
    );
    return hash === verifyHash;
  }

  /**
   * Generates a secure random token
   */
  generateSecureToken(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }

  /**
   * Creates a SHA-256 hash of input
   */
  createSHA256Hash(input: string): string {
    return createHash('sha256').update(input).digest('hex');
  }

  /**
   * Delays execution for specified milliseconds
   */
  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Retries an async operation with exponential backoff
   */
  async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxRetries) {
          throw lastError;
        }

        const delay = baseDelay * Math.pow(2, attempt);
        await this.delay(delay);
      }
    }

    throw lastError || new Error('Operation failed after retries');
  }

  /**
   * Formats a date to ISO string
   */
  formatDate(date: Date): string {
    return date.toISOString();
  }

  /**
   * Parses a date from string
   */
  parseDate(dateString: string): Date {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string');
    }
    return date;
  }

  /**
   * Calculates time difference in milliseconds
   */
  getTimeDifference(startDate: Date, endDate: Date): number {
    return endDate.getTime() - startDate.getTime();
  }

  /**
   * Checks if a date is expired
   */
  isExpired(expiryDate: Date): boolean {
    return new Date() > expiryDate;
  }

  /**
   * Sanitizes object by removing undefined/null values
   */
  sanitizeObject<T extends Record<string, unknown>>(obj: T): Partial<T> {
    const sanitized: Partial<T> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null) {
        sanitized[key as keyof T] = value as T[keyof T];
      }
    }

    return sanitized;
  }

  /**
   * Deep clones an object
   */
  deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime()) as unknown as T;
    }

    if (obj instanceof Array) {
      return obj.map((item: unknown) => this.deepClone(item)) as unknown as T;
    }

    const cloned = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = this.deepClone(obj[key]);
      }
    }

    return cloned;
  }

  /**
   * Converts string to camelCase
   */
  toCamelCase(str: string): string {
    return str.replace(/([-_][a-z])/gi, (match) => {
      return match.toUpperCase().replace('-', '').replace('_', '');
    });
  }

  /**
   * Converts string to snake_case
   */
  toSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '');
  }

  /**
   * Truncates string to specified length
   */
  truncateString(
    str: string,
    maxLength: number,
    suffix: string = '...',
  ): string {
    if (str.length <= maxLength) {
      return str;
    }
    return str.substring(0, maxLength - suffix.length) + suffix;
  }

  /**
   * Validates and normalizes email
   */
  normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  /**
   * Generates a random integer between min and max (inclusive)
   */
  randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Checks if value is empty (null, undefined, empty string, empty array, empty object)
   */
  isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) {
      return true;
    }

    if (typeof value === 'string' || Array.isArray(value)) {
      return value.length === 0;
    }

    if (typeof value === 'object' && value !== null) {
      return Object.keys(value).length === 0;
    }

    return false;
  }
}
