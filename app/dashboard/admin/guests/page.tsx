import Link from "next/link"
import { getGuests } from "@/lib/actions/guest-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Pencil, Trash } from "lucide-react"

export default async function GuestsPage() {
  const { success, data: guests, message } = await getGuests()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Guests Management</h1>
        <Button asChild>
          <Link href="/dashboard/admin/guests/new">Add New Guest</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Guests</CardTitle>
          <CardDescription>Manage hotel guests and their information.</CardDescription>
        </CardHeader>
        <CardContent>
          {!success ? (
            <div className="text-center py-4 text-muted-foreground">{message || "Failed to load guests"}</div>
          ) : guests && guests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guests.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell className="font-medium">{guest.name}</TableCell>
                    <TableCell>{guest.email}</TableCell>
                    <TableCell>{guest.guestProfile?.phone || "N/A"}</TableCell>
                    <TableCell className="truncate max-w-[200px]">{guest.guestProfile?.address || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/dashboard/admin/guests/${guest.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/dashboard/admin/guests/${guest.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/dashboard/admin/guests/${guest.id}/delete`}>
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4 text-muted-foreground">No guests found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

