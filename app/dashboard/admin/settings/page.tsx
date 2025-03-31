import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your hotel system settings and preferences.</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Hotel Information</CardTitle>
              <CardDescription>Update your hotel's basic information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hotel-name">Hotel Name</Label>
                <Input id="hotel-name" defaultValue="Crown Hotel" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotel-address">Address</Label>
                <Input id="hotel-address" defaultValue="123 Luxury Avenue, New York, NY 10001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotel-phone">Phone Number</Label>
                <Input id="hotel-phone" defaultValue="+1 (555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotel-email">Email</Label>
                <Input id="hotel-email" defaultValue="info@crownhotel.com" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>Set your hotel's check-in and check-out times.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="check-in-time">Check-in Time</Label>
                <Input id="check-in-time" type="time" defaultValue="14:00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="check-out-time">Check-out Time</Label>
                <Input id="check-out-time" type="time" defaultValue="11:00" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure when and how you receive email notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="new-booking">New Booking Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive an email when a new booking is made.</p>
                </div>
                <Switch id="new-booking" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="booking-cancel">Booking Cancellation</Label>
                  <p className="text-sm text-muted-foreground">Receive an email when a booking is cancelled.</p>
                </div>
                <Switch id="booking-cancel" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="guest-message">Guest Messages</Label>
                  <p className="text-sm text-muted-foreground">Receive an email when a guest sends a message.</p>
                </div>
                <Switch id="guest-message" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Notifications</CardTitle>
              <CardDescription>Configure system-level notification settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="low-inventory">Low Inventory Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when inventory items are running low.
                  </p>
                </div>
                <Switch id="low-inventory" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenance">Maintenance Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications for scheduled maintenance.</p>
                </div>
                <Switch id="maintenance" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Password Settings</CardTitle>
              <CardDescription>Update your password and security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Password</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable-2fa">Enable Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require a verification code when logging in.</p>
                </div>
                <Switch id="enable-2fa" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Configure 2FA</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>Configure system-wide settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable dark mode for the dashboard.</p>
                </div>
                <Switch id="dark-mode" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-logout">Auto Logout</Label>
                  <p className="text-sm text-muted-foreground">Automatically log out after 30 minutes of inactivity.</p>
                </div>
                <Switch id="auto-logout" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Manage your system data and backups.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Database Backup</Label>
                <p className="text-sm text-muted-foreground">Create a backup of your system data.</p>
                <Button variant="outline" className="mt-2">
                  Create Backup
                </Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Export Data</Label>
                <p className="text-sm text-muted-foreground">Export your system data in CSV format.</p>
                <Button variant="outline" className="mt-2">
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

