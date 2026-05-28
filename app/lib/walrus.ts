/**
 * Walrus storage integration.
 *
 * Current state: stub that simulates upload/retrieval.
 * To wire real Walrus:
 *   1. npm install @mysten/walrus (when the SDK is stable)
 *   2. Replace uploadToWalrus with WalrusClient.writeBlob()
 *   3. Replace getBlobUrl with WalrusClient.readBlob() or direct aggregator URL
 *
 * Publisher and aggregator URLs are configured via env vars (see .env.example).
 */

const PUBLISHER = process.env.WALRUS_PUBLISHER_URL ?? 'https://publisher.walrus-testnet.walrus.space';
const AGGREGATOR = process.env.WALRUS_AGGREGATOR_URL ?? 'https://aggregator.walrus-testnet.walrus.space';

export interface UploadResult {
  blobId: string;
  url: string;
}

/**
 * Upload a file buffer to Walrus and return the blob ID.
 * Called from the /api/walrus/upload route handler (server-side).
 *
 * TODO: replace with real Walrus SDK call:
 *   const client = new WalrusClient({ network: 'mainnet' });
 *   const result = await client.writeBlob({ blob: buffer, epochs: 5 });
 *   return { blobId: result.blobId, url: getBlobUrl(result.blobId) };
 */
export async function uploadToWalrus(buffer: Buffer, _mimeType: string): Promise<UploadResult> {
  // Stub: real implementation calls the publisher HTTP API:
  // PUT {PUBLISHER}/v1/blobs?epochs=5  with the raw file bytes in the body
  const response = await fetch(`${PUBLISHER}/v1/blobs?epochs=5`, {
    method: 'PUT',
    body: buffer as unknown as BodyInit,
    headers: { 'Content-Type': 'application/octet-stream' },
  });

  if (!response.ok) {
    throw new Error(`Walrus publisher error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as { newlyCreated?: { blobObject: { blobId: string } }; alreadyCertified?: { blobId: string } };
  const blobId = data.newlyCreated?.blobObject?.blobId ?? data.alreadyCertified?.blobId;
  if (!blobId) throw new Error('Walrus did not return a blob ID');

  return { blobId, url: getBlobUrl(blobId) };
}

/** Direct aggregator URL for downloading a blob — safe to expose to clients. */
export function getBlobUrl(blobId: string): string {
  return `${AGGREGATOR}/v1/blobs/${blobId}`;
}
