'use client';

import { StatusDot } from './StatusDot';

export function TatumBadge() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 7,
      background: 'var(--s2)', border: '1px solid var(--border)',
      borderRadius: 8, padding: '7px 12px', fontSize: 12, color: 'var(--t2)',
    }}>
      <StatusDot/>
      <span>Tatum RPC · <span style={{ color: 'var(--accent)', fontWeight: 500 }}>Sui Mainnet</span></span>
    </div>
  );
}
