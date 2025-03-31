import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PencilIcon, ArrowLeft } from "lucide-react"
import { getStaffMemberById } from "@/lib/actions/staff-actions"

interface StaffDetailsPageProps {
  params: {
    id: string
  }
}

export default async function StaffDetailsPage({ params }: StaffDetailsPageProps) {
  const { success, data: staff, message } = await getStaffMemberById(params.id)

  if (!success || !staff) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/admin/staff">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Staff Details</h1>
        </div>
        <Link href={`/dashboard/admin/staff/${params.id}/edit`}>
          <Button>
            <PencilIcon className="mr-2 h-4 w-4" />
            Edit Staff Member
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{staff.name}</CardTitle>
              <CardDescription>{staff.position}</CardDescription>
            </div>
            <Badge
              variant={staff.status === "Active" ? "success" : staff.status === "On Leave" ? "warning" : "destructive"}
            >
              {staff.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Position</h3>
              <p>{staff.position}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
              <p>{staff.department}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p>{staff.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
              <p>{staff.phone || "Not provided"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
              <p>{staff.role}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Hire Date</h3>
              <p>{staff.hireDate ? new Date(staff.hireDate).toLocaleDateString() : "Not provided"}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Address</h3>
            <p>{staff.address || "Not provided"}</p>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Salary</h3>
            <p>${staff.salary?.toFixed(2) || "0.00"} per year</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

