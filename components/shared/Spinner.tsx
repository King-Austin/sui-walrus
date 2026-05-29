'use client';

export function Spinner({ size = 20, color = 'var(--accent)' }: { size?: number; color?: string }) {
  return (
    <div style={{
      width: size, height: size,
      border: '2px solid rgba(255,255,255,0.08)',
      borderTopColor: color,
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      flexShrink: 0,
    }}/>
  );
}
