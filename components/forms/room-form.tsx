"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { RoomStatus, RoomType } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { createRoom, updateRoom } from "@/lib/actions/room-actions"

const formSchema = z.object({
  number: z.string().min(1, "Room number is required"),
  type: z.nativeEnum(RoomType, {
    required_error: "Room type is required",
  }),
  price: z.coerce.number().positive("Price must be positive"),
  capacity: z.coerce.number().positive("Capacity must be positive"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  amenities: z.array(z.string()).min(1, "At least one amenity is required"),
  status: z.nativeEnum(RoomStatus).optional(),
  images: z.array(z.string()).optional(),
})

const amenitiesList = [
  { id: "wifi", label: "Free Wi-Fi" },
  { id: "tv", label: "Television" },
  { id: "ac", label: "Air Conditioning" },
  { id: "minibar", label: "Mini Bar" },
  { id: "safe", label: "Safe" },
  { id: "breakfast", label: "Breakfast Included" },
  { id: "gym", label: "Gym Access" },
  { id: "pool", label: "Pool Access" },
  { id: "spa", label: "Spa Access" },
  { id: "lounge", label: "Executive Lounge" },
]

type FormValues = z.infer<typeof formSchema>

interface RoomFormProps {
  initialData?: any
  isEditing?: boolean
}

export default function RoomForm({ initialData, isEditing = false }: RoomFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: Number.parseFloat(initialData.price),
          capacity: Number.parseInt(initialData.capacity),
        }
      : {
          number: "",
          type: undefined,
          price: 0,
          capacity: 1,
          description: "",
          amenities: [],
          status: RoomStatus.AVAILABLE,
          images: [],
        },
  })

  async function onSubmit(values: FormValues) {
    setIsLoading(true)

    try {
      if (isEditing && initialData?.id) {
        const result = await updateRoom(initialData.id, values)
        if (result.success) {
          toast({
            title: "Room updated",
            description: "The room has been updated successfully.",
          })
          router.push("/dashboard/admin/rooms")
          router.refresh()
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to update room",
            variant: "destructive",
          })
        }
      } else {
        const result = await createRoom(
          values.number,
          values.type,
          values.price,
          values.capacity,
          values.description,
          values.amenities,
          values.images || [],
        )
        if (result.success) {
          toast({
            title: "Room created",
            description: "The room has been created successfully.",
          })
          router.push("/dashboard/admin/rooms")
          router.refresh()
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to create room",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 101" {...field} />
                </FormControl>
                <FormDescription>A unique identifier for the room</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(RoomType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0) + type.slice(1).toLowerCase().replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>The category of the room</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per Night ($)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormDescription>The nightly rate for the room</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormDescription>Maximum number of guests</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {isEditing && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(RoomStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0) + status.slice(1).toLowerCase().replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Current availability status</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the room and its features" className="min-h-[120px]" {...field} />
              </FormControl>
              <FormDescription>Detailed description of the room</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amenities"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Amenities</FormLabel>
                <FormDescription>Select the amenities available in this room</FormDescription>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {amenitiesList.map((amenity) => (
                  <FormField
                    key={amenity.id}
                    control={form.control}
                    name="amenities"
                    render={({ field }) => {
                      return (
                        <FormItem key={amenity.id} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(amenity.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, amenity.id])
                                  : field.onChange(field.value?.filter((value) => value !== amenity.id))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{amenity.label}</FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEditing ? "Update Room" : "Create Room"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

