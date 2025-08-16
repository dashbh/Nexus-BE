// Validation related errors
import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../constants/error-codes';
import { NexusError, ErrorDetails } from './base-error';

export class ValidationError extends NexusError {
  constructor(
    message: string = 'Validation failed',
    details?: ErrorDetails,
    correlationId?: string,
  ) {
    super(
      ErrorCodes.VALIDATION_FAILED,
      message,
      HttpStatus.BAD_REQUEST,
      details,
      correlationId,
    );
    this.name = 'ValidationError';
  }
}
