import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, FileText, TrendingUp, Calendar, Filter } from "lucide-react"
import { getTransactions } from "@/lib/actions/transaction-actions"
import { getAllBookings } from "@/lib/actions/booking-actions"
import { getRooms } from "@/lib/actions/room-actions"

export default async function ReportsPage() {
  // Fetch data for reports
  const transactionsResult = await getTransactions()
  const bookingsResult = await getAllBookings()
  const roomsResult = await getRooms()

  const transactions = transactionsResult.success ? transactionsResult.data : []
  const bookings = bookingsResult.success ? bookingsResult.data : []
  const rooms = roomsResult.success ? roomsResult.data : []

  // Calculate revenue metrics
  const totalRevenue = transactions.filter((t) => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0)

  const monthlyRevenue = transactions
    .filter((t) => t.type === "INCOME" && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0)

  // Calculate occupancy metrics
  const totalRooms = rooms.length
  const occupiedRooms = rooms.filter((r) => r.status === "OCCUPIED").length
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">View and generate reports for your hotel operations.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Lifetime revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">Current occupancy</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
            <p className="text-xs text-muted-foreground">All-time bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="financial">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
              <TabsTrigger value="guest">Guest Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="financial" className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Financial Reports</h3>
              <p className="text-muted-foreground">
                View detailed financial reports including revenue, expenses, and profit margins.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Revenue Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60 bg-muted/20 flex items-center justify-center">[Revenue Chart Placeholder]</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Expense Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60 bg-muted/20 flex items-center justify-center">[Expense Chart Placeholder]</div>
                  </CardContent>
                </Card>
              </div>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download Financial Report
              </Button>
            </TabsContent>
            <TabsContent value="occupancy" className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Occupancy Reports</h3>
              <p className="text-muted-foreground">
                View detailed occupancy reports including room utilization and seasonal trends.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Occupancy by Room Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60 bg-muted/20 flex items-center justify-center">
                      [Occupancy Chart Placeholder]
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Seasonal Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60 bg-muted/20 flex items-center justify-center">[Trends Chart Placeholder]</div>
                  </CardContent>
                </Card>
              </div>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download Occupancy Report
              </Button>
            </TabsContent>
            <TabsContent value="guest" className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Guest Analytics</h3>
              <p className="text-muted-foreground">
                View detailed guest analytics including demographics and booking patterns.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Guest Demographics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60 bg-muted/20 flex items-center justify-center">
                      [Demographics Chart Placeholder]
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Booking Patterns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60 bg-muted/20 flex items-center justify-center">
                      [Booking Patterns Chart Placeholder]
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download Guest Analytics Report
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

