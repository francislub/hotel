import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ActivityForm from "@/components/forms/activity-form"

export default function NewActivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add New Activity</h1>
        <p className="text-muted-foreground">Create a new activity for hotel guests.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Details</CardTitle>
          <CardDescription>Enter the details for the new activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityForm />
        </CardContent>
      </Card>
    </div>
  )
}

