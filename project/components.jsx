// components.jsx — Shared data, tokens, and UI components

// ── VIEWPORT HOOK ──────────────────────────────────────────────────────────────
function useViewport() {
  const [w, setW] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return { w, mobile: w < 640, tablet: w < 1024 };
}

// ── MOCK DATA ──────────────────────────────────────────────────────────────────
const MOCK_FILES = [
  {
    id: 1, title: "Sui DeFi Research Paper",
    description: "Comprehensive analysis of DeFi protocols on Sui, covering yield farming strategies, liquidity pool mechanics, and on-chain risk assessment models. Includes backtested data from Q1–Q4 2025.",
    type: "pdf", size: "2.4 MB", price: 5,
    seller: "0x7f3a9b21c4e8d05f6a3b12c9e4f7d2a1b8c3e5f2", sellerShort: "0x7f3a…b12c",
    blobId: "bAEKDJ3ma9Nz7qL4xP2wR8sT5vU6yB1cF0gH3iI",
    kiosk: "0x9f2e8d1c3a5b7e4f62a1b9c3d7e2f4a8",
    category: "Research", sales: 12, views: 89, listed: "2d ago",
    tags: ["DeFi", "Sui", "Yield"], verified: true
  },
  {
    id: 2, title: "Walrus Protocol Dataset",
    description: "Raw storage performance metrics and node distribution data from the Walrus decentralized storage network. 90 days of blob upload/retrieval stats across 200+ nodes.",
    type: "csv", size: "45 MB", price: 15,
    seller: "0x4a219b83c2d7f60e5a3b91c2d7f8e4a3b5c2d9e3", sellerShort: "0x4a21…9e3f",
    blobId: "bAEOPR7xk2Bt6mY8wQ5nS4hJ3iG9rE1lD0fF2",
    kiosk: "0x8b1a3e5f92c4d6a7b2e1f3c5d8a4b7e2",
    category: "Dataset", sales: 7, views: 54, listed: "5d ago",
    tags: ["Walrus", "Storage", "Metrics"], verified: false
  },
  {
    id: 3, title: "NFT Collection Artwork Pack",
    description: "800-piece generative NFT art collection source files. Includes layered PSD files, trait rarity tables, and metadata generation scripts. Ready to deploy on Sui.",
    type: "zip", size: "128 MB", price: 25,
    seller: "0x2c894d7b6e3f1a5c8d2e9b4f7a1c3d5e8f2a6b4", sellerShort: "0x2c89…4d7b",
    blobId: "bAEMNK2jh5Wq9pR3vL8uI7oY6tE4sD0aF1gG3",
    kiosk: "0x3c4d7e9a1b5f2c8d6e3a7b4f9c2d5e1a",
    category: "Art", sales: 3, views: 127, listed: "1d ago",
    tags: ["NFT", "Generative", "Art"], verified: true
  },
  {
    id: 4, title: "Crypto Trading Signals API",
    description: "Live trading signal JSON feed with historical backtests. Covers BTC, ETH, and SUI pairs with entry/exit points, confidence scores, and market regime classification.",
    type: "json", size: "1.2 MB", price: 8,
    seller: "0x9b3c7f1e4a2d6b8e5c3f1a9d4b7e2c6a3f5d8b1", sellerShort: "0x9b3c…7f1e",
    blobId: "bAELPQ9sc8Vn1uF6kO3mX2gZ5hA7bC4dE9fF0",
    kiosk: "0x5e6f2b4c8d1a7e3f9b2c6d4a8e5f1b3c",
    category: "Finance", sales: 31, views: 203, listed: "8d ago",
    tags: ["Trading", "Signals", "API"], verified: true
  },
  {
    id: 5, title: "Blockchain Dev Video Course",
    description: "12-hour comprehensive course on building dApps on Sui using Move. Covers smart contracts, wallet integration, and Kiosk deployment from scratch.",
    type: "mp4", size: "850 MB", price: 40,
    seller: "0x1e4d2a9c7f5b3e1d8c6a4b2f9e7d5c3a1b9e7f5", sellerShort: "0x1e4d…2a9c",
    blobId: "bAEIJK5td3Xo7gH0fN2iP6qQ8rR9sS1tT4uU5",
    kiosk: "0x7g8h4c2e6a9b1d3f5e7c2a4b8d6e0f2c",
    category: "Education", sales: 18, views: 341, listed: "12d ago",
    tags: ["Move", "dApp", "Course"], verified: true
  },
  {
    id: 6, title: "Move Smart Contract Templates",
    description: "Production-ready Move module templates: token issuance, staking, governance modules, and custom Kiosk extensions. All audited and mainnet-tested.",
    type: "zip", size: "3.1 MB", price: 12,
    seller: "0x6f8e3b4a1d9c5f2e7a3b8c4d6e1f5a2b9c7d3e5", sellerShort: "0x6f8e…3b4a",
    blobId: "bAEHGF8ue4Yp2iI1jM7kN3lO5mP9nQ6oR0pP1",
    kiosk: "0x1i2j6d8e4b7c3f9a5d2e8f6b1c4d7e3a",
    category: "Code", sales: 45, views: 412, listed: "20d ago",
    tags: ["Move", "Templates", "Kiosk"], verified: true
  },
  {
    id: 7, title: "Move Language Handbook",
    description: "Complete reference for the Move language on Sui. Syntax guide, standard library docs, and 50+ annotated code examples covering advanced patterns.",
    type: "pdf", size: "5.8 MB", price: 6,
    seller: "0x3a7b8c2d5e4f1a6b9c3d7e2f4a8b1c5d3e7f2a9", sellerShort: "0x3a7b…8c2d",
    blobId: "bAEDEF4vf5Zq3jJ2hK8iL1mM6nN0oO4pP7qQ9",
    kiosk: "0x3k4l8f0g2c5d9e1a7b3f6c9d2e5f8a1b",
    category: "Research", sales: 22, views: 178, listed: "3d ago",
    tags: ["Move", "Reference", "Docs"], verified: false
  },
  {
    id: 8, title: "DeFi Protocol Analytics Q2 2026",
    description: "Quarterly analytics report covering TVL trends, volume metrics, and user growth across the top 15 Sui DeFi protocols, with 6-month forecasting models.",
    type: "pdf", size: "4.2 MB", price: 10,
    seller: "0x5c2a6e9f3b1d7e4f8a2c5d9b1e6f3a7c4d8e2b5", sellerShort: "0x5c2a…6e9f",
    blobId: "bAEABC1wg6Ar4kK3eJ0fI9gH8hG7iF6jE5kD4",
    kiosk: "0x5m6n0h2i4c8d3e7f1a5b9c2d6e4f8a3b",
    category: "Finance", sales: 9, views: 67, listed: "7d ago",
    tags: ["DeFi", "Analytics", "Q2"], verified: false
  }
];

