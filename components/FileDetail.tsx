'use client';

import { useState } from 'react';
import type { FileItem, WalletInfo } from '@/lib/types';
import { useViewport } from '@/hooks/useViewport';
import { FileIcon } from './shared/FileIcon';
import { CategoryBadge } from './shared/Badge';
import { Mono } from './shared/Mono';
import { Spinner } from './shared/Spinner';
import { TatumBadge } from './shared/TatumBadge';

function randHex(n: number) {
  return Array.from({ length: n }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
}

interface PurchaseModalProps {
  file: FileItem;
  wallet: WalletInfo;
  onClose: () => void;
  onSuccess: (tx: string) => void;
}

function PurchaseModal({ file, wallet, onClose, onSuccess }: PurchaseModalProps) {
  const [phase, setPhase] = useState<'confirm' | 'signing' | 'verifying' | 'success'>('confirm');
  const [verifyProgress, setVerifyProgress] = useState(0);
  const gas = (0.003 + Math.random() * 0.002).toFixed(4);

  const handleBuy = async () => {
    setPhase('signing');
    await new Promise(r => setTimeout(r, 1600));
    setPhase('verifying');
    for (let i = 0; i <= 100; i += Math.random() * 20 + 10) {
      await new Promise(r => setTimeout(r, 180));
      setVerifyProgress(Math.min(Math.round(i), 100));
    }
    await new Promise(r => setTimeout(r, 400));
    setPhase('success');
    setTimeout(() => onSuccess(randHex(64)), 900);
  };

  const labelStyle = {
    fontFamily: "'DM Mono', monospace",
    fontSize: 15, color: 'var(--rp-text-secondary)',
  };
  const valueStyle = (accent?: boolean) => ({
    fontFamily: "'DM Mono', monospace",
    fontSize: 15, color: accent ? 'var(--rp-accent-green)' : 'var(--rp-text-primary)',
    fontWeight: accent ? 500 : 400,
  });

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(7,9,15,0.88)', backdropFilter: 'blur(14px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000,
      }}
      onClick={phase === 'confirm' ? onClose : undefined}
    >
      <div
        className="fade-in"
        style={{
          background: 'var(--rp-bg-raised)',
          border: '0.5px solid var(--rp-border)',
          borderRadius: '16px 16px 0 0',
          padding: '2rem 1.5rem 2.5rem',
          width: '100%', maxWidth: 480,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ width: 32, height: 3, background: 'var(--rp-border)', borderRadius: 2, margin: '0 auto 1.5rem' }} />

        {phase === 'confirm' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <p style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: 'var(--rp-text-secondary)', marginBottom: '0.25rem',
                }}>
                  Confirm Purchase
                </p>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 26, fontWeight: 600, color: 'var(--rp-text-primary)',
                }}>
                  Get access.<br />
                  <em style={{ color: 'var(--rp-accent-green)', fontStyle: 'italic' }}>Own it forever.</em>
                </h3>
              </div>
              <button onClick={onClose} style={{
                background: 'none', border: 'none',
                color: 'var(--rp-text-secondary)', cursor: 'pointer',
                fontSize: 22, lineHeight: 1, padding: 2,
              }}>×</button>
            </div>

            {/* File preview */}
            <div style={{
              display: 'flex', gap: 12, padding: '0.875rem',
              background: 'var(--rp-bg-surface)',
              border: '0.5px solid var(--rp-border)',
              borderRadius: 10, marginBottom: '1rem', alignItems: 'center',
            }}>
              <FileIcon type={file.type} size={40} />
              <div>
                <div style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 600, fontSize: 16,
                  color: 'var(--rp-text-primary)', marginBottom: 2,
                }}>
                  {file.title}
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, color: 'var(--rp-text-secondary)' }}>{file.size}</div>
              </div>
            </div>

            {/* Cost breakdown */}
            <div style={{
              background: 'var(--rp-bg-surface)',
              border: '0.5px solid var(--rp-border)',
              borderRadius: 10, marginBottom: '1rem', overflow: 'hidden',
            }}>
              {([
                ['Access Pass', '1× Sui Object'],
                ['Kiosk ID',    file.kiosk.slice(0, 10) + '…'],
                ['Est. Gas',    `${gas} SUI`],
                ['Total',       `${file.price} SUI`],
              ] as [string, string][]).map(([k, v], i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderBottom: i < 3 ? '0.5px solid var(--rp-border)' : 'none',
                }}>
                  <span style={labelStyle}>{k}</span>
                  <span style={valueStyle(k === 'Total')}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '1rem' }}><TatumBadge /></div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onClose} style={{
                flex: 1, fontFamily: "'DM Mono', monospace",
                fontSize: 15, fontWeight: 500, padding: '0.75rem',
                borderRadius: 8, background: 'transparent',
                border: '0.5px solid var(--rp-border-strong)',
                color: 'var(--rp-text-primary)', cursor: 'pointer',
              }}>
                Cancel
              </button>
              <button onClick={handleBuy} style={{
                flex: 1, fontFamily: "'DM Mono', monospace",
                fontSize: 15, fontWeight: 500, padding: '0.75rem',
                borderRadius: 8,
                background: 'var(--rp-accent-green)', color: '#ECEAE4',
                border: 'none', cursor: 'pointer',
              }}>
                Pay {file.price} SUI →
              </button>
            </div>
          </>
        )}

        {phase === 'signing' && (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'rgba(79,159,255,0.1)',
              border: '0.5px solid rgba(79,159,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}>
              <Spinner size={24} color="#4F9FFF" />
            </div>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 24, fontWeight: 600, color: 'var(--rp-text-primary)', marginBottom: '0.5rem',
            }}>
              Waiting for Signature
            </h3>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, color: 'var(--rp-text-secondary)' }}>
              Approve in {wallet.wallet}…
            </p>
          </div>
        )}

        {phase === 'verifying' && (
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'var(--rp-text-secondary)', marginBottom: '0.5rem',
            }}>
              Tatum RPC
            </p>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 24, fontWeight: 600, color: 'var(--rp-text-primary)', marginBottom: '1.25rem',
            }}>
              Verifying Ownership
            </h3>
            <div style={{
              position: 'relative', height: 64,
              background: 'var(--rp-bg-sunken)',
              borderRadius: 10, overflow: 'hidden', marginBottom: '1rem',
              border: '0.5px solid var(--rp-border)',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                background: 'linear-gradient(90deg, transparent, var(--rp-accent-green), transparent)',
                animation: 'scanline 1.4s linear infinite',
              }} />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: '0 1rem', gap: 4,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Mono style={{ fontSize: '0.8em', color: 'var(--rp-text-secondary)' }}>TATUM RPC</Mono>
                  <Mono style={{ fontSize: '0.8em', color: 'var(--rp-accent-green)' }}>Querying…</Mono>
                </div>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 14, color: 'var(--rp-text-secondary)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  GET /sui/v1/objects/{file.kiosk.slice(0, 14)}…
                </div>
              </div>
            </div>
            <div style={{
              background: 'var(--rp-bg-surface)', borderRadius: 50,
              height: 4, overflow: 'hidden', marginBottom: '0.5rem',
              border: '0.5px solid var(--rp-border)',
            }}>
              <div style={{
                height: '100%', width: `${verifyProgress}%`,
                background: 'var(--rp-accent-green)',
                transition: 'width 0.2s', borderRadius: 50,
              }} />
            </div>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: 'var(--rp-text-secondary)' }}>
              Confirming ownership transfer…
            </p>
          </div>
        )}

        {phase === 'success' && (
          <div style={{ textAlign: 'center', padding: '1.25rem 0' }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: 'var(--rp-accent-green-tint)',
              border: '0.5px solid var(--rp-accent-green-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem', fontSize: 26,
              color: 'var(--rp-accent-green)',
            }}>
              ✓
            </div>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 28, fontWeight: 600, color: 'var(--rp-accent-green)', marginBottom: '0.5rem',
            }}>
              Ownership Transferred
            </h3>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, color: 'var(--rp-text-secondary)' }}>
              Unlocking file access…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface FileDetailProps {
  file: FileItem;
  wallet: WalletInfo | null;
  onWalletRequired: () => void;
  onPurchaseSuccess: (file: FileItem, tx: string) => void;
  onBack: () => void;
}

