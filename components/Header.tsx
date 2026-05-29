'use client';

import type { WalletInfo, Page, Direction } from '@/lib/types';
import { useViewport } from '@/hooks/useViewport';
import { Logo } from './shared/Logo';
import { StatusDot } from './shared/StatusDot';

const NAV = [
  { id: 'marketplace' as Page, label: 'Marketplace' },
  { id: 'upload'      as Page, label: 'Sell'        },
  { id: 'dashboard'  as Page, label: 'Dashboard'   },
];

interface HeaderProps {
  page: Page;
  setPage: (p: Page) => void;
  wallet: WalletInfo | null;
  onWalletClick: () => void;
  direction: Direction;
  setDirection: (d: Direction) => void;
}

function ThemeToggle({ direction, setDirection }: { direction: Direction; setDirection: (d: Direction) => void }) {
  const isDark = direction === 'dark';
  return (
    <button
      onClick={() => setDirection(isDark ? 'light' : 'dark')}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: 'transparent',
        border: '0.5px solid var(--rp-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'border-color 0.15s', fontSize: 14, lineHeight: 1,
        color: 'var(--rp-text-muted)',
      }}
    >
      {isDark ? '☀' : '●'}
    </button>
  );
}

export function Header({ page, setPage, wallet, onWalletClick, direction, setDirection }: HeaderProps) {
  const { mobile, tablet } = useViewport();

  const logoMark = (
    <button
      onClick={() => setPage('marketplace')}
      style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}
    >
      <Logo size={28} />
      <div style={{ textAlign: 'left' }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontWeight: 500, fontSize: 14,
          color: 'var(--rp-text-primary)', letterSpacing: '-0.01em', lineHeight: 1.2,
        }}>
          SUI<span style={{ color: 'var(--rp-accent-green)' }}>-Walrus</span>
        </div>
        {!mobile && (
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9, color: 'var(--rp-text-muted)',
            letterSpacing: '0.15em', textTransform: 'uppercase',
          }}>
            File Marketplace
          </div>
        )}
      </div>
    </button>
  );

  const walletChip = wallet ? (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'var(--rp-bg-surface)',
      border: '0.5px solid var(--rp-border)',
      padding: mobile ? '5px 10px' : '7px 13px',
      borderRadius: 8, flexShrink: 0,
    }}>
      <StatusDot />
      <div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--rp-text-primary)', lineHeight: 1.2 }}>{wallet.short}</div>
        {!mobile && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--rp-accent-green)', lineHeight: 1 }}>{wallet.balance} SUI</div>}
      </div>
    </div>
  ) : (
    <button
      onClick={onWalletClick}
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 13, fontWeight: 500,
        padding: mobile ? '0.45rem 0.875rem' : '0.5rem 1.1rem',
        background: 'var(--rp-text-primary)',
        color: 'var(--rp-bg-primary)',
        border: 'none', borderRadius: 8,
        cursor: 'pointer', letterSpacing: '0.02em',
        flexShrink: 0, transition: 'opacity 0.15s',
      }}
    >
      Connect Wallet
    </button>
  );

  if (mobile) {
    return (
      <>
        <header style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'var(--rp-bg-primary)',
          backdropFilter: 'blur(16px)',
          borderBottom: '0.5px solid var(--rp-border)',
          display: 'flex', alignItems: 'center',
          padding: '0 16px', height: 52, gap: 10,
        }}>
          {logoMark}
          <div style={{ flex: 1 }} />
          <ThemeToggle direction={direction} setDirection={setDirection} />
          {walletChip}
        </header>

        {/* Bottom nav */}
        <nav className="bottom-nav" style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          background: 'var(--rp-bg-primary)',
          backdropFilter: 'blur(16px)',
          borderTop: '0.5px solid var(--rp-border)',
          display: 'flex', height: 60,
        }}>
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => setPage(n.id)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 4,
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'DM Mono', monospace",
                color: page === n.id ? 'var(--rp-accent-green)' : 'var(--rp-text-muted)',
                transition: 'color 0.15s', position: 'relative',
              }}
            >
              <span style={{
                fontSize: 11, fontWeight: page === n.id ? 500 : 400,
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                {n.label}
              </span>
              {page === n.id && (
                <div style={{
                  position: 'absolute', top: 0, width: '100%', height: 2,
                  background: 'var(--rp-accent-green)',
                }} />
              )}
            </button>
          ))}
        </nav>
      </>
    );
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--rp-bg-primary)',
      backdropFilter: 'blur(16px)',
      borderBottom: '0.5px solid var(--rp-border)',
      display: 'flex', alignItems: 'center',
      padding: '0 2.5rem', height: 60,
      gap: tablet ? 16 : 32,
    }}>
      {logoMark}

      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1 }}>
        {NAV.map(n => (
          <button
            key={n.id}
            onClick={() => setPage(n.id)}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 12, fontWeight: 500,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              padding: '0.4rem 0.875rem', borderRadius: 6,
              background: page === n.id ? 'var(--rp-accent-green-tint)' : 'transparent',
              color: page === n.id ? 'var(--rp-accent-green)' : 'var(--rp-text-muted)',
              border: page === n.id
                ? '0.5px solid var(--rp-accent-green-border)'
                : '0.5px solid transparent',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            {n.label}
          </button>
        ))}
      </nav>

      <ThemeToggle direction={direction} setDirection={setDirection} />
      {walletChip}
    </header>
  );
}
