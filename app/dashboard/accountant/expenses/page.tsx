"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, MoreHorizontal, PencilIcon, Trash2Icon, EyeIcon, Download, Filter } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

// Sample expenses data
const expenses = [
  {
    id: "1",
    date: "2023-07-15",
    description: "Staff Salaries - July First Half",
    category: "Salary",
    amount: 12500.0,
    paymentMethod: "Bank Transfer",
    status: "Paid",
  },
  {
    id: "2",
    date: "2023-07-14",
    description: "Utility Bills - Electricity",
    category: "Utilities",
    amount: 3250.75,
    paymentMethod: "Direct Debit",
    status: "Paid",
  },
  {
    id: "3",
    date: "2023-07-12",
    description: "Food Supplies - Restaurant",
    category: "Food & Beverage",
    amount: 4750.5,
    paymentMethod: "Credit Card",
    status: "Paid",
  },
  {
    id: "4",
    date: "2023-07-10",
    description: "Maintenance - Pool Cleaning",
    category: "Maintenance",
    amount: 850.0,
    paymentMethod: "Cash",
    status: "Paid",
  },
  {
    id: "5",
    date: "2023-07-08",
    description: "Marketing - Social Media Campaign",
    category: "Marketing",
    amount: 1500.0,
    paymentMethod: "Credit Card",
    status: "Pending",
  },
  {
    id: "6",
    date: "2023-07-05",
    description: "Linen and Towels Replacement",
    category: "Supplies",
    amount: 2200.0,
    paymentMethod: "Credit Card",
    status: "Paid",
  },
  {
    id: "7",
    date: "2023-07-03",
    description: "Insurance Premium - Quarterly",
    category: "Insurance",
    amount: 3800.0,
    paymentMethod: "Bank Transfer",
    status: "Paid",
  },
]

// Chart data
const categoryData = [
  { name: "Salary", value: 12500 },
  { name: "Utilities", value: 3250.75 },
  { name: "Food & Beverage", value: 4750.5 },
  { name: "Maintenance", value: 850 },
  { name: "Marketing", value: 1500 },
  { name: "Supplies", value: 2200 },
  { name: "Insurance", value: 3800 },
]

const monthlyData = [
  { name: "Jan", amount: 22000 },
  { name: "Feb", amount: 24000 },
  { name: "Mar", amount: 25000 },
  { name: "Apr", amount: 27000 },
  { name: "May", amount: 26000 },
  { name: "Jun", amount: 28000 },
  { name: "Jul", amount: 28850.25 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFEFD5"]

export default function ExpensesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined })

  const filteredExpenses = expenses.filter((expense) => {
    // Search term filter
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase())

    // Category filter
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter

    // Status filter
    const matchesStatus = statusFilter === "all" || expense.status === statusFilter

    // Date range filter
    let matchesDateRange = true
    if (dateRange.from && dateRange.to) {
      const expenseDate = new Date(expense.date)
      matchesDateRange = expenseDate >= dateRange.from && expenseDate <= dateRange.to
    }

    return matchesSearch && matchesCategory && matchesStatus && matchesDateRange
  })

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Expense Management</h1>
        <Link href="/dashboard/accountant/expenses/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>Distribution of expenses across different categories</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
            <CardDescription>Expense trends over the past months</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Bar dataKey="amount" fill="#8884d8" name="Expense Amount" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
          <CardDescription>Manage and track all expenses. Total: ${totalExpenses.toFixed(2)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Salary">Salary</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Supplies">Supplies</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{expense.category}</Badge>
                    </TableCell>
                    <TableCell>${expense.amount.toFixed(2)}</TableCell>
                    <TableCell>{expense.paymentMethod}</TableCell>
                    <TableCell>
                      <Badge variant={expense.status === "Paid" ? "success" : "warning"}>{expense.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/accountant/expenses/${expense.id}`}>
                              <EyeIcon className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/accountant/expenses/${expense.id}/edit`}>
                              <PencilIcon className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/accountant/expenses/${expense.id}/delete`}>
                              <Trash2Icon className="mr-2 h-4 w-4" />
                              Delete
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download Receipt
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredExpenses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No expenses found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

