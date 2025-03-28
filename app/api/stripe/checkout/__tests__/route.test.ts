import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../route';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { setSession } from '@/lib/auth/session';
import { APIError, ErrorType } from '@/lib/api/errors';

// Mock dependencies
vi.mock('@/lib/db/drizzle', () => ({
  db: {
    select: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('@/lib/auth/session', () => ({
  setSession: vi.fn(),
}));

vi.mock('@/lib/payments/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        retrieve: vi.fn(),
      },
    },
    subscriptions: {
      retrieve: vi.fn(),
    },
  },
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

describe('Stripe Checkout API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to pricing if no session_id is provided', async () => {
    const req = new NextRequest('http://localhost:3000/api/stripe/checkout');
    const response = await GET(req);

    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe(
      'http://localhost:3000/pricing',
    );
  });

  it('should process a successful checkout session', async () => {
    // Setup mocks
    const { stripe } = await import('@/lib/payments/stripe');

    // Mock Stripe API calls
    vi.mocked(stripe.checkout.sessions.retrieve).mockResolvedValue({
      customer: { id: 'cus_123' },
      subscription: 'sub_123',
      client_reference_id: '1',
    } as any);

    vi.mocked(stripe.subscriptions.retrieve).mockResolvedValue({
      id: 'sub_123',
      status: 'active',
      items: {
        data: [
          {
            price: {
              product: {
                id: 'prod_123',
                name: 'Pro Plan',
              },
            },
          },
        ],
      },
    } as any);

    // Mock the database calls
    // First select call - user query
    const selectMock = vi.fn();
    const fromMock = vi.fn();
    const whereMock = vi.fn();
    const limitMock = vi.fn();

    limitMock.mockResolvedValue([{ id: 1, name: 'Test User' }]);
    whereMock.mockReturnValue({ limit: limitMock });
    fromMock.mockReturnValue({ where: whereMock });
    selectMock.mockReturnValue({ from: fromMock });

    // Second select call - team query
    const teamSelectMock = vi.fn();
    const teamFromMock = vi.fn();
    const teamWhereMock = vi.fn();
    const teamLimitMock = vi.fn();

    teamLimitMock.mockResolvedValue([{ teamId: 2 }]);
    teamWhereMock.mockReturnValue({ limit: teamLimitMock });
    teamFromMock.mockReturnValue({ where: teamWhereMock });
    teamSelectMock.mockReturnValue({ from: teamFromMock });

    // Update call
    const updateMock = vi.fn();
    const setMock = vi.fn();
    const updateWhereMock = vi.fn();

    updateWhereMock.mockResolvedValue(undefined);
    setMock.mockReturnValue({ where: updateWhereMock });
    updateMock.mockReturnValue({ set: setMock });

    // Chain the mocks
    vi.mocked(db.select)
      .mockImplementationOnce(selectMock)
      .mockImplementationOnce(teamSelectMock);
    vi.mocked(db.update).mockImplementation(updateMock);

    // Create request with session_id
    const req = new NextRequest(
      'http://localhost:3000/api/stripe/checkout?session_id=cs_123',
    );
    const response = await GET(req);

    // Verify response
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe(
      'http://localhost:3000/dashboard',
    );

    // Verify function calls
    expect(stripe.checkout.sessions.retrieve).toHaveBeenCalledWith('cs_123', {
      expand: ['customer', 'subscription'],
    });

    expect(stripe.subscriptions.retrieve).toHaveBeenCalledWith('sub_123', {
      expand: ['items.data.price.product'],
    });

    // Verify setSession was called
    expect(setSession).toHaveBeenCalledWith({ id: 1, name: 'Test User' });
  });

  it('should redirect to error page on processing error', async () => {
    // Mock Stripe checkout session retrieval to throw an error
    const { stripe } = await import('@/lib/payments/stripe');

    vi.mocked(stripe.checkout.sessions.retrieve).mockRejectedValue(
      new Error('Stripe API error'),
    );

    // Create request with session_id
    const req = new NextRequest(
      'http://localhost:3000/api/stripe/checkout?session_id=cs_123',
    );
    const response = await GET(req);

    // Verify response
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe(
      'http://localhost:3000/error',
    );
  });
});
