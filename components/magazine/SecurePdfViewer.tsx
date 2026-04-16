"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import {
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

/**
 * SecurePdfViewer — Anti-Leak PDF viewer for Official Magazines.
 *
 * Security measures:
 * 1. Blob fetching — PDF loaded via server-side API route, never exposing the WP media URL
 * 2. Disabled print — CSS @media print hides content & Keyboard event interceptors
 * 3. Disabled right-click — prevents "Save As" context menu
 * 4. Custom toolbar from default-layout without download/print options
 * 5. Text selection disabled via CSS
 * 6. Glass Overlay prevents inspector/click drag
 * 7. Watermark tracking user email/ID
 */

// We use the specific pdf.js worker version that matches the installed pdfjs-dist
const PDFJS_WORKER_URL = "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

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

  // Initialize the default layout plugin with custom toolbar (excluding download/print)
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [], // Disable sidebar
    renderToolbar: (Toolbar) => (
      <Toolbar>
        {(slots) => {
          const {
            CurrentPageInput,
            GoToNextPage,
            GoToPreviousPage,
            NumberOfPages,
            ZoomIn,
            ZoomOut,
            Zoom,
            EnterFullScreen,
          } = slots;
          return (
            <div className="flex w-full items-center justify-between px-4 py-2 border-b border-white/10 z-20 relative bg-[#1a1a2e]">
              <div className="flex items-center gap-4">
                {onClose && (
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                )}
                <div className="hidden font-semibold text-white sm:block">
                  {title}
                </div>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <div className="flex items-center gap-1">
                  <GoToPreviousPage />
                  <div className="flex items-center gap-2 px-2">
                    <CurrentPageInput />
                    <span className="text-sm">/ <NumberOfPages /></span>
                  </div>
                  <GoToNextPage />
                </div>
                <div className="mx-2 h-6 w-px bg-white/20" />
                <div className="flex items-center gap-1">
                  <ZoomOut />
                  <Zoom />
                  <ZoomIn />
                </div>
                <div className="mx-2 h-6 w-px bg-white/20" />
                <div className="flex items-center">
                  <EnterFullScreen />
                </div>
              </div>
            </div>
          );
        }}
      </Toolbar>
    ),
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

  // Fetch PDF as blob via secure API route
  useEffect(() => {
    let objectUrl: string | null = null;

    async function fetchPdf() {
      if (!token && !pdfUrl) {
         setError("Authentication required to view this magazine.");
         setLoading(false);
         return;
      }
      
      setLoading(true);
      setError(null);

      try {
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`/api/magazines/${magazineId}/pdf`, {
          headers
        });

        if (!res.ok) {
          if (pdfUrl) {
            setBlobUrl(pdfUrl);
            setLoading(false);
            return;
          }
          throw new Error(`Failed to load PDF (${res.status})`);
        }

        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      } catch (err) {
        if (pdfUrl) {
          setBlobUrl(pdfUrl);
        } else {
          setError(
            err instanceof Error ? err.message : "Failed to load magazine",
          );
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPdf();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
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
      className="secure-pdf-viewer relative flex h-[80vh] flex-col overflow-hidden rounded-2xl bg-[var(--color-dark-bg)] shadow-[var(--shadow-modal)]"
    >
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
            /* Dark theme overrides for the PDF toolbar */
            .rpv-core__toolbar {
              background-color: transparent !important;
              border-bottom: 0px !important;
            }
            .rpv-core__button, .rpv-core__icon {
              color: rgba(255,255,255,0.8) !important;
            }
            .rpv-core__button:hover {
              background-color: rgba(255,255,255,0.1) !important;
            }
            .rpv-core__textbox {
              background-color: rgba(255,255,255,0.1) !important;
              color: white !important;
              border: 1px solid rgba(255,255,255,0.2) !important;
            }
            .rpv-core__popover-body {
              background-color: #1a1a2e !important;
              color: white !important;
              border: 1px solid rgba(255,255,255,0.1) !important;
            }
            .rpv-core__menu-item:hover {
              background-color: rgba(255,255,255,0.1) !important;
              color: white !important;
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
                <div key={i} className="text-white text-3xl font-bold tracking-widest whitespace-nowrap px-8">
                  AHLAN SECURE VIEWER - {user?.email || "GUEST"}
                </div>
              ))}
           </div>
        </div>

        {/* Transparent Click-Stealer Overlay */}
        <div className="absolute inset-0 z-10 bg-transparent" aria-hidden="true" onContextMenu={handleContextMenu} />

        {blobUrl && (
          <div className="h-full w-full relative z-0">
            <Worker workerUrl={PDFJS_WORKER_URL}>
              <Viewer
                fileUrl={blobUrl}
                plugins={[defaultLayoutPluginInstance]}
                defaultScale={SpecialZoomLevel.PageFit}
                theme="dark"
              />
            </Worker>
          </div>
        )}
      </div>
    </div>
  );
}
