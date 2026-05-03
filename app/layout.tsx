import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Funnel_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/ui/AuthModal";
import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "sonner";

const funnel = Funnel_Display({
  subsets: ["latin"],
  variable: "--font-funnel",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ahlan — Digital Islamic Magazine",
  description:
    "A premium digital magazine celebrating Islamic culture, art, and contemporary thought. By the community, for the community.",
  keywords: [
    "Islamic magazine",
    "Muslim culture",
    "digital magazine",
    "Islamic art",
    "Ahlan",
  ],
  openGraph: {
    title: "Ahlan — Where Culture Meets Creativity",
    description:
      "Your digital gateway to Islamic art, culture, and contemporary thought.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${funnel.variable} ${jakarta.variable} antialiased`}
    >
      <body className="min-h-screen">
        <QueryProvider>
          <AuthProvider>
            <Toaster position="top-right" richColors />
            <Navbar />
            <main>{children}</main>
            <Footer />
            <AuthModal />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
