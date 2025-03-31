import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getMessageById } from "@/lib/actions/message-actions"

interface MessageDetailsPageProps {
  params: {
    id: string
  }
}

export default async function MessageDetailsPage({ params }: MessageDetailsPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const { success, data: message, message: errorMessage } = await getMessageById(params.id)

  if (!success || !message) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/dashboard/guest/messages">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Message Details</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Message from {session.user.name}</CardTitle>
              <CardDescription>{message.timestamp}</CardDescription>
            </div>
            <Badge variant="outline">{message.category}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <p className="whitespace-pre-line">{message.content}</p>
          </div>

          {message.isRead && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Staff Response</h3>
              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="whitespace-pre-line">
                  Thank you for your message. Our staff has reviewed it and will address your concerns promptly.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Link href="/dashboard/guest/messages/new">
              <Button>Send Another Message</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

