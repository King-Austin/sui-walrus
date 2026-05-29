'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

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

/* ── Animated terminal ── */
const TERMINAL_LINES = [
  { delay: 0,    text: '$ walrus upload research-paper.pdf',              color: '#ECEAE4' },
  { delay: 650,  text: '  ↑ uploading 2.4 MB → publisher node…',          color: '#9A9A8E' },
  { delay: 1300, text: '  ✓ blob certified — 2-of-N erasure coded',        color: '#2A6347' },
  { delay: 1950, text: '  blobId: bAEKDJ3ma9Nz7qL4xP2wR8sT5vU6…',        color: '#D4A853' },
  { delay: 2600, text: '  epochs: 5  redundancy: 2-of-N  size: 2.4 MB',   color: '#9A9A8E' },
  { delay: 3300, text: '$ sui kiosk create --price 5 SUI',                 color: '#ECEAE4' },
  { delay: 3950, text: '  ✓ KioskOwnerCap minted → 0x7f3a…b12c',          color: '#2A6347' },
  { delay: 4600, text: '  ✓ listing live on walrus-market.vercel.app',     color: '#2A6347' },
  { delay: 5400, text: '$ tatum sui getObject 0x9f2e8d1c…',               color: '#ECEAE4' },
  { delay: 6050, text: '  owner: { AddressOwner: "0x4a21…9e3f" }',        color: '#9A9A8E' },
  { delay: 6700, text: '  ✓ ownership verified — access granted',          color: '#2A6347' },
  { delay: 7400, text: '$ walrus download bAEKDJ3ma9Nz7qL4xP2wR8sT5vU6…', color: '#ECEAE4' },
  { delay: 8050, text: '  ↓ fetching from aggregator node…',               color: '#9A9A8E' },
  { delay: 8700, text: '  ✓ research-paper.pdf  saved to ./downloads/',    color: '#2A6347' },
];

/* token colours */
const T = {
  kw:   '#D4A853', /* keyword / method */
  str:  '#2A6347', /* string */
  num:  '#4F9FFF', /* number / id */
  cmt:  '#5A5A52', /* comment */
  fn:   '#ECEAE4', /* function / symbol */
  dim:  '#9A9A8E', /* punctuation */
};

const CODE_SNIPPET = [
  { tokens: [{ t: '// verify ownership before granting access', c: T.cmt }] },
  { tokens: [] },
  { tokens: [{ t: 'const ', c: T.dim }, { t: 'obj', c: T.fn }, { t: ' = await ', c: T.dim }, { t: 'getSuiObject', c: T.kw }, { t: '(', c: T.dim }, { t: 'kioskId', c: T.fn }, { t: ');', c: T.dim }] },
  { tokens: [{ t: 'const ', c: T.dim }, { t: 'owner', c: T.fn }, { t: ' = ', c: T.dim }, { t: 'obj', c: T.fn }, { t: '.owner?.AddressOwner;', c: T.dim }] },
  { tokens: [] },
  { tokens: [{ t: 'if ', c: T.kw }, { t: '(owner?.toLowerCase() === wallet.toLowerCase()) {', c: T.dim }] },
  { tokens: [{ t: '  return ', c: T.kw }, { t: 'getBlobUrl', c: T.kw }, { t: '(', c: T.dim }, { t: 'blobId', c: T.fn }, { t: ');', c: T.dim }, { t: '  // ✓ unlock', c: T.str }] },
  { tokens: [{ t: '}', c: T.dim }] },
  { tokens: [] },
  { tokens: [{ t: '// → ', c: T.cmt }, { t: '"https://aggregator.walrus.space/v1/blobs/bAEKDJ…"', c: T.str }] },
];

