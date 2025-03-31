"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { TransactionCategory, TransactionType } from "@prisma/client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { createTransaction, updateTransaction } from "@/lib/actions/transaction-actions"

const formSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  type: z.nativeEnum(TransactionType, {
    required_error: "Transaction type is required",
  }),
  category: z.nativeEnum(TransactionCategory, {
    required_error: "Category is required",
  }),
  date: z.date({
    required_error: "Date is required",
  }),
})

type FormValues = z.infer<typeof formSchema>

interface TransactionFormProps {
  initialData?: any
  isEditing?: boolean
}

export default function TransactionForm({ initialData, isEditing = false }: TransactionFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          amount: Number.parseFloat(initialData.amount),
          date: new Date(initialData.date),
        }
      : {
          amount: 0,
          description: "",
          type: undefined,
          category: undefined,
          date: new Date(),
        },
  })

  async function onSubmit(values: FormValues) {
    setIsLoading(true)

    try {
      if (isEditing && initialData?.id) {
        const result = await updateTransaction(initialData.id, values)
        if (result.success) {
          toast({
            title: "Transaction updated",
            description: "The transaction has been updated successfully.",
          })
          router.push("/dashboard/accountant/transactions")
          router.refresh()
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to update transaction",
            variant: "destructive",
          })
        }
      } else {
        const result = await createTransaction(
          values.amount,
          values.description,
          values.type,
          values.category,
          values.date,
        )
        if (result.success) {
          toast({
            title: "Transaction created",
            description: "The transaction has been created successfully.",
          })
          router.push("/dashboard/accountant/transactions")
          router.refresh()
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to create transaction",
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
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount ($)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormDescription>The transaction amount</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transaction Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(TransactionType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Whether this is income or expense</FormDescription>
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
                    {Object.values(TransactionCategory).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>The category of the transaction</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormDescription>The date of the transaction</FormDescription>
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
                <Textarea placeholder="Describe the transaction" className="min-h-[80px]" {...field} />
              </FormControl>
              <FormDescription>Details about the transaction</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEditing ? "Update Transaction" : "Create Transaction"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

