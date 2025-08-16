// Base error class and interfaces
import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../constants/error-codes';

export interface ErrorDetails {
  field?: string;
  value?: unknown;
  constraint?: string;
  context?: Record<string, unknown>;
}

export class NexusError extends Error {
  public readonly code: string;
  public readonly httpStatus: HttpStatus;
  public readonly details?: ErrorDetails;
  public readonly timestamp: Date;
  public readonly correlationId?: string;

  constructor(
    code: ErrorCodes,
    message: string,
    httpStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    details?: ErrorDetails,
    correlationId?: string,
  ) {
    super(message);
    this.name = 'NexusError';
    this.code = code;
    this.httpStatus = httpStatus;
    this.details = details;
    this.timestamp = new Date();
    this.correlationId = correlationId;
  }
}
