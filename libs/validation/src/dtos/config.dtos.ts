// Configuration related DTOs
import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

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
