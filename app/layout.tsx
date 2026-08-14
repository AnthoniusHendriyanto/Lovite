import type { Metadata } from "next";
import { EB_Garamond, Manrope, Public_Sans } from "next/font/google";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["400", "500", "600", "700"],
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
});
const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-label",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ByMean — Undangan Digital",
  description: "Buat undangan pernikahan digital yang bermakna.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="light">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body
        className={`${ebGaramond.variable} ${manrope.variable} ${publicSans.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
