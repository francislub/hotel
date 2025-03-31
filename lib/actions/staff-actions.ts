"use server"

import prisma from "@/lib/db"
import { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function getStaffMembers() {
  try {
    const staffUsers = await prisma.user.findMany({
      where: {
        role: {
          in: [Role.ADMIN, Role.STAFF],
        },
      },
      include: {
        staffProfile: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return {
      success: true,
      data: staffUsers.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        position: user.staffProfile?.position || "",
        department: user.staffProfile?.department || "",
        phone: user.staffProfile?.phoneNumber || "",
        status: user.staffProfile ? "Active" : "Inactive",
        hireDate: user.staffProfile?.hireDate || null,
      })),
    }
  } catch (error) {
    console.error("Error fetching staff members:", error)
    return { success: false, message: "Failed to fetch staff members" }
  }
}

export async function getStaffMemberById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        staffProfile: true,
      },
    })

    if (!user) {
      return { success: false, message: "Staff member not found" }
    }

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        position: user.staffProfile?.position || "",
        department: user.staffProfile?.department || "",
        phone: user.staffProfile?.phoneNumber || "",
        address: user.staffProfile?.address || "",
        status: user.staffProfile ? "Active" : "Inactive",
        hireDate: user.staffProfile?.hireDate || null,
        salary: user.staffProfile?.salary || 0,
      },
    }
  } catch (error) {
    console.error("Error fetching staff member:", error)
    return { success: false, message: "Failed to fetch staff member" }
  }
}

export async function updateStaffMember(
  id: string,
  data: {
    name?: string
    email?: string
    position?: string
    department?: string
    phoneNumber?: string
    address?: string
    salary?: number
    status?: string
  },
) {
  try {
    const { name, email, position, department, phoneNumber, address, salary, status } = data

    // Update user data
    const userData = { name, email }
    const filteredUserData = Object.fromEntries(Object.entries(userData).filter(([_, v]) => v !== undefined))

    if (Object.keys(filteredUserData).length > 0) {
      await prisma.user.update({
        where: { id },
        data: filteredUserData,
      })
    }

    // Update staff profile data
    const staffData = { position, department, phoneNumber, address, salary }
    const filteredStaffData = Object.fromEntries(Object.entries(staffData).filter(([_, v]) => v !== undefined))

    if (Object.keys(filteredStaffData).length > 0) {
      const staffProfile = await prisma.staff.findUnique({
        where: { userId: id },
      })

      if (staffProfile) {
        await prisma.staff.update({
          where: { userId: id },
          data: filteredStaffData,
        })
      } else if (status === "Active") {
        // Create staff profile if it doesn't exist and status is Active
        await prisma.staff.create({
          data: {
            userId: id,
            position: position || "Staff",
            department: department || "General",
            hireDate: new Date(),
            salary: salary || 0,
            phoneNumber: phoneNumber || "",
            address: address || "",
          },
        })
      }
    }

    // If status is Inactive, delete staff profile
    if (status === "Inactive") {
      const staffProfile = await prisma.staff.findUnique({
        where: { userId: id },
      })

      if (staffProfile) {
        await prisma.staff.delete({
          where: { userId: id },
        })
      }
    }

    revalidatePath("/dashboard/admin/staff")
    return { success: true, message: "Staff member updated successfully" }
  } catch (error) {
    console.error("Error updating staff member:", error)
    return { success: false, message: "Failed to update staff member" }
  }
}

export async function deleteStaffMember(id: string) {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return { success: false, message: "Staff member not found" }
    }

    // Delete user (cascade will delete staff profile)
    await prisma.user.delete({
      where: { id },
    })

    revalidatePath("/dashboard/admin/staff")
    return { success: true, message: "Staff member deleted successfully" }
  } catch (error) {
    console.error("Error deleting staff member:", error)
    return { success: false, message: "Failed to delete staff member" }
  }
}

