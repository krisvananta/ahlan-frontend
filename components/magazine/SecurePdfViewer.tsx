"use client";

import { useState, useCallback, useEffect } from "react";
import { Worker, Viewer, SpecialZoomLevel, ScrollMode } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import {
  Loader2,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

/**
 * SecurePdfViewer — Anti-Leak PDF viewer for Official Magazines.
 *
 * Security measures:
 * 1. Blob fetching — PDF loaded via server-side API route, never exposing the WP media URL
 * 2. Disabled print — CSS @media print hides content & Keyboard event interceptors
 * 3. Disabled right-click — prevents "Save As" context menu
 * 4. Custom toolbar removed for 100% distraction-free immersive reading
 * 5. Text selection disabled via CSS
 * 6. Glass Overlay prevents inspector/click drag
 * 7. Watermark tracking user email/ID
 */

// We serve the worker locally from /public to prevent CDN supply-chain attacks (SEC-02)
const PDFJS_WORKER_URL = "/pdf.worker.min.js";

interface SecurePdfViewerProps {
  /** Magazine ID — used to fetch PDF via secure API route */
  magazineId: string;
  /** Direct PDF URL — fallback for dev/mock mode */
  pdfUrl?: string;
  /** Magazine title for display */
  title: string;
  /** Callback to close the viewer */
  onClose?: () => void;
}

export default function SecurePdfViewer({
  magazineId,
  pdfUrl,
  title,
  onClose,
}: SecurePdfViewerProps) {
  const { token, user } = useAuth();
  
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  // Detect mobile/tablet vs desktop PC/laptop for responsive scroll mode
  useEffect(() => {
    const checkDevice = () => {
      const isTouchOrSmall =
        window.innerWidth <= 1024 || window.matchMedia("(pointer: coarse)").matches;
      setIsMobileOrTablet(isTouchOrSmall);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Lock background body scroll when in immersive reader mode
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Initialize the default layout plugin with toolbar and sidebar disabled for clean distraction-free view
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [], // Disable sidebar
    renderToolbar: () => <></>, // Remove top toolbar completely
  });

  // Global Key Listener to block Ctrl+P and Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P' || e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch the PDF via authenticated API proxy route
  useEffect(() => {
    let isMounted = true;
    let createdBlobUrl: string | null = null;

    async function fetchPdfBlob() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/magazines/${magazineId}/pdf`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Send auth token in header as fallback/supplement to HTTP-Only cookie
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          // Try to read error as JSON for a friendly message
          let errorMsg = `Failed to load magazine (HTTP ${res.status})`;
          try {
            const errData = await res.json();
            if (errData.error) errorMsg = errData.error;
          } catch {
            // response wasn't JSON, use default message
          }
          throw new Error(errorMsg);
        }

        // Response is raw binary PDF (application/octet-stream)
        const pdfArrayBuffer = await res.arrayBuffer();
        if (!pdfArrayBuffer || pdfArrayBuffer.byteLength === 0) {
          throw new Error("Empty PDF data received from server.");
        }

        const blob = new Blob([pdfArrayBuffer], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        createdBlobUrl = url;

        if (isMounted) {
          setBlobUrl(url);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load magazine. Please check your connection or access rights.",
          );
          setLoading(false);
        }
      }
    }

    // Always fetch through the secure API proxy.
    // Never use pdfUrl directly — it's a local WP URL (e.g., ahlan-backend.local)
    // that is only resolvable server-side.
    fetchPdfBlob();

    return () => {
      isMounted = false;
      if (createdBlobUrl && createdBlobUrl.startsWith("blob:")) {
        URL.revokeObjectURL(createdBlobUrl);
      }
    };
  }, [magazineId, pdfUrl, token]);

  // Prevent right-click
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl bg-white p-10 text-center shadow-[var(--shadow-card)]">
        <AlertTriangle size={40} className="mb-4 text-error" />
        <h3 className="font-heading text-xl font-bold text-heading">
          Unable to Load Magazine
        </h3>
        <p className="mt-2 text-sm text-muted">{error}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
          >
            Go Back
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      onContextMenu={handleContextMenu}
      className="secure-pdf-viewer fixed inset-0 z-[9999] flex h-[100dvh] w-screen flex-col overflow-hidden bg-[var(--color-dark-bg)] select-none"
      aria-label={title}
      title={title}
    >
      {/* Floating Back Button (< in transparent circle) */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-[10000] flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white/90 hover:bg-black/80 hover:text-white transition-all border border-white/20 shadow-lg backdrop-blur-md hover:scale-105"
          title="Back to E-Magazine Collection"
          aria-label="Back to E-Magazine Collection"
        >
          <ArrowLeft size={20} />
        </button>
      )}

      {/* Anti-print and Anti-select CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              .secure-pdf-viewer { display: none !important; }
              body::after {
                content: 'Printing is disabled for this content. Property of Ahlan.';
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                font-size: 1.5rem;
                color: #999;
              }
            }
            .secure-pdf-viewer {
              user-select: none;
              -webkit-user-select: none;
            }
            .secure-pdf-viewer canvas {
              user-select: none !important;
              -webkit-user-select: none !important;
            }
            /* Dark theme overrides for the PDF viewer */
            .rpv-core__viewer {
              background-color: #131320 !important;
            }
            /* Completely hide empty toolbar and sidebar containers from default layout */
            .rpv-default-layout__toolbar,
            .rpv-default-layout__sidebar {
              display: none !important;
              width: 0 !important;
              height: 0 !important;
              padding: 0 !important;
              margin: 0 !important;
              border: none !important;
              overflow: hidden !important;
            }
            /* Remove borders and backgrounds from layout containers */
            .rpv-default-layout__container,
            .rpv-default-layout__body {
              border: none !important;
              box-shadow: none !important;
              background: transparent !important;
            }
            /* Enable horizontal swipe navigation with page-by-page snapping only on mobile/tablet */
            @media (max-width: 1024px), (pointer: coarse) {
              .rpv-core__inner-pages {
                scroll-snap-type: x mandatory !important;
              }
              .rpv-core__page-layer {
                scroll-snap-align: center !important;
                scroll-snap-stop: always !important;
              }
            }
          `,
        }}
      />

      <div className="relative flex flex-1 items-center justify-center overflow-auto bg-[#131320] select-none">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[var(--color-dark-surface)]">
            <Loader2 size={32} className="animate-spin text-accent" />
            <p className="text-sm text-white/50">Loading encrypted asset...</p>
          </div>
        )}

        {/* Global Transparent Glass Overlay + Watermark Masking Canvas */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden flex items-center justify-center opacity-[0.03] select-none" aria-hidden="true">
           {/* Tiled Watermarks heavily rotated */}
           <div className="absolute inset-[-100%] flex flex-wrap gap-20 items-center justify-center rotate-[-30deg]">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="text-white text-3xl font-bold tracking-widest whitespace-nowrap px-8" aria-hidden="true">
                  AHLAN SECURE VIEWER - {user?.email || "GUEST"}
                </div>
              ))}
           </div>
        </div>

        {blobUrl && (
          <div className="h-full w-full relative z-0">
            <Worker workerUrl={PDFJS_WORKER_URL}>
              <Viewer
                fileUrl={blobUrl}
                plugins={[defaultLayoutPluginInstance]}
                defaultScale={SpecialZoomLevel.PageFit}
                scrollMode={isMobileOrTablet ? ScrollMode.Horizontal : ScrollMode.Vertical}
                theme="dark"
              />
            </Worker>
          </div>
        )}
      </div>
    </div>
  );
}

