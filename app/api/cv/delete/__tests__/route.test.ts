import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DELETE } from '../route';
import { db } from '@/lib/db/drizzle';
import { getUser } from '@/lib/db/queries';
import { NextRequest } from 'next/server';
import { APIError, ErrorType } from '@/lib/api/errors';

// Mock dependencies
vi.mock('@/lib/db/drizzle', () => ({
  db: {
    delete: vi.fn(() => ({
      where: vi.fn(() => ({
        returning: vi.fn(),
      })),
    })),
  },
}));

vi.mock('@/lib/db/queries', () => ({
  getUser: vi.fn(),
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

describe('CV Delete API Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    // Mock getUser to return null (unauthenticated)
    vi.mocked(getUser).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost:3000/api/cv/delete?id=1');
    const response = await DELETE(request);

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: 'You must be logged in to delete a CV',
      type: 'UNAUTHORIZED',
    });
  });

  it('should return 400 if CV ID is not provided', async () => {
    // Mock getUser to return a valid user
    vi.mocked(getUser).mockResolvedValueOnce({
      id: 1,
      name: 'Test User',
    } as any);

    const request = new NextRequest('http://localhost:3000/api/cv/delete');
    const response = await DELETE(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: 'CV ID is required',
      type: 'BAD_REQUEST',
    });
  });

  it('should return 404 if CV is not found or user does not have permission', async () => {
    // Mock getUser to return a valid user
    vi.mocked(getUser).mockResolvedValueOnce({
      id: 1,
      name: 'Test User',
    } as any);

    // Mock database query to return empty result (no CV found or no permission)
    const returningMock = vi.fn().mockResolvedValueOnce([]);
    const whereMock = vi.fn().mockReturnValue({ returning: returningMock });
    const deleteMock = vi.fn().mockReturnValue({ where: whereMock });
    vi.mocked(db.delete).mockImplementation(deleteMock);

    const request = new NextRequest(
      'http://localhost:3000/api/cv/delete?id=999',
    );
    const response = await DELETE(request);

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: 'CV not found or you do not have permission to delete it',
      type: 'BAD_REQUEST',
    });
  });

  it('should successfully delete a CV', async () => {
    // Mock getUser to return a valid user
    vi.mocked(getUser).mockResolvedValueOnce({
      id: 1,
      name: 'Test User',
    } as any);

    // Mock database query to return successful result
    const returningMock = vi
      .fn()
      .mockResolvedValueOnce([{ id: 1, userId: 1, fileName: 'test.docx' }]);
    const whereMock = vi.fn().mockReturnValue({ returning: returningMock });
    const deleteMock = vi.fn().mockReturnValue({ where: whereMock });
    vi.mocked(db.delete).mockImplementation(deleteMock);

    const request = new NextRequest('http://localhost:3000/api/cv/delete?id=1');
    const response = await DELETE(request);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message: 'CV deleted successfully',
    });

    // Verify db delete was called with the correct where clause
    expect(deleteMock).toHaveBeenCalled();
    expect(whereMock).toHaveBeenCalled();
  });

  it('should handle database errors', async () => {
    // Mock getUser to return a valid user
    vi.mocked(getUser).mockResolvedValueOnce({
      id: 1,
      name: 'Test User',
    } as any);

    // Mock database query to throw an error
    const returningMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('Database error'));
    const whereMock = vi.fn().mockReturnValue({ returning: returningMock });
    const deleteMock = vi.fn().mockReturnValue({ where: whereMock });
    vi.mocked(db.delete).mockImplementation(deleteMock);

    const request = new NextRequest('http://localhost:3000/api/cv/delete?id=1');
    const response = await DELETE(request);

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: 'An unexpected error occurred',
      type: 'UNKNOWN_ERROR',
    });
  });
});
