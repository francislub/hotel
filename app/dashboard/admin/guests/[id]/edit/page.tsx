import Link from "next/link"
import { notFound } from "next/navigation"
import { getGuestById } from "@/lib/actions/guest-actions"
import { Button } from "@/components/ui/button"
import { GuestForm } from "@/components/forms/guest-form"
import { ArrowLeft } from "lucide-react"

interface EditGuestPageProps {
  params: {
    id: string
  }
}

export default async function EditGuestPage({ params }: EditGuestPageProps) {
  const { id } = params
  const { success, data: guest, message } = await getGuestById(id)

  if (!success || !guest) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/admin/guests/${id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Guest</h1>
        </div>
      </div>

      <div className="max-w-2xl">
        <GuestForm guest={guest} />
      </div>
    </div>
  )
}

