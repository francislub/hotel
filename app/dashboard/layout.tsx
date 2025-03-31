"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
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
  Crown,
  Menu,
  X,
  Home,
  Hotel,
  Users,
  Calendar,
  Settings,
  CreditCard,
  BarChart3,
  LogOut,
  User,
  Bell,
  ChevronDown,
  Utensils,
  MessageSquare,
  FileText,
  HelpCircle,
  ClipboardList,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useSession, signOut } from "next-auth/react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userType, setUserType] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>("User")

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      setUserType(session.user.role.toLowerCase())
      setUserName(session.user.name || "User")
    } else if (pathname) {
      // Fallback to pathname-based detection
      if (pathname.includes("/admin")) {
        setUserType("admin")
        setUserName("Admin User")
      } else if (pathname.includes("/guest")) {
        setUserType("guest")
        setUserName("Guest User")
      } else if (pathname.includes("/accountant")) {
        setUserType("accountant")
        setUserName("Accountant User")
      } else if (pathname.includes("/staff")) {
        setUserType("staff")
        setUserName("Staff User")
      }
    }
  }, [session, pathname])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push("/")
  }

  // Define navigation items based on user type
  const getNavItems = () => {
    switch (userType) {
      case "admin":
        return [
          { name: "Dashboard", href: "/dashboard/admin", icon: Home },
          { name: "Rooms", href: "/dashboard/admin/rooms", icon: Hotel },
          { name: "Bookings", href: "/dashboard/admin/bookings", icon: Calendar },
          { name: "Guests", href: "/dashboard/admin/guests", icon: Users },
          { name: "Staff", href: "/dashboard/admin/staff", icon: Users },
          { name: "Services", href: "/dashboard/admin/services", icon: Utensils },
          { name: "Finance", href: "/dashboard/admin/finance", icon: CreditCard },
          { name: "Reports", href: "/dashboard/admin/reports", icon: BarChart3 },
          { name: "Messages", href: "/dashboard/admin/messages", icon: MessageSquare },
          { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
        ]
      case "guest":
        return [
          { name: "Dashboard", href: "/dashboard/guest", icon: Home },
          { name: "My Bookings", href: "/dashboard/guest/bookings", icon: Calendar },
          { name: "Book a Room", href: "/dashboard/guest/book", icon: Hotel },
          { name: "Services", href: "/dashboard/guest/services", icon: Utensils },
          { name: "Dining", href: "/dashboard/guest/dining", icon: Utensils },
          { name: "Spa & Wellness", href: "/dashboard/guest/spa", icon: Utensils },
          { name: "Activities", href: "/dashboard/guest/activities", icon: Calendar },
          { name: "Support", href: "/dashboard/guest/support", icon: HelpCircle },
          { name: "Profile", href: "/dashboard/guest/profile", icon: User },
        ]
      case "accountant":
        return [
          { name: "Dashboard", href: "/dashboard/accountant", icon: Home },
          { name: "Transactions", href: "/dashboard/accountant/transactions", icon: CreditCard },
          { name: "Invoices", href: "/dashboard/accountant/invoices", icon: FileText },
          { name: "Reports", href: "/dashboard/accountant/reports", icon: BarChart3 },
          { name: "Revenue", href: "/dashboard/accountant/revenue", icon: BarChart3 },
          { name: "Expenses", href: "/dashboard/accountant/expenses", icon: CreditCard },
          { name: "Payroll", href: "/dashboard/accountant/payroll", icon: Users },
          { name: "Budgeting", href: "/dashboard/accountant/budgeting", icon: ClipboardList },
          { name: "Settings", href: "/dashboard/accountant/settings", icon: Settings },
        ]
      case "staff":
        return [
          { name: "Dashboard", href: "/dashboard/staff", icon: Home },
          { name: "Tasks", href: "/dashboard/staff/tasks", icon: ClipboardList },
          { name: "Schedule", href: "/dashboard/staff/schedule", icon: Calendar },
          { name: "Guests", href: "/dashboard/staff/guests", icon: Users },
          { name: "Rooms", href: "/dashboard/staff/rooms", icon: Hotel },
          { name: "Messages", href: "/dashboard/staff/messages", icon: MessageSquare },
          { name: "Profile", href: "/dashboard/staff/profile", icon: User },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow border-r bg-background">
          <div className="flex items-center h-16 px-4 border-b">
            <Link href="/" className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">CROWN HOTEL</span>
            </Link>
          </div>
          <div className="flex-grow px-4 py-4 overflow-y-auto">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Log out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Crown className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">CROWN HOTEL</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-grow px-4 py-4 overflow-y-auto">
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`}
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="p-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Log out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Top navigation */}
        <header className="bg-background border-b sticky top-0 z-10">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center lg:hidden">
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <div className="ml-2 lg:hidden">
                <span className="font-semibold capitalize">{userType} Dashboard</span>
              </div>
            </div>
            <div className="flex-1 lg:ml-0 lg:justify-end flex items-center justify-end space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">{userName.charAt(0)}</span>
                    </div>
                    <span className="hidden md:inline-block">{userName}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/${userType}/profile`}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/${userType}/settings`}>Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

