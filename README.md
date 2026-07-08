# Ahlan E-Magazine Platform 📖✨

> The consumer-facing web platform for **Ahlan**, a premier digital Islamic lifestyle publication and interactive e-magazine.

Built with **Next.js 16 (App Router)**, **TypeScript (Strict Mode)**, and **Tailwind CSS v4**, powered by a headless **WordPress + WPGraphQL + Advanced Custom Fields (ACF)** backend.

---

## 🚀 Key Features

* **Gated E-Magazine Reader (`SecurePdfViewer`):**
  * Server-to-server PDF streaming proxy (`/api/magazines/[id]/pdf`) with zero exposure of raw WordPress media URLs.
  * Cryptographic HTTP-Only cookie JWT verification using `jose`.
  * Advanced anti-copy protections: custom right-click context menu prevention, keyboard shortcut blocking (Copy, Print, Save), click-stealing overlays, and dynamic user email/ID watermarking.
* **Dynamic Article Engine (`ThemeWrapper`):**
  * Custom article rendering engine allowing WordPress editors to dynamically configure layouts, typography, color schemes, and hero styles per article via ACF.
* **SEO & Performance Optimized:**
  * Canonical routing structure (`/blog/[slug]`) with automated deduplication redirects from legacy paths.
  * Comprehensive OpenGraph metadata and JSON-LD structured data.
  * Strict DOM sanitization using `isomorphic-dompurify` for all WordPress HTML content.
  * Localized Indonesian formatting (`id-ID` locale and `IDR` currency formatting).
* **Interactive User Dashboard:**
  * Community article submission queue with rich text editing (`TipTap`).
  * Reading history tracking and subscription membership management.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router only) |
| **Language** | TypeScript 5 (Strict Mode, zero `any` tolerance) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) (`@theme inline` design tokens) |
| **Animations** | [Framer Motion 12](https://www.framer.com/motion/) |
| **State & Fetching** | [TanStack React Query v5](https://tanstack.com/query) |
| **Backend CMS** | Headless WordPress via WPGraphQL + ACF Pro |
| **Auth & Security** | JWT in HTTP-Only cookies verified via `jose` |
| **PDF Rendering** | `@react-pdf-viewer/core` + `pdfjs-dist` (local worker) |

---

## 🏁 Getting Started

### 1. Prerequisites
* **Node.js** `>= 20.x`
* **npm**, **pnpm**, or **yarn**
* A running WordPress instance with **WPGraphQL**, **WPGraphQL JWT Authentication**, and **Advanced Custom Fields (ACF)** plugins installed.

### 2. Environment Setup
Copy the example environment file and configure your backend endpoints:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL=http://your-wordpress-backend.com/graphql
NEXT_PUBLIC_USE_MOCK_DATA=false
JWT_SECRET_KEY=your-server-side-jwt-secret-key
```

> **Note:** If `NEXT_PUBLIC_USE_MOCK_DATA=true` is set, the application will fallback to local mock data when WordPress is unreachable, enabling seamless offline UI development.

### 3. Run Development Server
Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

### 4. Run Global Production Server (Accessible From Anywhere)
To host the application from a local Windows machine and make it securely accessible **from anywhere in the world and on any device** over the internet (without requiring router port forwarding or static IPs), we use **PM2** and **Cloudflare Tunnel (`cloudflared`)**:

1. **Start the Server & Tunnel**:
   ```bash
   pm2 start ecosystem.config.js
   ```
2. **Find Your Worldwide Public URL**:
   Wait ~5 seconds after starting, then run:
   ```powershell
   Get-Content C:\Users\afifk\.pm2\logs\ahlan-tunnel-*.log | Select-String "trycloudflare"
   ```
   *(Or view live streaming logs with `pm2 logs ahlan-tunnel`).*
3. **Check Server Status**:
   ```bash
   pm2 status
   ```
4. **Stop Server & Tunnel**:
   ```bash
   pm2 stop all
   ```
5. **Restart Server & Tunnel**:
   ```bash
   pm2 restart all
   ```

---

## 📐 Architecture & Project Structure

```
ahlan-frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, providers, Navbar, Footer)
│   ├── page.tsx                  # Homepage (Server Component)
│   ├── globals.css               # Tailwind v4 @theme inline design tokens
│   ├── blog/                     # Canonical article & blog listing engine
│   ├── articles/[slug]/          # SEO deduplication redirect to /blog/[slug]
│   ├── library/                  # Full magazine catalog
│   ├── magazines/[id]/           # Secure magazine reader (gated)
│   ├── dashboard/                # User dashboard (submissions, reading history)
│   └── api/                      # Server API Routes (auth, PDF streaming proxy)
├── components/
│   ├── sections/                 # Landing page sections (Hero, MagazineGrid, BlogFeed)
│   ├── magazine/                 # SecurePdfViewer & magazine utilities
│   ├── article/                  # ThemeWrapper design engine
│   ├── layout/                   # Navbar & Footer shells
│   └── ui/                       # Atomic UI elements & AuthModal
├── providers/                    # AuthProvider & React Query client
├── lib/                          # WPGraphQL client, API services, HTML sanitization
├── hooks/                        # Custom React hooks (e.g., useScrollSpy)
└── types/                        # Centralized TypeScript definitions
```

---

## 🤝 Contributing & Standards

We enforce strict architectural and coding standards across the repository. Before submitting code or opening a pull request, please review our core developer guides:

* **[CONTRIBUTING.md](./CONTRIBUTING.md):** Developer Code of Conduct, coding rules, accessibility requirements, and testing guidelines.
* **[AGENTS.md](./AGENTS.md):** Single source of truth for AI coding assistants and automated tools operating on this repository.

### Quick Verification Checklist
Before committing changes, ensure all verification checks pass:

```bash
# 1. Type check (must have 0 errors)
npx tsc --noEmit

# 2. Lint check
npm run lint

# 3. Production build verification
npm run build
```

---

## 📄 License

All rights reserved. © Ahlan Magazine.