const MY_LISTINGS = [
  { id: 101, title: "Move Contract Audit Checklist", type: "pdf", size: "0.9 MB", price: 7, sales: 14, revenue: 98, status: "active", blobId: "bAEXYZ9pm2Qr7sT4uU5vV6", listed: "4d ago", views: 93 },
  { id: 102, title: "Sui Testnet Faucet Config",     type: "json",size: "0.1 MB", price: 2, sales: 67, revenue: 134,status: "active", blobId: "bAEWVU8ql1Po6rS3tT0uU7", listed: "18d ago",views: 431 },
  { id: 103, title: "dApp Boilerplate v2",            type: "zip", size: "12 MB",  price: 18,sales: 5,  revenue: 90, status: "delisted",blobId: "bAEVUT7pk0On5qR2sS9tT8", listed: "32d ago",views: 78 }
];

const WALLET_OPTIONS = [
  { id: "sui",     name: "Sui Wallet",   subtitle: "by Mysten Labs",   color: "#4F9FFF" },
  { id: "martian", name: "Martian",      subtitle: "Martian Wallet",   color: "#FF6B35" },
  { id: "ethos",   name: "Ethos",        subtitle: "Ethos Network",    color: "#8B5CF6" },
  { id: "suiet",   name: "Suiet",        subtitle: "Community Wallet", color: "#00E5A0" }
];

