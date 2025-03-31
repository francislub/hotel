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
import { getStaffMembers } from "@/lib/actions/staff-actions"

export default async function StaffPage() {
  // Fetch staff members from the database
  const staffResult = await getStaffMembers()
  const staffMembers = staffResult.success ? staffResult.data : []

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
          {staffMembers.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2">
              <p className="text-muted-foreground">No staff members found</p>
              <Link href="/dashboard/admin/staff/new">
                <Button variant="outline" size="sm">
                  Add your first staff member
                </Button>
              </Link>
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}

