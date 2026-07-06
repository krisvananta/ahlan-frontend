# Developer Code of Conduct: ahlan-frontend

This document establishes the minimum standards, best practices, and mandatory workflows for all developers contributing to the `ahlan-frontend` repository. The primary objective is to maintain a highly consistent Next.js 16 App Router architecture, enforce bulletproof server-side security, optimize rendering performance, and deliver a polished, mobile-first user experience.

---

## 1. Architectural & Code Standards

### 1.1. Modular Next.js App Router Structure

All new features and pages must strictly adhere to the Next.js App Router conventions to maintain a predictable codebase:

| Directory | Purpose | Examples |
|---|---|---|
| `app/[feature]/page.tsx` | Entry points for primary pages and routing logic | `app/library/page.tsx`, `app/magazines/[id]/page.tsx` |
| `app/api/` | Server-side API route handlers (auth, PDF proxy, admin) | `app/api/auth/login/route.ts`, `app/api/magazines/[id]/pdf/route.ts` |
| `components/sections/` | Large, composition-level landing page sections | `Hero.tsx`, `MagazineGrid.tsx`, `BlogFeed.tsx`, `About.tsx`, `Merchandise.tsx` |
| `components/ui/` | Reusable, atomic UI elements (modals, buttons, inputs) | `AuthModal.tsx` |
| `components/layout/` | Persistent shell components rendered in `app/layout.tsx` | `Navbar.tsx`, `Footer.tsx` |
| `components/magazine/` | Magazine-specific components (reader, viewer) | `SecurePdfViewer.tsx` |
| `components/article/` | Article-specific components (design engine, themed rendering) | `ThemeWrapper.tsx` |
| `components/dashboard/` | User and admin dashboard components | `SubmitForm.tsx`, `TipTapEditor.tsx` |
| `providers/` | Global state management and context providers | `AuthProvider.tsx`, `QueryProvider.tsx` |
| `lib/` | Core utilities, WPGraphQL client, sanitization, mock data | `api.ts`, `sanitize.ts`, `mock-data.ts` |
| `hooks/` | Reusable custom React hooks | `useScrollSpy.ts` |
| `types/` | Centralized TypeScript type definitions | `types/index.ts` |

### 1.2. Strict TypeScript Enforcement

* **Explicit Typing:** You must define explicit `type` aliases or `interfaces` in `types/index.ts` for all component props, state variables, and backend data payloads.
* **No `any` Types:** The use of the `any` type is **strictly prohibited**. If the shape of incoming data is temporarily unknown during parsing (e.g., JWT payload data), use `unknown` and perform proper type narrowing or cast with a well-defined inline type:

  ```typescript
  // ✅ Correct — cast with explicit shape
  const jwtData = payload.data as { user?: Record<string, string> } | undefined;

  // ❌ Incorrect — untyped escape hatch
  const jwtData = (payload as any).data;
  ```

### 1.3. Tech Stack & Dependencies

All developers must be familiar with the exact technology stack used in this project:

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| React | React | 19.x |
| Styling | Tailwind CSS v4 (with `@theme inline` design tokens in `globals.css`) | 4.x |
| Animation | Framer Motion | 12.x |
| Data Fetching | TanStack React Query | 5.x |
| Backend API | WPGraphQL + ACF (WordPress headless CMS) | — |
| Auth / JWT | `jose` (server-side JWT verification) | 6.x |
| PDF Rendering | `@react-pdf-viewer/core` + `pdfjs-dist` | 3.x |
| HTML Sanitization | `isomorphic-dompurify` | Latest |
| Toast Notifications | `sonner` | 2.x |
| Rich Text Editor | TipTap (`@tiptap/react`, `@tiptap/starter-kit`) | 3.x |
| Forms | `react-hook-form` | 7.x |
| Icons | `lucide-react` | 1.x |
| Fonts | Funnel Display (headings) + Plus Jakarta Sans (body) via `next/font/google` | — |

### 1.4. Design System

The design system is defined in `app/globals.css` using Tailwind CSS v4's `@theme inline` block. All new UI must use these CSS custom properties — do **not** introduce ad-hoc color values.

Key design tokens:

