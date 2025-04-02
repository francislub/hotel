"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { replyToMessage } from "@/lib/actions/message-actions"

interface MessageReplyFormProps {
  messageId: string
  userId: string
}

export function MessageReplyForm({ messageId, userId }: MessageReplyFormProps) {
  const [replyText, setReplyText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!replyText.trim()) return

    setIsSubmitting(true)
    try {
      const result = await replyToMessage(messageId, userId, replyText)

      if (result.success) {
        toast({
          title: "Reply Sent",
          description: "Your reply has been sent successfully.",
        })
        setReplyText("")
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to send reply",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending reply:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Type your reply here..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        className="min-h-[120px]"
        disabled={isSubmitting}
      />
      <Button type="submit" disabled={!replyText.trim() || isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Reply"}
      </Button>
    </form>
  )
}

