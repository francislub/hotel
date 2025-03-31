"use server"

import prisma from "@/lib/db"
import type { ServiceCategory } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function getServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: {
        name: "asc",
      },
    })
    return { success: true, data: services }
  } catch (error) {
    console.error("Error fetching services:", error)
    return { success: false, message: "Failed to fetch services" }
  }
}

export async function getServiceById(id: string) {
  try {
    const service = await prisma.service.findUnique({
      where: {
        id,
      },
    })

    if (!service) {
      return { success: false, message: "Service not found" }
    }

    return { success: true, data: service }
  } catch (error) {
    console.error("Error fetching service:", error)
    return { success: false, message: "Failed to fetch service" }
  }
}

export async function createService(name: string, description: string, price: number, category: ServiceCategory) {
  try {
    const service = await prisma.service.create({
      data: {
        name,
        description,
        price,
        category,
      },
    })

    revalidatePath("/dashboard/admin/services")
    return { success: true, data: service }
  } catch (error) {
    console.error("Error creating service:", error)
    return { success: false, message: "Failed to create service" }
  }
}

export async function updateService(
  id: string,
  data: {
    name?: string
    description?: string
    price?: number
    category?: ServiceCategory
  },
) {
  try {
    const service = await prisma.service.update({
      where: {
        id,
      },
      data,
    })

    revalidatePath("/dashboard/admin/services")
    return { success: true, data: service }
  } catch (error) {
    console.error("Error updating service:", error)
    return { success: false, message: "Failed to update service" }
  }
}

export async function deleteService(id: string) {
  try {
    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: {
        id,
      },
    })

    if (!existingService) {
      return { success: false, message: "Service not found" }
    }

    // Check if service is associated with any bookings
    const bookingServices = await prisma.service.findMany({
      where: {
        id,
        bookingId: {
          not: null,
        },
      },
    })

    if (bookingServices.length > 0) {
      return { success: false, message: "Cannot delete service that is associated with bookings" }
    }

    await prisma.service.delete({
      where: {
        id,
      },
    })

    revalidatePath("/dashboard/admin/services")
    return { success: true, message: "Service deleted successfully" }
  } catch (error) {
    console.error("Error deleting service:", error)
    return { success: false, message: "Failed to delete service" }
  }
}

export async function addServiceToBooking(bookingId: string, serviceId: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    })

    if (!booking) {
      return { success: false, message: "Booking not found" }
    }

    const service = await prisma.service.findUnique({
      where: {
        id: serviceId,
      },
    })

    if (!service) {
      return { success: false, message: "Service not found" }
    }

    // Create a copy of the service for this booking
    const bookingService = await prisma.service.create({
      data: {
        name: service.name,
        description: service.description,
        price: service.price,
        category: service.category,
        bookingId,
      },
    })

    revalidatePath(`/dashboard/admin/bookings/${bookingId}`)
    revalidatePath(`/dashboard/guest/bookings/${bookingId}`)
    return { success: true, data: bookingService }
  } catch (error) {
    console.error("Error adding service to booking:", error)
    return { success: false, message: "Failed to add service to booking" }
  }
}

export async function removeServiceFromBooking(serviceId: string) {
  try {
    const service = await prisma.service.findUnique({
      where: {
        id: serviceId,
      },
    })

    if (!service) {
      return { success: false, message: "Service not found" }
    }

    if (!service.bookingId) {
      return { success: false, message: "Service is not associated with a booking" }
    }

    const bookingId = service.bookingId

    await prisma.service.delete({
      where: {
        id: serviceId,
      },
    })

    revalidatePath(`/dashboard/admin/bookings/${bookingId}`)
    revalidatePath(`/dashboard/guest/bookings/${bookingId}`)
    return { success: true, message: "Service removed from booking successfully" }
  } catch (error) {
    console.error("Error removing service from booking:", error)
    return { success: false, message: "Failed to remove service from booking" }
  }
}

