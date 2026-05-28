'use client';

import { useState, type DragEvent, type ChangeEvent, Fragment } from 'react';
import type { WalletInfo } from '@/lib/types';
import { useViewport } from '@/hooks/useViewport';
import { Spinner } from './shared/Spinner';
import { Btn } from './shared/Btn';

function randHex(n: number) {
  return Array.from({ length: n }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
}
function randBlob() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return 'bAE' + Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

const PUBLISH_STEPS = ['Wrapping blob ID…', 'Creating Kiosk listing…', 'Setting SUI price…', 'Confirming via Tatum RPC…', 'Finalizing…'];
const STEP_DOTS = ['Upload', 'Processing', 'Details', 'Publishing', 'Live'];

interface UploadProps {
  wallet: WalletInfo | null;
  onWalletRequired: () => void;
  onNavigate: (page: import('@/lib/types').Page) => void;
}

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
    setStep(1);
    setProgress(0);

    // In production: POST to /api/walrus/upload with FormData
    // const fd = new FormData(); fd.append('file', f);
    // const res = await fetch('/api/walrus/upload', { method: 'POST', body: fd });
    // const { blobId } = await res.json();

    // Simulate upload progress
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
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) handleFile(f);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handlePublish = async () => {
    if (!price || !title) return;
    setStep(3);
    setPublishProgress(0);
    setPublishStep(0);
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

  const pad = mobile ? '20px 16px' : '48px 28px';

  return (
    <div className="fade-in" style={{ maxWidth: 640, margin: '0 auto', padding: pad, paddingBottom: mobile ? 88 : 48 }}>
      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: mobile ? 32 : 44, overflowX: 'auto', paddingBottom: 4 }}>
        {STEP_DOTS.map((label, i) => (
          <Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <div style={{ width: mobile ? 26 : 30, height: mobile ? 26 : 30, borderRadius: '50%', background: i < step ? 'var(--accent)' : i === step ? 'var(--accent-dim)' : 'var(--s2)', border: `2px solid ${i <= step ? 'var(--accent)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: i < step ? '#04100B' : i === step ? 'var(--accent)' : 'var(--t3)', transition: 'all 0.3s' }}>
                {i < step ? '✓' : i + 1}
              </div>
              {!mobile && <span style={{ fontSize: 10, color: i <= step ? 'var(--accent)' : 'var(--t3)', whiteSpace: 'nowrap' }}>{label}</span>}
            </div>
            {i < STEP_DOTS.length - 1 && (
              <div style={{ height: 2, flex: 1, minWidth: mobile ? 12 : 20, background: i < step ? 'var(--accent)' : 'var(--border)', margin: mobile ? '0 4px' : '0 8px', marginBottom: mobile ? 0 : 22, transition: 'background 0.3s' }}/>
            )}
          </Fragment>
        ))}
      </div>

      {/* STEP 0: Drop zone */}
      {step === 0 && (
        <div className="fade-in">
          <h2 style={{ fontSize: mobile ? 20 : 24, fontWeight: 700, marginBottom: 6, textAlign: 'center' }}>Upload a File to Sell</h2>
          <p style={{ color: 'var(--t2)', textAlign: 'center', marginBottom: 24, fontSize: 13 }}>Stored on Walrus · Access gated by Sui Kiosk</p>
          <label
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--card-radius)', padding: mobile ? '40px 24px' : '56px 40px', background: dragOver ? 'var(--accent-dim)' : 'var(--s1)', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center', boxShadow: dragOver ? 'var(--glow-hover)' : 'none' }}
          >
            <div style={{ fontSize: mobile ? 36 : 44, marginBottom: 12, opacity: 0.6 }}>⬆</div>
            <div style={{ fontWeight: 600, fontSize: mobile ? 15 : 17, marginBottom: 6 }}>Drag &amp; drop your file here</div>
            <div style={{ color: 'var(--t2)', fontSize: 13, marginBottom: 20 }}>PDF, ZIP, CSV, JSON, MP4…</div>
            <Btn variant="secondary" size="sm">Browse Files</Btn>
            <input type="file" style={{ display: 'none' }} onChange={handleInputChange}/>
          </label>
          {!wallet && (
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(79,159,255,0.08)', border: '1px solid rgba(79,159,255,0.25)', borderRadius: 'var(--card-radius)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>🔗</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, color: 'var(--sui)', fontSize: 13 }}>Wallet required</div>
                <div style={{ color: 'var(--t2)', fontSize: 12 }}>Connect your Sui wallet before uploading.</div>
              </div>
              <Btn variant="sui" size="sm" onClick={onWalletRequired} style={{ flexShrink: 0 }}>Connect</Btn>
            </div>
          )}
        </div>
      )}

      {/* STEP 1: Uploading to Walrus */}
      {step === 1 && (
        <div className="fade-in" style={{ textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-dim)', border: '2px solid rgba(0,229,160,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Spinner size={28}/>
          </div>
          <h2 style={{ fontSize: mobile ? 18 : 20, fontWeight: 700, marginBottom: 6 }}>Uploading to Walrus</h2>
          <p style={{ color: 'var(--t2)', fontSize: 13, marginBottom: 24 }}>{file?.name}</p>
          <div style={{ background: 'var(--s2)', borderRadius: 100, height: 7, overflow: 'hidden', marginBottom: 10 }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent)', borderRadius: 100, transition: 'width 0.3s', boxShadow: '0 0 10px var(--accent-glo)' }}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t3)' }}>
            <span>Uploading blob…</span>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{progress}%</span>
          </div>
          <div style={{ marginTop: 24, background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, textAlign: 'left' }}>
            {([['Endpoint', 'aggregator.walrus-testnet.walrus.space'], ['Redundancy', '2-of-N erasure coding'], ['Epochs', '5 (≈ 5 weeks)']] as [string, string][]).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                <span style={{ color: 'var(--t3)' }}>{k}</span>
                <span style={{ fontFamily: 'var(--mono)', color: 'var(--t2)', fontSize: 11, textAlign: 'right' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Metadata */}
      {step === 2 && (
        <div className="fade-in">
          <h2 style={{ fontSize: mobile ? 18 : 21, fontWeight: 700, marginBottom: 4 }}>Set Listing Details</h2>
          <p style={{ color: 'var(--t2)', fontSize: 13, marginBottom: 20 }}>Your file is stored. Wrap it in a Sui access pass and set a price.</p>
          <div style={{ background: 'var(--s2)', border: '1px solid rgba(0,229,160,0.2)', borderRadius: 10, padding: 12, marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 4 }}>WALRUS BLOB ID</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)', wordBreak: 'break-all' }}>{blobId}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--t2)', marginBottom: 7, fontWeight: 500 }}>Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Give your file a clear title"
                style={{ width: '100%', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 'var(--card-radius)', padding: '10px 13px', color: 'var(--t1)', fontSize: 14, fontFamily: 'inherit' }}/>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--t2)', marginBottom: 7, fontWeight: 500 }}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe what the buyer gets…" rows={3}
                style={{ width: '100%', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 'var(--card-radius)', padding: '10px 13px', color: 'var(--t1)', fontSize: 14, fontFamily: 'inherit', outline: 'none', resize: 'vertical' }}/>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--t2)', marginBottom: 7, fontWeight: 500 }}>Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  style={{ width: '100%', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 'var(--card-radius)', padding: '10px 13px', color: 'var(--t1)', fontSize: 13, fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}>
                  {['Research', 'Finance', 'Code', 'Dataset', 'Education', 'Art', 'Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--t2)', marginBottom: 7, fontWeight: 500 }}>Price (SUI)</label>
                <input type="number" min="0.1" step="0.1" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 10"
                  style={{ width: '100%', background: 'var(--s2)', border: `1px solid ${price ? 'rgba(0,229,160,0.4)' : 'var(--border)'}`, borderRadius: 'var(--card-radius)', padding: '10px 13px', color: 'var(--t1)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}/>
              </div>
            </div>
            {price && (
              <div style={{ background: 'var(--s2)', borderRadius: 10, padding: 14, fontSize: 13, color: 'var(--t2)' }}>
                {([['Listing price', `${price} SUI`, false], ['Marketplace fee (2.5%)', `−${(parseFloat(price) * 0.025).toFixed(3)} SUI`, false], ['You receive', `${(parseFloat(price) * 0.975).toFixed(3)} SUI`, true]] as [string, string, boolean][]).map(([k, v, accent]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: accent ? '1px solid var(--border)' : 'none', marginTop: accent ? 6 : 0 }}>
                    <span style={{ fontWeight: accent ? 600 : 400, color: accent ? 'var(--t1)' : 'inherit' }}>{k}</span>
                    <span style={{ fontWeight: accent ? 700 : 400, color: accent ? 'var(--accent)' : 'inherit' }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
            <Btn variant="primary" size="lg" full onClick={handlePublish} disabled={!price || !title}>List on Kiosk →</Btn>
          </div>
        </div>
      )}

      {/* STEP 3: Publishing */}
      {step === 3 && (
        <div className="fade-in" style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 24px' }}>
            <svg width="72" height="72" viewBox="0 0 72 72" style={{ position: 'absolute' }}>
              <circle cx="36" cy="36" r="32" fill="none" stroke="var(--s3)" strokeWidth="4"/>
              <circle cx="36" cy="36" r="32" fill="none" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${publishProgress * 2.01} 201`} strokeDashoffset="50" style={{ transition: 'stroke-dasharray 0.5s' }}/>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--accent)', fontSize: 14 }}>{publishProgress}%</div>
          </div>
          <h2 style={{ fontSize: mobile ? 18 : 20, fontWeight: 700, marginBottom: 6 }}>Publishing to Kiosk</h2>
          <p style={{ color: 'var(--t2)', fontSize: 13, marginBottom: 24 }}>Submitting your listing to the Sui blockchain…</p>
          <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            {PUBLISH_STEPS.map((label, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderBottom: i < PUBLISH_STEPS.length - 1 ? '1px solid var(--border)' : 'none', background: i === publishStep ? 'rgba(0,229,160,0.04)' : 'none' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: i < publishStep ? 'var(--accent)' : i === publishStep ? 'var(--accent-dim)' : 'var(--s3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${i <= publishStep ? 'var(--accent)' : 'var(--border)'}` }}>
                  {i < publishStep ? <span style={{ fontSize: 10, color: '#04100B', fontWeight: 700 }}>✓</span> : i === publishStep ? <Spinner size={9}/> : <span style={{ fontSize: 10, color: 'var(--t3)' }}>{i + 1}</span>}
                </div>
                <span style={{ fontSize: 12, color: i < publishStep ? 'var(--t3)' : i === publishStep ? 'var(--t1)' : 'var(--t3)', fontWeight: i === publishStep ? 500 : 400 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: Done */}
      {step === 4 && (
        <div className="fade-in" style={{ textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-dim)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 26 }}>✓</div>
          <h2 style={{ fontSize: mobile ? 20 : 24, fontWeight: 700, marginBottom: 6, color: 'var(--accent)' }}>File Listed!</h2>
          <p style={{ color: 'var(--t2)', fontSize: 13, marginBottom: 24 }}>Your access pass is live on the Sui Kiosk marketplace.</p>
          <div style={{ background: 'var(--s1)', border: '1px solid rgba(0,229,160,0.2)', borderRadius: 14, padding: 18, textAlign: 'left', marginBottom: 20 }}>
            {([['Blob ID', blobId.slice(0, 20) + '…', true], ['Kiosk ID', kioskId.slice(0, 14) + '…', false], ['Transaction', txHash.slice(0, 8) + '…' + txHash.slice(-6), false], ['Price', `${price} SUI`, false], ['Status', 'Active ✓', false]] as [string, string, boolean][]).map(([k, v, accent]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, color: 'var(--t3)' }}>{k}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: accent ? 'var(--accent)' : 'var(--t1)' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn variant="ghost" full onClick={reset} style={{ fontSize: 13 }}>List Another</Btn>
            <Btn variant="primary" full onClick={() => onNavigate('dashboard')} style={{ fontSize: 13 }}>View Dashboard →</Btn>
          </div>
        </div>
      )}
    </div>
  );
}
