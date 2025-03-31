"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Role } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { registerUser } from "@/lib/actions/auth-actions"
import { updateStaffProfile } from "@/lib/actions/user-actions"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  department: z.string().min(2, "Department must be at least 2 characters"),
  phoneNumber: z.string().min(5, "Phone number must be at least 5 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  salary: z.coerce.number().positive("Salary must be positive"),
  role: z.enum([Role.ADMIN, Role.STAFF]),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
})

type FormValues = z.infer<typeof formSchema>

interface StaffFormProps {
  initialData?: any
  isEditing?: boolean
}

export default function StaffForm({ initialData, isEditing = false }: StaffFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          salary: Number.parseFloat(initialData.salary || 0),
          role: initialData.role || Role.STAFF,
        }
      : {
          name: "",
          email: "",
          position: "",
          department: "",
          phoneNumber: "",
          address: "",
          salary: 0,
          role: Role.STAFF,
          password: "",
        },
  })

  async function onSubmit(values: FormValues) {
    setIsLoading(true)

    try {
      if (isEditing && initialData?.id) {
        // Update existing staff member
        const result = await updateStaffProfile(initialData.id, {
          position: values.position,
          department: values.department,
          salary: values.salary,
          phoneNumber: values.phoneNumber,
          address: values.address,
        })

        if (result.success) {
          toast({
            title: "Staff member updated",
            description: "The staff member has been updated successfully.",
          })
          router.push("/dashboard/admin/staff")
          router.refresh()
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to update staff member",
            variant: "destructive",
          })
        }
      } else {
        // Create new staff member
        const result = await registerUser(
          values.name,
          values.email,
          values.password || "password123", // Default password if not provided
          values.role,
        )

        if (result.success) {
          toast({
            title: "Staff member created",
            description: "The staff member has been created successfully.",
          })
          router.push("/dashboard/admin/staff")
          router.refresh()
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to create staff member",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} disabled={isEditing} />
                </FormControl>
                <FormDescription>The staff member's full name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} disabled={isEditing} />
                </FormControl>
                <FormDescription>The staff member's email address</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input placeholder="Front Desk Manager" {...field} />
                </FormControl>
                <FormDescription>The staff member's job position</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input placeholder="Reception" {...field} />
                </FormControl>
                <FormDescription>The department they work in</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormDescription>Contact phone number</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary ($)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormDescription>Annual salary amount</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isEditing}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={Role.STAFF}>Staff</SelectItem>
                    <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>System access role</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isEditing && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormDescription>Initial password (min. 6 characters)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St, City, Country" {...field} />
              </FormControl>
              <FormDescription>Residential address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEditing ? "Update Staff Member" : "Create Staff Member"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

