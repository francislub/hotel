import { getMessages } from "@/lib/actions/message-actions"
import { AdminMessages } from "@/components/dashboard/admin-messages"

export default async function MessagesPage() {
  // Fetch messages from the database
  const messagesResult = await getMessages()
  const messages = messagesResult.success ? messagesResult.data : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Manage and respond to guest messages and requests</p>
      </div>

      <AdminMessages messages={messages} />
    </div>
  )
}

