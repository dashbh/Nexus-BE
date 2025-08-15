// Date and time utility functions

/**
 * Formats a date to ISO string
 */
export function formatDate(date: Date): string {
  return date.toISOString();
}

/**
 * Parses a date from string
 */
export function parseDate(dateString: string): Date {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string');
  }
  return date;
}

/**
 * Calculates time difference in milliseconds
 */
export function getTimeDifference(startDate: Date, endDate: Date): number {
  return endDate.getTime() - startDate.getTime();
}

/**
 * Checks if a date is expired
 */
export function isExpired(expiryDate: Date): boolean {
  return new Date() > expiryDate;
}
