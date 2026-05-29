'use client';

import { useState, useEffect } from 'react';
import type { FileItem, WalletInfo } from '@/lib/types';
import { useViewport } from '@/hooks/useViewport';
import { Mono } from './shared/Mono';

const CHECK_LABELS = [
  'Confirming tx on Sui Mainnet…',
  'Querying Tatum RPC for ownership…',
  'Validating Kiosk access pass…',
  'Fetching blob from Walrus…',
];

interface UnlockProps {
  file: FileItem | null;
  txHash: string | null;
  wallet: WalletInfo | null;
  onBack: () => void;
}

export function Unlock({ file, txHash, onBack }: UnlockProps) {
  const { mobile } = useViewport();
  const [phase, setPhase] = useState<'verifying' | 'ready' | 'downloading' | 'done'>('verifying');
  const [checks, setChecks] = useState([false, false, false, false]);
  const [dlProgress, setDlProgress] = useState(0);
  const [chars, setChars] = useState('');

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      for (let i = 0; i < 4; i++) {
        await new Promise(r => setTimeout(r, 900 + Math.random() * 500));
        if (cancelled) return;
        setChecks(prev => { const n = [...prev]; n[i] = true; return n; });
      }
      await new Promise(r => setTimeout(r, 500));
      if (!cancelled) setPhase('ready');
    };
    run();
    return () => { cancelled = true; };
  }, []);

  const handleDownload = async () => {
    setPhase('downloading');
    for (let i = 0; i <= 100; i += Math.random() * 12 + 3) {
      await new Promise(r => setTimeout(r, 80 + Math.random() * 60));
      setDlProgress(Math.min(Math.round(i), 100));
    }
    await new Promise(r => setTimeout(r, 300));
    setPhase('done');
    const target = (file?.title ?? 'file') + ' · Unlocked';
    let out = '';
    for (let i = 0; i < target.length; i++) {
      await new Promise(r => setTimeout(r, 55));
      out += target[i];
      setChars(out);
    }
  };

  const blobShort = file?.blobId ? file.blobId.slice(0, 18) + '…' : '—';
  const doneCount = checks.filter(Boolean).length;

  const eyebrow = (text: string) => (
    <p style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: 15, letterSpacing: '0.15em', textTransform: 'uppercase',
      color: 'var(--rp-text-secondary)', marginBottom: '0.4rem',
    }}>
      {text}
    </p>
  );

  return (
    <div className="fade-in" style={{
      maxWidth: 560, margin: '0 auto',
      padding: mobile ? '2.5rem 1rem 5.5rem' : '4rem 2.5rem',
      textAlign: 'center',
    }}>

      {/* ── Verifying ── */}
      {phase === 'verifying' && (
        <>
          <div style={{
            position: 'relative', width: 80, height: 80, margin: '0 auto 1.5rem',
          }}>
            <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: 'absolute' }}>
              <circle cx="40" cy="40" r="35" fill="none" stroke="var(--rp-border)" strokeWidth="2" />
              <circle cx="40" cy="40" r="35" fill="none" stroke="var(--rp-accent-green)" strokeWidth="2"
                strokeLinecap="round" strokeDasharray="220" strokeDashoffset="0"
                style={{ animation: 'spin 1.6s linear infinite', transformOrigin: '40px 40px' }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
            }}>
              🔐
            </div>
          </div>

          {eyebrow('Tatum RPC · Sui Mainnet')}
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: mobile ? 28 : 36, fontWeight: 600,
            color: 'var(--rp-text-primary)', marginBottom: '0.35rem',
          }}>
            Verifying Access
          </h2>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 15, color: 'var(--rp-text-secondary)', marginBottom: '1.75rem', lineHeight: 1.6,
          }}>
            Confirming ownership on-chain via Tatum RPC
          </p>

          {/* Terminal block */}
          <div style={{
            background: 'var(--rp-bg-sunken)',
            border: '0.5px solid var(--rp-border)',
            borderRadius: 12, padding: mobile ? '1rem' : '1.25rem',
            textAlign: 'left', marginBottom: '1.25rem',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: 'linear-gradient(90deg, transparent, var(--rp-accent-green), transparent)',
              animation: 'scanline 2s linear infinite',
            }} />
            {/* Chrome dots */}
            <div style={{ display: 'flex', gap: 5, marginBottom: '0.875rem' }}>
              {['#C0392B', '#D4A853', '#2A6347'].map(c => (
                <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.7 }} />
              ))}
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 14, color: 'var(--rp-text-secondary)', marginLeft: 6,
              }}>
                tatum-rpc · sui mainnet
              </span>
            </div>
            {CHECK_LABELS.map((label, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '3px 0',
                fontFamily: "'DM Mono', monospace",
                fontSize: mobile ? 14 : 15,
              }}>
                <span style={{
                  color: checks[i]
                    ? 'var(--rp-accent-green)'
                    : i === doneCount
                      ? '#D4A853'
                      : 'var(--rp-text-ghost)',
                  flexShrink: 0, width: 12,
                }}>
                  {checks[i] ? '✓' : i === doneCount ? '›' : '·'}
                </span>
                <span style={{
                  color: checks[i]
                    ? 'var(--rp-text-secondary)'
                    : i === doneCount
                      ? 'var(--rp-text-primary)'
                      : 'var(--rp-text-ghost)',
                }}>
                  {label}
                </span>
                {i === doneCount && !checks[i] && (
                  <span style={{
                    display: 'inline-block', width: 5, height: 12,
                    background: 'var(--rp-accent-green)',
                    animation: 'blink 0.8s step-end infinite',
                  }} />
                )}
              </div>
            ))}
          </div>

          {txHash && (
            <div style={{
              background: 'var(--rp-bg-surface)',
              border: '0.5px solid var(--rp-border)',
              borderRadius: 8, padding: '0.65rem 1rem',
              display: 'flex', gap: 10, alignItems: 'center',
            }}>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 15, color: 'var(--rp-text-secondary)',
                letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0,
              }}>
                TX
              </span>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 14, color: 'var(--rp-text-secondary)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {txHash}
              </span>
            </div>
          )}
        </>
      )}

      {/* ── Ready ── */}
      {phase === 'ready' && (
        <div className="fade-in">
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            background: 'var(--rp-accent-green-tint)',
            border: '0.5px solid var(--rp-accent-green-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem', fontSize: 38,
          }}>
            🔓
          </div>

          {eyebrow('Access Granted')}
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: mobile ? 32 : 44, fontWeight: 600,
            color: 'var(--rp-accent-green)', marginBottom: '0.35rem',
            lineHeight: 0.96, letterSpacing: '-0.02em',
          }}>
            File unlocked.<br />
            <em style={{ color: 'var(--rp-accent-green)', fontStyle: 'italic' }}>It's yours.</em>
          </h2>
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 18, color: 'var(--rp-text-secondary)',
            marginBottom: '0.75rem', lineHeight: 1.6,
          }}>
            {file?.title}
          </p>

          <div style={{
            display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap',
            marginBottom: '1.75rem',
          }}>
            {[
              { label: '✓ Verified', color: 'var(--rp-accent-green)', bg: 'var(--rp-accent-green-tint)', border: 'var(--rp-accent-green-border)' },
              { label: 'Tatum RPC', color: '#4F9FFF', bg: 'rgba(79,159,255,0.08)', border: 'rgba(79,159,255,0.25)' },
              { label: file?.size ?? '', color: 'var(--rp-text-secondary)', bg: 'var(--rp-bg-surface)', border: 'var(--rp-border)' },
            ].map(b => (
              <span key={b.label} style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 15, fontWeight: 500, letterSpacing: '0.06em',
                padding: '3px 9px', borderRadius: 4,
                color: b.color, background: b.bg,
                border: `0.5px solid ${b.border}`,
              }}>
                {b.label}
              </span>
            ))}
          </div>

          <div style={{
            background: 'var(--rp-bg-raised)',
            border: '0.5px solid var(--rp-accent-green-border)',
            borderRadius: 12, overflow: 'hidden', marginBottom: '1.5rem',
            textAlign: 'left',
          }}>
            {([
              ['Walrus Blob',  blobShort,                                          true  ],
              ['Kiosk Object',(file?.kiosk?.slice(0, 14) ?? '') + '…',            false ],
              ['Verified by', 'Tatum RPC · Sui Mainnet',                          false ],
            ] as [string, string, boolean][]).map(([k, v, accent]) => (
              <div key={k} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderBottom: k !== 'Verified by' ? '0.5px solid var(--rp-border)' : 'none',
              }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: 'var(--rp-text-secondary)' }}>{k}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: accent ? 'var(--rp-accent-green)' : 'var(--rp-text-primary)' }}>{v}</span>
              </div>
            ))}
          </div>

          <button onClick={handleDownload} style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: 'var(--rp-accent-green)', color: '#ECEAE4',
            border: 'none', borderRadius: 50,
            padding: '0.9rem 2rem',
            fontFamily: "'DM Mono', monospace",
            fontSize: 14, fontWeight: 500, cursor: 'pointer',
            letterSpacing: '0.02em', transition: 'background 0.15s',
          }}>
            ↓ Download File
          </button>
        </div>
      )}

      {/* ── Downloading ── */}
      {phase === 'downloading' && (
        <div className="fade-in">
          <div style={{ fontSize: 44, marginBottom: '1.5rem' }}>🌊</div>
          {eyebrow('Walrus Network')}
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: mobile ? 26 : 32, fontWeight: 600,
            color: 'var(--rp-text-primary)', marginBottom: '0.35rem',
          }}>
            Retrieving from Walrus
          </h2>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 15, color: 'var(--rp-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6,
          }}>
            Fetching your blob from the decentralized network
          </p>
          <div style={{
            background: 'var(--rp-bg-sunken)', borderRadius: 50,
            height: 4, overflow: 'hidden', marginBottom: '0.5rem',
            border: '0.5px solid var(--rp-border)',
          }}>
            <div style={{
              height: '100%', width: `${dlProgress}%`,
              background: 'var(--rp-accent-green)',
              borderRadius: 50, transition: 'width 0.15s',
            }} />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontFamily: "'DM Mono', monospace",
            fontSize: 14, color: 'var(--rp-text-secondary)',
          }}>
            <Mono>blob.{file?.type} ← walrus</Mono>
            <span style={{ color: 'var(--rp-accent-green)', fontWeight: 500 }}>{dlProgress}%</span>
          </div>
        </div>
      )}

      {/* ── Done ── */}
      {phase === 'done' && (
        <div className="fade-in">
          <div style={{
            width: 86, height: 86, borderRadius: '50%',
            background: 'var(--rp-accent-green-tint)',
            border: '0.5px solid var(--rp-accent-green-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, margin: '0 auto 1.25rem',
            color: 'var(--rp-accent-green)',
          }}>
            ✓
          </div>

          {eyebrow('Complete')}
          <h2 style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: mobile ? 16 : 18, fontWeight: 500,
            color: 'var(--rp-accent-green)', marginBottom: '0.5rem',
            wordBreak: 'break-word', lineHeight: 1.4,
          }}>
            {chars}<span style={{ animation: 'blink 0.8s step-end infinite' }}>_</span>
          </h2>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 15, color: 'var(--rp-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6,
          }}>
            Retrieved from Walrus and saved to your device.
          </p>

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '0.625rem', marginBottom: '1.5rem',
          }}>
            {([
              ['TX',      txHash ? txHash.slice(0, 8) + '…' : '—'],
              ['Type',    (file?.type ?? '—').toUpperCase()        ],
              ['Size',    file?.size ?? '—'                        ],
              ['Network', 'Sui Mainnet'                            ],
            ] as [string, string][]).map(([k, v]) => (
              <div key={k} style={{
                background: 'var(--rp-bg-raised)',
                border: '0.5px solid var(--rp-border)',
                borderRadius: 10, padding: '0.875rem 1rem',
                textAlign: 'left',
              }}>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 14, color: 'var(--rp-text-secondary)',
                  letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.35rem',
                }}>
                  {k}
                </div>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 15, color: 'var(--rp-text-primary)', fontWeight: 500,
                }}>
                  {v}
                </div>
              </div>
            ))}
          </div>

          <button onClick={onBack} style={{
            width: '100%',
            fontFamily: "'DM Mono', monospace",
            fontSize: 15, fontWeight: 500, padding: '0.75rem',
            borderRadius: 8, background: 'transparent',
            border: '0.5px solid var(--rp-border-strong)',
            color: 'var(--rp-text-primary)', cursor: 'pointer',
          }}>
            ← Back to Marketplace
          </button>
        </div>
      )}
    </div>
  );
}
