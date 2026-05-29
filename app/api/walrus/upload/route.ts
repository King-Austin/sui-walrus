import { NextRequest } from 'next/server';
import { uploadToWalrus } from '@/lib/walrus';

export const runtime = 'nodejs';
// Walrus uploads can be large
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || 'application/octet-stream';

    const result = await uploadToWalrus(buffer, mimeType);
    return Response.json({ blobId: result.blobId, url: result.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
