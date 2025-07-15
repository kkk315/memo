import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import Breadcrumb from "./components/Breadcrumb";
import { siteConfig } from "../lib/site-config";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${siteConfig.title} | 個人開発者の技術ブログ`,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <header className="site-header">
          <div className="header-inner">
            <Link href="/" className="site-title">
              {siteConfig.title}
            </Link>
          </div>
        </header>
        
        <div className="site-container">
          <Breadcrumb />
          {children}
        </div>
        
        <footer className="site-footer">
          <div className="footer-inner">
            <p>{siteConfig.footer.copyright(2025)}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
