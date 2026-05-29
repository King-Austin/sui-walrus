'use client';

const FILE_TYPES: Record<string, { color: string; label: string }> = {
  pdf:  { color: '#FF4D6A', label: 'PDF' },
  zip:  { color: '#FFB347', label: 'ZIP' },
  csv:  { color: '#00E5A0', label: 'CSV' },
  json: { color: '#4F9FFF', label: 'JSON' },
  mp4:  { color: '#A78BFA', label: 'MP4' },
};

export function FileIcon({ type, size = 40 }: { type: string; size?: number }) {
  const { color, label } = FILE_TYPES[type] ?? { color: '#7A9BBE', label: 'FILE' };
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.22,
      background: color + '18', border: `1px solid ${color}40`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: size * 0.26, fontWeight: 600, color, letterSpacing: -0.5 }}>
        {label}
      </span>
    </div>
  );
}
