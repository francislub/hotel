"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Trash2Icon, AlertTriangleIcon, ArrowLeft } from "lucide-react"
import { deleteStaffMember } from "@/lib/actions/staff-actions"

interface DeleteStaffPageProps {
  params: {
    id: string
  }
}

export default function DeleteStaffPage({ params }: DeleteStaffPageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      const result = await deleteStaffMember(params.id)

      if (result.success) {
        toast({
          title: "Staff member deleted",
          description: "The staff member has been deleted successfully.",
        })
        router.push("/dashboard/admin/staff")
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete staff member",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting staff member:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href={`/dashboard/admin/staff/${params.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Delete Staff Member</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-destructive flex items-center">
            <AlertTriangleIcon className="mr-2 h-5 w-5" />
            Confirm Deletion
          </CardTitle>
          <CardDescription>
            Are you sure you want to delete this staff member? This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Deleting this staff member will permanently remove them from the system. Their account will be deactivated
            and they will no longer be able to access the system.
          </p>
          <div className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">
            <p className="font-medium">Warning:</p>
            <p className="mt-1">
              This action is permanent and cannot be reversed. All data associated with this staff member will be
              removed.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete Staff Member"}
            <Trash2Icon className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

