'use client';

import { useState } from 'react';
import type { WalletInfo, Page } from '@/lib/types';
import { MY_LISTINGS } from '@/lib/mock-data';
import { useViewport } from '@/hooks/useViewport';
import { FileIcon } from './shared/FileIcon';
import { Mono } from './shared/Mono';
import { StatusDot } from './shared/StatusDot';

interface DashboardProps {
  wallet: WalletInfo | null;
  onWalletRequired: () => void;
  onNavigate: (p: Page) => void;
}

const TABS = ['listings', 'activity', 'settings'] as const;
type Tab = typeof TABS[number];

const btn = (variant: 'ghost' | 'danger' | 'green', extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: "'DM Mono', monospace",
  fontSize: 13, fontWeight: 500,
  padding: '0.4rem 1rem', borderRadius: 6,
  cursor: 'pointer', transition: 'background 0.15s',
  ...(variant === 'ghost' ? {
    background: 'transparent',
    border: '0.5px solid var(--rp-border-strong)',
    color: 'var(--rp-text-primary)',
  } : variant === 'danger' ? {
    background: 'rgba(192,57,43,0.08)',
    border: '0.5px solid rgba(192,57,43,0.3)',
    color: 'var(--rp-accent-red)',
  } : {
    background: 'var(--rp-accent-green-tint)',
    border: '0.5px solid var(--rp-accent-green-border)',
    color: 'var(--rp-accent-green)',
  }),
  ...extra,
});

