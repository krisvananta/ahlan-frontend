import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitizes HTML strings using DOMPurify to prevent XSS (Cross-Site Scripting) attacks.
 * Safe to use in both SSR (Node.js/RSC) and Client Components.
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";
  return DOMPurify.sanitize(dirty, {
    // Allow standard HTML plus iframe embeds (common for video embeds in WordPress articles like YouTube/Vimeo)
    USE_PROFILES: { html: true },
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling", "target"],
  });
}
