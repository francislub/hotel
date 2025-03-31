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
import { Plus, MoreHorizontal, PencilIcon, EyeIcon, XCircleIcon, CheckCircleIcon } from "lucide-react"
import { getAllBookings } from "@/lib/actions/booking-actions"
import { format } from "date-fns"

export default async function BookingsPage() {
  const { success, data: bookings, message } = await getAllBookings()

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
        <h1 className="text-2xl font-bold tracking-tight">Bookings Management</h1>
        <Link href="/dashboard/admin/bookings/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Booking
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>
            Manage all bookings in the hotel. View, update, or cancel bookings as needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!success ? (
            <div className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">{message || "Failed to load bookings"}</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2">
              <p className="text-muted-foreground">No bookings found</p>
              <Link href="/dashboard/admin/bookings/new">
                <Button variant="outline" size="sm">
                  Create your first booking
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Guest</TableHead>
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
                      <TableCell>{booking.user.name}</TableCell>
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
                              <Link href={`/dashboard/admin/bookings/${booking.id}`}>
                                <EyeIcon className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/admin/bookings/${booking.id}/edit`}>
                                <PencilIcon className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            {booking.status === "PENDING" && (
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/admin/bookings/${booking.id}/confirm`}>
                                  <CheckCircleIcon className="mr-2 h-4 w-4" />
                                  Confirm
                                </Link>
                              </DropdownMenuItem>
                            )}
                            {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/admin/bookings/${booking.id}/cancel`}>
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

