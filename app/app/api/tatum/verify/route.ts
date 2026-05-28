import { NextRequest } from 'next/server';
import { verifyKioskOwnership } from '@/lib/tatum';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { kioskId?: string; walletAddress?: string };
    const { kioskId, walletAddress } = body;

    if (!kioskId || !walletAddress) {
      return Response.json({ error: 'kioskId and walletAddress are required' }, { status: 400 });
    }

    const verified = await verifyKioskOwnership(kioskId, walletAddress);
    return Response.json({ verified, kioskId, walletAddress });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Verification failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
