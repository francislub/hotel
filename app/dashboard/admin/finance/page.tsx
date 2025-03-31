import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, TrendingUp, TrendingDown, DollarSign, CreditCard, Calendar, Filter } from "lucide-react"
import { getTransactions } from "@/lib/actions/transaction-actions"
import { format } from "date-fns"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function FinancePage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  // Fetch transactions
  const transactionsResult = await getTransactions()
  const transactions = transactionsResult.success ? transactionsResult.data : []

  // Calculate financial metrics
  const totalIncome = transactions.filter((t) => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "EXPENSE").reduce((sum, t) => sum + t.amount, 0)

  const netProfit = totalIncome - totalExpenses

  // Get recent transactions
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financial Management</h1>
          <p className="text-muted-foreground">Track and manage your hotel's financial operations.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Financial Data
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <TrendingUp className="mr-1 h-4 w-4" />
                +12.5%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 flex items-center">
                <TrendingDown className="mr-1 h-4 w-4" />
                +8.2%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${netProfit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <TrendingUp className="mr-1 h-4 w-4" />
                +15.3%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$50,000.00</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">65%</span> of budget used
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Data Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Data</CardTitle>
          <CardDescription>View and manage your financial transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="transactions">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Recent Transactions</h3>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id.substring(0, 8)}</TableCell>
                      <TableCell>{format(new Date(transaction.date), "MMM dd, yyyy")}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === "INCOME" ? "success" : "destructive"}>
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Completed</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="income" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Income Sources</h3>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Income by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60 bg-muted/20 flex items-center justify-center">[Income Chart Placeholder]</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Monthly Income Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60 bg-muted/20 flex items-center justify-center">
                      [Income Trend Chart Placeholder]
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="expenses" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Expense Categories</h3>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Expenses by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60 bg-muted/20 flex items-center justify-center">
                      [Expenses Chart Placeholder]
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Monthly Expense Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60 bg-muted/20 flex items-center justify-center">
                      [Expense Trend Chart Placeholder]
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

