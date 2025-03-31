"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ServiceCategory } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { createService, updateService } from "@/lib/actions/service-actions"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  category: z.nativeEnum(ServiceCategory, {
    required_error: "Category is required",
  }),
})

type FormValues = z.infer<typeof formSchema>

interface ServiceFormProps {
  initialData?: any
  isEditing?: boolean
}

export default function ServiceForm({ initialData, isEditing = false }: ServiceFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: Number.parseFloat(initialData.price),
        }
      : {
          name: "",
          description: "",
          price: 0,
          category: undefined,
        },
  })

  async function onSubmit(values: FormValues) {
    setIsLoading(true)

    try {
      if (isEditing && initialData?.id) {
        const result = await updateService(initialData.id, values)
        if (result.success) {
          toast({
            title: "Service updated",
            description: "The service has been updated successfully.",
          })
          router.push("/dashboard/admin/services")
          router.refresh()
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to update service",
            variant: "destructive",
          })
        }
      } else {
        const result = await createService(values.name, values.description, values.price, values.category)
        if (result.success) {
          toast({
            title: "Service created",
            description: "The service has been created successfully.",
          })
          router.push("/dashboard/admin/services")
          router.refresh()
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to create service",
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
                <FormLabel>Service Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Room Service" {...field} />
                </FormControl>
                <FormDescription>The name of the service</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ServiceCategory).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>The category of the service</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormDescription>The price of the service</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the service and what it includes"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>Detailed description of the service</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEditing ? "Update Service" : "Create Service"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

