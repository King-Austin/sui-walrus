'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useViewport } from '@/hooks/useViewport';

/* ── Intersection observer hook ── */
function useInView(threshold = 0.18) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── Three-step terminal data ── */
const STEP_TERMINALS = [
  {
    num: '01',
    label: 'Store the file',
    tag: 'WALRUS STORAGE',
    tagColor: '#2A6347',
    title: 'Upload.',
    italic: 'Walrus keeps it.',
    body: 'Your file becomes a certified blob across 200+ storage nodes. 2-of-N erasure coded. No server. No AWS.',
    filename: 'walrus — bash',
    lines: [
      { delay: 0,    text: '$ walrus upload market-data-q2.csv',        color: '#ECEAE4' },
      { delay: 700,  text: '  ↑ uploading 45 MB → publisher node…',     color: '#9A9A8E' },
      { delay: 1400, text: '  ✓ blob certified  —  2-of-N redundancy',  color: '#2A6347' },
      { delay: 2100, text: '  blobId  bAEOPR7xk2Bt6mY8wQ5nS4hJ3iG9rE…',color: '#D4A853' },
      { delay: 2800, text: '  size    45 MB   epochs  5   nodes  200+', color: '#9A9A8E' },
      { delay: 3500, text: '  url     aggregator.walrus-testnet.walrus…',color: '#9A9A8E' },
    ],
  },
  {
    num: '02',
    label: 'List on Sui',
    tag: 'SUI KIOSK',
    tagColor: '#4F9FFF',
    title: 'Price it.',
    italic: 'Sui holds the lock.',
    body: 'A Kiosk object goes on-chain with your price in SUI. Buyers who pay receive a KioskOwnerCap — on-chain proof of access.',
    filename: 'sui — bash',
    lines: [
      { delay: 0,    text: '$ sui kiosk create \\',                       color: '#ECEAE4' },
      { delay: 0,    text: '    --blob bAEOPR7xk2Bt6mY8wQ5nS4hJ3iG9rE…',color: '#9A9A8E' },
      { delay: 0,    text: '    --price 15 SUI',                          color: '#9A9A8E' },
      { delay: 700,  text: '  ✓ KioskOwnerCap minted',                   color: '#2A6347' },
      { delay: 1400, text: '  objectId   0x9f2e8d1c3a5b7e4f62a1b9c3…',  color: '#D4A853' },
      { delay: 2100, text: '  seller     0x4a21…9e3f',                   color: '#9A9A8E' },
      { delay: 2800, text: '  price      15 SUI',                        color: '#9A9A8E' },
      { delay: 3500, text: '  ✓ listing live  →  walrus-market.vercel', color: '#2A6347' },
    ],
  },
  {
    num: '03',
    label: 'Buyer gets access',
    tag: 'TATUM RPC',
    tagColor: '#D4A853',
    title: 'Pay once.',
    italic: 'Tatum confirms it.',
    body: "Buyer pays. Tatum's Sui RPC verifies the KioskOwnerCap transfer. Access granted. File retrieved from Walrus. Done.",
    filename: 'tatum rpc — verify',
    lines: [
      { delay: 0,    text: '$ tatum sui getObject 0x9f2e8d1c3a5b7e4f…', color: '#ECEAE4' },
      { delay: 700,  text: '  objectId   0x9f2e8d1c3a5b7e4f62a1b9c3…',  color: '#9A9A8E' },
      { delay: 1400, text: '  owner      0x4a21…9e3f  ← buyer wallet',  color: '#D4A853' },
      { delay: 2100, text: '  ✓ ownership verified  —  access granted', color: '#2A6347' },
      { delay: 2800, text: '$ walrus download bAEOPR7xk2Bt6mY8wQ5nS4h…',color: '#ECEAE4' },
      { delay: 3500, text: '  ↓ fetching from aggregator…',              color: '#9A9A8E' },
      { delay: 4200, text: '  ✓ market-data-q2.csv  →  ./downloads/',   color: '#2A6347' },
    ],
  },
];

