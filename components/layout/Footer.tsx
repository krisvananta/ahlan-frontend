import Link from "next/link";
import { Heart } from "lucide-react";

const footerLinks = {
  Magazine: [
    { label: "Latest Issue", href: "#magazine" },
    { label: "Archive", href: "/library" },
    { label: "Subscribe", href: "#magazine" },
  ],
  Community: [
    { label: "Write for Us", href: "#blog" },
    { label: "Style Guide", href: "#" },
    { label: "Contributors", href: "#about" },
  ],
  Company: [
    { label: "About Ahlan", href: "#about" },
    { label: "Contact", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[var(--color-dark-bg)] text-white/80">
      {/* Geometric pattern overlay */}
      <div className="pattern-overlay pointer-events-none absolute inset-0 opacity-30" />

      {/* Gold accent line */}
      <div className="h-1 gradient-accent" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <span className="font-heading text-xl font-bold text-white">
                  أ
                </span>
              </div>
              <span className="font-heading text-2xl font-bold text-white">
                Ahlan
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              A digital magazine celebrating Islamic culture, art, and
              innovation. By the community, for the community.
            </p>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-accent">
                {category}
              </h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Ahlan Magazine. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-xs text-white/40">
            Made with <Heart size={12} className="text-accent" /> for the Ummah
          </p>
        </div>
      </div>
    </footer>
  );
}