export function FileDetail({ file, wallet, onWalletRequired, onPurchaseSuccess, onBack }: FileDetailProps) {
  const { mobile } = useViewport();
  const [showPurchase, setShowPurchase] = useState(false);
  const [purchased, setPurchased] = useState(false);

  const handleSuccess = (tx: string) => {
    setShowPurchase(false);
    setPurchased(true);
    onPurchaseSuccess(file, tx);
  };

  return (
    <div className="fade-in" style={{
      maxWidth: 1100, margin: '0 auto',
      padding: mobile ? '1rem 1rem 5.5rem' : '2.5rem 2.5rem 3rem',
    }}>
      {/* Back */}
      <button onClick={onBack} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'none', border: 'none',
        fontFamily: "'DM Mono', monospace",
        fontSize: 15, color: 'var(--rp-text-secondary)',
        cursor: 'pointer', marginBottom: '1.5rem', padding: 0,
        transition: 'color 0.12s',
      }}>
        ← Back to Marketplace
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : '1fr 320px',
        gap: '1.25rem', alignItems: 'start',
      }}>

        {/* ── Left column ── */}
        <div>
          {/* Hero card */}
          <div style={{
            background: 'var(--rp-bg-raised)',
            border: '0.5px solid var(--rp-border)',
            borderRadius: 12, overflow: 'hidden', marginBottom: '1rem',
          }}>
            {/* Preview area */}
            <div style={{
              height: mobile ? 160 : 200,
              background: 'var(--rp-bg-sunken)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 12, position: 'relative',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(var(--rp-border) 1px, transparent 1px), linear-gradient(90deg, var(--rp-border) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }} />
              <FileIcon type={file.type} size={mobile ? 60 : 72} />
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: 'var(--rp-text-secondary)' }}>
                  Access pass required to download
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, color: 'var(--rp-text-ghost)', marginTop: 2 }}>
                  {file.size}
                </div>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: mobile ? '1.25rem' : '1.75rem' }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '0.875rem' }}>
                <CategoryBadge category={file.category} />
                {file.verified && (
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 14, fontWeight: 500,
                    color: 'var(--rp-accent-green)',
                    background: 'var(--rp-accent-green-tint)',
                    border: '0.5px solid var(--rp-accent-green-border)',
                    borderRadius: 4, padding: '2px 7px',
                    letterSpacing: '0.08em',
                  }}>
                    ✓ Verified
                  </span>
                )}
                {file.tags.map(t => (
                  <span key={t} style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 14, color: 'var(--rp-text-secondary)',
                    background: 'var(--rp-bg-surface)',
                    border: '0.5px solid var(--rp-border)',
                    borderRadius: 4, padding: '2px 7px',
                    letterSpacing: '0.04em',
                  }}>
                    {t}
                  </span>
                ))}
              </div>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: mobile ? 24 : 32, fontWeight: 600,
                color: 'var(--rp-text-primary)', lineHeight: 1.2,
                letterSpacing: '-0.01em', marginBottom: '0.875rem',
              }}>
                {file.title}
              </h1>
              <p style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 14, color: 'var(--rp-text-secondary)',
                lineHeight: 1.7, maxWidth: '52ch',
              }}>
                {file.description}
              </p>
            </div>
          </div>

          {/* Technical details */}
          <div style={{
            background: 'var(--rp-bg-raised)',
            border: '0.5px solid var(--rp-border)',
            borderRadius: 12, overflow: 'hidden',
          }}>
            <div style={{
              padding: '1rem 1.25rem',
              borderBottom: '0.5px solid var(--rp-border)',
            }}>
              <p style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'var(--rp-text-secondary)',
              }}>
                Technical Details
              </p>
            </div>
            {([
              { label: 'Walrus Blob ID',  val: file.blobId,                  mono: true,  accent: true  },
              { label: 'Sui Kiosk ID',    val: file.kiosk,                   mono: true,  accent: false },
              { label: 'Seller',          val: file.sellerShort,             mono: true,  accent: false },
              { label: 'File Size',       val: file.size,                    mono: false, accent: false },
              { label: 'RPC Provider',    val: 'Tatum · Sui Mainnet',        mono: false, accent: false },
              { label: 'Sales',           val: `${file.sales} buyers`,       mono: false, accent: false },
            ] as { label: string; val: string; mono: boolean; accent: boolean }[]).map((r, i) => (
              <div key={r.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem 1.25rem',
                borderBottom: i < 5 ? '0.5px solid var(--rp-border)' : 'none',
                gap: 12,
              }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 14, color: 'var(--rp-text-secondary)', flexShrink: 0,
                }}>
                  {r.label}
                </span>
                <span style={{
                  fontFamily: r.mono ? "'DM Mono', monospace" : "'Cormorant Garamond', Georgia, serif",
                  fontSize: r.mono ? 11 : 14,
                  color: r.accent ? 'var(--rp-accent-green)' : 'var(--rp-text-primary)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  textAlign: 'right', maxWidth: mobile ? 180 : 320,
                }}>
                  {r.val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column — purchase card ── */}
        <div style={{ position: mobile ? 'static' : 'sticky', top: 80 }}>
          <div style={{
            background: 'var(--rp-bg-raised)',
            border: '0.5px solid var(--rp-border)',
            borderRadius: 12, padding: '1.5rem',
            marginBottom: '0.75rem',
          }}>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'var(--rp-text-secondary)', marginBottom: '0.4rem',
            }}>
              Price
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: '0.25rem' }}>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: mobile ? 36 : 44, fontWeight: 500,
                color: 'var(--rp-accent-green)',
              }}>
                {file.price}
              </span>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 16, color: 'var(--rp-text-secondary)', fontWeight: 500,
              }}>
                SUI
              </span>
            </div>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 14, color: 'var(--rp-text-secondary)', marginBottom: '1.25rem',
            }}>
              One-time purchase · Permanent access
            </p>

            {purchased ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '0.875rem',
                background: 'var(--rp-accent-green-tint)',
                border: '0.5px solid var(--rp-accent-green-border)',
                borderRadius: 8, marginBottom: '1rem',
                fontFamily: "'DM Mono', monospace",
                fontSize: 15, fontWeight: 500, color: 'var(--rp-accent-green)',
              }}>
                <span>✓</span> You own this file
              </div>
            ) : (
              <button
                onClick={() => wallet ? setShowPurchase(true) : onWalletRequired()}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 8,
                  background: 'var(--rp-accent-green)', color: '#ECEAE4',
                  border: 'none', borderRadius: 50,
                  padding: '0.875rem 1.5rem',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 14, fontWeight: 500, cursor: 'pointer',
                  marginBottom: '1rem', transition: 'background 0.15s',
                  letterSpacing: '0.02em',
                }}
              >
                {wallet ? `Buy · ${file.price} SUI` : 'Connect Wallet to Buy'}
              </button>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {([
                ['🔒', 'Access via Sui Kiosk'],
                ['🌊', 'Stored on Walrus'],
                ['⚡', 'Instant on payment'],
                ['🔍', 'Verified · Tatum RPC'],
              ] as [string, string][]).map(([ic, tx]) => (
                <div key={tx} style={{
                  display: 'flex', gap: 8, alignItems: 'center',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 14, color: 'var(--rp-text-secondary)',
                }}>
                  <span>{ic}</span><span>{tx}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Seller card */}
          <div style={{
            background: 'var(--rp-bg-raised)',
            border: '0.5px solid var(--rp-border)',
            borderRadius: 12, padding: '1.25rem',
          }}>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 14, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--rp-text-secondary)', marginBottom: '0.75rem',
            }}>
              Seller
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'var(--rp-bg-surface)',
                border: '0.5px solid var(--rp-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'DM Mono', monospace",
                fontSize: 15, color: 'var(--rp-text-secondary)', flexShrink: 0,
              }}>
                {file.sellerShort.slice(2, 4).toUpperCase()}
              </div>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: 'var(--rp-text-primary)', marginBottom: 2 }}>
                  {file.sellerShort}
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, color: 'var(--rp-text-secondary)' }}>
                  👁 {file.views} · ↓ {file.sales}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPurchase && wallet && (
        <PurchaseModal file={file} wallet={wallet} onClose={() => setShowPurchase(false)} onSuccess={handleSuccess} />
      )}
    </div>
  );
}