// ── ICONS ──────────────────────────────────────────────────────────────────────
function Logo({ size = 36 }) {
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

function FileIcon({ type, size = 40 }) {
  const map = {
    pdf:  { color: "#FF4D6A", label: "PDF" },
    zip:  { color: "#FFB347", label: "ZIP" },
    csv:  { color: "#00E5A0", label: "CSV" },
    json: { color: "#4F9FFF", label: "JSON" },
    mp4:  { color: "#A78BFA", label: "MP4" },
  };
  const { color, label } = map[type] || { color: "#7A9BBE", label: "FILE" };
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.22,
      background: color + "18", border: `1px solid ${color}40`,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
    }}>
      <span style={{ fontFamily: "var(--mono)", fontSize: size * 0.26, fontWeight: 600, color, letterSpacing: -0.5 }}>{label}</span>
    </div>
  );
}

function Spinner({ size = 20, color = "var(--accent)" }) {
  return <div style={{ width: size, height: size, border: `2px solid rgba(255,255,255,0.08)`, borderTopColor: color, borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }}/>;
}

function StatusDot({ active = true }) {
  return <div style={{ width: 7, height: 7, borderRadius: "50%", background: active ? "var(--accent)" : "var(--t3)", boxShadow: active ? "0 0 6px var(--accent)" : "none", flexShrink: 0 }}/>;
}

// ── UI COMPONENTS ──────────────────────────────────────────────────────────────
function Btn({ children, variant = "primary", size = "md", onClick, disabled, style, full }) {
  const sz = { sm: { padding: "6px 14px", fontSize: 13 }, md: { padding: "10px 22px", fontSize: 14 }, lg: { padding: "14px 30px", fontSize: 15 } }[size];
  const vr = {
    primary:   { background: "var(--accent)", color: "#04100B", border: "none", fontWeight: 700 },
    secondary: { background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid rgba(0,229,160,0.3)", fontWeight: 500 },
    sui:       { background: "var(--sui-dim)", color: "var(--sui)", border: "1px solid rgba(79,159,255,0.3)", fontWeight: 500 },
    ghost:     { background: "transparent", color: "var(--t2)", border: "1px solid var(--border)", fontWeight: 400 },
    danger:    { background: "rgba(255,77,106,0.1)", color: "var(--danger)", border: "1px solid rgba(255,77,106,0.3)", fontWeight: 500 },
  }[variant];
  const [hov, setHov] = React.useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...sz, ...vr, borderRadius: "var(--btn-radius)", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1, display: "inline-flex", alignItems: "center", justifyContent: full ? "center" : undefined, gap: 8, width: full ? "100%" : undefined, transition: "all 0.15s", fontFamily: "inherit", letterSpacing: 0.1, filter: hov && !disabled ? "brightness(1.12)" : "none", ...style }}>
      {children}
    </button>
  );
}

function Badge({ children, color = "var(--t3)", bg = "rgba(255,255,255,0.05)" }) {
  return <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 500, letterSpacing: 0.3, background: bg, color, border: `1px solid ${color}33`, whiteSpace: "nowrap" }}>{children}</span>;
}

function CategoryBadge({ category }) {
  const map = {
    Research:  { c: "#4F9FFF", b: "rgba(79,159,255,0.1)" },
    Dataset:   { c: "#00E5A0", b: "rgba(0,229,160,0.1)" },
    Art:       { c: "#FF6B9D", b: "rgba(255,107,157,0.1)" },
    Finance:   { c: "#FFB347", b: "rgba(255,179,71,0.1)" },
    Education: { c: "#A78BFA", b: "rgba(167,139,250,0.1)" },
    Code:      { c: "#00E5A0", b: "rgba(0,229,160,0.1)" },
  };
  const { c, b } = map[category] || { c: "var(--t2)", b: "var(--s2)" };
  return <Badge color={c} bg={b}>{category}</Badge>;
}

function Mono({ children, style }) {
  return <span style={{ fontFamily: "var(--mono)", fontSize: "0.82em", color: "var(--t2)", ...style }}>{children}</span>;
}

