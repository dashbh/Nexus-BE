// External service related errors
import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../constants/error-codes';
import { NexusError, ErrorDetails } from './base-error';

export class ExternalServiceError extends NexusError {
  constructor(
    code: ErrorCodes = ErrorCodes.EXTERNAL_SERVICE_UNAVAILABLE,
    message: string = 'External service error',
    details?: ErrorDetails,
    correlationId?: string,
  ) {
    super(
      code,
      message,
      HttpStatus.SERVICE_UNAVAILABLE,
      details,
      correlationId,
    );
    this.name = 'ExternalServiceError';
  }
}
