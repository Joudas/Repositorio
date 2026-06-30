import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Esta variable la leerá Tailwind
});

export const metadata: Metadata = {
  title: "MiniLinktree — Comparte tus enlaces",
  description: "Crea tu página personal para compartir todos tus enlaces en un solo lugar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full min-w-full flex flex-col bg-charcola-blue">
        {children}</body>
    </html>
  );
}
