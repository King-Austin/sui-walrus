'use client';

import type { WalletInfo, Page, Direction } from '@/lib/types';
import { useViewport } from '@/hooks/useViewport';
import { Logo } from './shared/Logo';
import { StatusDot } from './shared/StatusDot';
import { Btn } from './shared/Btn';

const NAV = [
  { id: 'marketplace' as Page, label: 'Marketplace', icon: '⊞' },
  { id: 'upload'      as Page, label: 'Sell',        icon: '⬆' },
  { id: 'dashboard'  as Page, label: 'Dashboard',   icon: '⊟' },
];

interface HeaderProps {
  page: Page;
  setPage: (p: Page) => void;
  wallet: WalletInfo | null;
  onWalletClick: () => void;
  direction: Direction;
  setDirection: (d: Direction) => void;
}

function DirToggle({ direction, setDirection, mobile }: { direction: Direction; setDirection: (d: Direction) => void; mobile: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 2, background: 'var(--s2)', padding: 3, borderRadius: 8, border: '1px solid var(--border)', flexShrink: 0 }}>
      {(['dir-a', 'dir-b'] as Direction[]).map(d => (
        <button
          key={d}
          onClick={() => { setDirection(d); document.body.className = d; }}
          style={{
            padding: mobile ? '4px 9px' : '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
            background: direction === d ? 'var(--s3)' : 'none',
            color: direction === d ? 'var(--accent)' : 'var(--t3)',
            border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
          }}
        >
          {d === 'dir-a' ? 'A' : 'B'}
        </button>
      ))}
    </div>
  );
}

export function Header({ page, setPage, wallet, onWalletClick, direction, setDirection }: HeaderProps) {
  const { mobile, tablet } = useViewport();

  if (mobile) {
    return (
      <>
        <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(7,9,15,0.92)', backdropFilter: 'blur(18px)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 16px', height: 52, gap: 12 }}>
          <button onClick={() => setPage('marketplace')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
            <Logo size={28}/>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--t1)', letterSpacing: -0.3 }}>SUI<span style={{ color: 'var(--accent)' }}>-Walrus</span></span>
          </button>
          <div style={{ flex: 1 }}/>
          <DirToggle direction={direction} setDirection={setDirection} mobile={true}/>
          {wallet ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--s2)', border: '1px solid var(--border)', padding: '5px 10px', borderRadius: 8, flexShrink: 0 }}>
              <StatusDot/>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)' }}>{wallet.balance} SUI</span>
            </div>
          ) : (
            <Btn onClick={onWalletClick} size="sm" variant="secondary" style={{ fontSize: 12, padding: '5px 12px', flexShrink: 0 }}>Connect</Btn>
          )}
        </header>

        <nav className="bottom-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(7,9,15,0.95)', backdropFilter: 'blur(18px)', borderTop: '1px solid var(--border)', display: 'flex', height: 60 }}>
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => setPage(n.id)}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: page === n.id ? 'var(--accent)' : 'var(--t3)', transition: 'color 0.15s', position: 'relative' }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>{n.icon}</span>
              <span style={{ fontSize: 10, fontWeight: page === n.id ? 600 : 400, letterSpacing: 0.3 }}>{n.label}</span>
              {page === n.id && <div style={{ position: 'absolute', bottom: 0, width: 28, height: 2, background: 'var(--accent)', borderRadius: '2px 2px 0 0' }}/>}
            </button>
          ))}
        </nav>
      </>
    );
  }

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(7,9,15,0.88)', backdropFilter: 'blur(18px)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 28px', height: 60, gap: tablet ? 16 : 28 }}>
      <button onClick={() => setPage('marketplace')} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
        <Logo size={32}/>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--t1)', letterSpacing: -0.3, lineHeight: 1.2 }}>SUI<span style={{ color: 'var(--accent)' }}>-Walrus</span></div>
          <div style={{ fontSize: 9, color: 'var(--t3)', letterSpacing: 1.2, textTransform: 'uppercase' }}>File Marketplace</div>
        </div>
      </button>

      <nav style={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
        {NAV.map(n => (
          <button
            key={n.id}
            onClick={() => setPage(n.id)}
            style={{ padding: '5px 13px', borderRadius: 7, fontSize: 14, background: page === n.id ? 'var(--accent-dim)' : 'none', color: page === n.id ? 'var(--accent)' : 'var(--t2)', border: page === n.id ? '1px solid rgba(0,229,160,0.2)' : '1px solid transparent', cursor: 'pointer', fontFamily: 'inherit', fontWeight: page === n.id ? 600 : 400, transition: 'all 0.15s' }}
          >
            {n.label}
          </button>
        ))}
      </nav>

      <DirToggle direction={direction} setDirection={setDirection} mobile={false}/>

      {wallet ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--s2)', border: '1px solid var(--border)', padding: '7px 13px', borderRadius: 'var(--card-radius)', flexShrink: 0 }}>
          <StatusDot/>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--t1)', lineHeight: 1.2 }}>{wallet.short}</div>
            <div style={{ fontSize: 11, color: 'var(--accent)', lineHeight: 1 }}>{wallet.balance} SUI</div>
          </div>
        </div>
      ) : (
        <Btn onClick={onWalletClick} size="sm" variant="secondary" style={{ flexShrink: 0 }}>Connect Wallet</Btn>
      )}
    </header>
  );
}
