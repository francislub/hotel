import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Hotel,
  Users,
  Calendar,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRightLeft,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { getAllBookings } from "@/lib/actions/booking-actions"
import { getRooms } from "@/lib/actions/room-actions"
import { getUsers } from "@/lib/actions/user-actions"
import { getTransactions } from "@/lib/actions/transaction-actions"
import { format } from "date-fns"

// Sample data for charts (in a real app, this would come from the database)
const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 4500 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 5500 },
  { name: "Jul", revenue: 7000 },
]

const occupancyData = [
  { name: "Jan", occupancy: 65 },
  { name: "Feb", occupancy: 59 },
  { name: "Mar", occupancy: 80 },
  { name: "Apr", occupancy: 81 },
  { name: "May", occupancy: 76 },
  { name: "Jun", occupancy: 85 },
  { name: "Jul", occupancy: 90 },
]

const roomTypeData = [
  { name: "Standard", value: 40 },
  { name: "Deluxe", value: 30 },
  { name: "Suite", value: 20 },
  { name: "Executive", value: 10 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default async function AdminDashboard() {
  // Fetch data from the database
  const bookingsResult = await getAllBookings()
  const roomsResult = await getRooms()
  const usersResult = await getUsers()
  const transactionsResult = await getTransactions()

  // Extract data or use empty arrays if fetch failed
  const bookings = bookingsResult.success ? bookingsResult.data : []
  const rooms = roomsResult.success ? roomsResult.data : []
  const users = usersResult.success ? usersResult.data : []
  const transactions = transactionsResult.success ? transactionsResult.data : []

  // Calculate dashboard metrics
  const totalRooms = rooms.length
  const occupiedRooms = rooms.filter((room) => room.status === "OCCUPIED").length
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

  const totalGuests = users.filter((user) => user.role === "GUEST").length
  const activeGuests = bookings.filter(
    (booking) => booking.status === "CHECKED_IN" || booking.status === "CONFIRMED",
  ).length

  const newBookings = bookings.filter(
    (booking) => new Date(booking.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  ).length

  // Calculate total revenue from transactions
  const totalRevenue = transactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  // Get recent bookings
  const recentBookings = bookings
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your hotel's performance.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
          <Button variant="outline">
            <TrendingUp className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +20.1%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +5.4%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{newBookings}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 flex items-center">
                <ArrowDownRight className="mr-1 h-4 w-4" />
                -2.5%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Guests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGuests}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-muted-foreground flex items-center">
                <ArrowRightLeft className="mr-1 h-4 w-4" />
                No change
              </span>{" "}
              from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="occupancy" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <div className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">No recent bookings found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.id.substring(0, 8)}</TableCell>
                    <TableCell>{booking.user.name}</TableCell>
                    <TableCell>
                      {booking.room.number} - {booking.room.type}
                    </TableCell>
                    <TableCell>{format(new Date(booking.checkIn), "MMM dd, yyyy")}</TableCell>
                    <TableCell>{format(new Date(booking.checkOut), "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          booking.status === "CONFIRMED"
                            ? "success"
                            : booking.status === "CHECKED_IN"
                              ? "info"
                              : booking.status === "PENDING"
                                ? "warning"
                                : "default"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>${booking.totalPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/admin/bookings/${booking.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <div className="mt-4 flex justify-end">
            <Link href="/dashboard/admin/bookings">
              <Button variant="outline">View All Bookings</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

