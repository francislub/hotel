"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { deleteGuest } from "@/lib/actions/guest-actions"
import { ArrowLeft, AlertTriangle } from "lucide-react"

interface DeleteGuestPageProps {
  params: {
    id: string
  }
}

export default function DeleteGuestPage({ params }: DeleteGuestPageProps) {
  const { id } = params
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const result = await deleteGuest(id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Guest deleted successfully",
        })
        router.push("/dashboard/admin/guests")
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete guest",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/admin/guests/${id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Delete Guest</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Confirm Deletion
          </CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete the guest account and all associated data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Are you sure you want to delete this guest? All bookings history and preferences will be permanently
            removed.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/admin/guests/${id}`}>Cancel</Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete Guest"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

