import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../route';
import { getUserLatestCV } from '@/lib/db/queries';
import { NextRequest } from 'next/server';
import { APIError, ErrorType } from '@/lib/api/errors';

// Mock dependencies
vi.mock('@/lib/db/queries', () => ({
  getUserLatestCV: vi.fn(),
}));

// Mock the API errors module
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

describe('CV Get Latest API Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null CV when no CV is found', async () => {
    // Mock getUserLatestCV to return null (no CV found)
    vi.mocked(getUserLatestCV).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost:3000/api/cv/get-latest');
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ cv: null });
  });

  it('should return the latest CV when found', async () => {
    // Mock getUserLatestCV to return a valid CV
    const mockCV = {
      id: 1,
      userId: 1,
      fileName: 'resume.docx',
      fileSize: 12345,
      fileType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      content: 'Sample CV content',
      jsonContent: { fullName: 'John Doe' },
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    };

    vi.mocked(getUserLatestCV).mockResolvedValueOnce(mockCV);

    const request = new NextRequest('http://localhost:3000/api/cv/get-latest');
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      cv: {
        id: 1,
        fileName: 'resume.docx',
        fileSize: 12345,
        fileType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        createdAt: mockCV.createdAt.toISOString(),
      },
    });
  });

  it('should handle errors from getUserLatestCV', async () => {
    // Mock getUserLatestCV to throw an error
    vi.mocked(getUserLatestCV).mockRejectedValueOnce(
      new Error('Database connection failed'),
    );

    const request = new NextRequest('http://localhost:3000/api/cv/get-latest');
    const response = await GET(request);

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: 'An unexpected error occurred',
      type: 'UNKNOWN_ERROR',
    });
  });
});
