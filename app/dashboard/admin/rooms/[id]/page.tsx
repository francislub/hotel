import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PencilIcon, ArrowLeft } from "lucide-react"
import { getRoomById } from "@/lib/actions/room-actions"

interface RoomDetailsPageProps {
  params: {
    id: string
  }
}

export default async function RoomDetailsPage({ params }: RoomDetailsPageProps) {
  const { success, data: room, message } = await getRoomById(params.id)

  if (!success || !room) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/admin/rooms">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Room Details</h1>
        </div>
        <Link href={`/dashboard/admin/rooms/${params.id}/edit`}>
          <Button>
            <PencilIcon className="mr-2 h-4 w-4" />
            Edit Room
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Room {room.number}</CardTitle>
              <CardDescription>{room.type} Room</CardDescription>
            </div>
            <Badge
              variant={
                room.status === "AVAILABLE"
                  ? "success"
                  : room.status === "OCCUPIED" || room.status === "RESERVED"
                    ? "destructive"
                    : "outline"
              }
            >
              {room.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Room Type</h3>
              <p>{room.type}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Room Number</h3>
              <p>{room.number}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Price per Night</h3>
              <p>${room.price.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Capacity</h3>
              <p>
                {room.capacity} {room.capacity === 1 ? "Person" : "People"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p>{room.status}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
              <p>{new Date(room.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Description</h3>
            <p className="whitespace-pre-line">{room.description}</p>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((amenity) => (
                <Badge key={amenity} variant="outline">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          {room.images && room.images.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">Images</h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {room.images.map((image, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-md">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Room ${room.number} - Image ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

