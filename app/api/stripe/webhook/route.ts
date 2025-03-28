import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { NextRequest } from 'next/server';
import { APIError, ErrorType, createErrorResponse } from '@/lib/api/errors';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('stripe-signature') as string;

    if (!signature) {
      throw new APIError(
        'Stripe signature missing from headers',
        ErrorType.BAD_REQUEST,
        400,
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed.', err);
      throw new APIError(
        'Webhook signature verification failed',
        ErrorType.BAD_REQUEST,
        400,
      );
    }

    switch (event.type) {
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return Response.json({ received: true });
  } catch (error) {
    return createErrorResponse(error);
  }
}
