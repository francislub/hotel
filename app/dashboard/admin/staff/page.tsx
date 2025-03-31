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
import { Plus, MoreHorizontal, PencilIcon, Trash2Icon, EyeIcon } from "lucide-react"

// Sample staff data
const staffMembers = [
  {
    id: "1",
    name: "John Smith",
    position: "Manager",
    department: "Administration",
    email: "john.smith@crownhotel.com",
    phone: "+1 (555) 123-4567",
    status: "Active",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    position: "Front Desk",
    department: "Reception",
    email: "sarah.johnson@crownhotel.com",
    phone: "+1 (555) 234-5678",
    status: "Active",
  },
  {
    id: "3",
    name: "Michael Brown",
    position: "Chef",
    department: "Kitchen",
    email: "michael.brown@crownhotel.com",
    phone: "+1 (555) 345-6789",
    status: "On Leave",
  },
  {
    id: "4",
    name: "Emily Davis",
    position: "Housekeeper",
    department: "Housekeeping",
    email: "emily.davis@crownhotel.com",
    phone: "+1 (555) 456-7890",
    status: "Active",
  },
  {
    id: "5",
    name: "Robert Wilson",
    position: "Maintenance",
    department: "Facilities",
    email: "robert.wilson@crownhotel.com",
    phone: "+1 (555) 567-8901",
    status: "Inactive",
  },
]

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Staff Management</h1>
        <Link href="/dashboard/admin/staff/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Staff Member
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Staff Members</CardTitle>
          <CardDescription>
            Manage all staff members in the hotel. Add, edit, or remove staff as needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffMembers.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.name}</TableCell>
                    <TableCell>{staff.position}</TableCell>
                    <TableCell>{staff.department}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{staff.phone}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          staff.status === "Active"
                            ? "success"
                            : staff.status === "On Leave"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {staff.status}
                      </Badge>
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
                            <Link href={`/dashboard/admin/staff/${staff.id}`}>
                              <EyeIcon className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/admin/staff/${staff.id}/edit`}>
                              <PencilIcon className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/admin/staff/${staff.id}/delete`}>
                              <Trash2Icon className="mr-2 h-4 w-4" />
                              Delete
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

