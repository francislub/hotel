import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft } from "lucide-react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getMessageThread } from "@/lib/actions/message-actions"
import { format } from "date-fns"
import { MessageReplyForm } from "@/components/forms/message-reply-form"

export default async function MessageDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const { id } = params
  const threadResult = await getMessageThread(id)

  if (!threadResult.success) {
    redirect("/dashboard/guest/messages")
  }

  const messages = threadResult.data

  // Format category for display
  const formatCategory = (category: string) => {
    return category.replace(/_/g, " ")
  }

  // Format message content
  const formatMessageContent = (content: string) => {
    // Check if the content has a subject line
    if (content.startsWith("Subject:")) {
      const parts = content.split("\n\n")
      if (parts.length >= 2) {
        const subject = parts[0].replace("Subject:", "").trim()
        const message = parts.slice(1).join("\n\n")
        return (
          <>
            <h3 className="font-medium mb-2">{subject}</h3>
            <p className="whitespace-pre-wrap">{message}</p>
          </>
        )
      }
    }

    // If no subject format is detected, just return the content
    return <p className="whitespace-pre-wrap">{content}</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/guest/messages">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Message Details</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Conversation</CardTitle>
              <CardDescription>View your conversation with hotel staff</CardDescription>
            </div>
            <Badge variant="outline">{formatCategory(messages[0].category)}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg ${
                  message.senderId === session.user.id ? "bg-primary text-primary-foreground ml-8" : "bg-muted mr-8"
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <Avatar>
                    <AvatarImage src={message.senderAvatar} alt={message.sender} />
                    <AvatarFallback>{message.senderInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{message.sender}</div>
                    <div className="text-xs opacity-80">{format(new Date(message.timestamp), "PPP 'at' p")}</div>
                  </div>
                </div>
                <div className={message.senderId === session.user.id ? "text-primary-foreground" : ""}>
                  {formatMessageContent(message.content)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t">
            <h3 className="font-medium mb-4">Reply to this message</h3>
            <MessageReplyForm messageId={id} userId={session.user.id} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

