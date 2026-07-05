"use client";

import React, { JSX } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header(): JSX.Element {
  const router = useRouter();
  return (
    <>
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-[9999] flex items-center justify-between p-6 bg-transparent">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Astra Health Logo"
            width={50}
            height={50}
            className="w-15 h-15 sm:w-13 sm:h-13 flex-shrink-0"
          />
        </div>

        {/* Navigation */}
        <div className="flex">
          <nav className="flex items-center space-x-2 pr-7">
            <a
              href="/consultations"
              className="text-black/80 hover:text-black text-xs font-light px-3 py-2 rounded-full hover:bg-black/10 transition-all duration-200"
            >
              Consultations
            </a>
            <a
              href="/medicine"
              className="text-black/80 hover:text-black text-xs font-light px-3 py-2 rounded-full hover:bg-black/10 transition-all duration-200"
            >
              Medicines
            </a>
            <a
              href="/health-bot"
              className="text-black/80 hover:text-black text-xs font-light px-3 py-2 rounded-full hover:bg-black/10 transition-all duration-200"
            >
              Health Bot
            </a>
          </nav>

          {/* Login group */}
          <div
            id="gooey-btn"
            className="relative flex items-center group"
            style={{ filter: "url(#gooey-filter)" }}
          >
            {/* Gooey Hover Button */}
            <button className="absolute right-0 px-2.5 py-2 rounded-full bg-white text-blue-500 border border-blue-500 font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center justify-center -translate-x-10 group-hover:-translate-x-19 z-0">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 17L17 7M17 7H7M17 7V17"
                />
              </svg>
            </button>

            {/* Main Button */}
            <button className="px-6 py-2 rounded-full font-normal text-xs transition-all duration-300 cursor-pointer h-8 flex items-center z-10 bg-white text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white hover:border-blue-500" onClick={()=>router.push("/sign-in")}>
              Login
            </button>
          </div>
        </div>
      </header>

      {/* GitHub button fixed above Spline watermark */}
      <a
        href="https://github.com/Akash-Shaw1/Astrahealth" // 🔗 Replace with your repo link
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-4 z-[9999] px-12 py-3  rounded-full bg-black text-white text-xs font-medium flex items-center shadow-md hover:bg-gray-800 transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 mr-2"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M12 .297a12 12 0 00-3.797 23.406c.6.113.82-.26.82-.578v-2.17c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.082-.729.082-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.606-2.665-.304-5.466-1.332-5.466-5.932 0-1.31.469-2.382 1.235-3.222-.124-.304-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.48 11.48 0 016.003 0c2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.872.118 3.176.768.84 1.234 1.912 1.234 3.222 0 4.61-2.804 5.625-5.475 5.922.43.37.814 1.096.814 2.21v3.277c0 .32.218.694.825.576A12 12 0 0012 .297z"
            clipRule="evenodd"
          />
        </svg>
        GitHub
      </a>
    </>
  );
}
