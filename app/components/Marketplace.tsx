'use client';

import { useState, useMemo } from 'react';
import type { FileItem, WalletInfo } from '@/lib/types';
import { MOCK_FILES } from '@/lib/mock-data';
import { useViewport } from '@/hooks/useViewport';
import { FileIcon } from './shared/FileIcon';
import { CategoryBadge } from './shared/Badge';
import { Mono } from './shared/Mono';
import { StatusDot } from './shared/StatusDot';

const CATEGORIES = ['All', 'Research', 'Finance', 'Code', 'Dataset', 'Education', 'Art'];

function FileCard({ file, onClick }: { file: FileItem; onClick: (f: FileItem) => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onClick(file)}
      style={{ background: 'var(--s1)', border: `1px solid ${hov ? 'rgba(0,229,160,0.22)' : 'var(--border)'}`, borderRadius: 'var(--card-radius)', padding: 16, cursor: 'pointer', transition: 'all 0.2s', transform: hov ? 'translateY(-2px)' : 'none', boxShadow: hov ? 'var(--card-hover-shadow)' : 'var(--card-shadow)', display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <FileIcon type={file.type} size={40}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4, flexWrap: 'wrap' }}>
            <CategoryBadge category={file.category}/>
            {file.verified && <span style={{ color: 'var(--accent)', fontSize: 11 }}>✓</span>}
          </div>
          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--t1)', lineHeight: 1.35, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{file.title}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--t3)', marginTop: 2 }}>{file.size} · {file.listed}</div>
        </div>
      </div>

      <div style={{ background: 'var(--s2)', borderRadius: 6, padding: '5px 9px', display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ fontSize: 10, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: 0.7, flexShrink: 0 }}>Blob</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--t2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.blobId}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>{file.price}</span>
          <span style={{ fontSize: 12, color: 'var(--t2)', fontWeight: 500 }}>SUI</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <span style={{ fontSize: 11, color: 'var(--t3)' }}>👁 {file.views}</span>
          <span style={{ fontSize: 11, color: 'var(--t3)' }}>↓ {file.sales}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
        <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--s3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: 'var(--t2)', flexShrink: 0 }}>S</div>
        <Mono style={{ fontSize: '0.75em' }}>{file.sellerShort}</Mono>
      </div>
    </div>
  );
}

interface MarketplaceProps {
  onFileSelect: (file: FileItem) => void;
  wallet: WalletInfo | null;
  onWalletRequired: () => void;
}

export function Marketplace({ onFileSelect }: MarketplaceProps) {
  const { mobile, tablet } = useViewport();
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [search, setSearch] = useState('');

  const pad = mobile ? '20px 16px' : '36px 28px';

  const filtered = useMemo(() => {
    let files = [...MOCK_FILES];
    if (activeCategory !== 'All') files = files.filter(f => f.category === activeCategory);
    if (search.trim()) files = files.filter(f =>
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    );
    if (sortBy === 'price-low')  files.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') files.sort((a, b) => b.price - a.price);
    else if (sortBy === 'popular')    files.sort((a, b) => b.sales - a.sales);
    return files;
  }, [activeCategory, sortBy, search]);

  const totalVolume = MOCK_FILES.reduce((s, f) => s + f.price * f.sales, 0);

  return (
    <div className="fade-in" style={{ maxWidth: 1280, margin: '0 auto', padding: pad, paddingBottom: mobile ? 80 : pad }}>
      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: mobile ? 10 : 14, marginBottom: mobile ? 20 : 32 }}>
        {[
          { label: 'Files Listed', value: MOCK_FILES.length },
          { label: 'Total Sales',  value: MOCK_FILES.reduce((s, f) => s + f.sales, 0) },
          { label: 'Volume',       value: `${totalVolume.toFixed(0)} SUI`, accent: true },
          { label: 'Network',      value: 'Mainnet', dot: true },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 'var(--card-radius)', padding: mobile ? '12px 14px' : '14px 18px' }}>
            <div style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.7 }}>{s.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {s.dot && <StatusDot/>}
              <span style={{ fontSize: mobile ? 17 : 20, fontWeight: 700, color: s.accent ? 'var(--accent)' : 'var(--t1)' }}>{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Sort */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)', fontSize: 14, pointerEvents: 'none' }}>⌕</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search files…"
            style={{ width: '100%', background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 'var(--card-radius)', padding: '9px 12px 9px 32px', color: 'var(--t1)', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
          />
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 'var(--card-radius)', padding: '9px 12px', color: 'var(--t2)', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', outline: 'none', flexShrink: 0 }}
        >
          <option value="recent">Recent</option>
          <option value="popular">Popular</option>
          <option value="price-low">$ Low→High</option>
          <option value="price-high">$ High→Low</option>
        </select>
      </div>

      {/* Category pills */}
      <div className="pill-row" style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: 4, WebkitOverflowScrolling: 'touch' }}>
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            style={{ padding: '5px 14px', borderRadius: 100, fontSize: 12, fontWeight: activeCategory === c ? 600 : 400, background: activeCategory === c ? 'var(--accent-dim)' : 'var(--s2)', color: activeCategory === c ? 'var(--accent)' : 'var(--t2)', border: activeCategory === c ? '1px solid rgba(0,229,160,0.3)' : '1px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', flexShrink: 0, whiteSpace: 'nowrap' }}
          >
            {c}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--t3)', alignSelf: 'center', flexShrink: 0, paddingLeft: 4 }}>{filtered.length}</span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--t3)' }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>⬚</div>
          <div style={{ fontSize: 15 }}>No files match your search</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : tablet ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: mobile ? 12 : 16 }}>
          {filtered.map(f => <FileCard key={f.id} file={f} onClick={onFileSelect}/>)}
        </div>
      )}

      {/* Info banner */}
      {!mobile && (
        <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: tablet ? '1fr' : '1fr 1fr', gap: 14 }}>
          {[
            { label: 'Stored on Walrus', desc: 'Files are stored as blobs on the Walrus decentralized storage network. Each blob ID is verifiable on-chain.', color: 'var(--accent)' },
            { label: 'Verified via Tatum RPC', desc: "Ownership transfers are verified through Tatum's enterprise-grade Sui RPC, ensuring fast and reliable confirmations.", color: 'var(--sui)' },
          ].map(b => (
            <div key={b.label} style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 'var(--card-radius)', padding: 18, display: 'flex', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${b.color}18`, border: `1px solid ${b.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: b.color, boxShadow: `0 0 8px ${b.color}` }}/>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, color: b.color }}>{b.label}</div>
                <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5 }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
