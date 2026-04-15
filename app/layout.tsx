import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/ui/AuthModal";
import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
      className={`${playfair.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-screen">
        <QueryProvider>
          <AuthProvider>
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
