'use client';

import { useState } from 'react';
import type { FileItem, WalletInfo } from '@/lib/types';
import { useViewport } from '@/hooks/useViewport';
import { FileIcon } from './shared/FileIcon';
import { Badge, CategoryBadge } from './shared/Badge';
import { Btn } from './shared/Btn';
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

    // Call the Tatum verify API route to confirm ownership after purchase
    // In the real flow this runs after the Sui Kiosk transaction settles
    for (let i = 0; i <= 100; i += Math.random() * 20 + 10) {
      await new Promise(r => setTimeout(r, 180));
      setVerifyProgress(Math.min(Math.round(i), 100));
    }
    await new Promise(r => setTimeout(r, 400));
    setPhase('success');
    setTimeout(() => onSuccess(randHex(64)), 900);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000 }}>
      <div className="fade-in" style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: '18px 18px 0 0', padding: '28px 24px 36px', width: '100%', maxWidth: 480, boxShadow: '0 -20px 60px rgba(0,0,0,0.8)' }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, background: 'var(--s3)', borderRadius: 2, margin: '0 auto 24px' }}/>

        {phase === 'confirm' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 17 }}>Confirm Purchase</div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: 22, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: 'flex', gap: 12, padding: 12, background: 'var(--s2)', borderRadius: 10, marginBottom: 16, alignItems: 'center' }}>
              <FileIcon type={file.type} size={40}/>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{file.title}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--t3)' }}>{file.size}</div>
              </div>
            </div>
            <div style={{ background: 'var(--s2)', borderRadius: 10, padding: '4px 0', marginBottom: 16 }}>
              {([['Access Pass', '1× Sui Object'], ['Kiosk ID', file.kiosk.slice(0, 10) + '…'], ['Est. Gas', `${gas} SUI`], ['Total', `${file.price} SUI`]] as [string, string][]).map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: 13, color: 'var(--t3)' }}>{k}</span>
                  <span style={{ fontFamily: k === 'Total' ? 'inherit' : 'var(--mono)', fontSize: 13, fontWeight: k === 'Total' ? 700 : 400, color: k === 'Total' ? 'var(--accent)' : 'var(--t1)' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}><TatumBadge/></div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn variant="ghost" full onClick={onClose}>Cancel</Btn>
              <Btn variant="primary" full onClick={handleBuy}>Pay {file.price} SUI →</Btn>
            </div>
          </>
        )}

        {phase === 'signing' && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--sui-dim)', border: '2px solid rgba(79,159,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <Spinner size={24} color="var(--sui)"/>
            </div>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Waiting for Signature</div>
            <div style={{ color: 'var(--t2)', fontSize: 14 }}>Approve in {wallet.wallet}…</div>
          </div>
        )}

        {phase === 'verifying' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 18 }}>Verifying Ownership</div>
            <div style={{ position: 'relative', height: 70, background: 'var(--s2)', borderRadius: 10, overflow: 'hidden', marginBottom: 18, border: '1px solid var(--border)' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', animation: 'scanline 1.4s linear infinite' }}/>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 14px', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                  <Mono style={{ color: 'var(--t3)' }}>TATUM RPC</Mono>
                  <Mono style={{ color: 'var(--accent)' }}>Querying…</Mono>
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--t2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>GET /sui/v1/objects/{file.kiosk.slice(0, 14)}…</div>
              </div>
            </div>
            <div style={{ background: 'var(--s2)', borderRadius: 100, height: 6, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ height: '100%', width: `${verifyProgress}%`, background: 'var(--accent)', transition: 'width 0.2s', boxShadow: '0 0 8px var(--accent-glo)' }}/>
            </div>
            <div style={{ fontSize: 12, color: 'var(--t3)' }}>Confirming ownership transfer…</div>
          </div>
        )}

        {phase === 'success' && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--accent-dim)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 26 }}>✓</div>
            <div style={{ fontWeight: 700, fontSize: 20, color: 'var(--accent)', marginBottom: 8 }}>Ownership Transferred!</div>
            <div style={{ color: 'var(--t2)', fontSize: 13 }}>Unlocking file access…</div>
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

  const pad = mobile ? '16px' : '40px 28px';

  return (
    <div className="fade-in" style={{ maxWidth: 1100, margin: '0 auto', padding: pad, paddingBottom: mobile ? 88 : 40 }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--t2)', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', marginBottom: 20, padding: 0 }}>
        ← Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 310px', gap: 20, alignItems: 'start' }}>
        {/* Left */}
        <div>
          <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 'var(--card-radius)', overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ height: mobile ? 160 : 200, background: 'var(--s2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,229,160,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,160,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px' }}/>
              <FileIcon type={file.type} size={mobile ? 60 : 72}/>
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--t3)' }}>Access pass required to download</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--t2)', marginTop: 2 }}>{file.size}</div>
              </div>
            </div>
            <div style={{ padding: mobile ? '16px' : '22px' }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                <CategoryBadge category={file.category}/>
                {file.verified && <Badge color="var(--accent)" bg="var(--accent-dim)">✓ Verified</Badge>}
                {file.tags.map(t => <Badge key={t}>{t}</Badge>)}
              </div>
              <h1 style={{ fontSize: mobile ? 18 : 22, fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>{file.title}</h1>
              <p style={{ color: 'var(--t2)', fontSize: 14, lineHeight: 1.65 }}>{file.description}</p>
            </div>
          </div>

          <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 'var(--card-radius)', padding: mobile ? '16px' : '22px' }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Technical Details</div>
            {([
              { label: 'Walrus Blob ID', val: file.blobId,       mono: true, accent: true },
              { label: 'Sui Kiosk ID',   val: file.kiosk,        mono: true },
              { label: 'Seller',         val: file.sellerShort,  mono: true },
              { label: 'File Size',      val: file.size },
              { label: 'RPC Provider',   val: 'Tatum · Sui Mainnet' },
              { label: 'Sales',          val: `${file.sales} buyers` },
            ] as { label: string; val: string; mono?: boolean; accent?: boolean }[]).map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border)', gap: 10 }}>
                <span style={{ fontSize: 12, color: 'var(--t3)', flexShrink: 0 }}>{r.label}</span>
                <span style={{ fontFamily: r.mono ? 'var(--mono)' : 'inherit', fontSize: 11, color: r.accent ? 'var(--accent)' : 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right', maxWidth: mobile ? 180 : 300 }}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — purchase card */}
        <div style={{ position: mobile ? 'static' : 'sticky', top: 80 }}>
          <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 'var(--card-radius)', padding: 20, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: mobile ? 30 : 36, fontWeight: 800, color: 'var(--accent)' }}>{file.price}</span>
              <span style={{ fontSize: 16, color: 'var(--t2)', fontWeight: 500 }}>SUI</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 18 }}>One-time purchase · Permanent access</div>
            {purchased ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, background: 'var(--accent-dim)', border: '1px solid rgba(0,229,160,0.3)', borderRadius: 10, marginBottom: 14, fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>
                <span>✓</span> You own this file
              </div>
            ) : (
              <Btn variant="primary" full size="lg" onClick={() => wallet ? setShowPurchase(true) : onWalletRequired()} style={{ marginBottom: 14 }}>
                {wallet ? `Buy · ${file.price} SUI` : 'Connect Wallet to Buy'}
              </Btn>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
              {([['🔒', 'Access via Sui Kiosk'], ['🌊', 'Stored on Walrus'], ['⚡', 'Instant on payment'], ['🔍', 'Verified · Tatum RPC']] as [string, string][]).map(([ic, tx]) => (
                <div key={tx} style={{ display: 'flex', gap: 8, color: 'var(--t2)' }}><span>{ic}</span><span>{tx}</span></div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 'var(--card-radius)', padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.8 }}>Seller</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--s3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--t2)', flexShrink: 0 }}>
                {file.sellerShort.slice(2, 4).toUpperCase()}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--t1)', marginBottom: 2 }}>{file.sellerShort}</div>
                <div style={{ fontSize: 11, color: 'var(--t3)' }}>👁 {file.views} · ↓ {file.sales}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPurchase && wallet && (
        <PurchaseModal file={file} wallet={wallet} onClose={() => setShowPurchase(false)} onSuccess={handleSuccess}/>
      )}
    </div>
  );
}