* **Brand:** `--color-primary` (#EF273E), `--color-accent` (#1F1F1F)
* **Surfaces:** `--color-cream`, `--color-surface`, `--color-dark-bg`
* **Typography:** `--font-heading` (Funnel Display), `--font-body` (Plus Jakarta Sans)
* **Effects:** `.glass`, `.glass-dark`, `.gradient-primary`, `.gradient-hero`, `.pattern-overlay`

---

## 2. Security & Authorization Standards

### 2.1. The Gatekeeper Logic (Strict Access Control)

Security must never rely solely on client-side UI manipulation (e.g., hiding a button). Content protection requires a defense-in-depth approach:

* **Server-Side Verification:** API routes serving sensitive data or file streams (like magazine PDFs via `app/api/magazines/[id]/pdf/route.ts`) **must** cryptographically verify JSON Web Tokens (JWT) on the server side using `jose.jwtVerify` and the `JWT_SECRET_KEY` environment variable.
* **Strict Boolean Evaluation:** When evaluating user roles or ACF metadata (especially the `userMembership` field group from WPGraphQL, which may return `null`, `undefined`, or string `"true"`), avoid loose boolean casting (`!!`). Use strict equality checks to prevent false positives:

  ```typescript
  // ✅ Correct — strict evaluation covering both boolean and string from ACF
  const hasAllAccess =
    viewer?.userMembership?.hasAllAccess === true ||
    viewer?.userMembership?.hasAllAccess === "true";

  // ❌ Incorrect — loose cast treats any truthy value (e.g., a database ID) as access
  const hasAllAccess = !!viewer?.hasAllAccess;
  ```

* **Secure Fallbacks:** If a user's authentication state is undefined, null, or unverified, the system must unequivocally default to `false` (Deny Access / 403 Forbidden).
* **No Mock Fallbacks in Production:** Never hardcode `purchased_magazines: ["1", "2"]` or default `hasAccess = true` as fallbacks. If a user is not authenticated or lacks access, deny access immediately.

### 2.2. WPGraphQL Schema Alignment

The ACF Field Group **"User Membership"** is exposed in WPGraphQL under the camelCase name `userMembership`. All GraphQL queries for user data must use this exact field name:

```graphql
# ✅ Correct — matches the WPGraphQL schema
userMembership {
  hasAllAccess
}

# ❌ Incorrect — this field does not exist on the User type
acfFields {
  hasAllAccess
}
```

When the WordPress backend ACF configuration changes, always verify the exposed field name using the WPGraphQL IDE (`/wp-admin → GraphQL → GraphiQL IDE`) before updating frontend queries.

### 2.3. Session & Token Management

* **HTTP-Only Cookies:** JWTs are stored exclusively in secure, HTTP-Only cookies set by `app/api/auth/login/route.ts`. This mitigates Cross-Site Scripting (XSS) attacks.
* **Session Hydration:** On page load, `AuthProvider` calls `GET /api/auth/me` to rehydrate user state from the cookie. The token is never exposed to client-side JavaScript.
* **Client-Side Storage:** Do not store authentication tokens in `localStorage` or `sessionStorage`. The `AuthProvider` context should only hold non-sensitive user metadata required for UI rendering.

### 2.4. Role-Based Access Pattern

Access checks must follow this exact precedence across all UI components and API routes:

```typescript
// 1. Admin bypass
if (user.role === "administrator") return true;
// 2. ACF "has all access" flag
if (user.has_all_access === true) return true;
// 3. Individual magazine purchase
return user.purchased_magazines?.includes(magazineId) || false;
```

### 2.5. XSS Prevention

All raw HTML fetched from WordPress (blog posts, fan articles, admin previews) **must** be sanitized using `isomorphic-dompurify` via the `sanitizeHtml()` helper in `lib/sanitize.ts` before rendering with `dangerouslySetInnerHTML`:

```typescript
import { sanitizeHtml } from "@/lib/sanitize";

// ✅ Correct — sanitized before render
<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />

// ❌ Incorrect — raw, unsanitized WordPress HTML
<div dangerouslySetInnerHTML={{ __html: post.content }} />
```

### 2.6. Local Dependencies for Critical Workers

Critical third-party scripts (like `pdf.worker.min.js`) must be served locally from the `/public` directory. Do not load core workers from external CDNs (unpkg, cdnjs, jsdelivr) — this prevents supply-chain attacks where a compromised CDN could inject malicious code into every reader's browser.

### 2.7. Gated PDF Delivery

Magazine PDF files uploaded to WordPress ACF File fields must **never** be exposed as direct WordPress URLs to the client. They must be fetched securely via authenticated Next.js API routes (`app/api/magazines/[id]/pdf/route.ts`), which stream the file to the `SecurePdfViewer` component.

---

## 3. Performance & Optimization

### 3.1. Server vs. Client Components

* **Server-First Default:** Render components as Server Components by default to optimize the First Contentful Paint (FCP), reduce JavaScript bundle sizes, and improve SEO.
* **Targeted Interactivity:** Use the `'use client'` directive exclusively at the leaves of your component tree — only where interactivity (e.g., `useState`, `useEffect`, `onClick` handlers, Framer Motion animations, or browser APIs) is strictly required.

### 3.2. Data Fetching & Asset Management

* **GraphQL via `lib/api.ts`:** All WordPress data fetching goes through the `wpQuery<T>()` function. Use the generic type parameter to get proper typing on responses.
* **Mock Data Fallback:** When `NEXT_PUBLIC_USE_MOCK_DATA=true` or the WordPress backend is unreachable, functions in `lib/api.ts` automatically fall back to `lib/mock-data.ts`. Never import mock data directly in page components — always go through the API functions.
* **Image Optimization:** All images must be rendered using the Next.js `<Image/>` component exclusively. Raw `<img>` tags are prohibited. The `next.config.ts` must have the correct `images.remotePatterns` configured for the WordPress backend domain.
* **Caching Strategies:** Utilize the `revalidate` parameter in `wpQuery()` calls intelligently. Mutations (login, article submission) must use `revalidate: 0`. Read queries default to `60` seconds.

---

## 4. UI/UX & Mobile-First Implementation

### 4.1. Mobile-First Tailwind CSS

The application must be fully responsive and optimized for mobile devices.

* **Progressive Enhancement:** Write base utility classes for mobile viewports first. Use responsive modifiers (`sm:`, `md:`, `lg:`, `xl:`) only to scale the design for larger screens.
* **Touch Targets:** Ensure all interactive elements (buttons, links, navigation items) have a minimum clickable area of `44×44 pixels` to accommodate touch interfaces comfortably.

### 4.2. Localization

* **Dates:** All dates must be formatted using the `"id-ID"` locale (Indonesian).
* **Currency:** All monetary values must be formatted as Indonesian Rupiah (IDR) using `Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" })`.

### 4.3. State Management & Attention to Detail

* **Dynamic UI Synchronization:** Action buttons across the catalog must synchronize instantly with the global `AuthContext` from `AuthProvider`. (e.g., automatically transitioning from "Buy Now" to "Read Now" upon successful login or purchase verification — see `MagazineGrid.tsx`'s `hasAccess()` function).
* **Graceful Degradation:** Asynchronous data fetching must be accompanied by polished Skeleton Loaders or Spinners.
* **Clear Error States:** If access is denied, do not leave the screen blank or crash the app. Render a dedicated "Locked" or "Error" screen featuring clear illustrations, educational messaging, and relevant Call-to-Action (CTA) buttons (see `app/magazines/[id]/page.tsx` for reference).

---

## 5. Environment Configuration

The following environment variables must be configured in `.env.local`:

| Variable | Purpose | Example |
|---|---|---|
| `NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL` | WPGraphQL endpoint for the WordPress backend | `http://ahlan-backend.local/graphql` |
| `NEXT_PUBLIC_USE_MOCK_DATA` | Set to `"true"` to bypass WordPress and use mock data | `true` |
| `JWT_SECRET_KEY` | Secret key for server-side JWT verification (must match WordPress plugin config) | *(long random string)* |

> **⚠️ Important:** `JWT_SECRET_KEY` is a server-only secret. Never prefix it with `NEXT_PUBLIC_`.

---

## 6. Git Workflow & Branching

### 6.1. Branch Strategy

| Branch | Purpose |
|---|---|
| `master` | Production-ready releases |
| `dev1` | Primary development branch — all feature work merges here first |

* Create feature branches from `dev1`, not `master`.
* All Pull Requests target `dev1`. Only reviewed and tested code is merged to `master`.

### 6.2. Pre-Push Checklist

Before pushing code to `dev1` or submitting a Pull Request, developers must successfully execute the following:

1. **TypeScript Check:** Run `npx tsc --noEmit` and ensure zero errors.
2. **Lint:** Run `npm run lint` and resolve all warnings and errors.
3. **Build Verification:** Run `npm run build` and verify the production build completes without errors.
4. **Administrator / Bypass Test:** Log in with an `administrator` role or an account possessing the `has_all_access: true` flag. Verify that the entire catalog is accessible and all gated content renders seamlessly without restriction.
5. **Subscriber / Restricted Test:** Log in with a standard subscriber account. Verify that unowned items properly display the "Buy Now" state. Attempt to directly access a gated reader URL (e.g., `/magazines/[id]`) and ensure the system correctly intercepts the request and renders the Locked screen.
6. **Clean Session Verification:** Log out and manually clear browser cookies. Log in with a different account to ensure no "ghost data" or previous state memory leaks into the new session.