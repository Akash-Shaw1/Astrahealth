"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Calendar,
  Bell,
  Home,
  Grid3X3,
  BarChart3,
  Users,
  Settings,
  ArrowUpRight,
  Filter,
  Flame,
  BookOpen,
  Video,
  Pill,
  MessageCircle,
  Menu,
  X,
  Activity,
  Hospital,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";

const navigationItems = [
  { icon: Home, href: "/dashboard", label: "Dashboard", category: "main" },
  {
    icon: Flame,
    href: "/health-streak",
    label: "Health Streak",
    category: "health",
  },
  {
    icon: BookOpen,
    href: "/education",
    label: "Education Hub",
    category: "health",
  },
  {
    icon: Video,
    href: "/consultations",
    label: "E-Consultations",
    category: "health",
  },
  {
    icon: Hospital,
    href: "/hospitals",
    label: "Hospitals",
    category: "health",
  },
  {
    icon: Pill,
    href: "/medicine",
    label: "Medicine Finder",
    category: "health",
  },
  {
    icon: MessageCircle,
    href: "/chat",
    label: "AI Health Assistant",
    category: "health",
  },
  {
    icon: Grid3X3,
    href: "/patients",
    label: "Patients",
    category: "management",
  },
  {
    icon: BarChart3,
    href: "/records",
    label: "Records",
    category: "management",
  },
  {
    icon: Users,
    href: "/appointments",
    label: "Appointments",
    category: "management",
  },
  {
    icon: Activity,
    href: "/health-campaigns",
    label: "Health Campaign Tracker",
    category: "management",
  },
  {
    icon: MessageCircle,
    href: "/feedback-referrals",
    label: "Feedback & Referrals",
    category: "management",
  },
  { icon: Settings, href: "/settings", label: "Settings", category: "system" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <header
        className={cn(
          "bg-white/90 backdrop-blur-md border-b border-slate-200/50 px-4 sm:px-6 py-3 fixed top-0 z-40 shadow-sm transition-all duration-300",
          sidebarExpanded ? "left-64" : "left-16",
          "right-0",
          "md:left-16",
          sidebarExpanded && "md:left-64"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <Image
              src="/logo.svg"
              alt="Astra Health Logo"
              width={50}
              height={50}
              className="w-15 h-15 sm:w-13 sm:h-13 flex-shrink-0"
            />
            <div className="hidden sm:flex flex-col justify-center">
              <h1 className="text-lg sm:text-xl font-bold text-slate-800">
                ASTRA HEALTH
              </h1>
              <p className="text-xs text-slate-500">Healthcare Management</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative hidden lg:block">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search appointments, records..."
                className="pl-12 pr-24 w-80 xl:w-96 bg-slate-50/80 border-slate-200/50 focus:bg-white focus:border-blue-300 transition-all duration-200"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 sm:gap-3 rounded-xl bg-white/80 ring-1 ring-slate-200/50 px-2 sm:px-4 h-10 sm:h-12 hover:bg-white hover:ring-slate-300/50 transition-all duration-200 shadow-sm">
                  <img
                    src="/human-placeholder.png"
                    className="h-6 w-6 sm:h-8 sm:w-8 rounded-full object-cover ring-2 ring-white"
                    alt="Emma Hayes"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="text-sm font-semibold text-slate-800">
                      Anirban Mukherjee
                    </div>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    className="text-slate-400 hidden sm:block"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white/95 backdrop-blur-md border-slate-200/50"
              >
                <DropdownMenuItem className="hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    Profile Settings
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-slate-50">
                  <Link href="/settings" className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                      <Settings className="w-4 h-4 text-slate-600" />
                    </div>
                    Preferences
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-red-50 text-red-600">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4 text-red-600" />
                    </div>
                    Sign Out
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="h-10 sm:h-12 px-3 sm:px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl">
              <MessageCircle className="w-4 h-4 mr-1 sm:mr-2" />
              <Link href="/health-bot" className="flex items-center">
                <span className="hidden sm:inline">Need Help?</span>
                <span className="sm:hidden">Help</span>
                <ArrowUpRight className="w-4 h-4 ml-1 sm:ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "bg-white/80 backdrop-blur-md border-r border-slate-200/50 flex flex-col transition-all duration-300 shadow-sm",
          "fixed left-0 top-0 h-screen z-50",
          sidebarExpanded ? "w-64" : "w-16",
          mobileSidebarOpen ? "flex w-64" : "hidden md:flex"
        )}
      >
        <div className="p-4 border-b border-slate-200/30">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSidebarExpanded(!sidebarExpanded);
              if (window.innerWidth < 768) {
                setMobileSidebarOpen(false);
              }
            }}
            className="w-full hover:bg-slate-100 transition-colors"
          >
            {sidebarExpanded || mobileSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        <nav className="flex-1 px-2 pb-4 overflow-y-auto">
          <div className="space-y-1">
            {(sidebarExpanded || mobileSidebarOpen) && (
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Main
                </h3>
              </div>
            )}
            {navigationItems
              .filter((item) => item.category === "main")
              .map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start transition-all duration-200 hover:bg-slate-100",
                        sidebarExpanded || mobileSidebarOpen
                          ? "px-3 py-2 h-10"
                          : "px-0 py-2 h-10 justify-center",
                        isActive
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                          : "text-slate-600 hover:text-slate-900"
                      )}
                      title={
                        !sidebarExpanded && !mobileSidebarOpen
                          ? item.label
                          : undefined
                      }
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5",
                          sidebarExpanded || mobileSidebarOpen ? "mr-3" : ""
                        )}
                      />
                      {(sidebarExpanded || mobileSidebarOpen) && (
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      )}
                    </Button>
                  </Link>
                );
              })}
          </div>

          <div className="space-y-1 mt-6">
            {(sidebarExpanded || mobileSidebarOpen) && (
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Health Services
                </h3>
              </div>
            )}
            {navigationItems
              .filter((item) => item.category === "health")
              .map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start transition-all duration-200 hover:bg-slate-100",
                        sidebarExpanded || mobileSidebarOpen
                          ? "px-3 py-2 h-10"
                          : "px-0 py-2 h-10 justify-center",
                        isActive
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                          : "text-slate-600 hover:text-slate-900"
                      )}
                      title={
                        !sidebarExpanded && !mobileSidebarOpen
                          ? item.label
                          : undefined
                      }
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5",
                          sidebarExpanded || mobileSidebarOpen ? "mr-3" : ""
                        )}
                      />
                      {(sidebarExpanded || mobileSidebarOpen) && (
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      )}
                    </Button>
                  </Link>
                );
              })}
          </div>

          <div className="space-y-1 mt-6">
            {(sidebarExpanded || mobileSidebarOpen) && (
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Management
                </h3>
              </div>
            )}
            {navigationItems
              .filter((item) => item.category === "management")
              .map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start transition-all duration-200 hover:bg-slate-100",
                        sidebarExpanded || mobileSidebarOpen
                          ? "px-3 py-2 h-10"
                          : "px-0 py-2 h-10 justify-center",
                        isActive
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                          : "text-slate-600 hover:text-slate-900"
                      )}
                      title={
                        !sidebarExpanded && !mobileSidebarOpen
                          ? item.label
                          : undefined
                      }
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5",
                          sidebarExpanded || mobileSidebarOpen ? "mr-3" : ""
                        )}
                      />
                      {(sidebarExpanded || mobileSidebarOpen) && (
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      )}
                    </Button>
                  </Link>
                );
              })}
          </div>

          <div className="space-y-1 mt-6">
            {(sidebarExpanded || mobileSidebarOpen) && (
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  System
                </h3>
              </div>
            )}
            {navigationItems
              .filter((item) => item.category === "system")
              .map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start transition-all duration-200 hover:bg-slate-100",
                        sidebarExpanded || mobileSidebarOpen
                          ? "px-3 py-2 h-10"
                          : "px-0 py-2 h-10 justify-center",
                        isActive
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                          : "text-slate-600 hover:text-slate-900"
                      )}
                      title={
                        !sidebarExpanded && !mobileSidebarOpen
                          ? item.label
                          : undefined
                      }
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5",
                          sidebarExpanded || mobileSidebarOpen ? "mr-3" : ""
                        )}
                      />
                      {(sidebarExpanded || mobileSidebarOpen) && (
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      )}
                    </Button>
                  </Link>
                );
              })}
          </div>
        </nav>
      </aside>

      <main
        className={cn(
          "min-h-screen overflow-x-hidden transition-all duration-300",
          "pt-20", // Top padding for fixed header
          sidebarExpanded ? "ml-64" : "ml-16", // Left margin for fixed sidebar
          "md:ml-16", // Reset for mobile, then apply desktop margins
          sidebarExpanded && "md:ml-64"
        )}
      >
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}
