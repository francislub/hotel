"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Bell,
  Calendar,
  CreditCard,
  Home,
  Hotel,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  User,
  Users,
  Activity,
  FileText,
  DollarSign,
  BarChart,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login")
    }
  }, [status])

  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!session) {
    return null
  }

  const userRole = session.user.role

  // Define navigation items based on user role
  const navigationItems = (() => {
    switch (userRole) {
      case "ADMIN":
        return [
          { name: "Dashboard", href: "/dashboard/admin", icon: Home },
          { name: "Bookings", href: "/dashboard/admin/bookings", icon: Calendar },
          { name: "Rooms", href: "/dashboard/admin/rooms", icon: Hotel },
          { name: "Services", href: "/dashboard/admin/services", icon: CreditCard },
          { name: "Staff", href: "/dashboard/admin/staff", icon: Users },
          { name: "Messages", href: "/dashboard/admin/messages", icon: MessageSquare },
          { name: "Activities", href: "/dashboard/admin/activities", icon: Activity },
          { name: "Reports", href: "/dashboard/admin/reports", icon: BarChart },
          { name: "Finance", href: "/dashboard/admin/finance", icon: DollarSign },
          { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
        ]
      case "GUEST":
        return [
          { name: "Dashboard", href: "/dashboard/guest", icon: Home },
          { name: "Book a Room", href: "/dashboard/guest/book", icon: Hotel },
          { name: "My Bookings", href: "/dashboard/guest/bookings", icon: Calendar },
          { name: "Activities", href: "/dashboard/guest/activities", icon: Activity },
          { name: "Messages", href: "/dashboard/guest/messages", icon: MessageSquare },
          { name: "Profile", href: "/dashboard/guest/profile", icon: User },
          { name: "Preferences", href: "/dashboard/guest/preferences", icon: Settings },
        ]
      case "ACCOUNTANT":
        return [
          { name: "Dashboard", href: "/dashboard/accountant", icon: Home },
          { name: "Transactions", href: "/dashboard/accountant/transactions", icon: CreditCard },
          { name: "Reports", href: "/dashboard/accountant/reports", icon: FileText },
          { name: "Expenses", href: "/dashboard/accountant/expenses", icon: DollarSign },
        ]
      default:
        return []
    }
  })()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex flex-col space-y-6 py-4">
                  <div className="px-4">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                      <Hotel className="h-6 w-6" />
                      <span>Crown Hotel</span>
                    </Link>
                  </div>
                  <nav className="flex flex-col space-y-1 px-2">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                          pathname === item.href
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted hover:text-foreground"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden lg:flex">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Hotel className="h-6 w-6" />
              <span>Crown Hotel</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                    <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${userRole.toLowerCase()}/profile`}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${userRole.toLowerCase()}/settings`}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/api/auth/signout">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <div className="hidden border-r bg-muted/40 lg:block lg:w-64">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-2 text-sm font-medium">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 ${
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

