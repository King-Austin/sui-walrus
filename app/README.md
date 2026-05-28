# SUI-Walrus · Decentralized File Marketplace

A Next.js 16 + React 19 marketplace where sellers upload files to [Walrus](https://walrus.space) decentralized storage and gate access through [Sui Kiosk](https://docs.sui.io/standards/kiosk) objects. Ownership is verified on-chain via the [Tatum](https://tatum.com) Sui RPC.

---

## What this app does

| Flow | Description |
|---|---|
| **Browse** | Buyers browse files listed on the marketplace, filtered by category/price |
| **Buy** | Buyer pays SUI → Kiosk transfers an access-pass object to their wallet |
| **Verify** | Tatum RPC confirms the buyer owns the Kiosk object |
| **Download** | Buyer retrieves the blob from the Walrus aggregator using the verified blob ID |
| **Sell** | Seller uploads a file → Walrus stores it → Kiosk listing is created with a price in SUI |
| **Dashboard** | Seller tracks revenue, sales, views, and manages listings |

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript, inline CSS-in-JS |
| Storage | [Walrus](https://walrus.space) — decentralized blob storage |
| Blockchain | [Sui](https://sui.io) — Kiosk standard for access control |
| RPC | [Tatum](https://tatum.com) — enterprise Sui RPC for on-chain reads |
| Fonts | Space Grotesk (body), JetBrains Mono (code/addresses) |

---

## Project layout

```
app/
├── app/
│   ├── layout.tsx              # Root layout — fonts, metadata, viewport
│   ├── page.tsx                # Entry point → <SuiWalrusApp/>
│   ├── globals.css             # Design tokens (CSS vars), animations, themes
│   └── api/
│       ├── tatum/
│       │   ├── object/route.ts     # GET  /api/tatum/object?id=  — fetch Sui object
│       │   └── verify/route.ts     # POST /api/tatum/verify      — verify Kiosk ownership
│       └── walrus/
│           └── upload/route.ts     # POST /api/walrus/upload      — upload file to Walrus
├── components/
│   ├── SuiWalrusApp.tsx        # Root client component — routing, wallet state
│   ├── Header.tsx              # Sticky nav (desktop) + bottom tab bar (mobile)
│   ├── Marketplace.tsx         # Browse, search, filter, sort file listings
│   ├── FileDetail.tsx          # File detail page + purchase modal
│   ├── Upload.tsx              # 5-step upload → Walrus → Kiosk listing flow
│   ├── Unlock.tsx              # Post-purchase: verify ownership → download blob
│   ├── Dashboard.tsx           # Seller stats, listings, activity, settings
│   └── shared/
│       ├── Badge.tsx           # Category and tag badges
│       ├── Btn.tsx             # Button (primary/secondary/sui/ghost/danger variants)
│       ├── FileIcon.tsx        # File type icon (PDF/ZIP/CSV/JSON/MP4)
│       ├── Logo.tsx            # SVG walrus logo
│       ├── Mono.tsx            # Monospace text span
│       ├── Spinner.tsx         # Loading spinner
│       ├── StatusDot.tsx       # Active/inactive indicator dot
│       ├── TatumBadge.tsx      # "Tatum RPC · Sui Mainnet" status pill
│       └── WalletModal.tsx     # Wallet selection modal (Sui/Martian/Ethos/Suiet)
├── hooks/
│   └── useViewport.ts          # Responsive breakpoints (mobile < 640, tablet < 1024)
├── lib/
│   ├── types.ts                # Shared TypeScript types (FileItem, WalletInfo, Page…)
│   ├── tatum.ts                # Tatum RPC client — getSuiObject, verifyKioskOwnership
│   ├── walrus.ts               # Walrus upload/blob URL helpers
│   └── mock-data.ts            # Sample listings and wallet options (dev/demo only)
├── .env.example                # Environment variable reference — copy to .env.local
├── package.json
└── tsconfig.json
```

---

## Getting started

### 1. Prerequisites

- Node.js 20+
- npm 10+
- A [Tatum](https://tatum.com) account (free tier works)

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```env
TATUM_API_KEY=your_key_here
```

Get your key at **tatum.com → sign up → Dashboard → API Keys**.
Free tier gives 10 req/s on Sui Mainnet — enough for development.

Walrus variables have working testnet defaults; leave them unchanged to start.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `TATUM_API_KEY` | **Yes** | — | Tatum API key for Sui RPC calls |
| `TATUM_SUI_RPC_URL` | No | `https://api.tatum.io/v3/blockchain/node/SUI` | Override Tatum RPC endpoint |
| `WALRUS_PUBLISHER_URL` | No | `https://publisher.walrus-testnet.walrus.space` | Walrus publisher for uploads |
| `WALRUS_AGGREGATOR_URL` | No | `https://aggregator.walrus-testnet.walrus.space` | Walrus aggregator for downloads |

All env vars are **server-side only** — none are exposed to the browser.

---

## API routes

### `GET /api/tatum/object?id=<objectId>`
Fetches a Sui object by its ID using Tatum RPC.

**Response:**
```json
{ "object": { "objectId": "0x…", "owner": {}, "type": "…", "content": {} } }
```

### `POST /api/tatum/verify`
Verifies that a wallet address owns a Sui Kiosk object.

**Body:**
```json
{ "kioskId": "0x…", "walletAddress": "0x…" }
```

**Response:**
```json
{ "verified": true, "kioskId": "0x…", "walletAddress": "0x…" }
```

> **Known limitation:** The current check reads `AddressOwner`. Real Sui Kiosks use a `KioskOwnerCap` pattern — this needs updating before mainnet use. See [lib/tatum.ts](lib/tatum.ts).

### `POST /api/walrus/upload`
Uploads a file to Walrus and returns its blob ID.

**Body:** `multipart/form-data` with a `file` field

**Response:**
```json
{ "blobId": "bAE…", "url": "https://aggregator…/v1/blobs/bAE…" }
```

> Vercel's default body limit is 4.5 MB. `maxDuration = 60` is already set for large uploads.

---

## Design system

Two visual themes toggle via the A / B button in the header:

| Theme | Class | Vibe |
|---|---|---|
| **Meridian** | `dir-a` | Clean grid, structured, subtle borders |
| **Neon Flux** | `dir-b` | Glowing accents, sharp corners, radial backgrounds |

All colors are CSS custom properties in `app/globals.css`:

```
--bg, --s1, --s2, --s3    surface layers (darkest → lightest)
--accent                   #00E5A0 — primary brand green
--sui                      #4F9FFF — Sui blockchain blue
--t1, --t2, --t3           text (bright → muted → dim)
--danger, --warn           red, amber
```

---

## State management

No external state library. Everything lives in React hooks:

- **`SuiWalrusApp`** owns `page`, `wallet`, `selectedFile`, `purchasedFile`, `direction`
- **`sessionStorage`** persists wallet and theme across page refreshes
- State flows down to children via props; events bubble up via callbacks

---

## What's mocked vs. real

This is the most important table for a new dev:

| Feature | Status | File | Next step |
|---|---|---|---|
| Marketplace listings | **Mocked** | `lib/mock-data.ts` | Replace with on-chain Kiosk queries |
| Wallet connection | **Mocked** (random address) | `components/shared/WalletModal.tsx` | Install `@mysten/dapp-kit`, use `ConnectButton` |
| File upload | **Mocked** (simulated progress) | `components/Upload.tsx:41-58` | Uncomment the real `fetch('/api/walrus/upload')` block |
| Purchase / Kiosk tx | **Mocked** (fake tx hash) | `components/FileDetail.tsx:29-43` | Use `@mysten/sui` to submit a real Kiosk purchase tx |
| Ownership verification | **Mocked** (timer only) | `components/Unlock.tsx:35-45` | Call `POST /api/tatum/verify` after tx settles |
| Download | **Mocked** (progress animation) | `components/Unlock.tsx:47-55` | Use `getBlobUrl(blobId)` from `lib/walrus.ts` + `<a download>` |
| Tatum RPC client | **Real** | `lib/tatum.ts` | Works — just needs `TATUM_API_KEY` |
| Walrus upload API | **Real** | `app/api/walrus/upload/route.ts` | Works — calls real Walrus publisher HTTP API |

---

## Recommended next steps

In priority order:

1. **Wire real wallet** — `npm install @mysten/dapp-kit @mysten/sui`, replace `WalletModal` with the SDK's `ConnectButton` and `useCurrentAccount` hook
2. **Wire real upload** — uncomment the `fetch('/api/walrus/upload')` block in [components/Upload.tsx](components/Upload.tsx)
3. **Wire real purchase** — use `@mysten/sui` to call the Sui Kiosk `purchase` Move function and get back a real tx digest
4. **Wire real verify** — after purchase settles, call `POST /api/tatum/verify` with the real kiosk ID and buyer address
5. **Wire real download** — construct `getBlobUrl(file.blobId)` from `lib/walrus.ts` and trigger an `<a href=… download>` click
6. **Fix Kiosk ownership check** — update `verifyKioskOwnership` in [lib/tatum.ts](lib/tatum.ts) to check the `KioskOwnerCap` object pattern
7. **Add upload size guard** — reject files over 4 MB in [app/api/walrus/upload/route.ts](app/api/walrus/upload/route.ts)

---

## Useful docs

| Resource | URL |
|---|---|
| Tatum API reference | https://docs.tatum.io |
| Walrus docs | https://docs.walrus.space |
| Sui Kiosk standard | https://docs.sui.io/standards/kiosk |
| Mysten dapp-kit | https://sdk.mystenlabs.com/dapp-kit |
| Sui TypeScript SDK | https://sdk.mystenlabs.com/typescript |
