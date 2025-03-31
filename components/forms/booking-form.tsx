"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format, addDays, differenceInDays } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { createBooking } from "@/lib/actions/booking-actions"
import { getAvailableRooms } from "@/lib/actions/room-actions"

const formSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  roomId: z.string().min(1, "Room is required"),
  checkIn: z.date({
    required_error: "Check-in date is required",
  }),
  checkOut: z.date({
    required_error: "Check-out date is required",
  }),
  guests: z.coerce.number().min(1, "At least 1 guest is required"),
  totalPrice: z.coerce.number().positive("Total price must be positive"),
})

type FormValues = z.infer<typeof formSchema>

interface BookingFormProps {
  userId: string
  initialCheckIn?: Date
  initialCheckOut?: Date
  initialGuests?: number
}

export default function BookingForm({ userId, initialCheckIn, initialCheckOut, initialGuests = 1 }: BookingFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [availableRooms, setAvailableRooms] = useState<any[]>([])
  const [selectedRoom, setSelectedRoom] = useState<any>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId,
      roomId: "",
      checkIn: initialCheckIn || new Date(),
      checkOut: initialCheckOut || addDays(new Date(), 1),
      guests: initialGuests,
      totalPrice: 0,
    },
  })

  const checkIn = form.watch("checkIn")
  const checkOut = form.watch("checkOut")
  const guests = form.watch("guests")
  const roomId = form.watch("roomId")

  // Fetch available rooms when dates or guests change
  useEffect(() => {
    async function fetchAvailableRooms() {
      if (checkIn && checkOut) {
        const result = await getAvailableRooms(checkIn, checkOut, guests)
        if (result.success) {
          setAvailableRooms(result.data)
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to fetch available rooms",
            variant: "destructive",
          })
        }
      }
    }

    fetchAvailableRooms()
  }, [checkIn, checkOut, guests])

  // Update selected room and total price when roomId changes
  useEffect(() => {
    if (roomId && availableRooms.length > 0) {
      const room = availableRooms.find((r) => r.id === roomId)
      setSelectedRoom(room)

      if (room && checkIn && checkOut) {
        const nights = Math.max(1, differenceInDays(checkOut, checkIn))
        const totalPrice = room.price * nights
        form.setValue("totalPrice", totalPrice)
      }
    }
  }, [roomId, availableRooms, checkIn, checkOut, form])

  async function onSubmit(values: FormValues) {
    setIsLoading(true)

    try {
      const result = await createBooking(
        values.userId,
        values.roomId,
        values.checkIn,
        values.checkOut,
        values.guests,
        values.totalPrice,
      )

      if (result.success) {
        toast({
          title: "Booking created",
          description: "Your booking has been created successfully.",
        })
        router.push("/dashboard/guest/bookings")
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to create booking",
          variant: "destructive",
        })
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
            name="checkIn"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Check-in Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>The date you will arrive at the hotel</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="checkOut"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Check-out Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date <= checkIn}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>The date you will leave the hotel</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Guests</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormDescription>How many people will be staying</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roomId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableRooms.length > 0 ? (
                      availableRooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.number} - {room.type} (${room.price}/night)
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No available rooms for selected dates
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>Available rooms for your selected dates</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {selectedRoom && (
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Booking Summary</h3>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span>Room:</span>
                <span>
                  {selectedRoom.number} - {selectedRoom.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Check-in:</span>
                <span>{format(checkIn, "PPP")}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-out:</span>
                <span>{format(checkOut, "PPP")}</span>
              </div>
              <div className="flex justify-between">
                <span>Nights:</span>
                <span>{Math.max(1, differenceInDays(checkOut, checkIn))}</span>
              </div>
              <div className="flex justify-between">
                <span>Guests:</span>
                <span>{guests}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total Price:</span>
                <span>${form.getValues("totalPrice").toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !selectedRoom}>
            {isLoading ? "Creating..." : "Create Booking"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

