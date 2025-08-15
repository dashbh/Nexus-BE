// gRPC Utility Functions

/**
 * Validates gRPC request structure
 */
export function validateGrpcRequest(
  serviceName: string,
  methodName: string,
  request: unknown,
): boolean {
  // Basic validation - in a real implementation, you would use protobuf validation
  return request !== null && typeof request === 'object';
}

/**
 * Creates a standardized gRPC error response
 */
export function createGrpcErrorResponse(message: string): {
  success: boolean;
  message: string;
} {
  return {
    success: false,
    message,
  };
}

/**
 * Creates a standardized gRPC success response
 */
export function createGrpcSuccessResponse<T extends Record<string, unknown>>(
  data?: T,
): { success: boolean } & T {
  return {
    success: true,
    ...(data || ({} as T)),
  };
}
