<!-- BEGIN:nextjs-agent-rules -->
# AGENTS.md — ahlan-frontend

> This file is the single source of truth for any AI coding agent operating on this repository.
> Read it in full before generating, modifying, or reviewing any code.

---

## 1. Project Identity

| Key | Value |
|-----|-------|
| **Project** | ahlan-frontend |
| **Purpose** | Consumer-facing magazine platform for Ahlan — a digital Islamic lifestyle publication |
| **Framework** | Next.js 16 (App Router only) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS v4 (`@theme inline` design tokens in `app/globals.css`) |
| **Backend** | Headless WordPress via WPGraphQL + Advanced Custom Fields (ACF) |
| **Auth** | JWT stored in HTTP-Only cookies, verified server-side with `jose` |

---

## 2. Critical Rules — Never Violate

### 2.1. No `any` Types
Use `unknown` with type narrowing if the shape is uncertain. The `any` type is banned project-wide.

### 2.2. No Mock Data in Production Logic
The application is in **production mode**. Never hardcode `purchased_magazines: ["1", "2"]`, default `hasAccess = true`, or return fake users as fallbacks. If a user is not authenticated or lacks access, deny access immediately (`false` / `403`).

### 2.3. Sanitize All WordPress HTML
Every `dangerouslySetInnerHTML` rendering WordPress content **must** be wrapped with the `sanitizeHtml()` helper from `lib/sanitize.ts` (which uses `isomorphic-dompurify`):

```typescript
import { sanitizeHtml } from "@/lib/sanitize";
<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
```

### 2.4. No External CDNs for Critical Workers
Scripts like `pdf.worker.min.js` must be served from `/public/`. Never load core runtime dependencies from unpkg, cdnjs, or jsdelivr.

### 2.5. No Raw `<img>` Tags
Use the Next.js `<Image/>` component exclusively. The `next.config.ts` file has `images.remotePatterns` configured for the WordPress backend domain.

### 2.6. HTTP-Only Cookies Only
JWTs live in HTTP-Only cookies. Never store tokens in `localStorage` or `sessionStorage`. The `AuthProvider` context holds only non-sensitive user metadata for UI rendering.

### 2.7. Strict Boolean Evaluation for Access Control
WordPress ACF fields may return `null`, `undefined`, `""`, or the string `"true"`. Always use strict equality:

```typescript
// ✅ Correct
const hasAllAccess = viewer?.userMembership?.hasAllAccess === true;

// ❌ Wrong — loose truthy check
const hasAllAccess = !!viewer?.hasAllAccess;
```

### 2.8. Localization
- **Dates:** Always format with `"id-ID"` locale.
- **Currency:** Always format as Indonesian Rupiah: `Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" })`.

---

## 3. Architecture Map

```
ahlan-frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, providers, Navbar, Footer)
│   ├── page.tsx                  # Homepage (Server Component, fetches posts + magazines)
│   ├── globals.css               # Tailwind v4 @theme inline design tokens
│   ├── blog/                     # Blog listing + [slug] detail pages
│   ├── articles/[slug]/          # Fan article pages with ThemeWrapper design engine
│   ├── library/                  # Full magazine catalog
│   ├── magazines/[id]/           # Individual magazine reader (gated)
│   ├── login/                    # Login page
│   ├── dashboard/                # User dashboard (submit articles, history)
│   ├── admin/review/             # Admin article review queue
│   └── api/
│       ├── auth/login/           # POST: WP login → sets HTTP-Only cookie
│       ├── auth/me/              # GET: hydrates session from cookie
│       ├── auth/logout/          # POST: clears cookie
│       ├── magazines/[id]/pdf/   # GET: authenticated PDF proxy stream
│       └── admin/upload-ebook/   # POST: upload PDF to WP media library
├── components/
│   ├── sections/                 # Hero, MagazineGrid, BlogFeed, About, Merchandise
│   ├── ui/                       # AuthModal
│   ├── layout/                   # Navbar, Footer
│   ├── magazine/                 # SecurePdfViewer
│   ├── article/                  # ThemeWrapper (design engine)
│   └── dashboard/                # SubmitForm, TipTapEditor
├── providers/
│   ├── AuthProvider.tsx          # Global auth context (session hydration via /api/auth/me)
│   └── QueryProvider.tsx         # TanStack React Query client
├── lib/
│   ├── api.ts                    # WPGraphQL client, queries, data transformers
│   ├── sanitize.ts               # HTML sanitization (isomorphic-dompurify wrapper)
│   └── mock-data.ts              # Mock data fallback (used when WP is unreachable)
├── hooks/
│   └── useScrollSpy.ts           # IntersectionObserver-based scroll tracking
└── types/
    └── index.ts                  # Centralized type definitions (WPPost, WPMagazine, etc.)
```

---

## 4. Data Flow

### 4.1. WordPress → Frontend Pipeline

```
WordPress (ACF + WPGraphQL)
  ↓ GraphQL over HTTP
lib/api.ts → wpQuery<T>()
  ↓ transforms raw WP nodes
Server Components (app/page.tsx, app/blog/page.tsx, etc.)
  ↓ passes typed data as props
Client Components (MagazineGrid, BlogFeed, etc.)
```

### 4.2. Authentication Flow

