import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "TENEXIM | Global Trade Intelligence",
  description: "The definitive source for global import-export intelligence. Empowering supply chains with precision data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} antialiased`}>
      <body className="font-sans text-slate-600 bg-slate-50 dark:bg-slate-950 dark:text-slate-300 selection:bg-amber-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
