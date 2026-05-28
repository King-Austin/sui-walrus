import { NextRequest } from 'next/server';
import { getSuiObject } from '@/lib/tatum';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const objectId = request.nextUrl.searchParams.get('id');
    if (!objectId) {
      return Response.json({ error: 'id query parameter is required' }, { status: 400 });
    }

    const object = await getSuiObject(objectId);
    return Response.json({ object });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch object';
    return Response.json({ error: message }, { status: 500 });
  }
}
