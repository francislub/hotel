"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Trash2Icon, AlertTriangleIcon, ArrowLeft } from "lucide-react"
import { deleteService } from "@/lib/actions/service-actions"

interface DeleteServicePageProps {
  params: {
    id: string
  }
}

export default function DeleteServicePage({ params }: DeleteServicePageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      const result = await deleteService(params.id)

      if (result.success) {
        toast({
          title: "Service deleted",
          description: "The service has been deleted successfully.",
        })
        router.push("/dashboard/admin/services")
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete service",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting service:", error)
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
        <Link href={`/dashboard/admin/services/${params.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Delete Service</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-destructive flex items-center">
            <AlertTriangleIcon className="mr-2 h-5 w-5" />
            Confirm Deletion
          </CardTitle>
          <CardDescription>Are you sure you want to delete this service? This action cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Deleting this service will permanently remove it from the system. Any historical data associated with this
            service will remain, but the service will no longer be available for bookings.
          </p>
          <div className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">
            <p className="font-medium">Warning:</p>
            <p className="mt-1">
              If the service is associated with any active bookings, you will not be able to delete it. You must first
              remove the service from all bookings.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete Service"}
            <Trash2Icon className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

