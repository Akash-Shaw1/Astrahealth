import type React from "react";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Instrument_Serif } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Script from "next/script";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Healthcare Dashboard",
  description: "Modern healthcare dashboard with glassmorphic design",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <style
            dangerouslySetInnerHTML={{
              __html: `
      html {
        font-family: ${figtree.style.fontFamily};
        --font-sans: ${figtree.variable};
        --font-mono: ${GeistMono.variable};
        --font-instrument-serif: ${instrumentSerif.variable};
      }

      /* Prevent Google Translate bar shifting */
      .skiptranslate { display: none !important; }
      body { top: 0 !important; }
      #google_translate_element { display: none !important; }
    `,
            }}
          />
          <Script
            id="gt-init"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              window.googleTranslateElementInit = function () {
                var containerId = 'google_translate_element';
                var el = document.getElementById(containerId);
                if (!el) {
                  el = document.createElement('div');
                  el.id = containerId;
                  el.style.display = 'none';
                  document.body.appendChild(el);
                }
                new google.translate.TranslateElement(
                  {
                    pageLanguage: 'en',
                    includedLanguages: 'en,hi,fr,de,es,zh-CN',
                    autoDisplay: false
                  },
                  containerId
                );
              };
            `,
            }}
          />
        </head>
        <body className={`${figtree.variable} ${instrumentSerif.variable}`}>
          <div id="google_translate_element" style={{ display: "none" }} />
          {children}
          <Script
            id="gt-script"
            src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
            strategy="afterInteractive"
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