```
User submits login form
  ↓
POST /api/auth/login (Next.js route)
  ↓ forwards to WPGraphQL LOGIN_MUTATION
  ↓ extracts JWT + user data (roles, userMembership.hasAllAccess)
  ↓ sets HTTP-Only cookie with JWT
  ↓ returns user metadata to client
AuthProvider stores user in React context
  ↓
On page reload: GET /api/auth/me
  ↓ reads cookie → forwards token to WPGraphQL VIEWER_QUERY
  ↓ re-hydrates AuthProvider context
```

### 4.3. Gated PDF Delivery

```
SecurePdfViewer requests /api/magazines/[id]/pdf
  ↓
API route reads JWT from cookie
  ↓ verifies with jose.jwtVerify()
  ↓ checks role/access against WPGraphQL
  ↓ fetches PDF from WordPress (server-to-server)
  ↓ streams PDF bytes to client (never exposes WP URL)
```

---

## 5. Key Files to Understand Before Making Changes

| File | Why It Matters |
|------|---------------|
| `lib/api.ts` | Central GraphQL client. All queries, mutations, and data transformers live here. |
| `lib/sanitize.ts` | XSS protection. Every `dangerouslySetInnerHTML` must use this. |
| `providers/AuthProvider.tsx` | Global auth state. Hydrates from `/api/auth/me` on mount. |
| `app/api/auth/login/route.ts` | Server-side login. Sets HTTP-Only JWT cookie. |
| `app/api/auth/me/route.ts` | Session hydration. Reads cookie, queries WP, returns user data. |
| `app/api/magazines/[id]/pdf/route.ts` | Gated PDF proxy. Verifies JWT, checks access, streams file. |
| `components/magazine/SecurePdfViewer.tsx` | Client-side PDF renderer with anti-copy protections. |
| `components/article/ThemeWrapper.tsx` | Design engine. Applies runtime ACF design configs to articles. |
| `types/index.ts` | All shared types. Always check here before creating new interfaces. |
| `app/globals.css` | Tailwind v4 design tokens (`@theme inline`). The entire color/spacing/shadow system. |

---

## 6. WPGraphQL Schema Alignment

The ACF Field Group **"User Membership"** is exposed in WPGraphQL as `userMembership` (camelCase). Key mapping:

```graphql
# ✅ Correct
viewer {
  roles { nodes { name } }
  userMembership { hasAllAccess }
}

# ❌ Wrong — does not exist
viewer {
  acfFields { hasAllAccess }
}
```

Always verify field names in the WPGraphQL IDE (`/wp-admin → GraphQL → GraphiQL IDE`) before writing queries.

---

## 7. Access Control Precedence

When checking if a user can access gated content, follow this exact order:

```typescript
function hasAccess(user: User | null, magazineId: string): boolean {
  if (!user) return false;
  // 1. Admin bypass
  if (user.role === "administrator") return true;
  // 2. ACF "has all access" subscription flag
  if (user.has_all_access === true) return true;
  // 3. Individual magazine purchase
  return user.purchased_magazines?.includes(magazineId) ?? false;
}
```

This logic is duplicated across several files today. When modifying access control, update **all** instances or (preferably) extract to a shared `lib/access.ts`.

---

## 8. Common Pitfalls

| Pitfall | Why It Breaks | What To Do |
|---------|--------------|------------|
| Using `acfFields` in GraphQL | Field doesn't exist — crashes the query | Use `userMembership` |
| `!!value` for ACF booleans | ACF returns `null`, `""`, or `"true"` — loose cast gives wrong results | Use `=== true` strict equality |
| Importing mock data directly in components | Bypasses the API layer, never fetches real WP data | Always call functions from `lib/api.ts` |
| Raw `<img>` for WP images | No optimization, no lazy loading, no CLS prevention | Use `<Image/>` from `next/image` |
| External CDN for pdf.worker.js | Supply-chain attack vector | Serve from `/public/pdf.worker.min.js` |
| Unsanitized `dangerouslySetInnerHTML` | XSS vulnerability — scripts execute in reader's browser | Wrap with `sanitizeHtml()` from `lib/sanitize.ts` |
| `localStorage` for JWT | XSS can steal the token | JWT lives in HTTP-Only cookies only |
| Formatting dates with `"en-US"` | Project targets Indonesian audience | Use `"id-ID"` locale |
| Dollar signs for prices | Wrong currency | Use `Intl.NumberFormat` with `currency: "IDR"` |
| Adding colors outside `globals.css` | Breaks design system consistency | Use existing `@theme inline` tokens |

---

## 9. Environment Variables

| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL` | Public | WPGraphQL endpoint |
| `NEXT_PUBLIC_USE_MOCK_DATA` | Public | `"true"` to use mock data when WP is unreachable |
| `JWT_SECRET_KEY` | **Server-only** | JWT verification secret (must match WordPress plugin config) |

> `JWT_SECRET_KEY` must **never** be prefixed with `NEXT_PUBLIC_`.

---

## 10. Before Submitting Code

1. `npx tsc --noEmit` — zero type errors
2. `npm run lint` — zero errors
3. `npm run build` — clean production build
4. Test with admin account — all content accessible
5. Test with subscriber account — gated content shows locked state
6. Test clean session — logout, clear cookies, login as different user

<!-- END:nextjs-agent-rules -->
