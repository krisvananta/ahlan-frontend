import type { DesignConfig } from "@/types";
import type { ReactNode } from "react";

/**
 * ThemeWrapper — The "Design Engine" core component.
 *
 * Receives a designConfig object (from WordPress ACF) and applies
 * custom styles dynamically to wrap article content.
 *
 * Uses inline styles because the color/font values come at runtime
 * from user data in WordPress — Tailwind can't generate classes
 * for arbitrary runtime values.
 *
 * Input Example:
 *   { bgColor: "#f3e5f5", textColor: "#2d3436", fontFamily: "serif", accentColor: "#6c5ce7" }
 *
 * Output:
 *   A styled wrapper that applies these custom styles to article content.
 */

interface ThemeWrapperProps {
  designConfig: DesignConfig;
  children: ReactNode;
}

/** Default fallback config */
const defaultConfig: DesignConfig = {
  bgColor: "#faf6f0",
  textColor: "#2d3436",
  fontFamily: "Georgia, serif",
  accentColor: "#0a5c36",
  borderStyle: "none",
};

/** Sanitize a CSS color value to prevent injection */
function sanitizeColor(value: string): string {
  // Allow hex, rgb, rgba, hsl, hsla, named colors
  const safe = value.replace(/[^a-zA-Z0-9#(),.\s%]/g, "");
  return safe || defaultConfig.bgColor;
}

/** Map short font names to full CSS font-family stacks */
function resolveFontFamily(font: string): string {
  const fontMap: Record<string, string> = {
    serif: "Georgia, 'Times New Roman', serif",
    "sans-serif": "Inter, system-ui, -apple-system, sans-serif",
    monospace: "'JetBrains Mono', 'Fira Code', monospace",
    cursive: "'Dancing Script', cursive",
  };
  return fontMap[font.toLowerCase()] || font;
}

export default function ThemeWrapper({
  designConfig,
  children,
}: ThemeWrapperProps) {
  const config = { ...defaultConfig, ...designConfig };

  const bgColor = sanitizeColor(config.bgColor);
  const textColor = sanitizeColor(config.textColor);
  const accentColor = sanitizeColor(config.accentColor);
  const fontFamily = resolveFontFamily(config.fontFamily);
  const borderStyle = config.borderStyle || "none";

  // Generate scoped CSS for article typography using the accent color
  const scopedStyles = `
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
    .article-theme p {
      font-size: 1.125rem;
      line-height: 1.8;
      margin-bottom: 1.25rem;
    }
    .article-theme a {
      color: ${accentColor};
      text-decoration: underline;
      text-underline-offset: 3px;
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
    @media (max-width: 640px) {
      .article-theme h1 { font-size: 1.75rem; }
      .article-theme h2 { font-size: 1.375rem; }
      .article-theme p { font-size: 1rem; }
    }
  `;

  return (
    <article
      className="article-theme mx-auto min-h-screen w-full max-w-4xl"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        fontFamily,
        borderTop: borderStyle !== "none" ? `4px ${borderStyle} ${accentColor}` : undefined,
      }}
    >
      {/* Scoped styles for article typography — works in Server Components */}
      <style dangerouslySetInnerHTML={{ __html: scopedStyles }} />

      {/* Article Content Container */}
      <div className="px-6 py-12 sm:px-12 sm:py-16 lg:px-20 lg:py-20">
        {children}
      </div>
    </article>
  );
}
