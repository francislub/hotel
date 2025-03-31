"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { CalendarIcon, Clock, MapPin, Users, Info } from "lucide-react"

type Activity = {
  id: string
  title: string
  description: string
  image: string
  date: Date
  duration: string
  location: string
  capacity: number
  remaining: number
  price: number
  category: string
}

interface GuestActivitiesProps {
  activities: Activity[]
}

export function GuestActivities({ activities }: GuestActivitiesProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const filteredActivities = activities
    .filter((activity) => {
      if (activeTab === "all") return true
      return activity.category.toLowerCase() === activeTab.toLowerCase()
    })
    .filter((activity) => {
      if (!selectedDate) return true
      const activityDate = new Date(activity.date)
      return (
        activityDate.getDate() === selectedDate.getDate() &&
        activityDate.getMonth() === selectedDate.getMonth() &&
        activityDate.getFullYear() === selectedDate.getFullYear()
      )
    })

  const handleBookActivity = (activityId: string) => {
    // In a real app, you would call an API to book the activity
    toast({
      title: "Activity Booked",
      description: "You have successfully booked this activity.",
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Filter Activities</CardTitle>
            <CardDescription>Find activities by category or date</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Categories</h3>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-2">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="wellness">Wellness</TabsTrigger>
                </TabsList>
                <TabsList className="grid grid-cols-2 mb-2">
                  <TabsTrigger value="food & drink">Food & Drink</TabsTrigger>
                  <TabsTrigger value="excursion">Excursions</TabsTrigger>
                </TabsList>
                <TabsList className="grid grid-cols-1">
                  <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Select Date</h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="border rounded-md p-2"
              />
              {selectedDate && (
                <Button variant="ghost" className="mt-2 w-full" onClick={() => setSelectedDate(undefined)}>
                  Clear Date
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>Contact our activities coordinator</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Our team can help you plan custom activities or provide more information about our offerings.
            </p>
            <Button className="w-full">Contact Concierge</Button>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <div className="space-y-6">
          {filteredActivities.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No activities found</h3>
                <p className="text-muted-foreground mt-1">Try changing your filters or selecting a different date</p>
              </CardContent>
            </Card>
          ) : (
            filteredActivities.map((activity) => (
              <Card key={activity.id} className="overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3 h-48 md:h-auto relative">
                    <img
                      src={activity.image || "/placeholder.svg"}
                      alt={activity.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2">{activity.category}</Badge>
                  </div>
                  <div className="md:w-2/3">
                    <CardHeader>
                      <CardTitle>{activity.title}</CardTitle>
                      <CardDescription>{activity.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {new Date(activity.date).toLocaleDateString(undefined, {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {new Date(activity.date).toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {" • "}
                            {activity.duration}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{activity.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {activity.remaining} spots left of {activity.capacity}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <div className="text-lg font-bold">
                        ${activity.price} <span className="text-sm font-normal text-muted-foreground">per person</span>
                      </div>
                      <Button onClick={() => handleBookActivity(activity.id)}>Book Activity</Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

