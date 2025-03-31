import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Plus, MoreHorizontal, EyeIcon, XCircleIcon } from "lucide-react"
import { getUserBookings } from "@/lib/actions/booking-actions"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { format } from "date-fns"

export default async function GuestBookingsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const { success, data: bookings, message } = await getUserBookings(session.user.id)

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "success"
      case "PENDING":
        return "warning"
      case "CHECKED_IN":
        return "info"
      case "CHECKED_OUT":
        return "default"
      case "CANCELLED":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
        <Link href="/dashboard/guest/book">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Book a Room
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>View and manage your bookings at Crown Hotel.</CardDescription>
        </CardHeader>
        <CardContent>
          {!success ? (
            <div className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">{message || "Failed to load bookings"}</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2">
              <p className="text-muted-foreground">You don't have any bookings yet</p>
              <Link href="/dashboard/guest/book">
                <Button variant="outline" size="sm">
                  Book your first room
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.id.substring(0, 8)}</TableCell>
                      <TableCell>
                        {booking.room.number} - {booking.room.type}
                      </TableCell>
                      <TableCell>{format(new Date(booking.checkIn), "MMM dd, yyyy")}</TableCell>
                      <TableCell>{format(new Date(booking.checkOut), "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(booking.status)}>{booking.status}</Badge>
                      </TableCell>
                      <TableCell>${booking.totalPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/guest/bookings/${booking.id}`}>
                                <EyeIcon className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/guest/bookings/${booking.id}/cancel`}>
                                  <XCircleIcon className="mr-2 h-4 w-4" />
                                  Cancel
                                </Link>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

