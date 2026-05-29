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
      style={{
        background: 'var(--rp-bg-raised)',
        border: `0.5px solid ${hov ? 'var(--rp-accent-green-border)' : 'var(--rp-border)'}`,
        borderRadius: 12, padding: '1.25rem', cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
        transform: hov ? 'translateY(-3px)' : 'none',
        boxShadow: hov ? '0 12px 32px rgba(0,0,0,0.14)' : 'none',
        display: 'flex', flexDirection: 'column', gap: '0.875rem',
      }}
    >
      {/* Top */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <FileIcon type={file.type} size={44} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6, flexWrap: 'wrap' }}>
            <CategoryBadge category={file.category} />
            {file.verified && (
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--rp-accent-green)', fontWeight: 500 }}>✓</span>
            )}
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 19, color: 'var(--rp-text-primary)', lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {file.title}
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--rp-text-secondary)', marginTop: 4 }}>
            {file.size} · {file.listed}
          </div>
        </div>
      </div>

      {/* Blob strip */}
      <div style={{ background: 'var(--rp-bg-sunken)', borderRadius: 6, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 8, border: '0.5px solid var(--rp-border)' }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--rp-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0 }}>Blob</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--rp-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.blobId}</span>
      </div>

      {/* Price + stats */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 24, fontWeight: 500, color: 'var(--rp-accent-green)' }}>{file.price}</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: 'var(--rp-text-secondary)', fontWeight: 500 }}>SUI</span>
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", display: 'flex', gap: 12, fontSize: 12, color: 'var(--rp-text-secondary)' }}>
          <span>👁 {file.views}</span>
          <span>↓ {file.sales}</span>
        </div>
      </div>

      {/* Seller */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: '0.75rem', borderTop: '0.5px solid var(--rp-border)' }}>
        <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--rp-bg-surface)', border: '0.5px solid var(--rp-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--rp-text-secondary)', flexShrink: 0 }}>S</div>
        <Mono style={{ fontSize: '0.85em', color: 'var(--rp-text-secondary)' }}>{file.sellerShort}</Mono>
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
    <div className="fade-in" style={{ maxWidth: 1280, margin: '0 auto', padding: mobile ? '1.5rem 1rem 5.5rem' : '2.5rem 2.5rem' }}>

      {/* Page header */}
      <div style={{ marginBottom: mobile ? '1.5rem' : '2rem' }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--rp-text-secondary)', marginBottom: '0.5rem' }}>
          01 — File Marketplace
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: mobile ? 36 : 'clamp(36px, 4vw, 56px)', fontWeight: 600, lineHeight: 0.96, letterSpacing: '-0.02em', color: 'var(--rp-text-primary)' }}>
          Buy knowledge.<br />
          <em style={{ color: 'var(--rp-accent-green)', fontStyle: 'italic' }}>Own it forever.</em>
        </h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 1, background: 'var(--rp-border)', borderRadius: 12, overflow: 'hidden', marginBottom: mobile ? '1.5rem' : '2rem' }}>
        {[
          { label: 'Files Listed', value: MOCK_FILES.length,                                       accent: false },
          { label: 'Total Sales',  value: MOCK_FILES.reduce((s, f) => s + f.sales, 0),             accent: false },
          { label: 'Volume',       value: `${totalVolume.toFixed(0)} SUI`,                         accent: true  },
          { label: 'Network',      value: 'Mainnet',                                               dot: true     },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--rp-bg-surface)', padding: mobile ? '0.875rem 1rem' : '1rem 1.25rem' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--rp-text-secondary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              {s.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {'dot' in s && s.dot && <StatusDot />}
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: mobile ? 20 : 24, fontWeight: 500, color: 'accent' in s && s.accent ? 'var(--rp-accent-green)' : 'var(--rp-text-primary)' }}>
                {s.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Search + sort */}
      <div style={{ display: 'flex', gap: 10, marginBottom: '1rem', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontFamily: "'DM Mono', monospace", color: 'var(--rp-text-secondary)', fontSize: 16, pointerEvents: 'none' }}>⌕</span>
          <input
            value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files…"
            style={{ width: '100%', background: 'var(--rp-bg-raised)', border: '0.5px solid var(--rp-border)', borderRadius: 8, padding: '0.7rem 0.875rem 0.7rem 2.4rem', color: 'var(--rp-text-primary)', fontFamily: "'DM Mono', monospace", fontSize: 14, outline: 'none' }}
          />
        </div>
        <select
          value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ background: 'var(--rp-bg-raised)', border: '0.5px solid var(--rp-border)', borderRadius: 8, padding: '0.7rem 0.875rem', color: 'var(--rp-text-primary)', fontFamily: "'DM Mono', monospace", fontSize: 14, cursor: 'pointer', outline: 'none', flexShrink: 0 }}
        >
          <option value="recent">Recent</option>
          <option value="popular">Popular</option>
          <option value="price-low">$ Low → High</option>
          <option value="price-high">$ High → Low</option>
        </select>
      </div>

      {/* Category pills */}
      <div className="pill-row" style={{ display: 'flex', gap: 6, marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: 4 }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)} style={{ fontFamily: "'DM Mono', monospace", padding: '0.4rem 1rem', borderRadius: 50, fontSize: 13, fontWeight: 500, letterSpacing: '0.04em', background: activeCategory === c ? 'var(--rp-accent-green-tint)' : 'var(--rp-bg-surface)', color: activeCategory === c ? 'var(--rp-accent-green)' : 'var(--rp-text-secondary)', border: activeCategory === c ? '0.5px solid var(--rp-accent-green-border)' : '0.5px solid var(--rp-border)', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0, whiteSpace: 'nowrap' }}>
            {c}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', flexShrink: 0, paddingLeft: 4, alignSelf: 'center', fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--rp-text-secondary)' }}>
          {filtered.length} files
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 36, marginBottom: '0.75rem', color: 'var(--rp-text-secondary)' }}>⬚</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, color: 'var(--rp-text-secondary)' }}>No files match your search</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : tablet ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: mobile ? '0.75rem' : '1rem' }}>
          {filtered.map(f => <FileCard key={f.id} file={f} onClick={onFileSelect} />)}
        </div>
      )}

      {/* Info banner */}
      {!mobile && (
        <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: tablet ? '1fr' : '1fr 1fr', gap: '0.75rem' }}>
          {[
            { tag: 'Walrus Storage', title: 'Files live on the network.', italic: 'Not your server.', desc: 'Files are stored as blobs on the Walrus decentralized storage network. Each blob ID is verifiable on-chain.', color: 'var(--rp-accent-green)' },
            { tag: 'Tatum RPC',      title: 'Verified at the',           italic: 'protocol level.', desc: "Ownership transfers are verified through Tatum's enterprise-grade Sui RPC, ensuring fast and reliable confirmations.", color: '#4F9FFF' },
          ].map(b => (
            <div key={b.tag} style={{ background: 'var(--rp-bg-raised)', border: '0.5px solid var(--rp-border)', borderRadius: 12, padding: '1.25rem 1.5rem', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: b.color, marginTop: 7, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--rp-text-secondary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{b.tag}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, fontWeight: 500, color: 'var(--rp-text-primary)', lineHeight: 1.3, marginBottom: '0.4rem' }}>
                  {b.title} <em style={{ color: b.color, fontStyle: 'italic' }}>{b.italic}</em>
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: 'var(--rp-text-secondary)', lineHeight: 1.65 }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
