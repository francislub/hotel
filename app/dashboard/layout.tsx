import type { ReactNode } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { SessionProvider } from "@/components/session-provider"
import {
  Hotel,
  Calendar,
  Users,
  Settings,
  LogOut,
  Menu,
  Home,
  Bed,
  CreditCard,
  MessageSquare,
  Activity,
  FileText,
  DollarSign,
  Utensils,
  SpadeIcon as SpaIcon,
  HelpCircle,
} from "lucide-react"

interface DashboardLayoutProps {
  children: ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const userRole = session.user.role || "GUEST"

  // Define navigation items based on user role
  const navigationItems = {
    ADMIN: [
      { name: "Dashboard", href: "/dashboard/admin", icon: Home },
      { name: "Bookings", href: "/dashboard/admin/bookings", icon: Calendar },
      { name: "Rooms", href: "/dashboard/admin/rooms", icon: Bed },
      { name: "Services", href: "/dashboard/admin/services", icon: CreditCard },
      { name: "Staff", href: "/dashboard/admin/staff", icon: Users },
      { name: "Guests", href: "/dashboard/admin/guests", icon: Users },
      { name: "Messages", href: "/dashboard/admin/messages", icon: MessageSquare },
      { name: "Activities", href: "/dashboard/admin/activities", icon: Activity },
      { name: "Reports", href: "/dashboard/admin/reports", icon: FileText },
      { name: "Finance", href: "/dashboard/admin/finance", icon: DollarSign },
      { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
    ],
    GUEST: [
      { name: "Dashboard", href: "/dashboard/guest", icon: Home },
      { name: "Book a Room", href: "/dashboard/guest/book", icon: Bed },
      { name: "My Bookings", href: "/dashboard/guest/bookings", icon: Calendar },
      { name: "Messages", href: "/dashboard/guest/messages", icon: MessageSquare },
      { name: "Activities", href: "/dashboard/guest/activities", icon: Activity },
      { name: "Profile", href: "/dashboard/guest/profile", icon: Users },
      { name: "Preferences", href: "/dashboard/guest/preferences", icon: Settings },
      { name: "Services", href: "/dashboard/guest/services", icon: Utensils },
      { name: "Dining", href: "/dashboard/guest/dining", icon: Utensils },
      { name: "Spa & Wellness", href: "/dashboard/guest/spa", icon: SpaIcon },
      { name: "Support", href: "/dashboard/guest/support", icon: HelpCircle },
    ],
    ACCOUNTANT: [
      { name: "Dashboard", href: "/dashboard/accountant", icon: Home },
      { name: "Transactions", href: "/dashboard/accountant/transactions", icon: CreditCard },
      { name: "Reports", href: "/dashboard/accountant/reports", icon: FileText },
      { name: "Expenses", href: "/dashboard/accountant/expenses", icon: DollarSign },
    ],
    STAFF: [
      { name: "Dashboard", href: "/dashboard/staff", icon: Home },
      { name: "Bookings", href: "/dashboard/staff/bookings", icon: Calendar },
      { name: "Messages", href: "/dashboard/staff/messages", icon: MessageSquare },
      { name: "Activities", href: "/dashboard/staff/activities", icon: Activity },
    ],
  }

  const navItems = navigationItems[userRole] || navigationItems.GUEST

  return (
    <SessionProvider>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 sm:max-w-xs">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2 font-bold">
                    <Hotel className="h-5 w-5" />
                    <span>Crown Hotel</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Hotel className="h-5 w-5" />
            <span>Crown Hotel</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Avatar>
              <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
              <AvatarFallback>
                {session.user.name
                  ? session.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        <div className="flex flex-1">
          <aside className="hidden w-64 border-r bg-background md:block fixed h-[calc(100vh-4rem)] top-16 overflow-y-auto">
            <nav className="flex flex-col gap-2 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
              <Link
                href="/api/auth/signout"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground mt-auto"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Link>
            </nav>
          </aside>
          <main className="flex-1 md:ml-64 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  )
}

