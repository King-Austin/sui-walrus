'use client';

import { useState, useEffect } from 'react';
import type { WalletInfo, FileItem, Page, Direction } from '@/lib/types';
import { useViewport } from '@/hooks/useViewport';
import { Header } from './Header';
import { WalletModal } from './shared/WalletModal';
import { Marketplace } from './Marketplace';
import { FileDetail } from './FileDetail';
import { Upload } from './Upload';
import { Unlock } from './Unlock';
import { Dashboard } from './Dashboard';

export function SuiWalrusApp() {
  const { mobile } = useViewport();
  const [page, setPage]               = useState<Page>('marketplace');
  const [wallet, setWallet]           = useState<WalletInfo | null>(null);
  const [walletModal, setWalletModal] = useState(false);
  const [direction, setDirection]     = useState<Direction>('dir-a');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [purchasedFile, setPurchasedFile] = useState<FileItem | null>(null);
  const [purchaseTx, setPurchaseTx]   = useState<string | null>(null);

  // Restore session state
  useEffect(() => {
    try {
      const savedWallet = sessionStorage.getItem('sui_wallet');
      if (savedWallet) setWallet(JSON.parse(savedWallet));
      const savedDir = (sessionStorage.getItem('sui_direction') ?? 'dir-a') as Direction;
      setDirection(savedDir);
      document.body.className = savedDir;
    } catch { /* ignore */ }
  }, []);

  const handleConnect = (w: WalletInfo) => {
    setWallet(w);
    setWalletModal(false);
    try { sessionStorage.setItem('sui_wallet', JSON.stringify(w)); } catch { /* ignore */ }
  };

  const handleDirectionChange = (d: Direction) => {
    setDirection(d);
    document.body.className = d;
    try { sessionStorage.setItem('sui_direction', d); } catch { /* ignore */ }
  };

  const navigate = (p: Page) => {
    setSelectedFile(null);
    setPage(p);
  };

  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file);
    setPage('detail');
  };

  const handlePurchaseSuccess = (file: FileItem, tx: string) => {
    setPurchasedFile(file);
    setPurchaseTx(tx);
    setTimeout(() => setPage('unlock'), 600);
  };

  const handleBack = () => {
    setSelectedFile(null);
    setPage('marketplace');
  };

  return (
    <>
      <Header
        page={page}
        setPage={navigate}
        wallet={wallet}
        onWalletClick={() => setWalletModal(true)}
        direction={direction}
        setDirection={handleDirectionChange}
      />

      <main style={{ minHeight: 'calc(100vh - 60px)' }}>
        {page === 'marketplace' && (
          <Marketplace
            onFileSelect={handleFileSelect}
            wallet={wallet}
            onWalletRequired={() => setWalletModal(true)}
          />
        )}
        {page === 'detail' && selectedFile && (
          <FileDetail
            file={selectedFile}
            wallet={wallet}
            onWalletRequired={() => setWalletModal(true)}
            onPurchaseSuccess={handlePurchaseSuccess}
            onBack={handleBack}
          />
        )}
        {page === 'upload' && (
          <Upload
            wallet={wallet}
            onWalletRequired={() => setWalletModal(true)}
          />
        )}
        {page === 'unlock' && (
          <Unlock
            file={purchasedFile}
            txHash={purchaseTx}
            wallet={wallet}
            onBack={handleBack}
          />
        )}
        {page === 'dashboard' && (
          <Dashboard
            wallet={wallet}
            onWalletRequired={() => setWalletModal(true)}
            onNavigate={navigate}
          />
        )}
      </main>

      {/* Direction label */}
      <div style={{
        position: 'fixed', bottom: mobile ? 68 : 16, left: 16,
        background: 'var(--s2)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '4px 10px',
        fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--mono)',
        pointerEvents: 'none', zIndex: 50, letterSpacing: 0.5,
      }}>
        {direction === 'dir-a' ? 'A · Meridian' : 'B · Neon Flux'}
      </div>

      {walletModal && (
        <WalletModal onConnect={handleConnect} onClose={() => setWalletModal(false)}/>
      )}
    </>
  );
}
