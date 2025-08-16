// Event related DTOs
import { IsUUID, IsString, IsDateString, IsOptional } from 'class-validator';

export class BaseEventDto {
  @IsUUID(4, { message: 'Event ID must be a valid UUID' })
  eventId: string;

  @IsString({ message: 'Event type is required' })
  eventType: string;

  @IsDateString({}, { message: 'Timestamp must be a valid date string' })
  timestamp: Date;

  @IsUUID(4, { message: 'Correlation ID must be a valid UUID' })
  correlationId: string;

  @IsOptional()
  @IsUUID(4, { message: 'User ID must be a valid UUID' })
  userId?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
