import type React from "react"
import type { Metadata } from "next"
import { GeistMono } from "geist/font/mono"
import { Figtree } from "next/font/google"
import "./globals.css"

export const metadata: Metadata = {
  title: "Healthcare Dashboard",
  description: "Modern healthcare dashboard with glassmorphic design",
  generator: "v0.app",
}

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${figtree.style.fontFamily};
  --font-sans: ${figtree.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
