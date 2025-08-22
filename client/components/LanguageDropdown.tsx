"use client";

import { useEffect, useRef, useState } from "react";

type Lang = { code: string; label: string };

const LANGUAGES: Lang[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "mr", label: "मराठी" },
  { code: "te", label: "తెలుగు" },
  { code: "ta", label: "தமிழ்" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "zh-CN", label: "中文" },
];

export default function LanguageDropdown() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Lang | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);

  // Read cookie on mount to show the current language (if any)
  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((c) => c.startsWith("googtrans="));
    if (cookie) {
      const val = decodeURIComponent(cookie.split("=")[1]); // e.g. "/en/hi"
      const parts = val.split("/");
      const target = parts[2]; // "hi"
      const found = LANGUAGES.find((l) => l.code === target);
      if (found) setCurrent(found);
    }
  }, []);

  // Close on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node))
        setOpen(false);
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

  function setCookieForTranslate(lang: string) {
    const val = `/en/${lang}`;
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    const expires = `; expires=${date.toUTCString()}`;
    // Always set path=/
    document.cookie = `googtrans=${encodeURIComponent(val)}; path=/${expires}`;
    // Also try a domain cookie (skips localhost)
    const host = window.location.hostname;
    if (host.includes(".")) {
      document.cookie = `googtrans=${encodeURIComponent(
        val
      )}; domain=.${host}; path=/${expires}`;
    }
  }

  function applyLanguage(lang: string) {
    const applyOnce = () => {
      const selectField = document.querySelector(
        "select.goog-te-combo"
      ) as HTMLSelectElement | null;
      if (selectField) {
        selectField.value = lang;
        // Dispatch the change event so Google Translate actually runs
        selectField.dispatchEvent(new Event("change"));
        return true;
      }
      return false;
    };

    // Try immediately
    if (applyOnce()) return;

    // If the select isn't there yet, observe the DOM briefly and retry
    const observer = new MutationObserver(() => {
      if (applyOnce()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    // Safety timeout to avoid leaking the observer
    setTimeout(() => observer.disconnect(), 10000);
  }

  function handlePick(lang: Lang) {
    setCookieForTranslate(lang.code);
    applyLanguage(lang.code);
    setCurrent(lang);
    setOpen(false);
  }

  return (
    <div ref={boxRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>🌐</span>
        <span>{current ? current.label : "Language"}</span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border overflow-hidden z-50"
        >
          {LANGUAGES.map((lang) => (
            <button
              role="option"
              aria-selected={current?.code === lang.code}
              key={lang.code}
              onClick={() => handlePick(lang)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
