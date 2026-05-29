'use client';

import { useState } from 'react';
import type { WalletInfo, WalletOption } from '@/lib/types';
import { WALLET_OPTIONS } from '@/lib/mock-data';
import { Spinner } from './Spinner';

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
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(7,9,15,0.88)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        className="fade-in"
        style={{
          background: 'var(--rp-bg-raised)',
          border: '0.5px solid var(--rp-border)',
          borderRadius: 16,
          padding: '2rem',
          width: 400, maxWidth: 'calc(100vw - 2rem)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'var(--rp-text-secondary)', marginBottom: '0.35rem',
            }}>
              Connect Wallet
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 28, fontWeight: 600, lineHeight: 1.0,
              color: 'var(--rp-text-primary)',
            }}>
              Choose your wallet.<br />
              <em style={{ color: 'var(--rp-accent-green)', fontStyle: 'italic' }}>Start selling.</em>
            </h2>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none',
            color: 'var(--rp-text-secondary)', cursor: 'pointer',
            fontSize: 22, lineHeight: 1, padding: 2, flexShrink: 0,
          }}>
            ×
          </button>
        </div>

        {/* Tatum badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '0.625rem 0.875rem',
          background: 'var(--rp-bg-sunken)',
          border: '0.5px solid var(--rp-border)',
          borderRadius: 8, marginBottom: '1.25rem',
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--rp-accent-green)',
          }} />
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 15, color: 'var(--rp-text-secondary)',
          }}>
            Ownership verified via Tatum RPC · Sui Mainnet
          </span>
        </div>

        {/* Wallet options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {WALLET_OPTIONS.map(w => (
            <button
              key={w.id}
              onClick={() => !connecting && handleConnect(w)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '0.875rem 1rem', borderRadius: 10,
                background: connecting === w.id
                  ? `${w.color}0D`
                  : 'var(--rp-bg-surface)',
                border: connecting === w.id
                  ? `0.5px solid ${w.color}50`
                  : '0.5px solid var(--rp-border)',
                cursor: connecting ? 'wait' : 'pointer',
                transition: 'all 0.15s', textAlign: 'left',
                width: '100%', fontFamily: 'inherit',
              }}
            >
              {/* Icon */}
              <div style={{
                width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                background: `${w.color}18`,
                border: `0.5px solid ${w.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'DM Mono', monospace",
                fontSize: 14, fontWeight: 500, color: w.color,
              }}>
                {initials[w.id] ?? w.id.slice(0, 2).toUpperCase()}
              </div>

              {/* Labels */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 600, fontSize: 17,
                  color: 'var(--rp-text-primary)', marginBottom: 1,
                }}>
                  {w.name}
                </div>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 14, color: 'var(--rp-text-secondary)',
                }}>
                  {w.subtitle}
                </div>
              </div>

              {connecting === w.id
                ? <Spinner size={16} />
                : <span style={{ color: 'var(--rp-text-secondary)', fontSize: 18, lineHeight: 1 }}>›</span>
              }
            </button>
          ))}
        </div>

        <p style={{
          fontFamily: "'DM Mono', monospace",
          textAlign: 'center', fontSize: 15,
          color: 'var(--rp-text-ghost)', marginTop: '1.25rem',
          lineHeight: 1.5,
        }}>
          By connecting you agree to the Terms of Service
        </p>
      </div>
    </div>
  );
}
