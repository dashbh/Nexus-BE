// WebSocket related errors
import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../constants/error-codes';
import { NexusError, ErrorDetails } from './base-error';

export class WebSocketError extends NexusError {
  constructor(
    code: ErrorCodes = ErrorCodes.WEBSOCKET_CONNECTION_FAILED,
    message: string = 'WebSocket error',
    details?: ErrorDetails,
    correlationId?: string,
  ) {
    super(code, message, HttpStatus.BAD_REQUEST, details, correlationId);
    this.name = 'WebSocketError';
  }
}
