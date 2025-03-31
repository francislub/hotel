"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { status } = useSession()

  const isDashboard = pathname.includes("/dashboard")
  const isLoggedIn = status === "authenticated"

  // Hide header and footer when in dashboard or when logged in
  const showHeaderFooter = !(isDashboard || isLoggedIn)

  return (
    <div className="flex min-h-screen flex-col">
      {showHeaderFooter && <Header />}
      <main className="flex-1">{children}</main>
      {showHeaderFooter && <Footer />}
    </div>
  )
}

