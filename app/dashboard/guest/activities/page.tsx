import { GuestActivities } from "@/components/dashboard/guest-activities"
import { getActivities } from "@/lib/actions/activity-actions"

export default async function ActivitiesPage() {
  // Fetch activities from the database
  const activitiesResult = await getActivities()
  const activities = activitiesResult.success ? activitiesResult.data : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hotel Activities</h1>
        <p className="text-muted-foreground">Discover and book exciting activities during your stay</p>
      </div>

      <GuestActivities activities={activities} />
    </div>
  )
}