function Card({ children, style, onClick }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: "var(--s1)", border: `1px solid ${hov && onClick ? "rgba(0,229,160,0.22)" : "var(--border)"}`, borderRadius: "var(--card-radius)", boxShadow: hov && onClick ? "var(--card-hover-shadow)" : "var(--card-shadow)", transition: "all 0.2s", transform: hov && onClick ? "translateY(-2px)" : "none", cursor: onClick ? "pointer" : "default", ...style }}>
      {children}
    </div>
  );
}

function TatumBadge() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, background: "var(--s2)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 12px", fontSize: 12, color: "var(--t2)" }}>
      <StatusDot/>
      <span>Tatum RPC · <span style={{ color: "var(--accent)", fontWeight: 500 }}>Sui Mainnet</span></span>
    </div>
  );
}

// ── WALLET MODAL ───────────────────────────────────────────────────────────────
function WalletModal({ onConnect, onClose }) {
  const [connecting, setConnecting] = React.useState(null);
  const handleConnect = async (w) => {
    setConnecting(w.id);
    await new Promise(r => setTimeout(r, 1800));
    const hex = () => Array.from({ length: 40 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("");
    const addr = "0x" + hex();
    onConnect({ address: addr, short: addr.slice(0, 6) + "…" + addr.slice(-4), wallet: w.name, balance: (Math.random() * 35 + 5).toFixed(3) });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={onClose}>
      <div className="fade-in" style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: 18, padding: 32, width: 380, boxShadow: "0 24px 80px rgba(0,0,0,0.85)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 19 }}>Connect Wallet</div>
            <div style={{ color: "var(--t2)", fontSize: 13, marginTop: 3 }}>Choose your Sui wallet to continue</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--t3)", cursor: "pointer", fontSize: 22, lineHeight: 1, padding: 2 }}>×</button>
        </div>
        <div style={{ marginBottom: 20 }}><TatumBadge /></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {WALLET_OPTIONS.map(w => (
            <button key={w.id} onClick={() => !connecting && handleConnect(w)}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", borderRadius: 10, background: connecting === w.id ? `${w.color}12` : "var(--s2)", border: connecting === w.id ? `1px solid ${w.color}50` : "1px solid var(--border)", cursor: connecting ? "wait" : "pointer", transition: "all 0.15s", textAlign: "left", width: "100%", fontFamily: "inherit" }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, background: `${w.color}20`, border: `1px solid ${w.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: w.color, flexShrink: 0 }}>
                {w.id === "sui" ? "S" : w.id === "martian" ? "M" : w.id === "ethos" ? "E" : "SU"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: "var(--t1)", fontSize: 14 }}>{w.name}</div>
                <div style={{ color: "var(--t3)", fontSize: 12 }}>{w.subtitle}</div>
              </div>
              {connecting === w.id ? <Spinner size={16}/> : <span style={{ color: "var(--t3)", fontSize: 20, lineHeight: 1 }}>›</span>}
            </button>
          ))}
        </div>
        <p style={{ textAlign: "center", color: "var(--t3)", fontSize: 11, marginTop: 18 }}>By connecting you agree to the Terms of Service</p>
      </div>
    </div>
  );
}

