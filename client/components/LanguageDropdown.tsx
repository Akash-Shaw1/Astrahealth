"use client";

import { Languages, LanguagesIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Lang = { code: string; label: string; googleCode?: string };

const LANGUAGES: Lang[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी", googleCode: "hi" },
  { code: "bn", label: "বাংলা", googleCode: "bn" },
  { code: "mr", label: "मराठी", googleCode: "mr" },
  { code: "te", label: "తెలుగు", googleCode: "te" },
  { code: "ta", label: "தமிழ்", googleCode: "ta" },
  { code: "gu", label: "ગુજરાતી", googleCode: "gu" },
  { code: "fr", label: "Français", googleCode: "fr" },
  { code: "de", label: "Deutsch", googleCode: "de" },
  { code: "es", label: "Español", googleCode: "es" },
  { code: "zh-CN", label: "中文", googleCode: "zh-cn" },
];

/**
 * Utility helpers for setting & deleting cookies with correct order.
 */
function setCookie(name: string, value: string, opts: { expires?: Date; path?: string; domain?: string; sameSite?: "Lax" | "Strict" | "None" } = {}) {
  let cookie = `${name}=${value}`;
  if (opts.expires) cookie += `; expires=${opts.expires.toUTCString()}`;
  cookie += `; path=${opts.path ?? "/"}`;
  if (opts.domain) cookie += `; domain=${opts.domain}`;
  if (opts.sameSite) cookie += `; SameSite=${opts.sameSite}`;
  document.cookie = cookie;
}

function deleteCookie(name: string, domain?: string) {
  // Clear all possible cookie combinations
  const expired = new Date(0);
  const paths = ["/", window.location.pathname];
  const domains = domain ? [domain, `.${domain}`] : [];
  
  paths.forEach(path => {
    document.cookie = `${name}=; expires=${expired.toUTCString()}; path=${path}`;
    domains.forEach(dom => {
      document.cookie = `${name}=; expires=${expired.toUTCString()}; path=${path}; domain=${dom}`;
    });
  });
}

/**
 * Parses googtrans cookie reliably (returns target language or empty string)
 */
function readGoogTransTarget(): string {
  const found = document.cookie
    .split(";")
    .map((s) => s.trim())
    .find((c) => c.startsWith("googtrans="));
  if (!found) return "";
  try {
    const raw = decodeURIComponent(found.split("=")[1] || "");
    // format expected: "/en/hi" or "/en/zh-cn"
    const parts = raw.split("/");
    const target = parts[2] || "";
    return target.toLowerCase(); // Normalize to lowercase
  } catch {
    return "";
  }
}

export default function LanguageDropdown() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Lang | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  // show current language from cookie on mount
  useEffect(() => {
    const tgt = readGoogTransTarget();
    if (!tgt) {
      setCurrent(LANGUAGES[0]); // Default to English
      return;
    }
    
    const found = LANGUAGES.find((l) => {
      const googleCode = l.googleCode || l.code.toLowerCase();
      return googleCode === tgt || l.code.toLowerCase() === tgt;
    });
    
    setCurrent(found || LANGUAGES[0]);
  }, []);

  // close on outside-click or Escape
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  /**
   * Clear all Google Translate related cookies and elements
   */
  function clearGoogleTranslate() {
    // Clear cookies
    const host = window.location.hostname;
    deleteCookie("googtrans");
    deleteCookie("googtrans", host);
    if (host.includes(".")) {
      deleteCookie("googtrans", `.${host}`);
    }
    
    // Clear any Google Translate UI elements that might interfere
    const gtElements = document.querySelectorAll('.goog-te-banner-frame, .goog-te-menu-frame');
    gtElements.forEach(el => el.remove());
  }

  /**
   * Set googtrans cookie properly. For english ('en') we remove the cookie (revert).
   */
  function setCookieForTranslate(lang: string) {
    const host = window.location.hostname;
    const domain = host.includes(".") ? `.${host}` : undefined;

    if (lang === "en") {
      clearGoogleTranslate();
      return;
    }

    const googleCode = LANGUAGES.find(l => l.code === lang)?.googleCode || lang.toLowerCase();
    const val = `/en/${googleCode}`;
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);

    // Clear existing cookies first
    clearGoogleTranslate();
    
    // Set new cookie
    setCookie("googtrans", encodeURIComponent(val), { 
      expires: date, 
      path: "/", 
      sameSite: "Lax" 
    });

    // Also try domain cookie for production environments
    if (domain) {
      try {
        setCookie("googtrans", encodeURIComponent(val), { 
          expires: date, 
          path: "/", 
          domain, 
          sameSite: "Lax" 
        });
      } catch {
        // ignore possible errors setting domain cookie
      }
    }
  }

  /**
   * Try to apply the translation immediately by manipulating select.goog-te-combo
   */
  function tryApplySelectNow(lang: string): boolean {
    const select = document.querySelector("select.goog-te-combo") as HTMLSelectElement | null;
    if (!select || !select.options || select.options.length === 0) return false;

    const googleCode = LANGUAGES.find(l => l.code === lang)?.googleCode || lang.toLowerCase();
    let targetOption: HTMLOptionElement | null = null;

    // First try exact match
    for (const opt of Array.from(select.options) as HTMLOptionElement[]) {
      if (opt.value.toLowerCase() === googleCode) {
        targetOption = opt;
        break;
      }
    }

    // If no exact match, try partial match
    if (!targetOption) {
      for (const opt of Array.from(select.options) as HTMLOptionElement[]) {
        const val = opt.value.toLowerCase();
        if (val.includes(googleCode) || val.endsWith(`-${googleCode}`)) {
          targetOption = opt;
          break;
        }
      }
    }

    if (!targetOption) return false;

    // Apply the translation
    select.value = targetOption.value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    
    // Trigger additional events that Google Translate might listen to
    const customEvent = new CustomEvent('change', { bubbles: true, cancelable: true });
    select.dispatchEvent(customEvent);
    
    return true;
  }

  /**
   * Primary handler for picking a language with improved reliability
   */
  function handlePick(lang: Lang) {
    if (isApplying) return;
    setIsApplying(true);
    setOpen(false);

    try {
      // Set the cookie first
      setCookieForTranslate(lang.code);
      
      // Update UI immediately
      setCurrent(lang);

      // For English, we're done after clearing cookies
      if (lang.code === "en") {
        setTimeout(() => setIsApplying(false), 500);
        // Small delay then reload to ensure clean state
        setTimeout(() => {
          window.location.reload();
        }, 100);
        return;
      }

      // Try immediate application first
      const applied = tryApplySelectNow(lang.code);
      
      if (applied) {
        // Wait a bit to see if translation takes effect
        setTimeout(() => {
          setIsApplying(false);
        }, 1000);
      } else {
        // Fallback: reload the page
        setTimeout(() => {
          try {
            window.location.reload();
          } catch {
            window.location.href = window.location.href;
          }
        }, 300);
      }

    } catch (error) {
      console.error("Translation error:", error);
      setTimeout(() => setIsApplying(false), 1000);
    }
  }

  return (
    <div ref={boxRef} className="relative" style={{ isolation: 'isolate' }}>
      <button
        onClick={() => !isApplying && setOpen((o) => !o)}
        className={`px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 transition-opacity ${
          isApplying ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={isApplying}
        style={{ 
          fontFamily: 'system-ui, -apple-system, sans-serif',
          isolation: 'isolate'
        }}
      >
        <span aria-hidden="true" className="pr-2"><LanguagesIcon/></span>
        <span style={{ whiteSpace: 'nowrap' }}>
          {isApplying ? "Changing..." : (current ? current.label : "Language")}
        </span>
      </button>

      {open && !isApplying && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border overflow-hidden z-50"
          style={{ 
            fontFamily: 'system-ui, -apple-system, sans-serif',
            isolation: 'isolate'
          }}
        >
          {LANGUAGES.map((lang) => (
            <button
              role="option"
              aria-selected={current?.code === lang.code}
              key={lang.code}
              onClick={() => handlePick(lang)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                current?.code === lang.code ? 'bg-blue-50 text-blue-700' : ''
              }`}
              style={{ 
                whiteSpace: 'nowrap',
                isolation: 'isolate'
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}