import { notFound } from "next/navigation"
import { getBookingById } from "@/lib/actions/booking-actions"
import { getAllRooms } from "@/lib/actions/room-actions"
import EditBookingForm from "@/components/forms/edit-booking-form"

interface EditBookingPageProps {
  params: {
    id: string
  }
}

export default async function EditBookingPage({ params }: EditBookingPageProps) {
  const [bookingResult, roomsResult] = await Promise.all([getBookingById(params.id), getAllRooms()])

  if (!bookingResult.success || !bookingResult.data) {
    notFound()
  }

  if (!roomsResult.success) {
    notFound()
  }

  const booking = bookingResult.data
  const rooms = roomsResult.data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Booking</h1>
        <p className="text-muted-foreground">Update booking details for {booking.user.name}</p>
      </div>

      <EditBookingForm booking={booking} rooms={rooms} />
    </div>
  )
}
