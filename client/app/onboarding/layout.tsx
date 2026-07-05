import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AstraHealth — Onboarding",
  description: "Set up your AstraHealth patient portal profile",
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
