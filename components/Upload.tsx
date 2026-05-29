'use client';

import { useState, type DragEvent, type ChangeEvent, Fragment } from 'react';
import type { WalletInfo } from '@/lib/types';
import { useViewport } from '@/hooks/useViewport';
import { Spinner } from './shared/Spinner';

function randHex(n: number) {
  return Array.from({ length: n }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
}
function randBlob() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return 'bAE' + Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

const PUBLISH_STEPS = ['Wrapping blob ID…', 'Creating Kiosk listing…', 'Setting SUI price…', 'Confirming via Tatum RPC…', 'Finalizing…'];
const STEP_LABELS = ['Upload', 'Processing', 'Details', 'Publishing', 'Live'];

interface UploadProps {
  wallet: WalletInfo | null;
  onWalletRequired: () => void;
  onNavigate: (page: import('@/lib/types').Page) => void;
}

const monoLabel: React.CSSProperties = {
  fontFamily: "'DM Mono', monospace",
  fontSize: 12, color: 'var(--rp-text-muted)',
  marginBottom: '0.5rem', fontWeight: 500,
  display: 'block',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--rp-bg-sunken)',
  border: '0.5px solid var(--rp-border)',
  borderRadius: 8,
  padding: '0.75rem 0.875rem',
  color: 'var(--rp-text-primary)',
  fontFamily: "'DM Mono', monospace",
  fontSize: 14, outline: 'none',
};

