import { Injectable } from '@nestjs/common';
import * as TypeGuards from './validators/type-guards';

@Injectable()
export class ValidationService {
  /**
   * Validates email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates password strength
   */
  isStrongPassword(password: string): boolean {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonalphas = /\W/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasNonalphas
    );
  }

  /**
   * Validates UUID format
   */
  isValidUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Sanitizes string input
   */
  sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  /**
   * Validates pagination parameters
   */
  validatePagination(
    page: number,
    limit: number,
  ): { page: number; limit: number } {
    const validPage = Math.max(1, Math.floor(page) || 1);
    const validLimit = Math.min(100, Math.max(1, Math.floor(limit) || 10));

    return { page: validPage, limit: validLimit };
  }

  // Type guard validators
  isValidUser = TypeGuards.isValidUser;
  isValidJwtPayload = TypeGuards.isValidJwtPayload;
  isValidSessionData = TypeGuards.isValidSessionData;
}
