// Define error types for better error handling
export enum ErrorType {
  UNAUTHORIZED = 'UNAUTHORIZED',
  BAD_REQUEST = 'BAD_REQUEST',
  PROCESSING_ERROR = 'PROCESSING_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// Custom error class for API errors
export class APIError extends Error {
  type: ErrorType;
  statusCode: number;

  constructor(message: string, type: ErrorType, statusCode: number) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.name = 'APIError';
  }
}

// Helper function to create standardized API error responses
export const createErrorResponse = (error: unknown) => {
  console.error('API Error:', error);

  // Handle APIError with type and status code
  if (error instanceof APIError) {
    return Response.json(
      {
        error: error.message,
        type: error.type,
      },
      { status: error.statusCode },
    );
  }

  // Handle unexpected errors
  return Response.json(
    {
      error: 'An unexpected error occurred',
      type: ErrorType.UNKNOWN_ERROR,
    },
    { status: 500 },
  );
};
