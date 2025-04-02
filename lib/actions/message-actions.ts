"use server"

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getMessages() {
  try {
    const messages = await prisma.message.findMany({
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // Format messages for the UI
    const formattedMessages = messages.map((message) => ({
      id: message.id,
      sender: message.sender.name || "Unknown",
      senderEmail: message.sender.email,
      senderAvatar: message.sender.image || "",
      senderInitials: message.sender.name
        ? message.sender.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "?",
      recipient: message.recipient.name || "Unknown",
      recipientId: message.recipientId,
      content: message.content,
      timestamp: message.createdAt.toISOString(),
      isRead: message.isRead,
      category: message.category,
    }))

    return { success: true, data: formattedMessages }
  } catch (error) {
    console.error("Error fetching messages:", error)
    return { success: false, message: "Failed to fetch messages" }
  }
}

export async function getMessagesByUser(userId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { recipientId: userId }],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // Format messages for the UI
    const formattedMessages = messages.map((message) => ({
      id: message.id,
      sender: message.sender.name || "Unknown",
      senderEmail: message.sender.email,
      senderAvatar: message.sender.image || "",
      senderInitials: message.sender.name
        ? message.sender.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "?",
      recipient: message.recipient.name || "Unknown",
      recipientId: message.recipientId,
      content: message.content,
      timestamp: message.createdAt.toISOString(),
      isRead: message.isRead,
      category: message.category,
    }))

    return { success: true, data: formattedMessages }
  } catch (error) {
    console.error("Error fetching user messages:", error)
    return { success: false, message: "Failed to fetch messages" }
  }
}

export async function getMessageById(id: string) {
  try {
    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    if (!message) {
      return { success: false, message: "Message not found" }
    }

    const formattedMessage = {
      id: message.id,
      sender: message.sender.name || "Unknown",
      senderEmail: message.sender.email,
      senderAvatar: message.sender.image || "",
      senderInitials: message.sender.name
        ? message.sender.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "?",
      recipient: message.recipient.name || "Unknown",
      recipientId: message.recipientId,
      content: message.content,
      timestamp: message.createdAt.toISOString(),
      isRead: message.isRead,
      category: message.category,
    }

    return { success: true, data: formattedMessage }
  } catch (error) {
    console.error("Error fetching message:", error)
    return { success: false, message: "Failed to fetch message" }
  }
}

export async function markMessageAsRead(id: string) {
  try {
    await prisma.message.update({
      where: { id },
      data: { isRead: true },
    })

    revalidatePath("/dashboard/admin/messages")
    revalidatePath("/dashboard/guest/messages")
    return { success: true, message: "Message marked as read" }
  } catch (error) {
    console.error("Error marking message as read:", error)
    return { success: false, message: "Failed to mark message as read" }
  }
}

export async function sendMessage(senderId: string, recipientId: string, content: string, category: string) {
  try {
    const message = await prisma.message.create({
      data: {
        senderId,
        recipientId,
        content,
        category,
        isRead: false,
      },
    })

    revalidatePath("/dashboard/admin/messages")
    revalidatePath("/dashboard/guest/messages")
    return { success: true, data: message }
  } catch (error) {
    console.error("Error sending message:", error)
    return { success: false, message: "Failed to send message" }
  }
}

export async function replyToMessage(messageId: string, senderId: string, content: string) {
  try {
    // Get the original message to determine the recipient
    const originalMessage = await prisma.message.findUnique({
      where: { id: messageId },
    })

    if (!originalMessage) {
      return { success: false, message: "Original message not found" }
    }

    // Create a reply (the recipient is the sender of the original message)
    const reply = await prisma.message.create({
      data: {
        senderId,
        recipientId: originalMessage.senderId,
        content,
        category: originalMessage.category,
        isRead: false,
        parentMessageId: messageId,
      },
    })

    // Mark the original message as read
    await prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    })

    revalidatePath("/dashboard/admin/messages")
    revalidatePath("/dashboard/guest/messages")
    return { success: true, data: reply }
  } catch (error) {
    console.error("Error replying to message:", error)
    return { success: false, message: "Failed to reply to message" }
  }
}

export async function getMessageThread(messageId: string) {
  try {
    // Get the original message
    const originalMessage = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    if (!originalMessage) {
      return { success: false, message: "Message not found" }
    }

    // Get all related messages (replies)
    const relatedMessages = await prisma.message.findMany({
      where: {
        OR: [{ id: messageId }, { parentMessageId: messageId }],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    })

    // Format messages for the UI
    const formattedMessages = relatedMessages.map((message) => ({
      id: message.id,
      sender: message.sender.name || "Unknown",
      senderId: message.senderId,
      senderEmail: message.sender.email,
      senderAvatar: message.sender.image || "",
      senderInitials: message.sender.name
        ? message.sender.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "?",
      recipient: message.recipient.name || "Unknown",
      recipientId: message.recipientId,
      content: message.content,
      timestamp: message.createdAt.toISOString(),
      isRead: message.isRead,
      category: message.category,
      isParent: message.id === messageId,
    }))

    return { success: true, data: formattedMessages }
  } catch (error) {
    console.error("Error fetching message thread:", error)
    return { success: false, message: "Failed to fetch message thread" }
  }
}

