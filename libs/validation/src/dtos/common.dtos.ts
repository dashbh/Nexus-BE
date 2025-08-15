// Common DTOs for pagination, WebSocket, etc.
import {
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsString,
  IsIn,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

// Pagination DTOs
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number = 10;

  @IsOptional()
  @IsString({ message: 'Sort by must be a string' })
  sortBy?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'], { message: 'Sort order must be ASC or DESC' })
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}

// WebSocket DTOs
export class WebSocketMessageDto {
  @IsString({ message: 'Message type is required' })
  type: string;

  @IsOptional()
  payload?: any;

  @IsOptional()
  @IsString({ message: 'Correlation ID must be a string' })
  correlationId?: string;
}

export class WebSocketSubscriptionDto {
  @IsString({ message: 'Channel is required' })
  channel: string;

  @IsOptional()
  @IsArray({ message: 'Filters must be an array' })
  filters?: string[];
}
