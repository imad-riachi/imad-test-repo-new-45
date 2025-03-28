# API Error Handling Module

This module provides standardized error handling for all API routes in the Next.js application.

## Usage

### Import the module

```typescript
import { APIError, ErrorType, createErrorResponse } from '@/lib/api';
```

### Basic pattern

Implement the following pattern in your API routes:

```typescript
export async function POST(req: NextRequest) {
  try {
    // Your route logic here

    // Example error throwing
    if (!user) {
      throw new APIError(
        'You must be logged in',
        ErrorType.UNAUTHORIZED,
        401
      );
    }

    // Return success response
    return Response.json({ success: true, data: { ... } });
  } catch (error) {
    // Handle all errors in a standardized way
    return createErrorResponse(error);
  }
}
```

### Error Types

The module defines the following error types:

- `UNAUTHORIZED` - User is not authenticated or lacks permissions (401/403)
- `BAD_REQUEST` - Invalid input or request parameters (400)
- `PROCESSING_ERROR` - Error during request processing (500)
- `DATABASE_ERROR` - Database-related errors (500)
- `UNKNOWN_ERROR` - Unexpected errors (500)

### Testing

For testing API routes with error handling, you can mock the error module:

```typescript
vi.mock('@/lib/api/errors', () => ({
  APIError: vi.fn().mockImplementation((message, type, statusCode) => ({
    message,
    type,
    statusCode,
    name: 'APIError',
  })),
  ErrorType: {
    UNAUTHORIZED: 'UNAUTHORIZED',
    BAD_REQUEST: 'BAD_REQUEST',
    PROCESSING_ERROR: 'PROCESSING_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  },
  createErrorResponse: vi.fn((error) => {
    if (error.type) {
      return Response.json(
        {
          error: error.message,
          type: error.type,
        },
        { status: error.statusCode },
      );
    }
    return Response.json(
      {
        error: 'An unexpected error occurred',
        type: 'UNKNOWN_ERROR',
      },
      { status: 500 },
    );
  }),
}));
```
