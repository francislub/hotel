"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function BookingForm() {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [guests, setGuests] = useState<string>("1")
  const [roomType, setRoomType] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real application, you would validate the form and then redirect
    // For now, we'll just redirect to the rooms page

    router.push(
      `/rooms?checkIn=${checkIn?.toISOString()}&checkOut=${checkOut?.toISOString()}&guests=${guests}&roomType=${roomType}`,
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 p-6 md:grid-cols-4 lg:grid-cols-5">
      <div className="space-y-2">
        <label htmlFor="check-in" className="text-sm font-medium">
          Check-in
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="check-in"
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !checkIn && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {checkIn ? format(checkIn, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={checkIn}
              onSelect={setCheckIn}
              initialFocus
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label htmlFor="check-out" className="text-sm font-medium">
          Check-out
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="check-out"
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !checkOut && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {checkOut ? format(checkOut, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={checkOut}
              onSelect={setCheckOut}
              initialFocus
              disabled={(date) => !checkIn || date <= checkIn}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label htmlFor="guests" className="text-sm font-medium">
          Guests
        </label>
        <Select value={guests} onValueChange={setGuests}>
          <SelectTrigger id="guests">
            <SelectValue placeholder="Select guests" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Guest</SelectItem>
            <SelectItem value="2">2 Guests</SelectItem>
            <SelectItem value="3">3 Guests</SelectItem>
            <SelectItem value="4">4 Guests</SelectItem>
            <SelectItem value="5">5+ Guests</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="room-type" className="text-sm font-medium">
          Room Type
        </label>
        <Select value={roomType} onValueChange={setRoomType}>
          <SelectTrigger id="room-type">
            <SelectValue placeholder="Select room type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard Room</SelectItem>
            <SelectItem value="deluxe">Deluxe Room</SelectItem>
            <SelectItem value="suite">Suite</SelectItem>
            <SelectItem value="executive">Executive Suite</SelectItem>
            <SelectItem value="family">Family Room</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
          Search
        </Button>
      </div>
    </form>
  )
}

