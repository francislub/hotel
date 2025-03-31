import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function GuestPreferencesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Stay Preferences</h1>
        <p className="text-muted-foreground">Customize your stay experience at Crown Hotel.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Room Preferences</CardTitle>
            <CardDescription>Set your preferences for room accommodations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room-type">Preferred Room Type</Label>
              <select id="room-type" className="w-full rounded-md border border-input bg-background px-3 py-2">
                <option value="standard">Standard Room</option>
                <option value="deluxe">Deluxe Room</option>
                <option value="suite">Suite</option>
                <option value="executive">Executive Suite</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bed-type">Preferred Bed Type</Label>
              <select id="bed-type" className="w-full rounded-md border border-input bg-background px-3 py-2">
                <option value="king">King Bed</option>
                <option value="queen">Queen Bed</option>
                <option value="twin">Twin Beds</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="floor-preference">Floor Preference</Label>
              <select id="floor-preference" className="w-full rounded-md border border-input bg-background px-3 py-2">
                <option value="any">No Preference</option>
                <option value="high">High Floor</option>
                <option value="middle">Middle Floor</option>
                <option value="low">Low Floor</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="non-smoking">Non-Smoking Room</Label>
                <p className="text-sm text-muted-foreground">Prefer a non-smoking room.</p>
              </div>
              <Switch id="non-smoking" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="quiet-room">Quiet Room</Label>
                <p className="text-sm text-muted-foreground">
                  Prefer a room away from elevators and high-traffic areas.
                </p>
              </div>
              <Switch id="quiet-room" defaultChecked />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Room Preferences</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Preferences</CardTitle>
            <CardDescription>Set your preferences for hotel services.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="check-in">Preferred Check-in Time</Label>
              <Input id="check-in" type="time" defaultValue="15:00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="check-out">Preferred Check-out Time</Label>
              <Input id="check-out" type="time" defaultValue="11:00" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="daily-housekeeping">Daily Housekeeping</Label>
                <p className="text-sm text-muted-foreground">Prefer daily housekeeping service.</p>
              </div>
              <Switch id="daily-housekeeping" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="turndown-service">Turndown Service</Label>
                <p className="text-sm text-muted-foreground">Prefer evening turndown service.</p>
              </div>
              <Switch id="turndown-service" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="wake-up-call">Wake-up Call Service</Label>
                <p className="text-sm text-muted-foreground">Prefer wake-up call service.</p>
              </div>
              <Switch id="wake-up-call" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Service Preferences</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dining Preferences</CardTitle>
            <CardDescription>Set your dining and dietary preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dietary-restrictions">Dietary Restrictions</Label>
              <Textarea
                id="dietary-restrictions"
                placeholder="e.g., Vegetarian, Gluten-free, Nut allergies"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="breakfast-preference">Breakfast Preference</Label>
              <select
                id="breakfast-preference"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="continental">Continental Breakfast</option>
                <option value="american">American Breakfast</option>
                <option value="buffet">Breakfast Buffet</option>
                <option value="room-service">Room Service Breakfast</option>
                <option value="none">No Breakfast</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="mini-bar">Mini Bar</Label>
                <p className="text-sm text-muted-foreground">Stock mini bar in room.</p>
              </div>
              <Switch id="mini-bar" defaultChecked />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Dining Preferences</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Special Requests</CardTitle>
            <CardDescription>Add any special requests for your stays.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="special-requests">Special Requests</Label>
              <Textarea
                id="special-requests"
                placeholder="e.g., Extra pillows, Specific room location, Accessibility needs"
                className="min-h-[150px]"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              We will do our best to accommodate your special requests, subject to availability.
            </p>
          </CardContent>
          <CardFooter>
            <Button>Save Special Requests</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

