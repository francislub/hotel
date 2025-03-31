import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import RoomForm from "@/components/forms/room-form"
import { getRoomById } from "@/lib/actions/room-actions"

interface EditRoomPageProps {
  params: {
    id: string
  }
}

export default async function EditRoomPage({ params }: EditRoomPageProps) {
  const { success, data: room, message } = await getRoomById(params.id)

  if (!success || !room) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Room</h1>
        <p className="text-muted-foreground">Update the details for room {room.number}.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Room Details</CardTitle>
          <CardDescription>Make changes to the room information below.</CardDescription>
        </CardHeader>
        <CardContent>
          <RoomForm initialData={room} isEditing />
        </CardContent>
      </Card>
    </div>
  )
}

