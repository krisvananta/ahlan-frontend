"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import AuthForm from "@/components/auth/AuthForm";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2 },
  },
};

/**
 * Global Authentication Modal.
 * Includes focus trap, initial focus management, and Escape key handler for full A11Y compliance.
 */
export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthModalOpen) return;

    // Focus first input or button on open
    const timer = setTimeout(() => {
      if (modalRef.current) {
        const firstInput = modalRef.current.querySelector("input");
        if (firstInput) {
          firstInput.focus();
        } else {
          const firstFocusable = modalRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement | null;
          firstFocusable?.focus();
        }
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeAuthModal();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAuthModalOpen, closeAuthModal]);

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeAuthModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="Authentication modal"
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-modal)]"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close Button */}
            <button
              onClick={closeAuthModal}
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-muted transition-colors hover:bg-cream hover:text-heading"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <AuthForm
              initialView="login"
              onSuccess={closeAuthModal}
              showHeader={true}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