export function Dashboard({ wallet, onWalletRequired, onNavigate }: DashboardProps) {
  const { mobile } = useViewport();
  const [activeTab, setActiveTab] = useState<Tab>('listings');
  const [delistConfirm, setDelistConfirm] = useState<number | null>(null);

  if (!wallet) {
    return (
      <div className="fade-in" style={{ maxWidth: 480, margin: '6rem auto', padding: '0 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--rp-text-secondary)', marginBottom: '1.5rem' }}>
          Seller Dashboard
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 600, lineHeight: 0.96, letterSpacing: '-0.02em', color: 'var(--rp-text-primary)', marginBottom: '1rem' }}>
          Connect your wallet.<br />
          <em style={{ color: 'var(--rp-accent-green)', fontStyle: 'italic' }}>See your sales.</em>
        </h2>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, color: 'var(--rp-text-secondary)', lineHeight: 1.7, maxWidth: '32ch', margin: '0 auto 2rem' }}>
          Connect your Sui wallet to view your listings, sales, and earnings.
        </p>
        <button onClick={onWalletRequired} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--rp-accent-green)', color: '#ECEAE4', border: 'none', borderRadius: 50, padding: '0.9rem 2.25rem', fontFamily: "'DM Mono', monospace", fontSize: 15, cursor: 'pointer', letterSpacing: '0.02em', fontWeight: 500 }}>
          Connect Wallet ↗
        </button>
      </div>
    );
  }

  const totalRevenue = MY_LISTINGS.reduce((s, l) => s + l.revenue, 0);
  const totalSales   = MY_LISTINGS.reduce((s, l) => s + l.sales, 0);
  const totalViews   = MY_LISTINGS.reduce((s, l) => s + l.views, 0);
  const activeCount  = MY_LISTINGS.filter(l => l.status === 'active').length;

  return (
    <div className="fade-in" style={{ maxWidth: 1100, margin: '0 auto', padding: mobile ? '2rem 1rem 5.5rem' : '3rem 2.5rem 3rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: mobile ? 'flex-start' : 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--rp-text-secondary)', marginBottom: '0.5rem' }}>
            01 — Seller Dashboard
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: mobile ? 36 : 'clamp(36px, 4vw, 52px)', fontWeight: 600, lineHeight: 0.96, letterSpacing: '-0.02em', color: 'var(--rp-text-primary)' }}>
            Your files.<br />
            <em style={{ color: 'var(--rp-accent-green)', fontStyle: 'italic' }}>Your revenue.</em>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <StatusDot />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--rp-text-secondary)' }}>{wallet.short}</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--rp-accent-green)', fontWeight: 500 }}>{wallet.balance} SUI</span>
          </div>
        </div>
        <button onClick={() => onNavigate('upload')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--rp-accent-green)', color: '#ECEAE4', border: 'none', borderRadius: 50, padding: mobile ? '0.7rem 1.4rem' : '0.85rem 1.9rem', fontFamily: "'DM Mono', monospace", fontSize: mobile ? 14 : 15, fontWeight: 500, cursor: 'pointer', letterSpacing: '0.02em', transition: 'background 0.15s', flexShrink: 0 }}>
          + List File
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 1, background: 'var(--rp-border)', borderRadius: 12, overflow: 'hidden', marginBottom: '2.5rem' }}>
        {[
          { label: 'Revenue', value: totalRevenue, suffix: ' SUI', accent: true },
          { label: 'Sales',   value: totalSales,   suffix: ' total' },
          { label: 'Views',   value: totalViews,   suffix: ' total' },
          { label: 'Active',  value: `${activeCount}/${MY_LISTINGS.length}`, suffix: ' listings' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--rp-bg-surface)', padding: mobile ? '1rem 1.1rem' : '1.25rem 1.5rem' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--rp-text-secondary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              {s.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: mobile ? 24 : 30, fontWeight: 500, color: s.accent ? 'var(--rp-accent-green)' : 'var(--rp-text-primary)' }}>
                {s.value}
              </span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--rp-text-secondary)' }}>
                {s.suffix}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '0.5px solid var(--rp-border)', marginBottom: '1.5rem' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            fontFamily: "'DM Mono', monospace",
            padding: mobile ? '0.65rem 1.1rem' : '0.7rem 1.4rem',
            fontSize: 13, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase',
            color: activeTab === tab ? 'var(--rp-accent-green)' : 'var(--rp-text-secondary)',
            background: 'none', border: 'none',
            borderBottom: activeTab === tab ? '2px solid var(--rp-accent-green)' : '2px solid transparent',
            cursor: 'pointer', transition: 'all 0.15s', marginBottom: -1,
          }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Listings */}
      {activeTab === 'listings' && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {MY_LISTINGS.map(listing => (
            <div key={listing.id} style={{ background: 'var(--rp-bg-raised)', border: '0.5px solid var(--rp-border)', borderRadius: 12, padding: mobile ? '1rem' : '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: '0.875rem' }}>
                <FileIcon type={listing.type} size={mobile ? 38 : 46} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: mobile ? 18 : 21, color: 'var(--rp-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: mobile ? 160 : 340 }}>
                      {listing.title}
                    </span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 500, color: listing.status === 'active' ? 'var(--rp-accent-green)' : 'var(--rp-text-secondary)', background: listing.status === 'active' ? 'var(--rp-accent-green-tint)' : 'transparent', border: `0.5px solid ${listing.status === 'active' ? 'var(--rp-accent-green-border)' : 'var(--rp-border)'}`, borderRadius: 4, padding: '2px 8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {listing.status === 'active' ? '● Active' : '◌ Delisted'}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--rp-text-secondary)', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    <span>👁 {listing.views} views</span>
                    <span>↓ {listing.sales} sales</span>
                    <span>{listing.listed}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: mobile ? 20 : 24, fontWeight: 500, color: 'var(--rp-accent-green)' }}>{listing.revenue}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--rp-text-secondary)' }}>SUI earned</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.875rem', borderTop: '0.5px solid var(--rp-border)' }}>
                <Mono style={{ fontSize: '0.85em', color: 'var(--rp-text-secondary)' }}>{listing.blobId.slice(0, 16)}…</Mono>
                <div style={{ display: 'flex', gap: 8 }}>
                  {listing.status === 'active' ? (
                    <>
                      <button style={btn('ghost')}>Edit</button>
                      <button style={btn('danger')} onClick={() => setDelistConfirm(listing.id)}>Delist</button>
                    </>
                  ) : (
                    <button style={btn('green')}>Relist</button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {delistConfirm !== null && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(7,9,15,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000 }}>
              <div className="fade-in" style={{ background: 'var(--rp-bg-raised)', border: '0.5px solid rgba(192,57,43,0.25)', borderRadius: '16px 16px 0 0', padding: '2rem 1.5rem 2.5rem', width: '100%', maxWidth: 480 }}>
                <div style={{ width: 32, height: 3, background: 'var(--rp-border)', borderRadius: 2, margin: '0 auto 1.5rem' }} />
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 600, color: 'var(--rp-text-primary)', marginBottom: '0.75rem' }}>
                  Delist this file?
                </h3>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: 'var(--rp-text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Removes the listing from the Kiosk. Your file stays on Walrus — relist anytime.
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setDelistConfirm(null)} style={{ ...btn('ghost'), flex: 1, padding: '0.8rem', borderRadius: 8, fontSize: 14 }}>Cancel</button>
                  <button onClick={() => setDelistConfirm(null)} style={{ ...btn('danger'), flex: 1, padding: '0.8rem', borderRadius: 8, fontSize: 14 }}>Confirm Delist</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Activity */}
      {activeTab === 'activity' && (
        <div className="fade-in" style={{ background: 'var(--rp-bg-raised)', border: '0.5px solid var(--rp-border)', borderRadius: 12, overflow: 'hidden' }}>
          {[
            { type: 'sale',    file: 'Sui Testnet Faucet Config',     buyer: '0x4a21…9e3f', amount: 2,    time: '2h ago'  },
            { type: 'sale',    file: 'Move Contract Audit Checklist', buyer: '0x7f3a…b12c', amount: 7,    time: '6h ago'  },
            { type: 'sale',    file: 'Sui Testnet Faucet Config',     buyer: '0x2c89…4d7b', amount: 2,    time: '11h ago' },
            { type: 'view',    file: 'Move Contract Audit Checklist', buyer: null,          amount: null, time: '14h ago' },
            { type: 'sale',    file: 'Sui Testnet Faucet Config',     buyer: '0x9b3c…7f1e', amount: 2,    time: '1d ago'  },
            { type: 'listing', file: 'dApp Boilerplate v2',           buyer: null,          amount: 18,   time: '32d ago' },
          ].map((ev, i, arr) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '1rem 1.25rem', borderBottom: i < arr.length - 1 ? '0.5px solid var(--rp-border)' : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0, background: ev.type === 'sale' ? 'var(--rp-accent-green-tint)' : 'var(--rp-bg-surface)', border: `0.5px solid ${ev.type === 'sale' ? 'var(--rp-accent-green-border)' : 'var(--rp-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Mono', monospace", fontSize: 15, color: ev.type === 'sale' ? 'var(--rp-accent-green)' : 'var(--rp-text-secondary)' }}>
                {ev.type === 'sale' ? '↓' : ev.type === 'listing' ? '+' : '👁'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 500, color: 'var(--rp-text-primary)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {ev.type === 'sale' ? 'Sale' : ev.type === 'listing' ? 'Listed' : 'View'} · {ev.file}
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--rp-text-secondary)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {ev.buyer && <Mono style={{ fontSize: '1em' }}>{ev.buyer}</Mono>}
                  <span>{ev.time}</span>
                </div>
              </div>
              {ev.amount && (
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 500, color: 'var(--rp-accent-green)', flexShrink: 0 }}>
                  +{ev.amount} SUI
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <div className="fade-in">
          <div style={{ background: 'var(--rp-bg-raised)', border: '0.5px solid var(--rp-border)', borderRadius: 12, overflow: 'hidden', marginBottom: '1rem' }}>
            {[
              { label: 'Connected Wallet',  val: wallet.wallet,  sub: wallet.short },
              { label: 'RPC Provider',      val: 'Tatum',        sub: 'Sui Mainnet · enterprise' },
              { label: 'Walrus Aggregator', val: 'Testnet',      sub: 'aggregator.walrus-testnet.walrus.space' },
              { label: 'Marketplace Fee',   val: '2.5%',         sub: 'Deducted from each sale' },
              { label: 'Payout Wallet',     val: wallet.short,   sub: 'Auto-transfer on sale' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: i < 4 ? '0.5px solid var(--rp-border)' : 'none', gap: 12 }}>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 19, fontWeight: 500, color: 'var(--rp-text-primary)', marginBottom: 2 }}>{row.label}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--rp-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: mobile ? 180 : 320 }}>{row.sub}</div>
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 500, color: 'var(--rp-accent-green)', flexShrink: 0 }}>{row.val}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '1.25rem', background: 'rgba(192,57,43,0.05)', border: '0.5px solid rgba(192,57,43,0.2)', borderRadius: 12 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 600, color: 'var(--rp-accent-red)', marginBottom: '0.35rem' }}>Disconnect Wallet</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: 'var(--rp-text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>Your listings stay active on-chain.</div>
            <button style={btn('danger', { padding: '0.55rem 1.4rem', borderRadius: 8, fontSize: 14 })}>Disconnect</button>
          </div>
        </div>
      )}
    </div>
  );
}
