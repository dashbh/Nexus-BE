// Security related errors
import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../constants/error-codes';
import { NexusError, ErrorDetails } from './base-error';

export class SecurityError extends NexusError {
  constructor(
    code: ErrorCodes = ErrorCodes.RATE_LIMIT_EXCEEDED,
    message: string = 'Security violation',
    details?: ErrorDetails,
    correlationId?: string,
  ) {
    super(code, message, HttpStatus.TOO_MANY_REQUESTS, details, correlationId);
    this.name = 'SecurityError';
  }
}
