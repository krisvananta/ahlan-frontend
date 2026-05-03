"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  User,
  LogOut,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import type { NavLink } from "@/types";

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "#hero", sectionId: "hero" },
  { label: "E-Magazine", href: "#magazine", sectionId: "magazine" },
  { label: "Blog", href: "#blog", sectionId: "blog" },
  { label: "Merch", href: "#merchandise", sectionId: "merchandise" },
  { label: "About", href: "#about", sectionId: "about" },
];

const SECTION_IDS = NAV_LINKS.map((l) => l.sectionId);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const activeSection = useScrollSpy(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setIsMobileOpen(false);
      }
    },
    [],
  );

  const navbarClass = useMemo(
    () =>
      `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "glass shadow-[var(--shadow-navbar)] border-b border-white/10"
          : "bg-transparent"
      }`,
    [isScrolled],
  );

  return (
    <nav className={navbarClass}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Ahlan Logo"
            width={120}
            height={40}
            className="h-10 w-auto object-contain sm:h-12 mix-blend-multiply"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.sectionId}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                activeSection === link.sectionId
                  ? "text-primary"
                  : isScrolled
                    ? "text-body hover:text-primary"
                    : "text-white/80 hover:text-white"
              }`}
            >
              {link.label}
              {activeSection === link.sectionId && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-accent"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
            </a>
          ))}
        </div>

        {/* Auth & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                  isScrolled 
                    ? "border-cream-dark hover:border-primary/50" 
                    : "border-white/20 hover:border-white/50"
                }`}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {(user?.nickname || user?.name || "U").charAt(0)}
                </div>
                <span
                  className={`hidden sm:inline ${isScrolled ? "text-heading" : "text-white"}`}
                >
                  {user?.nickname || user?.name}
                </span>
                <ChevronDown
                  size={14}
                  className={isScrolled ? "text-body" : "text-white/70"}
                />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl bg-white shadow-[var(--shadow-card)] ring-1 ring-black/5"
                  >
                    <Link
                      href="/library"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-body transition-colors hover:bg-cream"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <BookOpen size={16} />
                      My Library
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-3 text-sm text-error transition-colors hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 sm:px-5 ${
                isScrolled
                  ? "border-primary/60 text-primary hover:border-primary hover:bg-primary hover:text-white"
                  : "border-white/40 text-white hover:border-white hover:bg-white/10"
              }`}
            >
              <User size={16} />
              <span>Login</span>
            </button>
          )}

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={`rounded-lg p-2 transition-colors md:hidden ${
              isScrolled
                ? "text-heading hover:bg-cream"
                : "text-white hover:bg-white/10"
            }`}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-white/10 glass md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.sectionId}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    activeSection === link.sectionId
                      ? "bg-primary/10 text-primary"
                      : "text-body hover:bg-cream-dark"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
