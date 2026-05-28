// app.jsx — Root application with routing and state

function App() {
  const { mobile } = useViewport();
  const [page, setPage]             = React.useState("marketplace");
  const [wallet, setWallet]         = React.useState(null);
  const [walletModal, setWalletModal] = React.useState(false);
  const [direction, setDirection]   = React.useState("dir-a");
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [purchasedFile, setPurchasedFile] = React.useState(null);
  const [purchaseTx, setPurchaseTx] = React.useState(null);

  // Restore wallet from session
  React.useEffect(() => {
    try {
      const saved = sessionStorage.getItem("sui_wallet");
      if (saved) setWallet(JSON.parse(saved));
      const savedDir = sessionStorage.getItem("sui_direction") || "dir-a";
      setDirection(savedDir);
      document.body.className = savedDir;
    } catch {}
  }, []);

  const handleConnect = (w) => {
    setWallet(w);
    setWalletModal(false);
    try { sessionStorage.setItem("sui_wallet", JSON.stringify(w)); } catch {}
  };

  const handleDirectionChange = (d) => {
    setDirection(d);
    document.body.className = d;
    try { sessionStorage.setItem("sui_direction", d); } catch {}
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setPage("detail");
  };

  const handlePurchaseSuccess = (file, tx) => {
    setPurchasedFile(file);
    setPurchaseTx(tx);
    setTimeout(() => setPage("unlock"), 600);
  };

  const handleWalletRequired = () => setWalletModal(true);

  const handleBack = () => {
    setSelectedFile(null);
    setPage("marketplace");
  };

  const navigate = (p) => setPage(p);

  return (
    <>
      <Header
        page={page}
        setPage={(p) => { setSelectedFile(null); setPage(p); }}
        wallet={wallet}
        onWalletClick={handleWalletRequired}
        direction={direction}
        setDirection={handleDirectionChange}
      />

      <main style={{ minHeight: "calc(100vh - 60px)" }}>
        {page === "marketplace" && (
          <MarketplacePage
            onFileSelect={handleFileSelect}
            wallet={wallet}
            onWalletRequired={handleWalletRequired}
          />
        )}

        {page === "detail" && selectedFile && (
          <FileDetailPage
            file={selectedFile}
            wallet={wallet}
            onWalletRequired={handleWalletRequired}
            onPurchaseSuccess={handlePurchaseSuccess}
            onBack={handleBack}
          />
        )}

        {page === "upload" && (
          <UploadPage
            wallet={wallet}
            onWalletRequired={handleWalletRequired}
          />
        )}

        {page === "unlock" && (
          <UnlockPage
            file={purchasedFile}
            txHash={purchaseTx}
            wallet={wallet}
            onBack={handleBack}
          />
        )}

        {page === "dashboard" && (
          <DashboardPage
            wallet={wallet}
            onWalletRequired={handleWalletRequired}
            onNavigate={navigate}
          />
        )}
      </main>

      {/* Direction label */}
      <div style={{
        position: "fixed", bottom: mobile ? 68 : 16, left: 16,
        background: "var(--s2)", border: "1px solid var(--border)",
        borderRadius: 8, padding: "4px 10px",
        fontSize: 10, color: "var(--t3)", fontFamily: "var(--mono)",
        pointerEvents: "none", zIndex: 50, letterSpacing: 0.5
      }}>
        {direction === "dir-a" ? "A · Meridian" : "B · Neon Flux"}
      </div>

      {walletModal && (
        <WalletModal onConnect={handleConnect} onClose={() => setWalletModal(false)}/>
      )}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
