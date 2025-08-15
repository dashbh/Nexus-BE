import { Injectable } from '@nestjs/common';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  IsUUID,
  IsDateString,
  IsIn,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

// Authentication DTOs
export class CreateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must be at least 8 characters long and contain uppercase, lowercase, number, and symbol',
    },
  )
  password: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString({ message: 'Password is required' })
  @MinLength(1, { message: 'Password cannot be empty' })
  password: string;
}

export class RefreshTokenDto {
  @IsString({ message: 'Refresh token is required' })
  refreshToken: string;
}

export class ChangePasswordDto {
  @IsString({ message: 'Current password is required' })
  currentPassword: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'New password must be at least 8 characters long and contain uppercase, lowercase, number, and symbol',
    },
  )
  newPassword: string;
}

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

// Event DTOs
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

// Configuration DTOs
export class DatabaseConfigDto {
  @IsString({ message: 'Database host is required' })
  host: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Database port must be a number' })
  @Min(1, { message: 'Database port must be at least 1' })
  @Max(65535, { message: 'Database port cannot exceed 65535' })
  port: number;

  @IsString({ message: 'Database username is required' })
  username: string;

  @IsString({ message: 'Database password is required' })
  password: string;

  @IsString({ message: 'Database name is required' })
  database: string;

  @IsOptional()
  @IsBoolean({ message: 'Synchronize must be a boolean' })
  synchronize?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Logging must be a boolean' })
  logging?: boolean;
}

export class RedisConfigDto {
  @IsString({ message: 'Redis host is required' })
  host: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Redis port must be a number' })
  @Min(1, { message: 'Redis port must be at least 1' })
  @Max(65535, { message: 'Redis port cannot exceed 65535' })
  port: number;

  @IsOptional()
  @IsString({ message: 'Redis password must be a string' })
  password?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Redis DB must be a number' })
  @Min(0, { message: 'Redis DB must be at least 0' })
  db?: number;
}

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
}
