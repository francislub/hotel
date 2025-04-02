import Link from "next/link"
import { notFound } from "next/navigation"
import { getGuestById } from "@/lib/actions/guest-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash, ArrowLeft } from "lucide-react"

interface GuestPageProps {
  params: {
    id: string
  }
}

export default async function GuestPage({ params }: GuestPageProps) {
  const { id } = params
  const { success, data: guest, message } = await getGuestById(id)

  if (!success || !guest) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/admin/guests">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{guest.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/admin/guests/${id}/edit`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" asChild>
            <Link href={`/dashboard/admin/guests/${id}/delete`}>
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Guest Information</CardTitle>
            <CardDescription>Personal details and contact information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p>{guest.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p>{guest.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
              <p>{guest.guestProfile?.phone || "Not provided"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
              <p>{guest.guestProfile?.address || "Not provided"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Preferences</h3>
              <p>{guest.guestProfile?.preferences || "None specified"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking History</CardTitle>
            <CardDescription>Past and upcoming bookings.</CardDescription>
          </CardHeader>
          <CardContent>
            {guest.bookings && guest.bookings.length > 0 ? (
              <div className="space-y-4">
                {guest.bookings.map((booking) => (
                  <div key={booking.id} className="border rounded-md p-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">
                          {new Date(booking.checkInDate).toLocaleDateString()} -{" "}
                          {new Date(booking.checkOutDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Room: {booking.roomId}</p>
                      </div>
                      <div>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            booking.status === "CONFIRMED"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : booking.status === "CHECKED_IN"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No bookings found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

