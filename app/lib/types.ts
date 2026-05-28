export interface WalletInfo {
  address: string;
  short: string;
  wallet: string;
  balance: string;
}

export interface FileItem {
  id: number;
  title: string;
  description: string;
  type: 'pdf' | 'zip' | 'csv' | 'json' | 'mp4';
  size: string;
  price: number;
  seller: string;
  sellerShort: string;
  blobId: string;
  kiosk: string;
  category: string;
  sales: number;
  views: number;
  listed: string;
  tags: string[];
  verified: boolean;
}

export interface MyListing {
  id: number;
  title: string;
  type: string;
  size: string;
  price: number;
  sales: number;
  revenue: number;
  status: 'active' | 'delisted';
  blobId: string;
  listed: string;
  views: number;
}

export interface WalletOption {
  id: string;
  name: string;
  subtitle: string;
  color: string;
}

export type Page = 'marketplace' | 'detail' | 'upload' | 'unlock' | 'dashboard';
export type Direction = 'dark' | 'light';
