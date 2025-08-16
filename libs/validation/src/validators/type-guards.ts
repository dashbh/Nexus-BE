// Type guard validators for domain types

/**
 * Validates if an object matches the User interface structure
 */
export function isValidUser(obj: unknown): obj is Record<string, unknown> {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const user = obj as Record<string, unknown>;
  return (
    typeof user.id === 'string' &&
    typeof user.email === 'string' &&
    typeof user.isLocked === 'boolean' &&
    typeof user.failedLoginAttempts === 'number' &&
    user.createdAt instanceof Date &&
    user.updatedAt instanceof Date
  );
}

/**
 * Validates if an object matches the JwtPayload interface structure
 */
export function isValidJwtPayload(
  obj: unknown,
): obj is Record<string, unknown> {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const payload = obj as Record<string, unknown>;
  return (
    typeof payload.sub === 'string' &&
    typeof payload.email === 'string' &&
    typeof payload.iat === 'number' &&
    typeof payload.exp === 'number'
  );
}

/**
 * Validates if an object matches the SessionData interface structure
 */
export function isValidSessionData(
  obj: unknown,
): obj is Record<string, unknown> {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const session = obj as Record<string, unknown>;
  return (
    typeof session.userId === 'string' &&
    typeof session.email === 'string' &&
    session.loginTime instanceof Date &&
    session.lastActivity instanceof Date &&
    typeof session.refreshToken === 'string'
  );
}
