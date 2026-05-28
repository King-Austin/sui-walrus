'use client';

import { useState } from 'react';
import type { WalletInfo, WalletOption } from '@/lib/types';
import { WALLET_OPTIONS } from '@/lib/mock-data';
import { Spinner } from './Spinner';
import { TatumBadge } from './TatumBadge';

function randHex(n: number) {
  return Array.from({ length: n }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
}

interface WalletModalProps {
  onConnect: (wallet: WalletInfo) => void;
  onClose: () => void;
}

export function WalletModal({ onConnect, onClose }: WalletModalProps) {
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (w: WalletOption) => {
    setConnecting(w.id);
    await new Promise(r => setTimeout(r, 1800));
    const addr = '0x' + randHex(40);
    onConnect({
      address: addr,
      short: addr.slice(0, 6) + '…' + addr.slice(-4),
      wallet: w.name,
      balance: (Math.random() * 35 + 5).toFixed(3),
    });
  };

  const initials: Record<string, string> = { sui: 'S', martian: 'M', ethos: 'E', suiet: 'SU' };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onClick={onClose}
    >
      <div
        className="fade-in"
        style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 18, padding: 32, width: 380, maxWidth: 'calc(100vw - 32px)', boxShadow: '0 24px 80px rgba(0,0,0,0.85)' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 19 }}>Connect Wallet</div>
            <div style={{ color: 'var(--t2)', fontSize: 13, marginTop: 3 }}>Choose your Sui wallet to continue</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: 2 }}>×</button>
        </div>

        <div style={{ marginBottom: 20 }}><TatumBadge/></div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {WALLET_OPTIONS.map(w => (
            <button
              key={w.id}
              onClick={() => !connecting && handleConnect(w)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '13px 16px', borderRadius: 10,
                background: connecting === w.id ? `${w.color}12` : 'var(--s2)',
                border: connecting === w.id ? `1px solid ${w.color}50` : '1px solid var(--border)',
                cursor: connecting ? 'wait' : 'pointer',
                transition: 'all 0.15s', textAlign: 'left', width: '100%', fontFamily: 'inherit',
              }}
            >
              <div style={{ width: 38, height: 38, borderRadius: 9, background: `${w.color}20`, border: `1px solid ${w.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: w.color, flexShrink: 0 }}>
                {initials[w.id] ?? w.id.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--t1)', fontSize: 14 }}>{w.name}</div>
                <div style={{ color: 'var(--t3)', fontSize: 12 }}>{w.subtitle}</div>
              </div>
              {connecting === w.id ? <Spinner size={16}/> : <span style={{ color: 'var(--t3)', fontSize: 20, lineHeight: 1 }}>›</span>}
            </button>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: 'var(--t3)', fontSize: 11, marginTop: 18 }}>
          By connecting you agree to the Terms of Service
        </p>
      </div>
    </div>
  );
}
