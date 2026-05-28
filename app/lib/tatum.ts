/**
 * Tatum RPC client for Sui.
 *
 * TATUM_API_KEY must be set in .env.local (server-side only).
 * See https://docs.tatum.io for API reference.
 */

const TATUM_API_KEY = process.env.TATUM_API_KEY;
const TATUM_BASE_URL = process.env.TATUM_SUI_RPC_URL ?? 'https://api.tatum.io/v3/blockchain/node/SUI';

function tatumHeaders() {
  if (!TATUM_API_KEY) {
    throw new Error('TATUM_API_KEY is not set. Add it to .env.local');
  }
  return {
    'Content-Type': 'application/json',
    'x-api-key': TATUM_API_KEY,
  };
}

/** Raw JSON-RPC call to the Tatum Sui endpoint. */
async function rpc<T>(method: string, params: unknown[]): Promise<T> {
  const res = await fetch(TATUM_BASE_URL, {
    method: 'POST',
    headers: tatumHeaders(),
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  if (!res.ok) throw new Error(`Tatum RPC HTTP ${res.status}: ${await res.text()}`);
  const json = await res.json() as { result?: T; error?: { message: string } };
  if (json.error) throw new Error(`Tatum RPC error: ${json.error.message}`);
  return json.result as T;
}

export interface SuiObject {
  objectId: string;
  owner: { AddressOwner?: string; ObjectOwner?: string; Shared?: unknown } | string;
  type: string;
  content?: unknown;
}

/** Fetch a Sui object by its ID and return ownership information. */
export async function getSuiObject(objectId: string): Promise<SuiObject> {
  const result = await rpc<{ data: SuiObject }>('sui_getObject', [
    objectId,
    { showContent: true, showOwner: true, showType: true },
  ]);
  return result.data;
}

/**
 * Verify that `walletAddress` currently owns the Kiosk object `kioskId`.
 * Returns true if ownership is confirmed.
 */
export async function verifyKioskOwnership(kioskId: string, walletAddress: string): Promise<boolean> {
  const obj = await getSuiObject(kioskId);
  const owner = typeof obj.owner === 'object' ? obj.owner.AddressOwner : undefined;
  return owner?.toLowerCase() === walletAddress.toLowerCase();
}
