// dashboard.jsx — Seller dashboard (responsive)

function DashboardPage({ wallet, onWalletRequired, onNavigate }) {
  const { mobile } = useViewport();
  const [activeTab, setActiveTab] = React.useState("listings");
  const [delistConfirm, setDelistConfirm] = React.useState(null);
  const pad = mobile ? "20px 16px" : "40px 28px";

  if (!wallet) {
    return (
      <div className="fade-in" style={{ maxWidth: 440, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔗</div>
        <h2 style={{ fontSize: mobile ? 20 : 22, fontWeight: 700, marginBottom: 10 }}>Connect Your Wallet</h2>
        <p style={{ color: "var(--t2)", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>Connect your Sui wallet to view your listings, sales, and earnings.</p>
        <Btn variant="primary" size="lg" onClick={onWalletRequired}>Connect Wallet</Btn>
      </div>
    );
  }

  const totalRevenue = MY_LISTINGS.reduce((s, l) => s + l.revenue, 0);
  const totalSales   = MY_LISTINGS.reduce((s, l) => s + l.sales, 0);
  const totalViews   = MY_LISTINGS.reduce((s, l) => s + l.views, 0);
  const activeCount  = MY_LISTINGS.filter(l => l.status === "active").length;

  return (
    <div className="fade-in" style={{ maxWidth: 1100, margin: "0 auto", padding: pad, paddingBottom: mobile ? 88 : 40 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: mobile ? "flex-start" : "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: mobile ? 20 : 24, fontWeight: 700, marginBottom: 4 }}>Seller Dashboard</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--t2)", fontSize: 13, flexWrap: "wrap" }}>
            <StatusDot/>
            <Mono style={{ fontSize: "0.9em" }}>{wallet.short}</Mono>
            <span style={{ color: "var(--accent)", fontWeight: 500 }}>{wallet.balance} SUI</span>
          </div>
        </div>
        <Btn variant="primary" size={mobile ? "sm" : "md"} onClick={() => onNavigate("upload")}>+ List File</Btn>
      </div>

      {/* Stat cards — 2×2 on mobile, 4 on desktop */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: mobile ? 10 : 14, marginBottom: 24 }}>
        {[
          { label: "Revenue",  value: totalRevenue,  suffix: " SUI", accent: true },
          { label: "Sales",    value: totalSales,    suffix: " sales" },
          { label: "Views",    value: totalViews,    suffix: " views" },
          { label: "Active",   value: `${activeCount}/${MY_LISTINGS.length}`, suffix: "" },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--card-radius)", padding: mobile ? "12px 14px" : "16px 18px" }}>
            <div style={{ fontSize: 10, color: "var(--t3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>{s.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
              <span style={{ fontSize: mobile ? 20 : 24, fontWeight: 700, color: s.accent ? "var(--accent)" : "var(--t1)" }}>{s.value}</span>
              {s.suffix && <span style={{ fontSize: 12, color: "var(--t2)" }}>{s.suffix}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 18, borderBottom: "1px solid var(--border)" }}>
        {["listings", "activity", "settings"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding: mobile ? "8px 14px" : "10px 18px", fontSize: mobile ? 13 : 14, fontWeight: activeTab === tab ? 600 : 400, color: activeTab === tab ? "var(--accent)" : "var(--t2)", background: "none", border: "none", borderBottom: activeTab === tab ? "2px solid var(--accent)" : "2px solid transparent", cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize", transition: "all 0.15s", marginBottom: -1 }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Listings tab */}
      {activeTab === "listings" && (
        <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MY_LISTINGS.map(listing => (
            <div key={listing.id} style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--card-radius)", padding: mobile ? "14px" : "16px 20px" }}>
              {/* Top row */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                <FileIcon type={listing.type} size={mobile ? 36 : 42}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, fontSize: mobile ? 13 : 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: mobile ? 160 : 280 }}>{listing.title}</span>
                    <Badge color={listing.status === "active" ? "var(--accent)" : "var(--t3)"} bg={listing.status === "active" ? "var(--accent-dim)" : "var(--s3)"}>
                      {listing.status === "active" ? "● Active" : "◌ Delisted"}
                    </Badge>
                  </div>
                  <div style={{ display: "flex", gap: 10, fontSize: 11, color: "var(--t3)", flexWrap: "wrap" }}>
                    <span>👁 {listing.views}</span>
                    <span>↓ {listing.sales}</span>
                    <span>{listing.listed}</span>
                  </div>
                </div>
                {/* Revenue */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: mobile ? 15 : 17, fontWeight: 700, color: "var(--accent)" }}>{listing.revenue}</div>
                  <div style={{ fontSize: 10, color: "var(--t3)" }}>SUI</div>
                </div>
              </div>

              {/* Bottom: price + actions */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid var(--border)" }}>
                <Mono style={{ fontSize: "0.75em", color: "var(--t3)" }}>{listing.blobId.slice(0, 14)}…</Mono>
                <div style={{ display: "flex", gap: 8 }}>
                  {listing.status === "active" ? (
                    <>
                      <Btn variant="ghost" size="sm" style={{ fontSize: 12 }}>Edit</Btn>
                      <Btn variant="danger" size="sm" style={{ fontSize: 12 }} onClick={() => setDelistConfirm(listing.id)}>Delist</Btn>
                    </>
                  ) : (
                    <Btn variant="secondary" size="sm" style={{ fontSize: 12 }}>Relist</Btn>
                  )}
                </div>
              </div>
            </div>
          ))}

          {delistConfirm && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 1000 }}>
              <div className="fade-in" style={{ background: "var(--s1)", border: "1px solid rgba(255,77,106,0.3)", borderRadius: "16px 16px 0 0", padding: "28px 24px 36px", width: "100%", maxWidth: 480 }}>
                <div style={{ width: 36, height: 4, background: "var(--s3)", borderRadius: 2, margin: "0 auto 20px" }}/>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 10 }}>Delist File?</div>
                <p style={{ color: "var(--t2)", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>Removes the listing from the Kiosk. Your file stays on Walrus — relist anytime.</p>
                <div style={{ display: "flex", gap: 10 }}>
                  <Btn variant="ghost" full onClick={() => setDelistConfirm(null)}>Cancel</Btn>
                  <Btn variant="danger" full onClick={() => setDelistConfirm(null)}>Confirm Delist</Btn>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Activity tab */}
      {activeTab === "activity" && (
        <div className="fade-in" style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--card-radius)", overflow: "hidden" }}>
          {[
            { type: "sale",    file: "Sui Testnet Faucet Config",    buyer: "0x4a21…9e3f", amount: 2,  time: "2h ago"  },
            { type: "sale",    file: "Move Contract Audit Checklist",buyer: "0x7f3a…b12c", amount: 7,  time: "6h ago"  },
            { type: "sale",    file: "Sui Testnet Faucet Config",    buyer: "0x2c89…4d7b", amount: 2,  time: "11h ago" },
            { type: "view",    file: "Move Contract Audit Checklist",buyer: null,           amount: null,time: "14h ago" },
            { type: "sale",    file: "Sui Testnet Faucet Config",    buyer: "0x9b3c…7f1e", amount: 2,  time: "1d ago"  },
            { type: "listing", file: "dApp Boilerplate v2",          buyer: null,           amount: 18, time: "32d ago" },
          ].map((ev, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: ev.type === "sale" ? "var(--accent-dim)" : ev.type === "listing" ? "var(--sui-dim)" : "var(--s3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                {ev.type === "sale" ? "↓" : ev.type === "listing" ? "+" : "👁"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ev.type === "sale" ? `Sale · ${ev.file}` : ev.type === "listing" ? `Listed · ${ev.file}` : `View · ${ev.file}`}
                </div>
                <div style={{ fontSize: 11, color: "var(--t3)", display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {ev.buyer && <Mono style={{ fontSize: "1em" }}>{ev.buyer}</Mono>}
                  <span>{ev.time}</span>
                </div>
              </div>
              {ev.amount && <div style={{ fontWeight: 700, color: "var(--accent)", fontSize: 14, flexShrink: 0 }}>+{ev.amount} SUI</div>}
            </div>
          ))}
        </div>
      )}

      {/* Settings tab */}
      {activeTab === "settings" && (
        <div className="fade-in">
          <div style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--card-radius)", overflow: "hidden", marginBottom: 16 }}>
            {[
              { label: "Connected Wallet",  val: wallet.wallet,     sub: wallet.short },
              { label: "RPC Provider",      val: "Tatum",           sub: "Sui Mainnet · enterprise" },
              { label: "Walrus Aggregator", val: "Testnet",         sub: "aggregator.walrus-testnet.walrus.space" },
              { label: "Marketplace Fee",   val: "2.5%",            sub: "Deducted from each sale" },
              { label: "Payout Wallet",     val: wallet.short,      sub: "Auto-transfer on sale" },
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: i < 4 ? "1px solid var(--border)" : "none", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{row.label}</div>
                  <div style={{ fontSize: 11, color: "var(--t3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: mobile ? 160 : 280 }}>{row.sub}</div>
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--accent)", flexShrink: 0 }}>{row.val}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: 18, background: "rgba(255,77,106,0.05)", border: "1px solid rgba(255,77,106,0.2)", borderRadius: "var(--card-radius)" }}>
            <div style={{ fontWeight: 600, marginBottom: 6, color: "var(--danger)", fontSize: 14 }}>Disconnect Wallet</div>
            <div style={{ fontSize: 13, color: "var(--t2)", marginBottom: 14 }}>Your listings stay active on-chain.</div>
            <Btn variant="danger" size="sm">Disconnect</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { DashboardPage });
