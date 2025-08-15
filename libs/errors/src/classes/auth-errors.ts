// Authentication related errors
import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../constants/error-codes';
import { NexusError, ErrorDetails } from './base-error';

export class AuthenticationError extends NexusError {
  constructor(
    code: ErrorCodes = ErrorCodes.UNAUTHORIZED,
    message: string = 'Authentication failed',
    details?: ErrorDetails,
    correlationId?: string,
  ) {
    super(code, message, HttpStatus.UNAUTHORIZED, details, correlationId);
    this.name = 'AuthenticationError';
  }
}
