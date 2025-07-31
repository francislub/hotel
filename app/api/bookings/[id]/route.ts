import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { BookingStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { roomId, checkIn, checkOut, guests, status, totalPrice } = body

    // Validate required fields
    if (!roomId || !checkIn || !checkOut || !guests || !status || !totalPrice) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id },
    })

    if (!existingBooking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 })
    }

    // Check room availability if room or dates are being changed
    if (
      roomId !== existingBooking.roomId ||
      new Date(checkIn).getTime() !== existingBooking.checkIn.getTime() ||
      new Date(checkOut).getTime() !== existingBooking.checkOut.getTime()
    ) {
      const overlappingBookings = await prisma.booking.findMany({
        where: {
          roomId,
          id: { not: params.id }, // Exclude current booking
          OR: [
            {
              AND: [{ checkIn: { lte: new Date(checkOut) } }, { checkIn: { gte: new Date(checkIn) } }],
            },
            {
              AND: [{ checkOut: { lte: new Date(checkOut) } }, { checkOut: { gte: new Date(checkIn) } }],
            },
            {
              AND: [{ checkIn: { lte: new Date(checkIn) } }, { checkOut: { gte: new Date(checkOut) } }],
            },
          ],
          status: {
            in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN],
          },
        },
      })

      if (overlappingBookings.length > 0) {
        return NextResponse.json({ message: "Room is not available for the selected dates" }, { status: 400 })
      }
    }

    // Update the booking
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        roomId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests: Number.parseInt(guests),
        status,
        totalPrice: Number.parseFloat(totalPrice),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        room: true,
      },
    })

    // Revalidate relevant paths
    revalidatePath(`/dashboard/admin/bookings/${params.id}`)
    revalidatePath("/dashboard/admin/bookings")
    revalidatePath("/dashboard/guest/bookings")

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
