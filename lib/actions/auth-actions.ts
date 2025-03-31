"use server"

import { hash, compare } from "bcryptjs"
import prisma from "@/lib/db"
import { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function registerUser(name: string, email: string, password: string, role: Role = Role.GUEST) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return { success: false, message: "User with this email already exists" }
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    })

    // Create profile based on role
    if (role === Role.GUEST) {
      await prisma.guest.create({
        data: {
          userId: user.id,
          phone: "",
          address: "",
          preferences: "",
          loyaltyPoints: 0,
        },
      })
    } else if (role === Role.ADMIN || role === Role.STAFF) {
      await prisma.staff.create({
        data: {
          userId: user.id,
          position: role === Role.ADMIN ? "Manager" : "Staff",
          department: "General",
          hireDate: new Date(),
          salary: 0,
          phoneNumber: "",
          address: "",
        },
      })
    } else if (role === Role.ACCOUNTANT) {
      await prisma.staff.create({
        data: {
          userId: user.id,
          position: "Accountant",
          department: "Finance",
          hireDate: new Date(),
          salary: 0,
          phoneNumber: "",
          address: "",
        },
      })
    }

    revalidatePath("/login")
    return { success: true, message: "User registered successfully" }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, message: "Failed to register user" }
  }
}

export async function loginUser(email: string, password: string) {
  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return { success: false, message: "Invalid email or password" }
    }

    // Check password
    const passwordMatch = await compare(password, user.password)
    if (!passwordMatch) {
      return { success: false, message: "Invalid email or password" }
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "Failed to login" }
  }
}

