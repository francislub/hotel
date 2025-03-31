"use server"

import prisma from "@/lib/db"
import { RoomStatus, type RoomType } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function getRooms() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        number: "asc",
      },
    })
    return { success: true, data: rooms }
  } catch (error) {
    console.error("Error fetching rooms:", error)
    return { success: false, message: "Failed to fetch rooms" }
  }
}

export async function getRoomById(id: string) {
  try {
    const room = await prisma.room.findUnique({
      where: {
        id,
      },
    })

    if (!room) {
      return { success: false, message: "Room not found" }
    }

    return { success: true, data: room }
  } catch (error) {
    console.error("Error fetching room:", error)
    return { success: false, message: "Failed to fetch room" }
  }
}

export async function createRoom(
  number: string,
  type: RoomType,
  price: number,
  capacity: number,
  description: string,
  amenities: string[],
  images: string[] = [],
) {
  try {
    // Check if room number already exists
    const existingRoom = await prisma.room.findUnique({
      where: {
        number,
      },
    })

    if (existingRoom) {
      return { success: false, message: "Room with this number already exists" }
    }

    const room = await prisma.room.create({
      data: {
        number,
        type,
        price,
        capacity,
        description,
        amenities,
        images,
        status: RoomStatus.AVAILABLE,
      },
    })

    revalidatePath("/dashboard/admin/rooms")
    return { success: true, data: room }
  } catch (error) {
    console.error("Error creating room:", error)
    return { success: false, message: "Failed to create room" }
  }
}

export async function updateRoom(
  id: string,
  data: {
    number?: string
    type?: RoomType
    price?: number
    capacity?: number
    description?: string
    amenities?: string[]
    status?: RoomStatus
    images?: string[]
  },
) {
  try {
    // Check if room exists
    const existingRoom = await prisma.room.findUnique({
      where: {
        id,
      },
    })

    if (!existingRoom) {
      return { success: false, message: "Room not found" }
    }

    // If number is being updated, check if it's unique
    if (data.number && data.number !== existingRoom.number) {
      const roomWithNumber = await prisma.room.findUnique({
        where: {
          number: data.number,
        },
      })

      if (roomWithNumber) {
        return { success: false, message: "Room with this number already exists" }
      }
    }

    const room = await prisma.room.update({
      where: {
        id,
      },
      data,
    })

    revalidatePath("/dashboard/admin/rooms")
    return { success: true, data: room }
  } catch (error) {
    console.error("Error updating room:", error)
    return { success: false, message: "Failed to update room" }
  }
}

export async function deleteRoom(id: string) {
  try {
    // Check if room exists
    const existingRoom = await prisma.room.findUnique({
      where: {
        id,
      },
    })

    if (!existingRoom) {
      return { success: false, message: "Room not found" }
    }

    // Check if room has any bookings
    const bookings = await prisma.booking.findMany({
      where: {
        roomId: id,
        status: {
          in: ["PENDING", "CONFIRMED", "CHECKED_IN"],
        },
      },
    })

    if (bookings.length > 0) {
      return { success: false, message: "Cannot delete room with active bookings" }
    }

    await prisma.room.delete({
      where: {
        id,
      },
    })

    revalidatePath("/dashboard/admin/rooms")
    return { success: true, message: "Room deleted successfully" }
  } catch (error) {
    console.error("Error deleting room:", error)
    return { success: false, message: "Failed to delete room" }
  }
}

export async function getAvailableRooms(checkIn: Date, checkOut: Date, capacity?: number) {
  try {
    // Find rooms that are booked during the requested period
    const bookedRoomIds = await prisma.booking.findMany({
      where: {
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
          in: ["PENDING", "CONFIRMED", "CHECKED_IN"],
        },
      },
      select: {
        roomId: true,
      },
    })

    // Get all available rooms
    const availableRooms = await prisma.room.findMany({
      where: {
        id: {
          notIn: bookedRoomIds.map((booking) => booking.roomId),
        },
        status: RoomStatus.AVAILABLE,
        ...(capacity ? { capacity: { gte: capacity } } : {}),
      },
    })

    return { success: true, data: availableRooms }
  } catch (error) {
    console.error("Error fetching available rooms:", error)
    return { success: false, message: "Failed to fetch available rooms" }
  }
}

