'use client';

import type { CSSProperties, ReactNode } from 'react';

export function Mono({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <span style={{ fontFamily: 'var(--mono)', fontSize: '0.82em', color: 'var(--t2)', ...style }}>
      {children}
    </span>
  );
}
