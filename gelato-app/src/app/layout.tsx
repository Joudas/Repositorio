import type { Metadata } from 'next'
import { Outfit, Inter, Geist } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Punto Glaceal — Heladería & Dulcería',
  description: 'Menú digital de Punto Glaceal. Helados artesanales, milkshakes y más.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={cn("antialiased", outfit.variable, inter.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-dvh bg-[#FEFCF3] text-[#451A03] font-inter">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
