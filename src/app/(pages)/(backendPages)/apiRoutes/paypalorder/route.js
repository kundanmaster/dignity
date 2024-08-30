import { NextResponse } from 'next/server';

const PAYPAL_API = 'https://api-m.sandbox.paypal.com/v2/checkout/orders';
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET;

const getAccessToken = async () => {
  try {
    const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }),
    });

    if (!response.ok) {
      console.error('Error fetching access token:', response.statusText);
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error in getAccessToken:', error);
    throw error;
  }
};

export async function POST(req) {
  
  try {
    const { amount } = await req.json();
    console.log('Request body:', { amount });

    if (!amount) {
      return NextResponse.json({ error: 'Invalid request, amount is required' }, { status: 400 });
    }

    const accessToken = await getAccessToken();

    const response = await fetch(PAYPAL_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: amount,
            },
          },
        ],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
        },
      }),
    });

    const order = await response.json();
    console.log('Created PayPal order:', order);

    if (!response.ok) {
      console.error('Error creating PayPal order:', order);
      return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 });
    }

    return NextResponse.json({ id: order.id });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return NextResponse.json({ error: 'Error creating PayPal order' }, { status: 500 });
  }
}
