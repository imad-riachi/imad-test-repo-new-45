import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { POST } from './route';
import { ZodError } from 'zod';

// Mock dependencies
vi.mock('@/lib/auth/session', async () => {
  return {
    getSession: vi.fn(),
  };
});

vi.mock('@/lib/cv-rewriter/rewriter', async () => {
  return {
    rewriteCV: vi.fn(),
  };
});

vi.mock('@/lib/db/drizzle', () => {
  return {
    db: {},
  };
});

// Import mocked functions
import { getSession } from '@/lib/auth/session';
import { rewriteCV } from '@/lib/cv-rewriter/rewriter';

describe('CV Rewrite API', () => {
  const mockUser = { id: 'user123', name: 'Test User' };
  const mockSession = { user: mockUser };

  const validCvData = {
    name: 'Test User',
    contactInfo: {
      email: 'test@example.com',
    },
    workExperience: [
      {
        company: 'Test Company',
        position: 'Developer',
        period: '2020-Present',
        responsibilities: ['Coding'],
      },
    ],
    education: [
      {
        institution: 'Test University',
        degree: 'BS',
        year: '2019',
      },
    ],
    skills: [{ name: 'JavaScript' }],
  };

  const validJobDescription =
    'This is a valid job description with more than ten words to meet the validation requirements.';

  // Mock rewrite response
  const mockRewriteResponse = {
    originalCv: validCvData,
    rewrittenCv: validCvData,
    jobDescription: validJobDescription,
    matches: {
      skills: [],
      experience: [],
    },
    improvements: [],
  };

  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();

    // Set up default mock returns
    (getSession as any).mockResolvedValue(mockSession);
    (rewriteCV as any).mockResolvedValue(mockRewriteResponse);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 401 when no session is found', async () => {
    // Mock no session
    (getSession as any).mockResolvedValue(null);

    // Create request
    const request = new NextRequest('http://localhost/api/cv/rewrite', {
      method: 'POST',
      body: JSON.stringify({
        cvData: validCvData,
        jobDescription: validJobDescription,
      }),
    });

    // Call API
    const response = await POST(request);

    // Assertions
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(401);

    const jsonData = await response.json();
    expect(jsonData).toHaveProperty('error', 'Authentication required');
  });

  it('returns 400 when request data is invalid', async () => {
    // Create request with invalid data (missing required fields)
    const request = new NextRequest('http://localhost/api/cv/rewrite', {
      method: 'POST',
      body: JSON.stringify({
        // Missing cvData
        jobDescription: validJobDescription,
      }),
    });

    // Call API
    const response = await POST(request);

    // Assertions
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(400);

    const jsonData = await response.json();
    expect(jsonData).toHaveProperty('error', 'Invalid request data');
    expect(jsonData).toHaveProperty('details');
  });

  it('returns 400 when job description is too short', async () => {
    // Create request with short job description
    const request = new NextRequest('http://localhost/api/cv/rewrite', {
      method: 'POST',
      body: JSON.stringify({
        cvData: validCvData,
        jobDescription: 'Too short',
      }),
    });

    // Call API
    const response = await POST(request);

    // Assertions
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(400);
  });

  it('returns 200 with rewritten CV when request is valid', async () => {
    // Create valid request
    const request = new NextRequest('http://localhost/api/cv/rewrite', {
      method: 'POST',
      body: JSON.stringify({
        cvData: validCvData,
        jobDescription: validJobDescription,
      }),
    });

    // Call API
    const response = await POST(request);

    // Assertions
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);

    // Verify rewriteCV was called with correct params
    expect(rewriteCV).toHaveBeenCalledWith(validCvData, validJobDescription);

    // Check response data
    const jsonData = await response.json();
    expect(jsonData).toHaveProperty('originalCv');
    expect(jsonData).toHaveProperty('rewrittenCv');
    expect(jsonData).toHaveProperty('jobDescription');
    expect(jsonData).toHaveProperty('matches');
    expect(jsonData).toHaveProperty('improvements');
  });

  it('returns 500 when rewriteCV throws an error', async () => {
    // Mock rewriteCV to throw error
    (rewriteCV as any).mockRejectedValue(new Error('Test error'));

    // Create valid request
    const request = new NextRequest('http://localhost/api/cv/rewrite', {
      method: 'POST',
      body: JSON.stringify({
        cvData: validCvData,
        jobDescription: validJobDescription,
      }),
    });

    // Call API
    const response = await POST(request);

    // Assertions
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(500);

    const jsonData = await response.json();
    expect(jsonData).toHaveProperty('error', 'Failed to rewrite CV');
    expect(jsonData).toHaveProperty('message', 'Test error');
  });
});
