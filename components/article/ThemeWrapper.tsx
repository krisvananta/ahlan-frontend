import type { DesignConfig } from "@/types";
import type { ReactNode } from "react";

/**
 * ThemeWrapper — The "Design Engine" core component.
 *
 * Receives a designConfig object (from WordPress ACF) and applies
 * custom visual theming to article content.
 *
 * ACF Fields:
 *   - bgColor:        Background color hex (e.g. "#f3e5f5")
 *   - textColor:      Primary text color hex (e.g. "#2d3436")
 *   - primaryFont:    "serif" | "sans" | "mono"
 *   - decorationType: "vintage" | "modern" | "minimal" | "classic"
 *   - accentColor:    (optional) Accent for headings/links
 *
 * Uses inline styles + scoped CSS because values come from runtime
 * WordPress data — Tailwind can't generate classes for arbitrary user values.
 */

interface ThemeWrapperProps {
  designConfig: DesignConfig;
  children: ReactNode;
}

// ================================
// Font Mapping
// ================================

/**
 * Maps ACF primaryFont short names to full CSS font-family stacks.
 * These align with the Google Fonts loaded in app/layout.tsx
 * (Playfair Display for serif, Inter for sans).
 */
const FONT_STACKS: Record<string, string> = {
  serif: "'Playfair Display', Georgia, 'Times New Roman', serif",
  sans: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
};

function resolveFontFamily(font: string): string {
  return FONT_STACKS[font.toLowerCase()] || FONT_STACKS.serif;
}

// ================================
// Decoration Styles
// ================================

/**
 * Returns CSS class names and style overrides based on decorationType.
 * Each decoration adds a unique visual character to the article.
 */
interface DecorationResult {
  /** Extra classes for the article wrapper */
  wrapperClass: string;
  /** Additional scoped CSS for the decoration */
  css: string;
}

function getDecorationStyles(
  type: string,
  accentColor: string,
): DecorationResult {
  switch (type.toLowerCase()) {
    case "vintage":
      return {
        wrapperClass: "decoration-vintage",
        css: `
          .decoration-vintage {
            border: 3px double ${accentColor};
            border-radius: 0;
            position: relative;
          }
          .decoration-vintage::before {
            content: '';
            position: absolute;
            top: 8px;
            left: 8px;
            right: 8px;
            bottom: 8px;
            border: 1px solid ${accentColor}40;
            pointer-events: none;
          }
          .decoration-vintage h1 {
            text-align: center;
            border-bottom: 2px solid ${accentColor}30;
            padding-bottom: 1rem;
          }
          .decoration-vintage blockquote {
            border-left: 3px double ${accentColor};
            font-family: Georgia, serif;
          }
          .decoration-vintage::after {
            content: '❧';
            display: block;
            text-align: center;
            font-size: 1.5rem;
            color: ${accentColor}50;
            padding: 2rem 0 0;
          }
        `,
      };

    case "modern":
      return {
        wrapperClass: "decoration-modern",
        css: `
          .decoration-modern {
            border-left: 6px solid ${accentColor};
            border-radius: 0;
          }
          .decoration-modern h1 {
            font-weight: 900;
            letter-spacing: -0.02em;
          }
          .decoration-modern h2 {
            border-bottom: none;
            padding-bottom: 0;
            text-transform: uppercase;
            font-size: 1rem;
            letter-spacing: 0.15em;
            color: ${accentColor};
            margin-top: 3rem;
          }
          .decoration-modern blockquote {
            border-left: none;
            border-radius: 0.75rem;
            background: ${accentColor}10;
            padding: 1.5rem 2rem;
            position: relative;
          }
          .decoration-modern blockquote::before {
            content: '"';
            position: absolute;
            top: -0.5rem;
            left: 1rem;
            font-size: 4rem;
            color: ${accentColor}30;
            font-family: Georgia, serif;
            line-height: 1;
          }
        `,
      };

    case "classic":
      return {
        wrapperClass: "decoration-classic",
        css: `
          .decoration-classic {
            border-top: 4px solid ${accentColor};
            border-bottom: 4px solid ${accentColor};
          }
          .decoration-classic h1 {
            text-align: center;
          }
          .decoration-classic h2 {
            text-align: center;
            border-bottom: none;
            padding-bottom: 0;
          }
          .decoration-classic h2::after {
            content: '';
            display: block;
            width: 60px;
            height: 2px;
            background: ${accentColor};
            margin: 0.75rem auto 0;
          }
          .decoration-classic p:first-of-type::first-letter {
            font-size: 3.5rem;
            float: left;
            line-height: 1;
            padding-right: 0.5rem;
            color: ${accentColor};
            font-family: 'Playfair Display', Georgia, serif;
            font-weight: 700;
          }
        `,
      };

    case "minimal":
    default:
      return {
        wrapperClass: "decoration-minimal",
        css: `
          .decoration-minimal {
            border-radius: 1rem;
          }
          .decoration-minimal h2 {
            border-bottom: 1px solid ${accentColor}15;
          }
        `,
      };
  }
}

