import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import MessageForm from "@/components/forms/message-form"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function NewMessagePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Send a Message</h1>
        <p className="text-muted-foreground">Contact our staff with any questions or requests.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Message</CardTitle>
          <CardDescription>Fill out the form below to send a message to our staff.</CardDescription>
        </CardHeader>
        <CardContent>
          <MessageForm userId={session.user.id} />
        </CardContent>
      </Card>
    </div>
  )
}

