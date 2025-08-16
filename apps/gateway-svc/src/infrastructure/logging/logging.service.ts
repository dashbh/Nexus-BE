import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as correlationId from 'correlation-id';

@Injectable()
export class LoggingService implements LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  private getCorrelationId(): string | undefined {
    return correlationId.getId();
  }

  log(message: string, context?: string) {
    this.logger.info(message, {
      context,
      correlationId: this.getCorrelationId(),
    });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, {
      trace,
      context,
      correlationId: this.getCorrelationId(),
    });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, {
      context,
      correlationId: this.getCorrelationId(),
    });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, {
      context,
      correlationId: this.getCorrelationId(),
    });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, {
      context,
      correlationId: this.getCorrelationId(),
    });
  }

  info(message: string, context?: string) {
    this.logger.info(message, {
      context,
      correlationId: this.getCorrelationId(),
    });
  }
}
