import { notFound } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { CalendarIcon, UserIcon, CreditCardIcon, MapPinIcon, EditIcon, XIcon, CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getBookingById } from "@/lib/actions/booking-actions"
import { BookingStatus, PaymentStatus } from "@prisma/client"

interface BookingDetailPageProps {
  params: {
    id: string
  }
}

function getStatusColor(status: BookingStatus) {
  switch (status) {
    case BookingStatus.PENDING:
      return "bg-yellow-100 text-yellow-800"
    case BookingStatus.CONFIRMED:
      return "bg-blue-100 text-blue-800"
    case BookingStatus.CHECKED_IN:
      return "bg-green-100 text-green-800"
    case BookingStatus.CHECKED_OUT:
      return "bg-gray-100 text-gray-800"
    case BookingStatus.CANCELLED:
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function getPaymentStatusColor(status: PaymentStatus) {
  switch (status) {
    case PaymentStatus.PENDING:
      return "bg-yellow-100 text-yellow-800"
    case PaymentStatus.COMPLETED:
      return "bg-green-100 text-green-800"
    case PaymentStatus.FAILED:
      return "bg-red-100 text-red-800"
    case PaymentStatus.REFUNDED:
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const result = await getBookingById(params.id)

  if (!result.success || !result.data) {
    notFound()
  }

  const booking = result.data
  const totalPaid =
    booking.payments?.reduce((sum, payment) => {
      return payment.status === PaymentStatus.COMPLETED ? sum + payment.amount : sum
    }, 0) || 0

  const remainingBalance = booking.totalPrice - totalPaid

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Booking Details</h1>
          <p className="text-muted-foreground">Booking ID: {booking.id}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/admin/bookings/${booking.id}/edit`}>
            <Button variant="outline">
              <EditIcon className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          {booking.status === BookingStatus.PENDING && (
            <>
              <Link href={`/dashboard/admin/bookings/${booking.id}/confirm`}>
                <Button>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Confirm
                </Button>
              </Link>
              <Link href={`/dashboard/admin/bookings/${booking.id}/cancel`}>
                <Button variant="destructive">
                  <XIcon className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Booking Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Booking Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Status</span>
              <Badge className={getStatusColor(booking.status)}>{booking.status.replace("_", " ")}</Badge>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Check-in</span>
                <span className="text-sm font-medium">{format(new Date(booking.checkIn), "PPP")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Check-out</span>
                <span className="text-sm font-medium">{format(new Date(booking.checkOut), "PPP")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Guests</span>
                <span className="text-sm font-medium">{booking.guests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium">{format(new Date(booking.createdAt), "PPP")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guest Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Guest Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="text-sm font-medium">{booking.user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm font-medium">{booking.user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Guest ID</span>
                <span className="text-sm font-medium">{booking.user.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Room Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5" />
              Room Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Room Number</span>
                <span className="text-sm font-medium">{booking.room.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Room Type</span>
                <span className="text-sm font-medium">{booking.room.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Price per Night</span>
                <span className="text-sm font-medium">${booking.room.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Capacity</span>
                <span className="text-sm font-medium">{booking.room.capacity} guests</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCardIcon className="h-5 w-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Price</span>
                <span className="text-sm font-medium">${booking.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Paid</span>
                <span className="text-sm font-medium text-green-600">${totalPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Remaining Balance</span>
                <span className={`text-sm font-medium ${remainingBalance > 0 ? "text-red-600" : "text-green-600"}`}>
                  ${remainingBalance.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments */}
      {booking.payments && booking.payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>All payments associated with this booking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {booking.payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">${payment.amount.toFixed(2)}</span>
                      <Badge className={getPaymentStatusColor(payment.status)}>{payment.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {payment.method} • {format(new Date(payment.createdAt), "PPP")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Services */}
      {booking.services && booking.services.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Services</CardTitle>
            <CardDescription>Services booked with this reservation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {booking.services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                  <span className="font-medium">${service.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-start">
        <Link href="/dashboard/admin/bookings">
          <Button variant="outline">Back to Bookings</Button>
        </Link>
      </div>
    </div>
  )
}
