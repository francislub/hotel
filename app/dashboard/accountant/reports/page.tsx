"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, subMonths, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns"
import { CalendarIcon, Download, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { getFinancialSummary } from "@/lib/actions/transaction-actions"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("monthly")
  const [isLoading, setIsLoading] = useState(false)
  const [reportData, setReportData] = useState<any>(null)

  const [monthlyDate, setMonthlyDate] = useState<Date>(new Date())
  const [quarterlyDate, setQuarterlyDate] = useState<Date>(new Date())
  const [yearlyDate, setYearlyDate] = useState<Date>(new Date())

  const generateMonthlyReport = async () => {
    setIsLoading(true)
    try {
      const startDate = startOfMonth(monthlyDate)
      const endDate = endOfMonth(monthlyDate)

      const result = await getFinancialSummary(startDate, endDate)

      if (result.success) {
        setReportData(result.data)
        toast({
          title: "Report Generated",
          description: `Monthly report for ${format(monthlyDate, "MMMM yyyy")} has been generated.`,
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to generate report",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateQuarterlyReport = async () => {
    setIsLoading(true)
    try {
      // For simplicity, we'll use 3 months for quarterly report
      const startDate = startOfMonth(subMonths(quarterlyDate, 2))
      const endDate = endOfMonth(quarterlyDate)

      const result = await getFinancialSummary(startDate, endDate)

      if (result.success) {
        setReportData(result.data)
        toast({
          title: "Report Generated",
          description: `Quarterly report ending ${format(quarterlyDate, "MMMM yyyy")} has been generated.`,
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to generate report",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateYearlyReport = async () => {
    setIsLoading(true)
    try {
      const startDate = startOfYear(yearlyDate)
      const endDate = endOfYear(yearlyDate)

      const result = await getFinancialSummary(startDate, endDate)

      if (result.success) {
        setReportData(result.data)
        toast({
          title: "Report Generated",
          description: `Yearly report for ${format(yearlyDate, "yyyy")} has been generated.`,
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to generate report",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const downloadReport = () => {
    if (!reportData) return

    // In a real application, you would generate a PDF or Excel file
    // For now, we'll just show a toast
    toast({
      title: "Report Downloaded",
      description: "The report has been downloaded successfully.",
    })
  }

  // Prepare chart data
  const prepareExpensesChartData = () => {
    if (!reportData || !reportData.expensesByCategory) return []

    return Object.entries(reportData.expensesByCategory).map(([category, amount]) => ({
      name: category.replace("_", " "),
      value: amount,
    }))
  }

  const prepareIncomeChartData = () => {
    if (!reportData || !reportData.incomeByCategory) return []

    return Object.entries(reportData.incomeByCategory).map(([category, amount]) => ({
      name: category.replace("_", " "),
      value: amount,
    }))
  }

  const prepareSummaryChartData = () => {
    if (!reportData) return []

    return [
      {
        name: "Income",
        value: reportData.totalIncome,
      },
      {
        name: "Expenses",
        value: reportData.totalExpenses,
      },
      {
        name: "Net Profit",
        value: reportData.netProfit,
      },
    ]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Financial Reports</h1>
        {reportData && (
          <Button onClick={downloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Report</CardTitle>
              <CardDescription>Generate a financial report for a specific month.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Select Month</div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !monthlyDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {monthlyDate ? format(monthlyDate, "MMMM yyyy") : "Select month"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={monthlyDate} onSelect={setMonthlyDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button onClick={generateMonthlyReport} disabled={isLoading}>
                  {isLoading ? "Generating..." : "Generate Report"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quarterly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Report</CardTitle>
              <CardDescription>Generate a financial report for a specific quarter.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Select End Month of Quarter</div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !quarterlyDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {quarterlyDate ? format(quarterlyDate, "MMMM yyyy") : "Select month"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={quarterlyDate} onSelect={setQuarterlyDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button onClick={generateQuarterlyReport} disabled={isLoading}>
                  {isLoading ? "Generating..." : "Generate Report"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yearly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Yearly Report</CardTitle>
              <CardDescription>Generate a financial report for a specific year.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Select Year</div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !yearlyDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {yearlyDate ? format(yearlyDate, "yyyy") : "Select year"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={yearlyDate} onSelect={setYearlyDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button onClick={generateYearlyReport} disabled={isLoading}>
                  {isLoading ? "Generating..." : "Generate Report"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {reportData && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>Overview of income, expenses, and profit.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Total Income</div>
                  <div className="text-3xl font-bold text-green-600">ssp{reportData.totalIncome.toFixed(2)}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Total Expenses</div>
                  <div className="text-3xl font-bold text-red-600">ssp{reportData.totalExpenses.toFixed(2)}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Net Profit</div>
                  <div
                    className={`text-3xl font-bold ${reportData.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    ssp{reportData.netProfit.toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Expense Distribution</CardTitle>
                <CardDescription>Breakdown of expenses by category.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareExpensesChartData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {prepareExpensesChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Income Distribution</CardTitle>
                <CardDescription>Breakdown of income by category.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareIncomeChartData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {prepareIncomeChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
              <CardDescription>Summary of financial performance.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareSummaryChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Amount" barSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Report Details</CardTitle>
                <CardDescription>Detailed information about this report.</CardDescription>
              </div>
              <Button variant="outline" onClick={downloadReport}>
                <FileText className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Report Type</div>
                    <div className="font-medium">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Report</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Generated On</div>
                    <div className="font-medium">{format(new Date(), "PPP")}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Period</div>
                    <div className="font-medium">
                      {activeTab === "monthly" && format(monthlyDate, "MMMM yyyy")}
                      {activeTab === "quarterly" && `Quarter ending ${format(quarterlyDate, "MMMM yyyy")}`}
                      {activeTab === "yearly" && format(yearlyDate, "yyyy")}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Profit Margin</div>
                    <div className="font-medium">
                      {reportData.totalIncome > 0
                        ? `${((reportData.netProfit / reportData.totalIncome) * 100).toFixed(2)}%`
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

