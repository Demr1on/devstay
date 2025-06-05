import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const adminPassword = searchParams.get('password');

  // Simple Admin-Schutz
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Webhook-Handler Status
    const webhookHandlers = [
      { event: 'checkout.session.completed', status: '✅ Implementiert' },
      { event: 'checkout.session.async_payment_succeeded', status: '✅ Implementiert' },
      { event: 'checkout.session.async_payment_failed', status: '✅ Implementiert' },
      { event: 'payment_intent.succeeded', status: '✅ Implementiert' },
      { event: 'payment_intent.payment_failed', status: '✅ Implementiert' },
      { event: 'charge.refunded', status: '🆕 Neu implementiert' },
      { event: 'charge.dispute.created', status: '🆕 Neu implementiert' },
    ];

    // Environment Check
    const envCheck = {
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    };

    return NextResponse.json({
      message: 'Webhook Status Check',
      webhookHandlers,
      environmentVariables: envCheck,
      webhookEndpoint: `${req.nextUrl.origin}/api/webhooks`,
      instructions: {
        step1: 'Gehe zu dashboard.stripe.com → Webhooks',
        step2: 'Finde deinen Webhook-Endpoint',
        step3: 'Klick "Configure" → "Events to send"',
        step4: 'Füge hinzu: charge.refunded, charge.dispute.created',
        step5: 'Speichern und Test-Event senden'
      }
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Webhook Status Check fehlgeschlagen',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 