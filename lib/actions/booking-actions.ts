"use server"

import prisma from "@/lib/db"
import { BookingStatus, type PaymentMethod, PaymentStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function createBooking(
  userId: string,
  roomId: string,
  checkIn: Date,
  checkOut: Date,
  guests: number,
  totalPrice: number,
) {
  try {
    // Check if room is available for the requested period
    const isRoomAvailable = await checkRoomAvailability(roomId, checkIn, checkOut)

    if (!isRoomAvailable) {
      return { success: false, message: "Room is not available for the selected dates" }
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        roomId,
        checkIn,
        checkOut,
        guests,
        totalPrice,
        status: BookingStatus.PENDING,
      },
    })

    revalidatePath("/dashboard/guest/bookings")
    revalidatePath("/dashboard/admin/bookings")
    return { success: true, data: booking }
  } catch (error) {
    console.error("Error creating booking:", error)
    return { success: false, message: "Failed to create booking" }
  }
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  try {
    const booking = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        status,
      },
    })

    revalidatePath("/dashboard/guest/bookings")
    revalidatePath("/dashboard/admin/bookings")
    return { success: true, data: booking }
  } catch (error) {
    console.error("Error updating booking status:", error)
    return { success: false, message: "Failed to update booking status" }
  }
}

export async function cancelBooking(id: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: {
        id,
      },
    })

    if (!booking) {
      return { success: false, message: "Booking not found" }
    }

    if (booking.status === BookingStatus.CHECKED_IN) {
      return { success: false, message: "Cannot cancel a booking that has already checked in" }
    }

    await prisma.booking.update({
      where: {
        id,
      },
      data: {
        status: BookingStatus.CANCELLED,
      },
    })

    revalidatePath("/dashboard/guest/bookings")
    revalidatePath("/dashboard/admin/bookings")
    return { success: true, message: "Booking cancelled successfully" }
  } catch (error) {
    console.error("Error cancelling booking:", error)
    return { success: false, message: "Failed to cancel booking" }
  }
}

export async function getUserBookings(userId: string) {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId,
      },
      include: {
        room: true,
      },
      orderBy: {
        checkIn: "desc",
      },
    })

    return { success: true, data: bookings }
  } catch (error) {
    console.error("Error fetching user bookings:", error)
    return { success: false, message: "Failed to fetch bookings" }
  }
}

export async function getAllBookings() {
  try {
    const bookings = await prisma.booking.findMany({
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
      orderBy: {
        checkIn: "desc",
      },
    })

    return { success: true, data: bookings }
  } catch (error) {
    console.error("Error fetching all bookings:", error)
    return { success: false, message: "Failed to fetch bookings" }
  }
}

export async function getBookingById(id: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: {
        id,
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
        payments: true,
        services: true,
      },
    })

    if (!booking) {
      return { success: false, message: "Booking not found" }
    }

    return { success: true, data: booking }
  } catch (error) {
    console.error("Error fetching booking:", error)
    return { success: false, message: "Failed to fetch booking" }
  }
}

export async function addPaymentToBooking(bookingId: string, amount: number, method: PaymentMethod) {
  try {
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        payments: true,
      },
    })

    if (!booking) {
      return { success: false, message: "Booking not found" }
    }

    // Calculate total paid amount
    const totalPaid = booking.payments.reduce((sum, payment) => {
      if (payment.status === PaymentStatus.COMPLETED) {
        return sum + payment.amount
      }
      return sum
    }, 0)

    // Check if payment would exceed total price
    if (totalPaid + amount > booking.totalPrice) {
      return { success: false, message: "Payment amount exceeds remaining balance" }
    }

    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount,
        method,
        status: PaymentStatus.PENDING,
      },
    })

    revalidatePath(`/dashboard/admin/bookings/${bookingId}`)
    revalidatePath(`/dashboard/guest/bookings/${bookingId}`)
    return { success: true, data: payment }
  } catch (error) {
    console.error("Error adding payment:", error)
    return { success: false, message: "Failed to add payment" }
  }
}

export async function updatePaymentStatus(id: string, status: PaymentStatus) {
  try {
    const payment = await prisma.payment.update({
      where: {
        id,
      },
      data: {
        status,
      },
    })

    const booking = await prisma.booking.findUnique({
      where: {
        id: payment.bookingId,
      },
      include: {
        payments: true,
      },
    })

    if (booking) {
      revalidatePath(`/dashboard/admin/bookings/${booking.id}`)
      revalidatePath(`/dashboard/guest/bookings/${booking.id}`)
    }

    return { success: true, data: payment }
  } catch (error) {
    console.error("Error updating payment status:", error)
    return { success: false, message: "Failed to update payment status" }
  }
}

async function checkRoomAvailability(roomId: string, checkIn: Date, checkOut: Date) {
  // Find any overlapping bookings
  const overlappingBookings = await prisma.booking.findMany({
    where: {
      roomId,
      OR: [
        {
          // Booking starts during the requested period
          AND: [{ checkIn: { lte: checkOut } }, { checkIn: { gte: checkIn } }],
        },
        {
          // Booking ends during the requested period
          AND: [{ checkOut: { lte: checkOut } }, { checkOut: { gte: checkIn } }],
        },
        {
          // Booking spans the entire requested period
          AND: [{ checkIn: { lte: checkIn } }, { checkOut: { gte: checkOut } }],
        },
      ],
      status: {
        in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN],
      },
    },
  })

  // Room is available if there are no overlapping bookings
  return overlappingBookings.length === 0
}

