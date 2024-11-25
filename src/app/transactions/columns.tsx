"use client"

import { ColumnDef } from "@tanstack/react-table"
import {Badge} from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {ArrowUpDown, MoreHorizontal} from "lucide-react"
import {Button} from "@/components/ui/button";

type Category = {
    id: string
    name: string
}

export type Transaction = {
    id: string
    amount: number
    date: string
    type: "Income" | "Expense" | "RecurringExpense"
    payee: string
    method: string
    category: Category
    expense: boolean
}

const categoryColors = {
    income: 'bg-green-500',
    rent: 'bg-blue-500',
    entertainment: 'bg-yellow-500',
    transportation: 'bg-red-500',
    food: 'bg-purple-500',
};

const methodColors = {
    cash: 'bg-amber-500',
    creditcard: 'bg-rose-500',
    banktransfer: 'bg-lime-600',
    debitcard: 'bg-cyan-500',
};

const handleDelete = (itemId: number) => {
    fetch(`/api/transactions?id=${itemId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
}

const handleAddImage = (itemId: number) => {

}

// https://ui.shadcn.com/docs/components/data-table
export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: "Number",
        header: "#",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "amount",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        sortingFn: (rowA, rowB, columnId) => {
            const amountA = rowA.getValue(columnId) as number;
            const amountB = rowB.getValue(columnId) as number;

            // Check if either row is of type 'expense' and invert the sign of the amount
            const isExpenseA = rowA.original.type === "Expense";
            const isExpenseB = rowB.original.type === "Expense";

            const adjustedAmountA = isExpenseA ? -amountA : amountA;
            const adjustedAmountB = isExpenseB ? -amountB : amountB;

            return adjustedAmountA - adjustedAmountB;
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"))
            const formatted = new Intl.NumberFormat("th-TH", {
                style: "currency",
                currency: "THB",
            }).format(amount)

            let style

            if (row.original.type === "Income") {
                style = {
                    color: "green",
                    fontWeight: "bold",
                }
            } else {
                style = {
                    color: "red",
                    fontWeight: "bold",
                }
            }

            return <span style={style}>{formatted}</span>
        },
    },
    {
        accessorKey: "payee",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Payee
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("date"))
            return date.toLocaleDateString("en-GB" +
                "", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        },
    },
    {
        accessorKey: "method",
        header: "Method",
        cell: ({ row }) => {
            const method = row.original.method || "N/A";

            // Get the category color, default to gray if not found
            const methodColor = methodColors[method.toLowerCase()] || 'bg-gray-700';

            return (
                <Badge className={`text-white ${methodColor}`}>
                    {method}
                </Badge>
            );
        },
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
            const category = row.original.category.name || "N/A";

            // Get the category color, default to gray if not found
            const categoryColor = categoryColors[category.toLowerCase()] || 'bg-gray-500';

            return (
                <Badge className={`text-white ${categoryColor}`}>
                    {category}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const payment = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => handleDelete(parseInt(row.original.id))}
                        >
                            Delete Transaction
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