function Terminal() {
  const [shown, setShown] = useState(0);
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    const timers = TERMINAL_LINES.map((l, i) =>
      setTimeout(() => setShown(i + 1), l.delay)
    );
    const blink = setInterval(() => setCursor(c => !c), 530);
    return () => { timers.forEach(clearTimeout); clearInterval(blink); };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* ── bash terminal ── */}
      <div style={{
        background: '#0E0E0C', border: '0.5px solid rgba(255,255,255,0.12)',
        borderRadius: 12, overflow: 'hidden', fontFamily: "'DM Mono', 'JetBrains Mono', monospace",
      }}>
        {/* chrome */}
        <div style={{ padding: '10px 14px', borderBottom: '0.5px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 7 }}>
          {['#C0392B','#D4A853','#2A6347'].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8 }} />
          ))}
          <span style={{ fontSize: 10, color: '#5A5A52', marginLeft: 8, letterSpacing: '0.08em' }}>sui-walrus — bash</span>
        </div>
        {/* lines */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {TERMINAL_LINES.slice(0, shown).map((l, i) => (
            <div key={i} style={{
              fontSize: 12, color: l.color, lineHeight: 1.75,
              animation: 'lpFadeUp 0.28s cubic-bezier(0.22,1,0.36,1) both',
            }}>
              {l.text}
              {i === shown - 1 && shown < TERMINAL_LINES.length && (
                <span style={{ display: 'inline-block', width: 6, height: 13, background: '#ECEAE4', marginLeft: 2, opacity: cursor ? 1 : 0, verticalAlign: 'text-bottom' }} />
              )}
            </div>
          ))}
          {shown === TERMINAL_LINES.length && (
            <div style={{ fontSize: 12, color: '#ECEAE4', lineHeight: 1.75 }}>
              $ <span style={{ display: 'inline-block', width: 6, height: 13, background: '#ECEAE4', marginLeft: 2, opacity: cursor ? 1 : 0, verticalAlign: 'text-bottom' }} />
            </div>
          )}
        </div>
      </div>

      {/* ── code snippet ── */}
      <div style={{
        background: '#0E0E0C', border: '0.5px solid rgba(255,255,255,0.12)',
        borderRadius: 12, overflow: 'hidden', fontFamily: "'DM Mono', 'JetBrains Mono', monospace",
        opacity: shown >= 9 ? 1 : 0.25,
        transition: 'opacity 0.6s ease',
      }}>
        <div style={{ padding: '10px 14px', borderBottom: '0.5px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            {['#C0392B','#D4A853','#2A6347'].map(c => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8 }} />
            ))}
            <span style={{ fontSize: 10, color: '#5A5A52', marginLeft: 8, letterSpacing: '0.08em' }}>lib/tatum.ts</span>
          </div>
          <span style={{ fontSize: 9, color: '#2A6347', letterSpacing: '0.1em', border: '0.5px solid rgba(42,99,71,0.4)', borderRadius: 4, padding: '2px 7px' }}>TYPESCRIPT</span>
        </div>
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {CODE_SNIPPET.map((line, i) => (
            <div key={i} style={{ fontSize: 12, lineHeight: 1.8, display: 'flex', flexWrap: 'wrap' }}>
              {line.tokens.length === 0
                ? <span>&nbsp;</span>
                : line.tokens.map((tok, j) => (
                    <span key={j} style={{ color: tok.c }}>{tok.t}</span>
                  ))
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Step indicator ── */
const STEPS = [
  {
    num: '01',
    title: 'Upload to Walrus',
    italic: 'decentralized',
    body: 'Your file is stored as a certified blob across a network of storage nodes. 2-of-N erasure coding keeps it retrievable even if nodes go offline.',
    tag: 'STORAGE',
    detail: 'blobId: bAEKDJ3ma9Nz…',
  },
  {
    num: '02',
    title: 'Mint a Kiosk access pass',
    italic: 'on Sui',
    body: 'A Sui Kiosk object is created with your price in SUI. Buyers who pay receive a KioskOwnerCap — the on-chain proof of access.',
    tag: 'BLOCKCHAIN',
    detail: 'KioskOwnerCap → 0x7f3a…b12c',
  },
  {
    num: '03',
    title: 'Tatum verifies. Buyer downloads.',
    italic: 'instantly',
    body: 'Tatum RPC confirms the ownership transfer on Sui Mainnet. Access is granted and the blob is retrieved directly from the Walrus aggregator.',
    tag: 'VERIFIED',
    detail: 'Tatum RPC · Sui Mainnet ✓',
  },
];

function StepSection() {
  const { ref, visible } = useInView(0.12);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => setActive(a => (a + 1) % STEPS.length), 3000);
    return () => clearInterval(id);
  }, [visible]);

  return (
    <section ref={ref as React.RefObject<HTMLElement>} style={{
      background: '#0E0E0C', padding: 'clamp(4rem,8vw,6rem) clamp(1.25rem,5vw,2.5rem)',
    }}>
      <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#5A5A52', marginBottom: '1.5rem' }}>
        02 — HOW IT WORKS
      </p>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 'clamp(36px,5vw,60px)', fontWeight: 600, lineHeight: 0.96, letterSpacing: '-0.02em',
        color: '#ECEAE4', marginBottom: 'clamp(3rem,6vw,5rem)',
      }}>
        Three steps.<br /><em style={{ color: '#D4A853', fontStyle: 'italic' }}>Zero middlemen.</em>
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1rem', maxWidth: 1100, margin: '0 auto' }}>
        {STEPS.map((s, i) => (
          <div
            key={i}
            onClick={() => setActive(i)}
            style={{
              background: active === i ? '#1A1A17' : '#0E0E0C',
              border: `0.5px solid ${active === i ? 'rgba(31,74,53,0.6)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 12, padding: '1.75rem', cursor: 'pointer',
              transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              opacity: visible ? 1 : 0,
              transitionDelay: `${i * 0.12}s`,
              borderTop: active === i ? '2px solid #1F4A35' : '0.5px solid rgba(255,255,255,0.08)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 28, fontWeight: 400, color: active === i ? '#2A6347' : '#3A3A34', lineHeight: 1 }}>{s.num}</span>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.15em', color: active === i ? '#2A6347' : '#3A3A34', border: `0.5px solid ${active === i ? '#2A6347' : '#3A3A34'}`, borderRadius: 4, padding: '2px 7px' }}>{s.tag}</span>
            </div>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 22, fontWeight: 500, color: '#ECEAE4', lineHeight: 1.2, marginBottom: '0.75rem',
            }}>
              {s.title.replace(s.italic, '')}<em style={{ color: '#D4A853', fontStyle: 'italic' }}>{s.italic}</em>
            </h3>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, color: '#9A9A8E', lineHeight: 1.65, marginBottom: '1.25rem' }}>
              {s.body}
            </p>
            <div style={{
              fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#2A6347',
              background: 'rgba(31,74,53,0.08)', borderLeft: '2px solid rgba(31,74,53,0.35)',
              padding: '6px 10px', borderRadius: '0 4px 4px 0',
              opacity: active === i ? 1 : 0.4, transition: 'opacity 0.3s',
            }}>
              {s.detail}
            </div>
          </div>
        ))}
      </div>

      {/* connecting progress bar */}
      <div style={{ maxWidth: 1100, margin: '2rem auto 0', display: 'flex', alignItems: 'center', gap: 0 }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
              background: active >= i ? '#1F4A35' : '#3A3A34',
              transition: 'background 0.35s',
            }} />
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 1, background: '#3A3A34', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: '#1F4A35',
                  transform: active > i ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
                }} />
              </div>
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
      <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7A7A70', marginBottom: '1.5rem' }}>
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
          <div key={i} style={{
            background: '#FFFFFF', border: '0.5px solid rgba(0,0,0,0.10)',
            borderRadius: 12, padding: '1.75rem',
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            opacity: visible ? 1 : 0,
            transition: `transform 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s, opacity 0.55s ease ${i * 0.1}s`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: 24 }}>{f.icon}</span>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.12em', color: '#7A7A70', border: '0.5px solid rgba(0,0,0,0.15)', borderRadius: 4, padding: '2px 7px' }}>{f.tag}</span>
            </div>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 22, fontWeight: 500, color: '#1C1C1A', lineHeight: 1.25, marginBottom: '0.75rem',
            }}>
              {f.title}<br /><em style={{ color: '#1F4A35', fontStyle: 'italic' }}>{f.italic}</em>
            </h3>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, color: '#4A4A42', lineHeight: 1.65, marginBottom: '1.5rem' }}>
              {f.body}
            </p>
            {/* slim stat bar */}
            <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', paddingTop: '1rem', display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 22, fontWeight: 500, color: '#1F4A35' }}>{f.stat}</span>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#7A7A70', letterSpacing: '0.05em' }}>{f.statLabel}</span>
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
      <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#5A5A52', marginBottom: '1.5rem' }}>
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
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#2A6347', letterSpacing: '0.12em', marginBottom: '1.25rem' }}>FOR SELLERS</p>
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
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: '#ECEAE4', marginBottom: 2 }}>{title}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 14, color: '#9A9A8E', lineHeight: 1.55 }}>{desc}</div>
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
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#2A6347', letterSpacing: '0.12em', marginBottom: '1.25rem' }}>FOR BUYERS</p>
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
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: '#ECEAE4', marginBottom: 2 }}>{title}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 14, color: '#9A9A8E', lineHeight: 1.55 }}>{desc}</div>
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
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 26, fontWeight: 500, color: '#1F4A35', marginBottom: 4 }}>{s.n}</div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#7A7A70', letterSpacing: '0.05em', lineHeight: 1.5 }}>{s.label}</div>
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
        fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.15em',
        textTransform: 'uppercase', color: '#5A5A52', marginBottom: '1.5rem',
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
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 18, color: '#9A9A8E', lineHeight: 1.65, maxWidth: 480, margin: '0 auto 2.5rem',
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
          fontFamily: "'DM Mono',monospace", fontSize: 13, cursor: 'pointer',
          letterSpacing: '0.02em', textDecoration: 'none',
          transition: 'background 0.15s',
        }}>
          Open marketplace ↗
        </Link>
        <a href="https://docs.walrus.space" target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'transparent', color: '#9A9A8E',
          border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 50, padding: '0.9rem 2rem',
          fontFamily: "'DM Mono',monospace", fontSize: 13, cursor: 'pointer',
          letterSpacing: '0.02em', textDecoration: 'none',
          transition: 'border-color 0.15s, color 0.15s',
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
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #4A4A42;
          text-decoration: none;
          transition: color 0.12s;
        }
        .lp-nav-link:hover { color: #1C1C1A; }

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
          font-size: 12px;
          padding: 0.45rem 1rem;
          background: #1C1C1A;
          color: #ECEAE4;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          letter-spacing: 0.02em;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          transition: background 0.15s;
        }
        .lp-btn-solid:hover { background: #2A2A26; }

        .lp-step-card:hover { border-color: rgba(31,74,53,0.4) !important; }

        @media (max-width: 768px) {
          .lp-nav-links { display: none; }
          .lp-nav-ghost  { display: none; }
        }
      `}</style>

      <div className="lp-root" style={{ background: '#ECEAE4', minHeight: '100vh' }}>

        {/* ── NAV ── */}
        <nav style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: scrolled ? 'rgba(236,234,228,0.94)' : '#ECEAE4',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: '0.5px solid rgba(0,0,0,0.08)',
          padding: '0.875rem 2.5rem',
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
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: '#7A7A70', letterSpacing: '0.12em', textTransform: 'uppercase' }}>File Marketplace</div>
            </div>
          </div>

          <div className="lp-nav-links" style={{ display: 'flex', gap: '2rem' }}>
            {[['#how', 'How it works'], ['#stack', 'The stack'], ['#who', 'Who it\'s for']].map(([href, label]) => (
              <a key={href} href={href} className="lp-nav-link">{label}</a>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Link href="/marketplace" className="lp-btn-solid">Open App ↗</Link>
          </div>
        </nav>

        {/* ── HERO (light) ── */}
        <section style={{
          background: '#ECEAE4',
          padding: 'clamp(4rem,8vw,7rem) clamp(1.25rem,5vw,2.5rem) clamp(3rem,6vw,5rem)',
        }}>
          <p style={{
            fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#7A7A70', marginBottom: '1.5rem',
            animation: 'lpFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both',
          }}>
            01 — DECENTRALIZED FILE MARKETPLACE
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'clamp(2rem,5vw,4rem)', alignItems: 'start', maxWidth: 1200, margin: '0 auto' }}>
            {/* left */}
            <div>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(48px,7vw,88px)', fontWeight: 600,
                lineHeight: 0.95, letterSpacing: '-0.02em', color: '#1C1C1A',
                marginBottom: '1.5rem',
                animation: 'lpFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.08s both',
              }}>
                Sell files.<br />
                <em style={{ color: '#1F4A35', fontStyle: 'italic' }}>Keep the keys.</em>
              </h1>
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 18, color: '#4A4A42', lineHeight: 1.7,
                maxWidth: '34ch', marginBottom: '2rem',
                animation: 'lpFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.16s both',
              }}>
                Upload to Walrus. Gate access with a Sui Kiosk object.
                Verified on-chain via Tatum RPC. No platform. No middleman.
                <em style={{ fontStyle: 'italic' }}> Just the network.</em>
              </p>
              <div style={{
                display: 'flex', gap: '0.875rem', flexWrap: 'wrap',
                animation: 'lpFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.24s both',
              }}>
                <Link href="/marketplace" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#1F4A35', color: '#ECEAE4', textDecoration: 'none',
                  border: 'none', borderRadius: 50, padding: '0.9rem 2rem',
                  fontFamily: "'DM Mono',monospace", fontSize: 13, cursor: 'pointer',
                  letterSpacing: '0.02em', transition: 'background 0.15s',
                }}>
                  Start selling ↗
                </Link>
                <a href="#how" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'transparent', color: '#4A4A42', textDecoration: 'none',
                  border: '0.5px solid rgba(0,0,0,0.2)', borderRadius: 50, padding: '0.9rem 2rem',
                  fontFamily: "'DM Mono',monospace", fontSize: 13, cursor: 'pointer',
                  letterSpacing: '0.02em', transition: 'border-color 0.15s',
                }}>
                  See how it works
                </a>
              </div>

              {/* trust strip */}
              <div style={{
                marginTop: '2.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap',
                animation: 'lpFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.32s both',
              }}>
                {[['🌊','Walrus Storage'],['🔵','Sui Mainnet'],['⚡','Tatum RPC']].map(([ic, label]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13 }}>{ic}</span>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#7A7A70', letterSpacing: '0.06em' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* right — terminal */}
            <div style={{ animation: 'lpFadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s both' }}>
              <Terminal />
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS (dark) ── */}
        <div id="how"><StepSection /></div>

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
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#3A3A34', letterSpacing: '0.06em' }}>
            SUI-Walrus · Decentralized File Marketplace
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {[
              ['Walrus docs', 'https://docs.walrus.space'],
              ['Sui Kiosk', 'https://docs.sui.io/standards/kiosk'],
              ['Tatum', 'https://docs.tatum.io'],
              ['GitHub', 'https://github.com/King-Austin/sui-walrus'],
            ].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#3A3A34', textDecoration: 'none', letterSpacing: '0.06em', transition: 'color 0.12s' }}>
                {label}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
