import { Injectable } from '@nestjs/common';
import * as CryptoUtils from './crypto';
import * as DateUtils from './date';
import * as ObjectUtils from './object';
import * as StringUtils from './string';
import * as AsyncUtils from './async';
import * as ApiUtils from './api';

@Injectable()
export class UtilsService {
  // Crypto utilities
  generateUUID = CryptoUtils.generateUUID;
  generateCorrelationId = CryptoUtils.generateCorrelationId;
  hashPassword = CryptoUtils.hashPassword;
  verifyPassword = CryptoUtils.verifyPassword;
  generateSecureToken = CryptoUtils.generateSecureToken;
  createSHA256Hash = CryptoUtils.createSHA256Hash;

  // Date utilities
  formatDate = DateUtils.formatDate;
  parseDate = DateUtils.parseDate;
  getTimeDifference = DateUtils.getTimeDifference;
  isExpired = DateUtils.isExpired;

  // Object utilities
  sanitizeObject = ObjectUtils.sanitizeObject;
  deepClone = ObjectUtils.deepClone;
  isEmpty = ObjectUtils.isEmpty;

  // String utilities
  toCamelCase = StringUtils.toCamelCase;
  toSnakeCase = StringUtils.toSnakeCase;
  truncateString = StringUtils.truncateString;
  normalizeEmail = StringUtils.normalizeEmail;
  randomInt = StringUtils.randomInt;

  // Async utilities
  delay = AsyncUtils.delay;
  retryWithBackoff = AsyncUtils.retryWithBackoff;

  // API utilities
  createApiResponse = ApiUtils.createApiResponse;
  createPaginationMeta = ApiUtils.createPaginationMeta;
  createPaginatedResponse = ApiUtils.createPaginatedResponse;
}
