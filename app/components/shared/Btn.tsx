'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'sui' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const SIZES: Record<Size, CSSProperties> = {
  sm: { padding: '6px 14px',  fontSize: 13 },
  md: { padding: '10px 22px', fontSize: 14 },
  lg: { padding: '14px 30px', fontSize: 15 },
};

const VARIANTS: Record<Variant, CSSProperties> = {
  primary:   { background: 'var(--accent)',     color: '#04100B',       border: 'none',                               fontWeight: 700 },
  secondary: { background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(0,229,160,0.3)',      fontWeight: 500 },
  sui:       { background: 'var(--sui-dim)',    color: 'var(--sui)',    border: '1px solid rgba(79,159,255,0.3)',     fontWeight: 500 },
  ghost:     { background: 'transparent',       color: 'var(--t2)',     border: '1px solid var(--border)',            fontWeight: 400 },
  danger:    { background: 'rgba(255,77,106,0.1)', color: 'var(--danger)', border: '1px solid rgba(255,77,106,0.3)', fontWeight: 500 },
};

interface BtnProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  onClick?: () => void;
  disabled?: boolean;
  style?: CSSProperties;
  full?: boolean;
  type?: 'button' | 'submit';
}

export function Btn({ children, variant = 'primary', size = 'md', onClick, disabled, style, full, type = 'button' }: BtnProps) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...SIZES[size],
        ...VARIANTS[variant],
        borderRadius: 'var(--btn-radius)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: full ? 'center' : undefined,
        gap: 8,
        width: full ? '100%' : undefined,
        transition: 'all 0.15s',
        fontFamily: 'inherit',
        letterSpacing: 0.1,
        filter: hov && !disabled ? 'brightness(1.12)' : 'none',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
