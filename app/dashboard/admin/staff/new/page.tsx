import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import StaffForm from "@/components/forms/staff-form"

export default function NewStaffPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add New Staff Member</h1>
        <p className="text-muted-foreground">Create a new staff member in the hotel system.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Details</CardTitle>
          <CardDescription>Enter the details for the new staff member.</CardDescription>
        </CardHeader>
        <CardContent>
          <StaffForm />
        </CardContent>
      </Card>
    </div>
  )
}

