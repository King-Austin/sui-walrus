'use client';

import type { ReactNode } from 'react';

const CATEGORY_MAP: Record<string, { c: string; b: string }> = {
  Research:  { c: '#4F9FFF', b: 'rgba(79,159,255,0.1)' },
  Dataset:   { c: '#00E5A0', b: 'rgba(0,229,160,0.1)' },
  Art:       { c: '#FF6B9D', b: 'rgba(255,107,157,0.1)' },
  Finance:   { c: '#FFB347', b: 'rgba(255,179,71,0.1)' },
  Education: { c: '#A78BFA', b: 'rgba(167,139,250,0.1)' },
  Code:      { c: '#00E5A0', b: 'rgba(0,229,160,0.1)' },
};

export function Badge({
  children,
  color = 'var(--t3)',
  bg = 'rgba(255,255,255,0.05)',
}: {
  children: ReactNode;
  color?: string;
  bg?: string;
}) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px', borderRadius: 100,
      fontSize: 11, fontWeight: 500, letterSpacing: 0.3,
      background: bg, color, border: `1px solid ${color}33`,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  const { c, b } = CATEGORY_MAP[category] ?? { c: 'var(--t2)', b: 'var(--s2)' };
  return <Badge color={c} bg={b}>{category}</Badge>;
}