// ── HEADER ─────────────────────────────────────────────────────────────────────
function Header({ page, setPage, wallet, onWalletClick, direction, setDirection }) {
  const { mobile, tablet } = useViewport();
  const nav = [
    { id: "marketplace", label: "Marketplace", icon: "⊞" },
    { id: "upload",      label: "Sell",         icon: "⬆" },
    { id: "dashboard",   label: "Dashboard",    icon: "⊟" },
  ];

  const DirToggle = () => (
    <div style={{ display: "flex", gap: 2, background: "var(--s2)", padding: "3px", borderRadius: 8, border: "1px solid var(--border)", flexShrink: 0 }}>
      {[{ key: "dir-a", label: "A" }, { key: "dir-b", label: "B" }].map(d => (
        <button key={d.key} onClick={() => { setDirection(d.key); document.body.className = d.key; }}
          style={{ padding: mobile ? "4px 9px" : "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: direction === d.key ? "var(--s3)" : "none", color: direction === d.key ? "var(--accent)" : "var(--t3)", border: "none", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
          {d.label}
        </button>
      ))}
    </div>
  );

  if (mobile) {
    return (
      <>
        {/* Mobile top bar */}
        <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(7,9,15,0.92)", backdropFilter: "blur(18px)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 16px", height: 52, gap: 12 }}>
          <button onClick={() => setPage("marketplace")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}>
            <Logo size={28}/>
            <span style={{ fontWeight: 700, fontSize: 14, color: "var(--t1)", letterSpacing: -0.3 }}>SUI<span style={{ color: "var(--accent)" }}>-Walrus</span></span>
          </button>
          <div style={{ flex: 1 }}/>
          <DirToggle/>
          {wallet ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--s2)", border: "1px solid var(--border)", padding: "5px 10px", borderRadius: 8, flexShrink: 0 }}>
              <StatusDot/>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent)" }}>{wallet.balance} SUI</span>
            </div>
          ) : (
            <Btn onClick={onWalletClick} size="sm" variant="secondary" style={{ fontSize: 12, padding: "5px 12px", flexShrink: 0 }}>Connect</Btn>
          )}
        </header>

        {/* Mobile bottom nav */}
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: "rgba(7,9,15,0.95)", backdropFilter: "blur(18px)", borderTop: "1px solid var(--border)", display: "flex", height: 60 }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", color: page === n.id ? "var(--accent)" : "var(--t3)", transition: "color 0.15s" }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>{n.icon}</span>
              <span style={{ fontSize: 10, fontWeight: page === n.id ? 600 : 400, letterSpacing: 0.3 }}>{n.label}</span>
              {page === n.id && <div style={{ position: "absolute", bottom: 0, width: 28, height: 2, background: "var(--accent)", borderRadius: "2px 2px 0 0" }}/>}
            </button>
          ))}
        </nav>
      </>
    );
  }

  // Desktop header
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(7,9,15,0.88)", backdropFilter: "blur(18px)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 28px", height: 60, gap: tablet ? 16 : 28 }}>
      <button onClick={() => setPage("marketplace")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}>
        <Logo size={32}/>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "var(--t1)", letterSpacing: -0.3, lineHeight: 1.2 }}>SUI<span style={{ color: "var(--accent)" }}>-Walrus</span></div>
          <div style={{ fontSize: 9, color: "var(--t3)", letterSpacing: 1.2, textTransform: "uppercase" }}>File Marketplace</div>
        </div>
      </button>
      <nav style={{ display: "flex", alignItems: "center", gap: 3, flex: 1 }}>
        {nav.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)}
            style={{ padding: "5px 13px", borderRadius: 7, fontSize: 14, background: page === n.id ? "var(--accent-dim)" : "none", color: page === n.id ? "var(--accent)" : "var(--t2)", border: page === n.id ? "1px solid rgba(0,229,160,0.2)" : "1px solid transparent", cursor: "pointer", fontFamily: "inherit", fontWeight: page === n.id ? 600 : 400, transition: "all 0.15s" }}>
            {n.label}
          </button>
        ))}
      </nav>
      <DirToggle/>
      {wallet ? (
        <div style={{ display: "flex", alignItems: "center", gap: 9, background: "var(--s2)", border: "1px solid var(--border)", padding: "7px 13px", borderRadius: "var(--card-radius)", flexShrink: 0 }}>
          <StatusDot/>
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--t1)", lineHeight: 1.2 }}>{wallet.short}</div>
            <div style={{ fontSize: 11, color: "var(--accent)", lineHeight: 1 }}>{wallet.balance} SUI</div>
          </div>
        </div>
      ) : (
        <Btn onClick={onWalletClick} size="sm" variant="secondary" style={{ flexShrink: 0 }}>Connect Wallet</Btn>
      )}
    </header>
  );
}

Object.assign(window, {
  MOCK_FILES, MY_LISTINGS, WALLET_OPTIONS,
  useViewport,
  Logo, FileIcon, Spinner, StatusDot,
  Btn, Badge, CategoryBadge, Mono, Card, TatumBadge,
  WalletModal, Header
});
