import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { POST } from '../route';
import { processCVFile } from '@/lib/cv/extractor';
import { db } from '@/lib/db/drizzle';
import { getUser } from '@/lib/db/queries';

// Mock dependencies
vi.mock('@/lib/db/drizzle', () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(),
      })),
    })),
  },
}));

vi.mock('@/lib/cv/extractor', () => ({
  processCVFile: vi.fn(),
}));

vi.mock('@/lib/db/queries', () => ({
  getUser: vi.fn(),
}));

describe('CV Upload API Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Utility function to create a mock request with FormData
  const createMockRequest = (file?: File) => {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }

    const request = new NextRequest('http://localhost:3000/api/cv/upload', {
      method: 'POST',
      body: formData,
    });

    return request;
  };

  it('should return 401 if user is not authenticated', async () => {
    // Mock getUser to return null (unauthenticated)
    vi.mocked(getUser).mockResolvedValueOnce(null);

    const request = createMockRequest();
    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: 'You must be logged in to upload a CV',
      type: 'UNAUTHORIZED',
    });
  });

  it('should return 400 if no file is uploaded', async () => {
    // Mock getUser to return a valid user
    vi.mocked(getUser).mockResolvedValueOnce({
      id: 1,
      name: 'Test User',
    } as any);

    const request = createMockRequest(); // No file provided
    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: 'No file uploaded',
      type: 'BAD_REQUEST',
    });
  });

  it('should successfully process and store CV data', async () => {
    // Mock getUser to return a valid user
    vi.mocked(getUser).mockResolvedValueOnce({
      id: 1,
      name: 'Test User',
    } as any);

    // Create a mock file
    const mockFile = new File(['test content'], 'resume.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    // Mock the CV processing result
    const mockCVData = {
      userId: '1',
      fileName: 'resume.docx',
      fileSize: 12345,
      fileType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      content: 'Sample CV content',
      jsonContent: {
        fullName: 'John Doe',
        rawText: 'Sample CV content',
      },
    };
    vi.mocked(processCVFile).mockResolvedValueOnce(mockCVData);

    // Mock DB insertion result
    const returningMock = vi.fn().mockResolvedValueOnce([
      {
        id: 123,
        ...mockCVData,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    const valuesMock = vi.fn().mockReturnValue({ returning: returningMock });
    const insertMock = vi.fn().mockReturnValue({ values: valuesMock });
    vi.mocked(db.insert).mockImplementation(insertMock);

    const request = createMockRequest(mockFile);
    const response = await POST(request);

    // Verify response
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message: 'CV uploaded and processed successfully',
      cvId: 123,
    });

    // Verify that processCVFile was called with the correct arguments
    expect(processCVFile).toHaveBeenCalledWith(mockFile, '1');

    // Verify that the database functions were called
    expect(insertMock).toHaveBeenCalled();
    expect(valuesMock).toHaveBeenCalledWith({
      userId: 1,
      fileName: 'resume.docx',
      fileSize: 12345,
      fileType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      content: 'Sample CV content',
      jsonContent: {
        fullName: 'John Doe',
        rawText: 'Sample CV content',
      },
    });
    expect(returningMock).toHaveBeenCalled();
  });

  it('should handle errors during processing', async () => {
    // Mock getUser to return a valid user
    vi.mocked(getUser).mockResolvedValueOnce({
      id: 1,
      name: 'Test User',
    } as any);

    // Create a mock file
    const mockFile = new File(['test content'], 'resume.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    // Mock processCVFile to throw an error
    vi.mocked(processCVFile).mockRejectedValueOnce(
      new Error('Processing failed'),
    );

    const request = createMockRequest(mockFile);
    const response = await POST(request);

    // Verify response
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: 'Failed to process CV file',
      type: 'PROCESSING_ERROR',
    });
  });

  it('should handle database errors', async () => {
    // Mock getUser to return a valid user
    vi.mocked(getUser).mockResolvedValueOnce({
      id: 1,
      name: 'Test User',
    } as any);

    // Create a mock file
    const mockFile = new File(['test content'], 'resume.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    // Mock CV processing to succeed
    const mockCVData = {
      userId: '1',
      fileName: 'resume.docx',
      fileSize: 12345,
      fileType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      content: 'Sample CV content',
      jsonContent: {
        fullName: 'John Doe',
        rawText: 'Sample CV content',
      },
    };
    vi.mocked(processCVFile).mockResolvedValueOnce(mockCVData);

    // Mock DB insertion to fail
    const returningMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('Database connection failed'));
    const valuesMock = vi.fn().mockReturnValue({ returning: returningMock });
    const insertMock = vi.fn().mockReturnValue({ values: valuesMock });
    vi.mocked(db.insert).mockImplementation(insertMock);

    const request = createMockRequest(mockFile);
    const response = await POST(request);

    // Verify response
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: 'Failed to process CV file',
      type: 'PROCESSING_ERROR',
    });
  });
});
