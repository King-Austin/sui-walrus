'use client';

import { useState, useEffect } from 'react';
import type { FileItem, WalletInfo } from '@/lib/types';
import { useViewport } from '@/hooks/useViewport';
import { Badge } from './shared/Badge';
import { Btn } from './shared/Btn';
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
      // In production: call /api/tatum/verify to confirm ownership on-chain
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
    // In production: fetch the blob URL from /api/walrus/blob or directly from aggregator
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

  const pad = mobile ? '32px 16px' : '56px 28px';
  const blobShort = file?.blobId ? file.blobId.slice(0, 18) + '…' : '—';
  const doneCount = checks.filter(Boolean).length;

  return (
    <div className="fade-in" style={{ maxWidth: 560, margin: '0 auto', padding: pad, paddingBottom: mobile ? 88 : 56, textAlign: 'center' }}>

      {/* VERIFYING */}
      {phase === 'verifying' && (
        <>
          <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 24px' }}>
            <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: 'absolute' }}>
              <circle cx="40" cy="40" r="35" fill="none" stroke="var(--s3)" strokeWidth="3"/>
              <circle cx="40" cy="40" r="35" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round"
                strokeDasharray="220" strokeDashoffset="0" style={{ animation: 'spin 1.6s linear infinite', transformOrigin: '40px 40px' }}/>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🔐</div>
          </div>
          <h2 style={{ fontSize: mobile ? 20 : 22, fontWeight: 700, marginBottom: 6 }}>Verifying Access</h2>
          <p style={{ color: 'var(--t2)', fontSize: 13, marginBottom: 28 }}>Confirming ownership on-chain via Tatum RPC</p>

          <div style={{ background: '#050810', border: '1px solid var(--border)', borderRadius: 12, padding: mobile ? 14 : 18, textAlign: 'left', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', animation: 'scanline 2s linear infinite' }}/>
            <div style={{ display: 'flex', gap: 5, marginBottom: 12 }}>
              {['#FF4D6A', '#FFB347', '#00E5A0'].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.7 }}/>)}
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--t3)', marginLeft: 6 }}>tatum-rpc · sui mainnet</span>
            </div>
            {CHECK_LABELS.map((label, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontFamily: 'var(--mono)', fontSize: mobile ? 11 : 12 }}>
                <span style={{ color: checks[i] ? 'var(--accent)' : i === doneCount ? 'var(--warn)' : 'var(--t3)', flexShrink: 0 }}>
                  {checks[i] ? '✓' : i === doneCount ? '›' : '·'}
                </span>
                <span style={{ color: checks[i] ? 'var(--t2)' : i === doneCount ? 'var(--t1)' : 'var(--t3)' }}>{label}</span>
                {i === doneCount && !checks[i] && (
                  <span style={{ display: 'inline-block', width: 5, height: 11, background: 'var(--accent)', animation: 'blink 0.8s step-end infinite' }}/>
                )}
              </div>
            ))}
          </div>

          {txHash && (
            <div style={{ background: 'var(--s2)', borderRadius: 8, padding: '9px 13px', display: 'flex', gap: 8, alignItems: 'center', fontSize: 12 }}>
              <span style={{ color: 'var(--t3)', flexShrink: 0, fontSize: 10 }}>TX</span>
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--t2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 11 }}>{txHash}</span>
            </div>
          )}
        </>
      )}

      {/* READY */}
      {phase === 'ready' && (
        <div className="fade-in">
          <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'var(--accent-dim)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 38, boxShadow: '0 0 40px var(--accent-glo)' }}>🔓</div>
          <h2 style={{ fontSize: mobile ? 22 : 26, fontWeight: 700, marginBottom: 6, color: 'var(--accent)' }}>Access Granted</h2>
          <p style={{ color: 'var(--t2)', fontSize: 14, marginBottom: 10 }}>{file?.title}</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
            <Badge color="var(--accent)" bg="var(--accent-dim)">✓ Verified</Badge>
            <Badge color="var(--sui)" bg="var(--sui-dim)">Tatum RPC</Badge>
            <Badge>{file?.size}</Badge>
          </div>
          <div style={{ background: 'var(--s1)', border: '1px solid rgba(0,229,160,0.2)', borderRadius: 12, padding: 16, textAlign: 'left', marginBottom: 24 }}>
            {([['Walrus Blob', blobShort, true], ['Kiosk Object', (file?.kiosk?.slice(0, 14) ?? '') + '…', false], ['Verified by', 'Tatum RPC · Sui Mainnet', false]] as [string, string, boolean][]).map(([k, v, accent]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                <span style={{ color: 'var(--t3)' }}>{k}</span>
                <span style={{ fontFamily: 'var(--mono)', color: accent ? 'var(--accent)' : 'var(--t1)', fontSize: 11 }}>{v}</span>
              </div>
            ))}
          </div>
          <Btn variant="primary" size="lg" full onClick={handleDownload}>↓ Download File</Btn>
        </div>
      )}

      {/* DOWNLOADING */}
      {phase === 'downloading' && (
        <div className="fade-in">
          <div style={{ fontSize: 44, marginBottom: 24 }}>🌊</div>
          <h2 style={{ fontSize: mobile ? 18 : 20, fontWeight: 700, marginBottom: 6 }}>Retrieving from Walrus</h2>
          <p style={{ color: 'var(--t2)', fontSize: 13, marginBottom: 24 }}>Fetching your blob from the decentralized network</p>
          <div style={{ background: 'var(--s2)', borderRadius: 100, height: 7, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ height: '100%', width: `${dlProgress}%`, background: 'linear-gradient(90deg, var(--accent), var(--sui))', borderRadius: 100, transition: 'width 0.15s', boxShadow: '0 0 10px var(--accent-glo)' }}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t3)' }}>
            <Mono>blob.{file?.type} ← walrus</Mono>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{dlProgress}%</span>
          </div>
        </div>
      )}

      {/* DONE */}
      {phase === 'done' && (
        <div className="fade-in">
          <div style={{ width: 86, height: 86, borderRadius: '50%', background: 'var(--accent-dim)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, boxShadow: '0 0 50px rgba(0,229,160,0.4)', margin: '0 auto 22px' }}>✓</div>
          <h2 style={{ fontSize: mobile ? 18 : 22, fontWeight: 800, color: 'var(--accent)', marginBottom: 8, fontFamily: 'var(--mono)', wordBreak: 'break-word' }}>
            {chars}<span style={{ animation: 'blink 0.8s step-end infinite' }}>_</span>
          </h2>
          <p style={{ color: 'var(--t2)', fontSize: 13, marginBottom: 24 }}>Retrieved from Walrus and saved to your device.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
            {([['TX', txHash ? txHash.slice(0, 8) + '…' : '—'], ['Type', (file?.type ?? '—').toUpperCase()], ['Size', file?.size ?? '—'], ['Network', 'Sui Mainnet']] as [string, string][]).map(([k, v]) => (
              <div key={k} style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', textAlign: 'left' }}>
                <div style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.8 }}>{k}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--t1)', fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>
          <Btn variant="ghost" full onClick={onBack}>← Back to Marketplace</Btn>
        </div>
      )}
    </div>
  );
}
