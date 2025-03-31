import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import RoomForm from "@/components/forms/room-form"

export default function NewRoomPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add New Room</h1>
        <p className="text-muted-foreground">Create a new room in the hotel system.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Room Details</CardTitle>
          <CardDescription>Enter the details for the new room.</CardDescription>
        </CardHeader>
        <CardContent>
          <RoomForm />
        </CardContent>
      </Card>
    </div>
  )
}

