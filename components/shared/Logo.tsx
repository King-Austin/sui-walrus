'use client';

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#0A1525"/>
      <rect x="0.5" y="0.5" width="39" height="39" rx="9.5" stroke="rgba(0,229,160,0.35)"/>
      <ellipse cx="20" cy="19" rx="10" ry="9" fill="rgba(0,229,160,0.08)"/>
      <ellipse cx="20" cy="19" rx="10" ry="9" stroke="#00E5A0" strokeWidth="1.5"/>
      <circle cx="16.5" cy="17" r="1.5" fill="#00E5A0"/>
      <circle cx="23.5" cy="17" r="1.5" fill="#00E5A0"/>
      <ellipse cx="20" cy="20.5" rx="2.5" ry="1.5" fill="rgba(0,229,160,0.55)"/>
      <path d="M16.5 25 Q14 29 13 31.5" stroke="#00E5A0" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
      <path d="M23.5 25 Q26 29 27 31.5" stroke="#00E5A0" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
      <path d="M10.5 20.5H9M10.5 22.5H8.5" stroke="#00E5A0" strokeWidth="0.8" strokeLinecap="round" opacity="0.45"/>
      <path d="M29.5 20.5H31M29.5 22.5H31.5" stroke="#00E5A0" strokeWidth="0.8" strokeLinecap="round" opacity="0.45"/>
    </svg>
  );
}
