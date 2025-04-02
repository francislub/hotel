"use server"

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getGuests() {
  try {
    const guests = await prisma.user.findMany({
      where: {
        role: "GUEST",
      },
      include: {
        guestProfile: true,
      },
      orderBy: {
        name: "asc",
      },
    })
    return { success: true, data: guests }
  } catch (error) {
    console.error("Error fetching guests:", error)
    return { success: false, message: "Failed to fetch guests" }
  }
}

export async function getGuestById(id: string) {
  try {
    const guest = await prisma.user.findUnique({
      where: {
        id,
        role: "GUEST",
      },
      include: {
        guestProfile: true,
        bookings: true,
      },
    })

    if (!guest) {
      return { success: false, message: "Guest not found" }
    }

    return { success: true, data: guest }
  } catch (error) {
    console.error("Error fetching guest:", error)
    return { success: false, message: "Failed to fetch guest" }
  }
}

export async function updateGuest(
  id: string,
  data: {
    name?: string
    email?: string
    guestProfile?: {
      phone?: string
      address?: string
      preferences?: string
    }
  },
) {
  try {
    // Check if guest exists
    const existingGuest = await prisma.user.findUnique({
      where: {
        id,
        role: "GUEST",
      },
      include: {
        guestProfile: true,
      },
    })

    if (!existingGuest) {
      return { success: false, message: "Guest not found" }
    }

    // Update user data
    const updatedGuest = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        email: data.email,
        guestProfile: data.guestProfile
          ? {
              upsert: {
                create: data.guestProfile,
                update: data.guestProfile,
              },
            }
          : undefined,
      },
      include: {
        guestProfile: true,
      },
    })

    revalidatePath("/dashboard/admin/guests")
    return { success: true, data: updatedGuest }
  } catch (error) {
    console.error("Error updating guest:", error)
    return { success: false, message: "Failed to update guest" }
  }
}

export async function deleteGuest(id: string) {
  try {
    // Check if guest exists
    const existingGuest = await prisma.user.findUnique({
      where: {
        id,
        role: "GUEST",
      },
      include: {
        bookings: true,
      },
    })

    if (!existingGuest) {
      return { success: false, message: "Guest not found" }
    }

    // Check if guest has active bookings
    const activeBookings = existingGuest.bookings.filter(
      (booking) => booking.status === "PENDING" || booking.status === "CONFIRMED" || booking.status === "CHECKED_IN",
    )

    if (activeBookings.length > 0) {
      return { success: false, message: "Cannot delete guest with active bookings" }
    }

    // Delete guest
    await prisma.user.delete({
      where: {
        id,
      },
    })

    revalidatePath("/dashboard/admin/guests")
    return { success: true, message: "Guest deleted successfully" }
  } catch (error) {
    console.error("Error deleting guest:", error)
    return { success: false, message: "Failed to delete guest" }
  }
}

