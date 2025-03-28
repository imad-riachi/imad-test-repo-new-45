import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { APIError, ErrorType, createErrorResponse } from '../errors';

describe('API Error Handling', () => {
  // Mock console.error to prevent noise in test output
  const originalConsoleError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe('APIError Class', () => {
    it('should create an APIError with the correct properties', () => {
      const error = new APIError('Test error', ErrorType.BAD_REQUEST, 400);
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(APIError);
      expect(error.message).toBe('Test error');
      expect(error.type).toBe(ErrorType.BAD_REQUEST);
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe('APIError');
    });
  });

  describe('createErrorResponse', () => {
    it('should handle APIError correctly', async () => {
      const apiError = new APIError(
        'Invalid input',
        ErrorType.BAD_REQUEST,
        400,
      );
      const response = createErrorResponse(apiError);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        error: 'Invalid input',
        type: ErrorType.BAD_REQUEST,
      });
      expect(console.error).toHaveBeenCalledWith('API Error:', apiError);
    });

    it('should handle generic Error as unknown error', async () => {
      const genericError = new Error('Something went wrong');
      const response = createErrorResponse(genericError);

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({
        error: 'An unexpected error occurred',
        type: ErrorType.UNKNOWN_ERROR,
      });
      expect(console.error).toHaveBeenCalledWith('API Error:', genericError);
    });

    it('should handle non-error objects', async () => {
      const nonError = 'This is not an error';
      const response = createErrorResponse(nonError);

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({
        error: 'An unexpected error occurred',
        type: ErrorType.UNKNOWN_ERROR,
      });
      expect(console.error).toHaveBeenCalledWith('API Error:', nonError);
    });
  });
});
