import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import StaffForm from "@/components/forms/staff-form"
import { getStaffMemberById } from "@/lib/actions/staff-actions"

interface EditStaffPageProps {
  params: {
    id: string
  }
}

export default async function EditStaffPage({ params }: EditStaffPageProps) {
  const { success, data: staff, message } = await getStaffMemberById(params.id)

  if (!success || !staff) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Staff Member</h1>
        <p className="text-muted-foreground">Update the details for {staff.name}.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Details</CardTitle>
          <CardDescription>Make changes to the staff information below.</CardDescription>
        </CardHeader>
        <CardContent>
          <StaffForm initialData={staff} isEditing />
        </CardContent>
      </Card>
    </div>
  )
}

