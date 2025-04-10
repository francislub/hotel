import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye } from "lucide-react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getMessagesByUser } from "@/lib/actions/message-actions"
import { formatDistanceToNow } from "date-fns"

export default async function GuestMessagesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Fetch messages from the database
  const messagesResult = await getMessagesByUser(session.user.id)
  const messages = messagesResult.success ? messagesResult.data : []

  // Format category for display
  const formatCategory = (category: string) => {
    return category.replace(/_/g, " ")
  }

  // Extract subject from content
  const extractSubject = (content: string) => {
    if (content.startsWith("Subject:")) {
      const subjectLine = content.split("\n")[0]
      return subjectLine.replace("Subject:", "").trim()
    }
    return content.substring(0, 50) + (content.length > 50 ? "..." : "")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">My Messages</h1>
        <Link href="/dashboard/guest/messages/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Messages</CardTitle>
          <CardDescription>View and manage your messages with hotel staff.</CardDescription>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2">
              <p className="text-muted-foreground">You don't have any messages yet</p>
              <Link href="/dashboard/guest/messages/new">
                <Button variant="outline" size="sm">
                  Send your first message
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>{formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}</TableCell>
                      <TableCell className="max-w-xs truncate">{extractSubject(message.content)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{formatCategory(message.category)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={message.isRead ? "default" : "success"}>
                          {message.isRead ? "Read" : "Unread"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/guest/messages/${message.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

