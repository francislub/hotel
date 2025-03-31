"use server"

import prisma from "@/lib/db"
import { Role } from "@prisma/client"
import { hash } from "bcrypt"
import { revalidatePath } from "next/cache"

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        name: "asc",
      },
    })
    return { success: true, data: users }
  } catch (error) {
    console.error("Error fetching users:", error)
    return { success: false, message: "Failed to fetch users" }
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        guestProfile: id ? true : false,
        staffProfile: id ? true : false,
      },
    })

    if (!user) {
      return { success: false, message: "User not found" }
    }

    return { success: true, data: user }
  } catch (error) {
    console.error("Error fetching user:", error)
    return { success: false, message: "Failed to fetch user" }
  }
}

export async function updateUser(
  id: string,
  data: {
    name?: string
    email?: string
    role?: Role
  },
) {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!existingUser) {
      return { success: false, message: "User not found" }
    }

    // If email is being updated, check if it's unique
    if (data.email && data.email !== existingUser.email) {
      const userWithEmail = await prisma.user.findUnique({
        where: {
          email: data.email,
        },
      })

      if (userWithEmail) {
        return { success: false, message: "Email already in use" }
      }
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data,
    })

    revalidatePath("/dashboard/admin/users")
    return { success: true, data: user }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, message: "Failed to update user" }
  }
}

export async function updateUserPassword(id: string, newPassword: string) {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!existingUser) {
      return { success: false, message: "User not found" }
    }

    // Hash the new password
    const hashedPassword = await hash(newPassword, 10)

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        password: hashedPassword,
      },
    })

    return { success: true, message: "Password updated successfully" }
  } catch (error) {
    console.error("Error updating password:", error)
    return { success: false, message: "Failed to update password" }
  }
}

export async function updateGuestProfile(
  userId: string,
  data: {
    phone?: string
    address?: string
    preferences?: string
  },
) {
  try {
    // Check if user exists and is a guest
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        guestProfile: true,
      },
    })

    if (!user) {
      return { success: false, message: "User not found" }
    }

    if (user.role !== Role.GUEST) {
      return { success: false, message: "User is not a guest" }
    }

    // Update or create guest profile
    if (user.guestProfile) {
      await prisma.guest.update({
        where: {
          userId,
        },
        data,
      })
    } else {
      await prisma.guest.create({
        data: {
          userId,
          ...data,
        },
      })
    }

    revalidatePath("/dashboard/guest/profile")
    return { success: true, message: "Profile updated successfully" }
  } catch (error) {
    console.error("Error updating guest profile:", error)
    return { success: false, message: "Failed to update profile" }
  }
}

export async function updateStaffProfile(
  userId: string,
  data: {
    position?: string
    department?: string
    hireDate?: Date
    salary?: number
    phoneNumber?: string
    address?: string
  },
) {
  try {
    // Check if user exists and is staff or admin
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        staffProfile: true,
      },
    })

    if (!user) {
      return { success: false, message: "User not found" }
    }

    if (user.role !== Role.ADMIN && user.role !== Role.STAFF) {
      return { success: false, message: "User is not staff or admin" }
    }

    // Update or create staff profile
    if (user.staffProfile) {
      await prisma.staff.update({
        where: {
          userId,
        },
        data,
      })
    } else {
      await prisma.staff.create({
        data: {
          userId,
          position: data.position || "Staff",
          department: data.department || "General",
          hireDate: data.hireDate || new Date(),
          salary: data.salary || 0,
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
        },
      })
    }

    revalidatePath("/dashboard/admin/staff")
    return { success: true, message: "Staff profile updated successfully" }
  } catch (error) {
    console.error("Error updating staff profile:", error)
    return { success: false, message: "Failed to update staff profile" }
  }
}

export async function deleteUser(id: string) {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        bookings: true,
      },
    })

    if (!existingUser) {
      return { success: false, message: "User not found" }
    }

    // Check if user has active bookings
    const activeBookings = existingUser.bookings.filter(
      (booking) => booking.status === "PENDING" || booking.status === "CONFIRMED" || booking.status === "CHECKED_IN",
    )

    if (activeBookings.length > 0) {
      return { success: false, message: "Cannot delete user with active bookings" }
    }

    // Delete user
    await prisma.user.delete({
      where: {
        id,
      },
    })

    revalidatePath("/dashboard/admin/users")
    return { success: true, message: "User deleted successfully" }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, message: "Failed to delete user" }
  }
}