// ================================
// Color Sanitization
// ================================

/** Sanitize a CSS color value to prevent injection */
function sanitizeColor(value: string, fallback: string): string {
  const safe = value.replace(/[^a-zA-Z0-9#(),.\s%]/g, "");
  return safe || fallback;
}

/**
 * Derive an accent color from the text color if none is provided.
 * Uses the text color at reduced opacity as a reasonable default.
 */
function deriveAccentColor(config: DesignConfig): string {
  return config.accentColor || config.textColor || "#0a5c36";
}

// ================================
// Component
// ================================

export default function ThemeWrapper({
  designConfig,
  children,
}: ThemeWrapperProps) {
  const bgColor = sanitizeColor(designConfig.bgColor, "#faf6f0");
  const textColor = sanitizeColor(designConfig.textColor, "#2d3436");
  const accentColor = sanitizeColor(deriveAccentColor(designConfig), "#0a5c36");
  const fontFamily = resolveFontFamily(designConfig.primaryFont);

  const decoration = getDecorationStyles(
    designConfig.decorationType,
    accentColor,
  );

  // Scoped typography styles driven by the design config
  const typographyCSS = `
    .article-theme h1,
    .article-theme h2,
    .article-theme h3 {
      color: ${accentColor};
      font-family: ${fontFamily};
      line-height: 1.3;
    }
    .article-theme h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    .article-theme h2 {
      font-size: 1.75rem;
      margin-top: 2.5rem;
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid ${accentColor}20;
    }
    .article-theme h3 {
      font-size: 1.375rem;
      margin-top: 2rem;
      margin-bottom: 0.5rem;
    }
    .article-theme p {
      font-size: 1.125rem;
      line-height: 1.8;
      margin-bottom: 1.25rem;
    }
    .article-theme a {
      color: ${accentColor};
      text-decoration: underline;
      text-underline-offset: 3px;
      transition: opacity 0.2s;
    }
    .article-theme a:hover {
      opacity: 0.75;
    }
    .article-theme blockquote {
      border-left: 4px solid ${accentColor};
      padding: 1rem 1.5rem;
      margin: 2rem 0;
      font-style: italic;
      background: ${accentColor}08;
      border-radius: 0 0.5rem 0.5rem 0;
    }
    .article-theme strong {
      color: ${accentColor};
    }
    .article-theme ul,
    .article-theme ol {
      padding-left: 1.5rem;
      margin-bottom: 1.25rem;
    }
    .article-theme li {
      margin-bottom: 0.5rem;
      line-height: 1.7;
    }
    .article-theme img {
      border-radius: 0.75rem;
      margin: 2rem 0;
      width: 100%;
    }
    .article-theme hr {
      border: none;
      height: 2px;
      background: linear-gradient(90deg, transparent, ${accentColor}30, transparent);
      margin: 3rem 0;
    }
    @media (max-width: 640px) {
      .article-theme h1 { font-size: 1.75rem; }
      .article-theme h2 { font-size: 1.375rem; }
      .article-theme h3 { font-size: 1.125rem; }
      .article-theme p { font-size: 1rem; line-height: 1.7; }
    }
  `;

  return (
    <article
      className={`article-theme ${decoration.wrapperClass} mx-auto min-h-screen w-full max-w-4xl`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        fontFamily,
      }}
    >
      {/* Scoped styles: typography + decoration */}
      <style
        dangerouslySetInnerHTML={{
          __html: typographyCSS + decoration.css,
        }}
      />

      {/* Article Content */}
      <div className="px-6 py-12 sm:px-12 sm:py-16 lg:px-20 lg:py-20">
        {children}
      </div>
    </article>
  );
}
