import type { Metadata } from "next";
import localFont from "next/font/local";
import { Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

/* CSS variables documented in app/globals.css :root */
const montreal = localFont({
  src: "./fonts/montreal.woff2",
  weight: "700",
  style: "normal",
  variable: "--font-montreal",
  display: "swap",
});

const montrealBook = localFont({
  src: "./fonts/montrealbook.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-montreal-book",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Leonard Semmler — Portfolio",
  description: "Portfolio of Leonard Semmler",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montreal.variable} ${montrealBook.variable} ${plusJakarta.variable} ${spaceMono.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
