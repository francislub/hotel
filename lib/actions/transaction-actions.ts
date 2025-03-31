"use server"

import prisma from "@/lib/db"
import { type TransactionCategory, TransactionType } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function getTransactions() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        date: "desc",
      },
    })
    return { success: true, data: transactions }
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return { success: false, message: "Failed to fetch transactions" }
  }
}

export async function getTransactionById(id: string) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id,
      },
    })

    if (!transaction) {
      return { success: false, message: "Transaction not found" }
    }

    return { success: true, data: transaction }
  } catch (error) {
    console.error("Error fetching transaction:", error)
    return { success: false, message: "Failed to fetch transaction" }
  }
}

export async function createTransaction(
  amount: number,
  description: string,
  type: TransactionType,
  category: TransactionCategory,
  date: Date,
) {
  try {
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        description,
        type,
        category,
        date,
      },
    })

    revalidatePath("/dashboard/accountant/transactions")
    return { success: true, data: transaction }
  } catch (error) {
    console.error("Error creating transaction:", error)
    return { success: false, message: "Failed to create transaction" }
  }
}

export async function updateTransaction(
  id: string,
  data: {
    amount?: number
    description?: string
    type?: TransactionType
    category?: TransactionCategory
    date?: Date
  },
) {
  try {
    const transaction = await prisma.transaction.update({
      where: {
        id,
      },
      data,
    })

    revalidatePath("/dashboard/accountant/transactions")
    return { success: true, data: transaction }
  } catch (error) {
    console.error("Error updating transaction:", error)
    return { success: false, message: "Failed to update transaction" }
  }
}

export async function deleteTransaction(id: string) {
  try {
    // Check if transaction exists
    const existingTransaction = await prisma.transaction.findUnique({
      where: {
        id,
      },
    })

    if (!existingTransaction) {
      return { success: false, message: "Transaction not found" }
    }

    await prisma.transaction.delete({
      where: {
        id,
      },
    })

    revalidatePath("/dashboard/accountant/transactions")
    return { success: true, message: "Transaction deleted successfully" }
  } catch (error) {
    console.error("Error deleting transaction:", error)
    return { success: false, message: "Failed to delete transaction" }
  }
}

export async function getFinancialSummary(startDate: Date, endDate: Date) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    // Calculate total income
    const totalIncome = transactions
      .filter((transaction) => transaction.type === TransactionType.INCOME)
      .reduce((sum, transaction) => sum + transaction.amount, 0)

    // Calculate total expenses
    const totalExpenses = transactions
      .filter((transaction) => transaction.type === TransactionType.EXPENSE)
      .reduce((sum, transaction) => sum + transaction.amount, 0)

    // Calculate net profit
    const netProfit = totalIncome - totalExpenses

    // Group expenses by category
    const expensesByCategory = transactions
      .filter((transaction) => transaction.type === TransactionType.EXPENSE)
      .reduce(
        (acc, transaction) => {
          const category = transaction.category
          if (!acc[category]) {
            acc[category] = 0
          }
          acc[category] += transaction.amount
          return acc
        },
        {} as Record<string, number>,
      )

    // Group income by category
    const incomeByCategory = transactions
      .filter((transaction) => transaction.type === TransactionType.INCOME)
      .reduce(
        (acc, transaction) => {
          const category = transaction.category
          if (!acc[category]) {
            acc[category] = 0
          }
          acc[category] += transaction.amount
          return acc
        },
        {} as Record<string, number>,
      )

    return {
      success: true,
      data: {
        totalIncome,
        totalExpenses,
        netProfit,
        expensesByCategory,
        incomeByCategory,
      },
    }
  } catch (error) {
    console.error("Error generating financial summary:", error)
    return { success: false, message: "Failed to generate financial summary" }
  }
}

