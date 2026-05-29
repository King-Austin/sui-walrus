'use client';

import { StatusDot } from './StatusDot';

export function TatumBadge() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'var(--rp-bg-sunken)',
      border: '0.5px solid var(--rp-border-strong)',
      borderRadius: 8, padding: '8px 14px',
      fontFamily: "'DM Mono', monospace",
      fontSize: 13, color: 'var(--rp-text-secondary)',
    }}>
      <StatusDot />
      <span>
        Tatum RPC ·{' '}
        <span style={{ color: 'var(--rp-accent-green)', fontWeight: 500 }}>Sui Mainnet</span>
      </span>
    </div>
  );
}