export function Upload({ wallet, onWalletRequired, onNavigate }: UploadProps) {
  const { mobile } = useViewport();
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [blobId, setBlobId] = useState('');
  const [price, setPrice] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Research');
  const [txHash, setTxHash] = useState('');
  const [kioskId, setKioskId] = useState('');
  const [publishProgress, setPublishProgress] = useState(0);
  const [publishStep, setPublishStep] = useState(0);

  const startWalrusUpload = async (f: File) => {
    setStep(1); setProgress(0);
    for (let i = 0; i <= 100; i += Math.random() * 8 + 2) {
      await new Promise(r => setTimeout(r, 120 + Math.random() * 80));
      setProgress(Math.min(Math.round(i), 100));
    }
    setProgress(100);
    await new Promise(r => setTimeout(r, 350));
    setBlobId(randBlob());
    setStep(2);
  };

  const handleFile = (f: File) => {
    if (!wallet) { onWalletRequired(); return; }
    setFile(f);
    setTitle(f.name.replace(/\.[^.]+$/, ''));
    startWalrusUpload(f);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) handleFile(f);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handlePublish = async () => {
    if (!price || !title) return;
    setStep(3); setPublishProgress(0); setPublishStep(0);
    for (let i = 0; i < PUBLISH_STEPS.length; i++) {
      setPublishStep(i);
      await new Promise(r => setTimeout(r, 800 + Math.random() * 500));
      setPublishProgress(Math.round(((i + 1) / PUBLISH_STEPS.length) * 100));
    }
    setTxHash(randHex(64));
    setKioskId('0x' + randHex(32));
    setStep(4);
  };

  const reset = () => {
    setStep(0); setFile(null); setProgress(0); setBlobId('');
    setPrice(''); setTitle(''); setDescription('');
    setPublishProgress(0); setPublishStep(0); setTxHash(''); setKioskId('');
  };

  return (
    <div className="fade-in" style={{
      maxWidth: 640, margin: '0 auto',
      padding: mobile ? '2rem 1rem 5.5rem' : '3rem 2.5rem 3rem',
    }}>

      {/* ── Step indicator ── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        marginBottom: mobile ? '2rem' : '2.5rem',
        overflowX: 'auto', paddingBottom: 4,
      }}>
        {STEP_LABELS.map((label, i) => (
          <Fragment key={i}>
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 6, flexShrink: 0,
            }}>
              <div style={{
                width: mobile ? 26 : 30, height: mobile ? 26 : 30,
                borderRadius: '50%',
                background: i < step
                  ? 'var(--rp-accent-green)'
                  : i === step
                    ? 'var(--rp-accent-green-tint)'
                    : 'var(--rp-bg-surface)',
                border: `0.5px solid ${i <= step ? 'var(--rp-accent-green)' : 'var(--rp-border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'DM Mono', monospace",
                fontSize: 11, fontWeight: 500,
                color: i < step ? '#ECEAE4' : i === step ? 'var(--rp-accent-green)' : 'var(--rp-text-muted)',
                transition: 'all 0.3s',
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              {!mobile && (
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10, letterSpacing: '0.06em',
                  color: i <= step ? 'var(--rp-accent-green)' : 'var(--rp-text-muted)',
                  whiteSpace: 'nowrap',
                }}>
                  {label}
                </span>
              )}
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div style={{
                height: 1, flex: 1, minWidth: mobile ? 10 : 16,
                background: i < step ? 'var(--rp-accent-green)' : 'var(--rp-border)',
                margin: mobile ? '0 4px' : '0 8px',
                marginBottom: mobile ? 0 : 22,
                transition: 'background 0.3s',
              }} />
            )}
          </Fragment>
        ))}
      </div>

      {/* ── Step 0: Drop zone ── */}
      {step === 0 && (
        <div className="fade-in">
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'var(--rp-text-muted)', marginBottom: '0.5rem', textAlign: 'center',
          }}>
            01 — Upload
          </p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: mobile ? 28 : 36, fontWeight: 600,
            lineHeight: 0.96, letterSpacing: '-0.02em',
            color: 'var(--rp-text-primary)',
            marginBottom: '0.5rem', textAlign: 'center',
          }}>
            Upload a file.<br />
            <em style={{ color: 'var(--rp-accent-green)', fontStyle: 'italic' }}>Start selling.</em>
          </h2>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 13, color: 'var(--rp-text-muted)',
            textAlign: 'center', marginBottom: '1.75rem',
            lineHeight: 1.65,
          }}>
            Stored on Walrus · Access gated by Sui Kiosk
          </p>

          <label
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              border: `0.5px dashed ${dragOver ? 'var(--rp-accent-green)' : 'var(--rp-border-strong)'}`,
              borderRadius: 12,
              padding: mobile ? '2.5rem 1.5rem' : '3.5rem 2.5rem',
              background: dragOver ? 'var(--rp-accent-green-tint)' : 'var(--rp-bg-surface)',
              cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
            }}
          >
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: mobile ? 32 : 40, marginBottom: '0.875rem',
              opacity: 0.5, color: 'var(--rp-text-muted)',
            }}>
              ⬆
            </div>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 600, fontSize: mobile ? 18 : 22,
              color: 'var(--rp-text-primary)', marginBottom: '0.4rem',
            }}>
              Drag & drop your file here
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 13, color: 'var(--rp-text-muted)', marginBottom: '1.5rem',
            }}>
              PDF, ZIP, CSV, JSON, MP4…
            </div>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 13, fontWeight: 500,
              padding: '0.5rem 1.25rem', borderRadius: 8,
              background: 'transparent',
              border: '0.5px solid var(--rp-border-strong)',
              color: 'var(--rp-text-primary)',
            }}>
              Browse Files
            </span>
            <input type="file" style={{ display: 'none' }} onChange={handleInputChange} />
          </label>

          {!wallet && (
            <div style={{
              marginTop: '1rem', padding: '0.875rem 1rem',
              background: 'rgba(79,159,255,0.06)',
              border: '0.5px solid rgba(79,159,255,0.2)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 18 }}>🔗</span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 13, fontWeight: 500, color: '#4F9FFF', marginBottom: 2,
                }}>
                  Wallet required
                </div>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12, color: 'var(--rp-text-muted)',
                }}>
                  Connect your Sui wallet before uploading.
                </div>
              </div>
              <button
                onClick={onWalletRequired}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12, fontWeight: 500,
                  padding: '0.4rem 0.875rem', borderRadius: 8,
                  background: 'rgba(79,159,255,0.12)',
                  border: '0.5px solid rgba(79,159,255,0.3)',
                  color: '#4F9FFF', cursor: 'pointer', flexShrink: 0,
                }}
              >
                Connect
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Step 1: Uploading ── */}
      {step === 1 && (
        <div className="fade-in" style={{ textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--rp-accent-green-tint)',
            border: '0.5px solid var(--rp-accent-green-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            <Spinner size={28} />
          </div>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'var(--rp-text-muted)', marginBottom: '0.4rem',
          }}>
            Walrus Storage
          </p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: mobile ? 24 : 30, fontWeight: 600,
            color: 'var(--rp-text-primary)', marginBottom: '0.4rem',
          }}>
            Uploading to Walrus
          </h2>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 13, color: 'var(--rp-text-muted)', marginBottom: '1.5rem',
          }}>
            {file?.name}
          </p>
          <div style={{
            background: 'var(--rp-bg-sunken)', borderRadius: 50,
            height: 4, overflow: 'hidden', marginBottom: '0.5rem',
            border: '0.5px solid var(--rp-border)',
          }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: 'var(--rp-accent-green)',
              borderRadius: 50, transition: 'width 0.3s',
            }} />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontFamily: "'DM Mono', monospace",
            fontSize: 12, color: 'var(--rp-text-muted)',
          }}>
            <span>Uploading blob…</span>
            <span style={{ color: 'var(--rp-accent-green)', fontWeight: 500 }}>{progress}%</span>
          </div>
          <div style={{
            marginTop: '1.5rem',
            background: 'var(--rp-bg-raised)',
            border: '0.5px solid var(--rp-border)',
            borderRadius: 10, overflow: 'hidden', textAlign: 'left',
          }}>
            {([
              ['Endpoint', 'aggregator.walrus-testnet.walrus.space'],
              ['Redundancy', '2-of-N erasure coding'],
              ['Epochs', '5 (≈ 5 weeks)'],
            ] as [string, string][]).map(([k, v], i) => (
              <div key={k} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '0.625rem 1rem',
                borderBottom: i < 2 ? '0.5px solid var(--rp-border)' : 'none',
              }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--rp-text-muted)' }}>{k}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--rp-text-secondary)', textAlign: 'right' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 2: Metadata ── */}
      {step === 2 && (
        <div className="fade-in">
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'var(--rp-text-muted)', marginBottom: '0.4rem',
          }}>
            03 — Listing Details
          </p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: mobile ? 26 : 32, fontWeight: 600,
            color: 'var(--rp-text-primary)', marginBottom: '0.35rem',
            lineHeight: 1.1,
          }}>
            Price it.<br />
            <em style={{ color: 'var(--rp-accent-green)', fontStyle: 'italic' }}>Sui holds the lock.</em>
          </h2>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 13, color: 'var(--rp-text-muted)', marginBottom: '1.25rem', lineHeight: 1.6,
          }}>
            Your file is stored. Wrap it in a Sui access pass and set a price.
          </p>

          {/* Blob ID */}
          <div style={{
            background: 'var(--rp-accent-green-tint)',
            border: '0.5px solid var(--rp-accent-green-border)',
            borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1.25rem',
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10, color: 'var(--rp-text-muted)',
              letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.25rem',
            }}>
              Walrus Blob ID
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 12, color: 'var(--rp-accent-green)', wordBreak: 'break-all',
            }}>
              {blobId}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div>
              <label style={monoLabel}>Title</label>
              <input
                value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Give your file a clear title"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={monoLabel}>Description</label>
              <textarea
                value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Describe what the buyer gets…" rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={monoLabel}>Category</label>
                <select
                  value={category} onChange={e => setCategory(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {['Research', 'Finance', 'Code', 'Dataset', 'Education', 'Art', 'Other'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={monoLabel}>Price (SUI)</label>
                <input
                  type="number" min="0.1" step="0.1"
                  value={price} onChange={e => setPrice(e.target.value)}
                  placeholder="e.g. 10"
                  style={{
                    ...inputStyle,
                    borderColor: price ? 'var(--rp-accent-green-border)' : 'var(--rp-border)',
                  }}
                />
              </div>
            </div>

            {/* Fee breakdown */}
            {price && (
              <div style={{
                background: 'var(--rp-bg-surface)',
                border: '0.5px solid var(--rp-border)',
                borderRadius: 10, overflow: 'hidden',
              }}>
                {([
                  ['Listing price', `${price} SUI`, false],
                  ['Marketplace fee (2.5%)', `−${(parseFloat(price) * 0.025).toFixed(3)} SUI`, false],
                  ['You receive', `${(parseFloat(price) * 0.975).toFixed(3)} SUI`, true],
                ] as [string, string, boolean][]).map(([k, v, accent], i) => (
                  <div key={k} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '0.625rem 1rem',
                    borderTop: accent ? '0.5px solid var(--rp-border)' : i > 0 ? '0.5px solid var(--rp-border)' : 'none',
                  }}>
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 13,
                      color: accent ? 'var(--rp-text-primary)' : 'var(--rp-text-muted)',
                      fontWeight: accent ? 500 : 400,
                    }}>
                      {k}
                    </span>
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 13,
                      color: accent ? 'var(--rp-accent-green)' : 'var(--rp-text-muted)',
                      fontWeight: accent ? 500 : 400,
                    }}>
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handlePublish}
              disabled={!price || !title}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8,
                background: (!price || !title) ? 'var(--rp-bg-surface)' : 'var(--rp-accent-green)',
                color: (!price || !title) ? 'var(--rp-text-muted)' : '#ECEAE4',
                border: 'none', borderRadius: 50,
                padding: '0.9rem 2rem',
                fontFamily: "'DM Mono', monospace",
                fontSize: 14, fontWeight: 500, cursor: (!price || !title) ? 'not-allowed' : 'pointer',
                letterSpacing: '0.02em', transition: 'background 0.15s',
              }}
            >
              List on Kiosk →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Publishing ── */}
      {step === 3 && (
        <div className="fade-in" style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 1.5rem' }}>
            <svg width="72" height="72" viewBox="0 0 72 72" style={{ position: 'absolute' }}>
              <circle cx="36" cy="36" r="32" fill="none" stroke="var(--rp-border)" strokeWidth="3" />
              <circle cx="36" cy="36" r="32" fill="none" stroke="var(--rp-accent-green)" strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${publishProgress * 2.01} 201`}
                strokeDashoffset="50"
                style={{ transition: 'stroke-dasharray 0.5s' }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'DM Mono', monospace",
              fontWeight: 500, color: 'var(--rp-accent-green)', fontSize: 14,
            }}>
              {publishProgress}%
            </div>
          </div>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'var(--rp-text-muted)', marginBottom: '0.4rem',
          }}>
            04 — Publishing
          </p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: mobile ? 24 : 30, fontWeight: 600,
            color: 'var(--rp-text-primary)', marginBottom: '0.35rem',
          }}>
            Publishing to Kiosk
          </h2>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 13, color: 'var(--rp-text-muted)', marginBottom: '1.5rem',
          }}>
            Submitting your listing to the Sui blockchain…
          </p>
          <div style={{
            background: 'var(--rp-bg-raised)',
            border: '0.5px solid var(--rp-border)',
            borderRadius: 12, overflow: 'hidden',
          }}>
            {PUBLISH_STEPS.map((label, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '0.875rem 1rem',
                borderBottom: i < PUBLISH_STEPS.length - 1 ? '0.5px solid var(--rp-border)' : 'none',
                background: i === publishStep ? 'var(--rp-accent-green-tint)' : 'transparent',
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  background: i < publishStep
                    ? 'var(--rp-accent-green)'
                    : i === publishStep
                      ? 'var(--rp-accent-green-tint)'
                      : 'var(--rp-bg-surface)',
                  border: `0.5px solid ${i <= publishStep ? 'var(--rp-accent-green)' : 'var(--rp-border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {i < publishStep
                    ? <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#ECEAE4', fontWeight: 500 }}>✓</span>
                    : i === publishStep
                      ? <Spinner size={9} />
                      : <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--rp-text-muted)' }}>{i + 1}</span>
                  }
                </div>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 13,
                  color: i === publishStep ? 'var(--rp-text-primary)' : 'var(--rp-text-muted)',
                  fontWeight: i === publishStep ? 500 : 400,
                }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 4: Done ── */}
      {step === 4 && (
        <div className="fade-in" style={{ textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--rp-accent-green-tint)',
            border: '0.5px solid var(--rp-accent-green-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            color: 'var(--rp-accent-green)', fontSize: 26,
          }}>
            ✓
          </div>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'var(--rp-accent-green)', marginBottom: '0.4rem',
          }}>
            05 — Live
          </p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: mobile ? 28 : 36, fontWeight: 600,
            color: 'var(--rp-accent-green)', marginBottom: '0.4rem',
          }}>
            File Listed.
          </h2>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 13, color: 'var(--rp-text-muted)', marginBottom: '1.5rem',
          }}>
            Your access pass is live on the Sui Kiosk marketplace.
          </p>

          <div style={{
            background: 'var(--rp-bg-raised)',
            border: '0.5px solid var(--rp-accent-green-border)',
            borderRadius: 12, padding: '1rem 1.25rem',
            textAlign: 'left', marginBottom: '1.25rem',
          }}>
            {([
              ['Blob ID',     blobId.slice(0, 20) + '…',                          true  ],
              ['Kiosk ID',   kioskId.slice(0, 14) + '…',                          false ],
              ['Transaction', txHash.slice(0, 8) + '…' + txHash.slice(-6),        false ],
              ['Price',       `${price} SUI`,                                      false ],
              ['Status',      'Active ✓',                                          false ],
            ] as [string, string, boolean][]).map(([k, v, accent], i) => (
              <div key={k} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.625rem 0',
                borderBottom: i < 4 ? '0.5px solid var(--rp-border)' : 'none',
              }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--rp-text-muted)' }}>{k}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: accent ? 'var(--rp-accent-green)' : 'var(--rp-text-primary)' }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={reset} style={{
              flex: 1, fontFamily: "'DM Mono', monospace",
              fontSize: 13, fontWeight: 500, padding: '0.75rem',
              borderRadius: 8, background: 'transparent',
              border: '0.5px solid var(--rp-border-strong)',
              color: 'var(--rp-text-primary)', cursor: 'pointer',
            }}>
              List Another
            </button>
            <button onClick={() => onNavigate('dashboard')} style={{
              flex: 1, fontFamily: "'DM Mono', monospace",
              fontSize: 13, fontWeight: 500, padding: '0.75rem',
              borderRadius: 8,
              background: 'var(--rp-accent-green)', color: '#ECEAE4',
              border: 'none', cursor: 'pointer',
            }}>
              View Dashboard →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
