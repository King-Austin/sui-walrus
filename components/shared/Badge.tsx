'use client';

import type { ReactNode } from 'react';

const CATEGORY_MAP: Record<string, { c: string; b: string }> = {
  Research:  { c: '#4F9FFF', b: 'rgba(79,159,255,0.12)' },
  Dataset:   { c: '#2A9460', b: 'rgba(42,148,96,0.12)'  },
  Art:       { c: '#FF6B9D', b: 'rgba(255,107,157,0.12)' },
  Finance:   { c: '#D4A853', b: 'rgba(212,168,83,0.12)' },
  Education: { c: '#A78BFA', b: 'rgba(167,139,250,0.12)' },
  Code:      { c: '#2A9460', b: 'rgba(42,148,96,0.12)'  },
};

export function Badge({
  children,
  color = 'var(--rp-text-secondary)',
  bg = 'var(--rp-bg-surface)',
}: {
  children: ReactNode;
  color?: string;
  bg?: string;
}) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px', borderRadius: 100,
      fontFamily: "'DM Mono', monospace",
      fontSize: 12, fontWeight: 500, letterSpacing: '0.03em',
      background: bg, color,
      border: `0.5px solid ${color}44`,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  const { c, b } = CATEGORY_MAP[category] ?? { c: 'var(--rp-text-secondary)', b: 'var(--rp-bg-surface)' };
  return <Badge color={c} bg={b}>{category}</Badge>;
}
