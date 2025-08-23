// app/components/GoogleTranslateScript.tsx
"use client";

import Script from "next/script";
import { useEffect } from "react";

export default function GoogleTranslateScript() {
  useEffect(() => {
    // optional: feature detect or log that client component mounted
    // console.debug("GoogleTranslateScript mounted");
  }, []);

  return (
    <Script
      src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      strategy="afterInteractive"
      onError={() => {
        // safe to run here because this component is client-side
        console.warn("Google Translate script failed to load.");
      }}
    />
  );
}