/* ── Single animated terminal window ── */
function StepTerminal({ step, active }: { step: typeof STEP_TERMINALS[0]; active: boolean }) {
  const [shown, setShown] = useState(0);
  const [cursor, setCursor] = useState(true);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!active) { setShown(0); return; }
    timersRef.current.forEach(clearTimeout);
    timersRef.current = step.lines.map((l, i) =>
      setTimeout(() => setShown(i + 1), l.delay + 300)
    );
    const blink = setInterval(() => setCursor(c => !c), 530);
    return () => { timersRef.current.forEach(clearTimeout); clearInterval(blink); };
  }, [active, step]);

  const done = shown >= step.lines.length;

  return (
    <div style={{
      background: '#0E0E0C',
      border: `0.5px solid ${active ? step.tagColor + '55' : 'rgba(255,255,255,0.10)'}`,
      borderTop: `2px solid ${active ? step.tagColor : 'transparent'}`,
      borderRadius: 12, overflow: 'hidden',
      fontFamily: "'DM Mono','JetBrains Mono',monospace",
      transition: 'border-color 0.3s',
      flex: 1,
    }}>
      {/* chrome */}
      <div style={{ padding: '10px 14px', borderBottom: '0.5px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {['#C0392B','#D4A853','#2A6347'].map(c => (
            <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: active ? 0.9 : 0.4 }} />
          ))}
          <span style={{ fontSize: 11, color: '#888880', marginLeft: 6, letterSpacing: '0.07em' }}>{step.filename}</span>
        </div>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.12em', color: active ? step.tagColor : '#3A3A34', border: `0.5px solid ${active ? step.tagColor + '60' : '#3A3A34'}`, borderRadius: 4, padding: '2px 7px', transition: 'all 0.3s' }}>{step.tag}</span>
      </div>
      {/* lines */}
      <div style={{ padding: '14px 18px', minHeight: 148, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {step.lines.slice(0, shown).map((l, i) => (
          <div key={i} style={{ fontSize: 15, color: active ? l.color : '#3A3A34', lineHeight: 1.8, animation: 'lpFadeUp 0.25s cubic-bezier(0.22,1,0.36,1) both', transition: 'color 0.4s' }}>
            {l.text}
            {i === shown - 1 && !done && (
              <span style={{ display: 'inline-block', width: 5, height: 12, background: '#ECEAE4', marginLeft: 2, opacity: cursor ? 1 : 0, verticalAlign: 'text-bottom' }} />
            )}
          </div>
        ))}
        {done && active && (
          <div style={{ fontSize: 15, color: '#ECEAE4', lineHeight: 1.8 }}>
            $ <span style={{ display: 'inline-block', width: 5, height: 12, background: '#ECEAE4', marginLeft: 2, opacity: cursor ? 1 : 0, verticalAlign: 'text-bottom' }} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Three-terminal section ── */
function ThreeTerminals() {
  const { ref, visible } = useInView(0.1);
  const [active, setActive] = useState(0);
  const { w } = useViewport();
  const mobile = w < 640;

  useEffect(() => {
    if (!visible) return;
    const DURATIONS = [4200, 4500, 5200];
    let current = 0;
    let timer: ReturnType<typeof setTimeout>;
    const loop = () => {
      current = (current + 1) % 3;
      setActive(current);
      timer = setTimeout(loop, DURATIONS[current]);
    };
    timer = setTimeout(loop, DURATIONS[0]);
    return () => clearTimeout(timer);
  }, [visible]);

  const s = STEP_TERMINALS[active];

  return (
    <section ref={ref as React.RefObject<HTMLElement>} id="how" style={{
      background: '#0E0E0C',
      padding: mobile
        ? '3rem 1.25rem 2.5rem'
        : 'clamp(4rem,8vw,6rem) clamp(1.25rem,5vw,2.5rem)',
    }}>
      <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#AAAAAA', marginBottom: '1rem', fontWeight: 500 }}>
        02 — HOW IT WORKS
      </p>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: mobile ? 36 : 'clamp(36px,5vw,60px)',
        fontWeight: 600, lineHeight: 0.96, letterSpacing: '-0.02em',
        color: '#ECEAE4', marginBottom: mobile ? '1.75rem' : 'clamp(2rem,4vw,3rem)',
      }}>
        Three steps.<br /><em style={{ color: '#D4A853', fontStyle: 'italic' }}>Zero middlemen.</em>
      </h2>

      {/* step tab pills — scrollable on mobile */}
      <div className="lp-pill-row" style={{
        display: 'flex', gap: '0.5rem', marginBottom: '1rem',
        overflowX: 'auto', paddingBottom: 4,
      }}>
        {STEP_TERMINALS.map((st, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
            background: active === i ? 'rgba(255,255,255,0.05)' : 'transparent',
            border: `0.5px solid ${active === i ? st.tagColor + '60' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: active === i ? st.tagColor : '#3A3A34' }}>{st.num}</span>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: active === i ? '#ECEAE4' : '#5A5A52', whiteSpace: 'nowrap' }}>{st.label}</span>
          </button>
        ))}
      </div>

      {/* MOBILE: show only active terminal full-width */}
      {mobile ? (
        <div style={{
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s, transform 0.5s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <StepTerminal step={s} active={true} />
        </div>
      ) : (
        /* DESKTOP: all 3 side by side */
        <div style={{
          display: 'flex', gap: '0.875rem', alignItems: 'stretch',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)',
        }}>
          {STEP_TERMINALS.map((st, i) => (
            <StepTerminal key={i} step={st} active={active === i} />
          ))}
        </div>
      )}

      {/* progress dots + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: '1.25rem', maxWidth: 280 }}>
        {STEP_TERMINALS.map((st, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div onClick={() => setActive(i)} style={{
              width: 7, height: 7, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
              background: active === i ? st.tagColor : '#3A3A34',
              transition: 'background 0.3s',
            }} />
            {i < 2 && (
              <div style={{ flex: 1, height: 1, background: '#3A3A34', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: STEP_TERMINALS[i].tagColor, transform: active > i ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)' }} />
              </div>
            )}
          </div>
        ))}
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#5A5A52', marginLeft: 10, whiteSpace: 'nowrap' }}>
          {STEP_TERMINALS[active].label}
        </span>
      </div>

      {/* active step description — single card on mobile */}
      <div style={{
        marginTop: '1.5rem',
        display: mobile ? 'block' : 'grid',
        gridTemplateColumns: mobile ? undefined : 'repeat(3,1fr)',
        gap: '0.75rem',
      }}>
        {STEP_TERMINALS.map((st, i) => (
          <div key={i} style={{
            padding: mobile && active !== i ? 0 : '1rem',
            maxHeight: mobile && active !== i ? 0 : 200,
            overflow: 'hidden',
            borderRadius: 10,
            background: active === i ? 'rgba(255,255,255,0.04)' : 'transparent',
            border: `0.5px solid ${active === i ? st.tagColor + '30' : 'transparent'}`,
            transition: 'all 0.35s',
            opacity: active === i ? 1 : mobile ? 0 : 0.32,
            marginBottom: mobile && active === i ? '0.5rem' : 0,
          }}>
            {(!mobile || active === i) && (
              <>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: st.tagColor, letterSpacing: '0.12em', marginBottom: '0.4rem', fontWeight: 500 }}>{st.num} — {st.tag}</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mobile ? 22 : 20, fontWeight: 600, color: '#ECEAE4', lineHeight: 1.25, marginBottom: '0.4rem' }}>
                  {st.title} <em style={{ color: st.tagColor, fontStyle: 'italic' }}>{st.italic}</em>
                </div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: mobile ? 14 : 13, color: '#CCCCCC', lineHeight: 1.7 }}>{st.body}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}


/* ── Feature cards ── */
const FEATURES = [
  {
    icon: '🌊',
    tag: 'WALRUS STORAGE',
    title: 'Files live on the network,',
    italic: 'not your server.',
    body: 'Walrus distributes your blobs across hundreds of storage nodes. No single point of failure. No AWS bill. No takedown risk.',
    stat: '200+', statLabel: 'storage nodes',
  },
  {
    icon: '🔐',
    tag: 'SUI KIOSK',
    title: 'Access is an object,',
    italic: 'not a password.',
    body: 'Buyers receive a on-chain Kiosk object — a cryptographic proof of purchase that lives in their wallet and can be verified by anyone.',
    stat: '< 1s', statLabel: 'ownership transfer',
  },
  {
    icon: '⚡',
    tag: 'TATUM RPC',
    title: 'Verified at the',
    italic: 'protocol level.',
    body: "Tatum's enterprise Sui RPC confirms every ownership transfer before access is granted. No trust required — the chain doesn't lie.",
    stat: '99.9%', statLabel: 'RPC uptime SLA',
  },
];

function FeatureSection() {
  const { ref, visible } = useInView();
  return (
    <section ref={ref as React.RefObject<HTMLElement>} style={{
      background: '#ECEAE4', padding: 'clamp(4rem,8vw,6rem) clamp(1.25rem,5vw,2.5rem)',
    }}>
      <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#3A3A32', marginBottom: '1.5rem', fontWeight: 500 }}>
        03 — THE STACK
      </p>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 'clamp(32px,4vw,52px)', fontWeight: 600, lineHeight: 1.0, letterSpacing: '-0.02em',
        color: '#1C1C1A', marginBottom: 'clamp(2.5rem,5vw,4rem)', maxWidth: 600,
      }}>
        Built on infrastructure that was<br /><em style={{ color: '#1F4A35', fontStyle: 'italic' }}>designed to last.</em>
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1rem', maxWidth: 1100, margin: '0 auto' }}>
        {FEATURES.map((f, i) => (
          <div key={i} className="lp-feature-card" style={{
            background: '#FFFFFF', border: '0.5px solid rgba(0,0,0,0.10)',
            borderRadius: 12, padding: '1.75rem',
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            opacity: visible ? 1 : 0,
            transition: `transform 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s, opacity 0.55s ease ${i * 0.1}s`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span className="lp-feature-icon" style={{ fontSize: 24 }}>{f.icon}</span>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, letterSpacing: '0.12em', color: '#2A2A24', border: '1px solid rgba(0,0,0,0.25)', borderRadius: 4, padding: '3px 8px', fontWeight: 500 }}>{f.tag}</span>
            </div>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 24, fontWeight: 600, color: '#0A0A08', lineHeight: 1.25, marginBottom: '0.75rem',
            }}>
              {f.title}<br /><em style={{ color: '#1F4A35', fontStyle: 'italic' }}>{f.italic}</em>
            </h3>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: '#1C1C1A', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {f.body}
            </p>
            {/* slim stat bar */}
            <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', paddingTop: '1rem', display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 28, fontWeight: 600, color: '#1F4A35' }}>{f.stat}</span>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 14, color: '#2A2A24', letterSpacing: '0.05em', fontWeight: 500 }}>{f.statLabel}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Seller / Buyer split ── */
function AudienceSection() {
  const { ref, visible } = useInView();
  return (
    <section ref={ref as React.RefObject<HTMLElement>} style={{
      background: '#0E0E0C', padding: 'clamp(4rem,8vw,6rem) clamp(1.25rem,5vw,2.5rem)',
    }}>
      <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#AAAAAA', marginBottom: '1.5rem', fontWeight: 500 }}>
        04 — WHO IT'S FOR
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1px', background: 'rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden', maxWidth: 1100, margin: '0 auto' }}>
        {/* Sellers */}
        <div style={{
          background: '#0E0E0C', padding: '2.5rem',
          transform: visible ? 'translateX(0)' : 'translateX(-20px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1), opacity 0.6s ease',
        }}>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 14, color: '#2A9460', letterSpacing: '0.12em', marginBottom: '1.25rem', fontWeight: 500 }}>FOR SELLERS</p>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(28px,3vw,40px)', fontWeight: 600, color: '#ECEAE4', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1.5rem',
          }}>
            Your knowledge.<br /><em style={{ color: '#D4A853' }}>Your price.</em>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {[
              ['Upload once', 'Any file format up to any size — PDF, ZIP, CSV, MP4, JSON'],
              ['Set your price in SUI', 'You keep 97.5% of every sale, always'],
              ['Your file stays yours', 'The blob stays on Walrus forever — delist and relist freely'],
              ['Earnings on-chain', 'SUI sent directly to your wallet on every purchase'],
            ].map(([title, desc]) => (
              <div key={title} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#1F4A35', marginTop: 8, flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 15, color: '#FFFFFF', marginBottom: 2, fontWeight: 500 }}>{title}</div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: '#CCCCCC', lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buyers */}
        <div style={{
          background: '#1A1A17', padding: '2.5rem',
          transform: visible ? 'translateX(0)' : 'translateX(20px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s, opacity 0.6s ease 0.1s',
        }}>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: '#2A9460', letterSpacing: '0.12em', marginBottom: '1.25rem', fontWeight: 500 }}>FOR BUYERS</p>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(28px,3vw,40px)', fontWeight: 600, color: '#ECEAE4', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1.5rem',
          }}>
            Pay once.<br /><em style={{ color: '#D4A853' }}>Own forever.</em>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {[
              ['No subscriptions', 'One transaction — the access pass is yours permanently'],
              ['Verified ownership', 'Tatum RPC confirms your Kiosk object before every download'],
              ['Instant access', 'Blob retrieved directly from the Walrus aggregator network'],
              ['Works with any Sui wallet', 'Sui Wallet, Martian, Ethos, Suiet — connect and pay'],
            ].map(([title, desc]) => (
              <div key={title} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#1F4A35', marginTop: 8, flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 15, color: '#FFFFFF', marginBottom: 2, fontWeight: 500 }}>{title}</div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: '#CCCCCC', lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Stats ticker ── */
const STATS = [
  { n: '200+', label: 'Walrus storage nodes' },
  { n: '< 1s', label: 'Kiosk ownership transfer' },
  { n: '2.5%', label: 'Marketplace fee only' },
  { n: '∞', label: 'Blob storage epochs' },
  { n: '4', label: 'Sui wallets supported' },
  { n: '0', label: 'Servers you need to run' },
];

function StatsSection() {
  const { ref, visible } = useInView(0.1);
  return (
    <section ref={ref as React.RefObject<HTMLElement>} style={{ background: '#ECEAE4', padding: 'clamp(3rem,6vw,5rem) clamp(1.25rem,5vw,2.5rem)', borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '0.5px', background: 'rgba(0,0,0,0.06)', borderRadius: 12, overflow: 'hidden', maxWidth: 1100, margin: '0 auto' }}>
        {STATS.map((s, i) => (
          <div key={i} style={{
            background: '#ECEAE4', padding: '1.5rem 1.25rem',
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            opacity: visible ? 1 : 0,
            transition: `transform 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.07}s, opacity 0.5s ease ${i * 0.07}s`,
          }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 32, fontWeight: 600, color: '#1F4A35', marginBottom: 4 }}>{s.n}</div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 14, color: '#2A2A24', letterSpacing: '0.05em', lineHeight: 1.5, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── CTA section ── */
function CtaSection() {
  const { ref, visible } = useInView();
  return (
    <section ref={ref as React.RefObject<HTMLElement>} style={{
      background: '#0E0E0C', padding: 'clamp(5rem,10vw,8rem) clamp(1.25rem,5vw,2.5rem)',
      textAlign: 'center',
    }}>
      <p style={{
        fontFamily: "'DM Mono',monospace", fontSize: 14, letterSpacing: '0.15em',
        textTransform: 'uppercase', color: '#AAAAAA', marginBottom: '1.5rem', fontWeight: 500,
        transform: visible ? 'translateY(0)' : 'translateY(14px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.5s',
      }}>05 — GET STARTED</p>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 'clamp(40px,6vw,76px)', fontWeight: 600, lineHeight: 0.96, letterSpacing: '-0.02em',
        color: '#ECEAE4', marginBottom: '1.25rem',
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.55s cubic-bezier(0.22,1,0.36,1) 0.08s, opacity 0.55s ease 0.08s',
      }}>
        Your file.<br />
        <em style={{ color: '#D4A853', fontStyle: 'italic' }}>The network's hands.</em>
      </h2>
      <p style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 17, color: '#CCCCCC', lineHeight: 1.75, maxWidth: 480, margin: '0 auto 2.5rem',
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.55s cubic-bezier(0.22,1,0.36,1) 0.16s, opacity 0.55s ease 0.16s',
      }}>
        Connect your Sui wallet and start selling in under two minutes.
        No account. No server. No permission.
      </p>
      <div style={{
        display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap',
        transform: visible ? 'translateY(0)' : 'translateY(14px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.55s cubic-bezier(0.22,1,0.36,1) 0.24s, opacity 0.55s ease 0.24s',
      }}>
        <Link href="/marketplace" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#1F4A35', color: '#ECEAE4',
          border: 'none', borderRadius: 50, padding: '0.9rem 2rem',
          fontFamily: "'DM Mono',monospace", fontSize: 15, cursor: 'pointer',
          letterSpacing: '0.02em', textDecoration: 'none',
          transition: 'background 0.15s',
        }}>
          Open marketplace ↗
        </Link>
        <a href="https://docs.walrus.space" target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'transparent', color: '#DDDDDD',
          border: '1.5px solid rgba(255,255,255,0.35)', borderRadius: 50, padding: '0.9rem 2rem',
          fontFamily: "'DM Mono',monospace", fontSize: 15, cursor: 'pointer',
          letterSpacing: '0.02em', textDecoration: 'none',
          transition: 'border-color 0.15s, color 0.15s',
          fontWeight: 500,
        }}>
          Read the docs
        </a>
      </div>
    </section>
  );
}

/* ── Root page ── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { w } = useViewport();
  const mobile = w < 640;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=DM+Mono:wght@400;500&display=swap');

        .lp-root * { box-sizing: border-box; }
        .lp-root { font-family: 'Cormorant Garamond', Georgia, serif; }

        @keyframes lpFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lpPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }

        .lp-nav-link {
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #2A2A24;
          text-decoration: none;
          transition: color 0.12s;
          font-weight: 500;
        }
        .lp-nav-link:hover { color: #000000; }

        .lp-btn-ghost {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          padding: 0.45rem 1rem;
          border: 0.5px solid rgba(0,0,0,0.20);
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          color: #1C1C1A;
          letter-spacing: 0.02em;
          transition: background 0.15s, border-color 0.15s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }
        .lp-btn-ghost:hover { background: #F5F3ED; }

        .lp-btn-solid {
          font-family: 'DM Mono', monospace;
          font-size: 15px;
          padding: 0.6rem 1.2rem;
          background: #1C1C1A;
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          letter-spacing: 0.02em;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          transition: background 0.15s;
          font-weight: 500;
        }
        .lp-btn-solid:hover { background: #000000; }

        .lp-step-card:hover { border-color: rgba(31,74,53,0.4) !important; }

        .lp-pill-row::-webkit-scrollbar { display: none; }
        .lp-pill-row { scrollbar-width: none; -ms-overflow-style: none; }

        /* Feature card hover */
        .lp-feature-card {
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s cubic-bezier(0.22,1,0.36,1), border-color 0.3s ease;
          will-change: transform;
        }
        .lp-feature-card:hover {
          transform: translateY(-5px) scale(1.012);
          box-shadow: 0 16px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(31,74,53,0.08);
          border-color: rgba(31,74,53,0.25) !important;
        }
        .lp-feature-card:hover .lp-feature-icon {
          transform: scale(1.15) rotate(-4deg);
        }
        .lp-feature-icon {
          display: inline-block;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }

        @media (max-width: 639px) {
          .lp-feature-card:hover {
            transform: none;
            box-shadow: none;
          }
        }
        @media (max-width: 639px) {
          .lp-audience-grid { grid-template-columns: 1fr !important; }
          .lp-feature-grid  { grid-template-columns: 1fr !important; }
          .lp-stats-grid    { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div className="lp-root" style={{ background: '#ECEAE4', minHeight: '100vh' }}>

        {/* ── NAV ── */}
        <nav style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: scrolled ? 'rgba(236,234,228,0.94)' : '#ECEAE4',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: '0.5px solid rgba(0,0,0,0.08)',
          padding: mobile ? '0.75rem 1.25rem' : '0.875rem 2.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'background 0.2s, backdrop-filter 0.2s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* walrus SVG logo */}
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="#1F4A35"/>
              <ellipse cx="20" cy="19" rx="10" ry="9" fill="rgba(236,234,228,0.1)"/>
              <ellipse cx="20" cy="19" rx="10" ry="9" stroke="#ECEAE4" strokeWidth="1.5"/>
              <circle cx="16.5" cy="17" r="1.5" fill="#ECEAE4"/>
              <circle cx="23.5" cy="17" r="1.5" fill="#ECEAE4"/>
              <ellipse cx="20" cy="20.5" rx="2.5" ry="1.5" fill="rgba(236,234,228,0.55)"/>
              <path d="M16.5 25 Q14 29 13 31.5" stroke="#ECEAE4" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
              <path d="M23.5 25 Q26 29 27 31.5" stroke="#ECEAE4" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
            </svg>
            <div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, fontWeight: 500, color: '#1C1C1A', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                SUI<span style={{ color: '#1F4A35' }}>-Walrus</span>
              </div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#4A4A42', letterSpacing: '0.12em', textTransform: 'uppercase' }}>File Marketplace</div>
            </div>
          </div>

          {!mobile && (
            <div style={{ display: 'flex', gap: '2rem' }}>
              {[['#how', 'How it works'], ['#stack', 'The stack'], ['#who', 'Who it\'s for']].map(([href, label]) => (
                <a key={href} href={href} className="lp-nav-link">{label}</a>
              ))}
            </div>
          )}

          <Link href="/marketplace" className="lp-btn-solid" style={{ padding: mobile ? '0.55rem 1.1rem' : undefined, fontSize: mobile ? 13 : undefined }}>
            Open App ↗
          </Link>
        </nav>

        {/* ── HERO (light) ── */}
        <section style={{
          background: '#ECEAE4',
          padding: mobile
            ? '2.5rem 1.25rem 2rem'
            : 'clamp(4rem,8vw,7rem) clamp(1.25rem,5vw,2.5rem) clamp(3rem,6vw,5rem)',
        }}>
          <p style={{
            fontFamily: "'DM Mono',monospace", fontSize: 14, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#3A3A32', marginBottom: '1rem',
            animation: 'lpFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both',
            fontWeight: 500,
          }}>
            01 — DECENTRALIZED FILE MARKETPLACE
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: mobile ? '1fr' : 'repeat(auto-fit,minmax(300px,1fr))',
            gap: mobile ? '1.5rem' : 'clamp(2rem,5vw,4rem)',
            alignItems: 'start', maxWidth: 1200, margin: '0 auto',
          }}>
            {/* left */}
            <div>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: mobile ? 'clamp(44px,12vw,60px)' : 'clamp(48px,7vw,88px)',
                fontWeight: 600, lineHeight: 0.95, letterSpacing: '-0.02em', color: '#1C1C1A',
                marginBottom: '1.25rem',
                animation: 'lpFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.08s both',
              }}>
                Sell files.<br />
                <em style={{ color: '#1F4A35', fontStyle: 'italic' }}>Keep the keys.</em>
              </h1>
              <p style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: mobile ? 15 : 17, color: '#1C1C1A', lineHeight: 1.75,
                maxWidth: '34ch', marginBottom: '1.5rem',
                animation: 'lpFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.16s both',
              }}>
                Upload to Walrus. Gate access with a Sui Kiosk object.
                Verified on-chain via Tatum RPC. No platform. No middleman.
                <em style={{ fontStyle: 'italic' }}> Just the network.</em>
              </p>
              <div style={{
                display: 'flex', gap: '0.75rem', flexWrap: 'wrap',
                animation: 'lpFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.24s both',
              }}>
                <Link href="/marketplace" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#1F4A35', color: '#ECEAE4', textDecoration: 'none',
                  border: 'none', borderRadius: 50,
                  padding: mobile ? '0.75rem 1.5rem' : '0.9rem 2rem',
                  fontFamily: "'DM Mono',monospace", fontSize: mobile ? 12 : 13,
                  cursor: 'pointer', letterSpacing: '0.02em', transition: 'background 0.15s',
                }}>
                  Start selling ↗
                </Link>
                <a href="#how" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'transparent', color: '#1C1C1A', textDecoration: 'none',
                  border: '1.5px solid rgba(0,0,0,0.4)', borderRadius: 50,
                  padding: mobile ? '0.75rem 1.5rem' : '0.9rem 2rem',
                  fontFamily: "'DM Mono',monospace", fontSize: mobile ? 12 : 13,
                  cursor: 'pointer', letterSpacing: '0.02em', transition: 'border-color 0.15s',
                  fontWeight: 500,
                }}>
                  See how it works
                </a>
              </div>

              {/* trust strip */}
              <div style={{
                marginTop: '1.75rem', display: 'flex', gap: '1.25rem', flexWrap: 'wrap',
                animation: 'lpFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.32s both',
              }}>
                {[['🌊','Walrus Storage'],['🔵','Sui Mainnet'],['⚡','Tatum RPC']].map(([ic, label]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: 16 }}>{ic}</span>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 14, color: '#2A2A24', letterSpacing: '0.06em', fontWeight: 500 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* right — mini terminal previews (desktop only) */}
            {!mobile && (
              <div style={{ animation: 'lpFadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s both', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {STEP_TERMINALS.map((s, i) => (
                  <div key={i} style={{ background: '#0E0E0C', border: `0.5px solid ${s.tagColor}33`, borderLeft: `2px solid ${s.tagColor}`, borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: s.tagColor, flexShrink: 0 }}>{s.num}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: '#AAAAAA', marginBottom: 3, letterSpacing: '0.08em' }}>{s.tag}</div>
                      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: '#CCCCCC', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.lines[0].text}</div>
                      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: s.tagColor, marginTop: 2 }}>✓ {s.label}</div>
                    </div>
                  </div>
                ))}
                <a href="#how" style={{ fontFamily: "'DM Mono',monospace", fontSize: 14, color: '#AAAAAA', textDecoration: 'none', textAlign: 'center', paddingTop: 4, letterSpacing: '0.06em' }}>
                  see it live ↓
                </a>
              </div>
            )}
          </div>
        </section>

        {/* ── HOW IT WORKS — 3 terminals (dark) ── */}
        <ThreeTerminals />

        {/* ── THE STACK (light) ── */}
        <div id="stack"><FeatureSection /></div>

        {/* ── STATS ── */}
        <StatsSection />

        {/* ── WHO IT'S FOR (dark) ── */}
        <div id="who"><AudienceSection /></div>

        {/* ── CTA (dark) ── */}
        <CtaSection />

        {/* ── FOOTER ── */}
        <footer style={{
          background: '#0E0E0C', borderTop: '0.5px solid rgba(255,255,255,0.06)',
          padding: '2rem 2.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 14, color: '#888880', letterSpacing: '0.06em' }}>
            SUI-Walrus · Decentralized File Marketplace
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {[
              ['Walrus docs', 'https://docs.walrus.space'],
              ['Sui Kiosk', 'https://docs.sui.io/standards/kiosk'],
              ['Tatum', 'https://docs.tatum.io'],
              ['GitHub', 'https://github.com/King-Austin/sui-walrus'],
            ].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Mono',monospace", fontSize: 14, color: '#888880', textDecoration: 'none', letterSpacing: '0.06em', transition: 'color 0.12s' }}>
                {label}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
