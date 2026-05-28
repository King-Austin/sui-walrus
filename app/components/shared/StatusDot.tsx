'use client';

export function StatusDot({ active = true }: { active?: boolean }) {
  return (
    <div style={{
      width: 7, height: 7, borderRadius: '50%',
      background: active ? 'var(--accent)' : 'var(--t3)',
      boxShadow: active ? '0 0 6px var(--accent)' : 'none',
      flexShrink: 0,
    }}/>
  );
}
