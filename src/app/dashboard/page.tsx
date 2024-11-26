"use client"

import DashboardCard from "@/components/DashboardCard";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {IncomeChart} from "@/components/IncomeChart";
import TransactionListBlock from "@/components/TransactionListBlock";
import ManualAddTxModalButton from "@/app/dashboard/ManualAddTxModalButton";
import {useEffect, useState} from "react";
import {Spinner} from "@/components/ui/spinner";

import {z} from "zod";
import {redirect, useRouter} from "next/navigation";
import AddBudgetModalButton from "@/app/dashboard/AddBudgetModalButton";
import {Progress} from "@/components/ui/progress";
import {revalidatePath} from "next/cache";

interface Category {
    name: string;
}

interface Transaction {
    id: number;
    userId: number;
    categoryId: number;
    userCategoryId: number | null;
    date: string; // ISO string format for the date
    amount: string;
    note: string | null;
    type: "Expense" | "Income" | "RecurringExpense"; // Assuming type can be either "Expense" or "Income"
    payee: string;
    createdAt: string; // ISO string format for the created date
    category: Category;
    userCategory: Category | null; // Assuming userCategory is either null or a Category
}

interface Budget {
    id: number;
    userId: number;
    category: Category
    amount: number;
    createdAt: string; // ISO string format for the created date
}

type TransactionList = Transaction[];

const Dashboard = () => {

    const [summaryInfo, setSummaryInfo] = useState([
        {title: "Last Month Income", amount: 0, percentage: 0},
        {title: "Last Month Expense", amount: 0, percentage: 0},
        {title: "Recurring Expenses", amount: 0, percentage: 0},
        {title: "Net Income", amount: 0, percentage: 0},
    ])

    const [budgets, setbudgets] = useState<Budget[]>([])
    const [transactions, setTransactions] = useState<TransactionList>([])
    const [isTransactionsLoading, setIsTransactionsLoading] = useState(true)
    const [isSummaryLoading, setIsSummaryLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    const router = useRouter()

    useEffect(() => {
        fetch("/api/transactions")
            .then(res => res.json())
            .then(data => {
                setTransactions(data)
                setIsTransactionsLoading(false)
            })
            .catch(err => {
                setIsError(true)
                setIsTransactionsLoading(false)
            })

        // TODO: Add percentages logic
        fetch("/api/summary")
            .then(res => res.json())
            .then(data => {
                setSummaryInfo([
                    {title: "Last Month Income", amount: data.lastMonthIncome, percentage: 0},
                    {title: "Last Month Expense", amount: data.lastMonthExpense, percentage: 0},
                    {title: "Recurring Expenses", amount: data.lastMonthRecurringExpense, percentage: 0},
                    {title: "Net Income", amount: data.NetIncome, percentage: 0},
                ])
                setIsSummaryLoading(false)
            })
            .catch(err => {
                console.log(err)
                setIsSummaryLoading(false)
            })

        fetch("/api/budget")
            .then(res => res.json())
            .then(data => {
                setbudgets(data)
                setIsSummaryLoading(false)
            })
            .catch(err => {
                console.log(err)
                setIsSummaryLoading(false)
            })
    }, [])

    const methods = ["Cash", "Credit Card", "Bank Transfer", "Debit Card"] as const

    const handleDeleteBudget = (budgetId: number) => {
        fetch(`/api/budget?id=${budgetId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
        router.refresh()
    }

    return (
        <div className="py-20 h-screen justify-center">
            <div className="flex justify-between items-center mx-6">
                <h1 className="mx-6 scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl "> Welcome,
                    user! </h1>
                <div>
                    {/*<UploadImageModal/>*/}
                    <AddBudgetModalButton/>
                    <ManualAddTxModalButton/>
                </div>
            </div>
            <div className="flex flex-wrap h-screen sm:grid sm:grid-cols-5 sm:grid-rows-5 gap-4 content-center m-8">
                <div className="grid grid-cols-subgrid gap-4 col-span-2 row-span-2 h-full">
                    {summaryInfo.map((info) => (
                        <DashboardCard
                            amount={info.amount}
                            percentage={info.percentage}
                            title={info.title}
                            isLoading={isSummaryLoading}
                            key={info.title}
                        />
                    ))}
                </div>
                <Card className="col-start-1 col-end-3 row-start-3 row-end-6 m-2">
                    <CardHeader>
                        <CardTitle
                            onClick={() => router.push("/transactions")}
                        >
                            <div className="flex justify-between items-center">
                                <div className="cursor-pointer hover:underline">
                                    Recent Transactions (Click to view all)
                                </div>

                                <Button variant="outline" size="sm"
                                        onClick={() => window.location.reload()}> Refresh </Button>
                            </div>
                        </CardTitle>
                    </CardHeader>

                    {isTransactionsLoading ? (
                        <div className="flex justify-center items-center">
                            <Spinner show={true} size="large"/>
                        </div>
                    ) : isError ? (
                        <div className="flex justify-center items-center">
                            <p className="text-red-500">Error loading transactions</p>
                        </div>
                    ) : (
                        transactions.length > 0 ? (
                                <CardContent>
                                    {transactions.slice(0, 6).map((transaction) => (
                                        <TransactionListBlock
                                            key={transaction.id}
                                            amount={parseInt(transaction.amount)}
                                            payee={transaction.payee}
                                            category={transaction.category.name}
                                            expense={transaction.type === 'Expense' || transaction.type === 'RecurringExpense'}
                                        />
                                    ))}
                                </CardContent>) :
                            <div className="flex justify-center items-center">
                                <p className="text-gray-500">No transactions found</p>
                            </div>

                    )}
                </Card>
                <div className="col-start-3 col-end-6 row-start-1 row-end-4 m-2">
                    <IncomeChart/>
                </div>
                <div className="col-start-3 col-end-6 row-start-4 row-end-6 m-2 h-full my-2">
                    <Card>
                        <CardHeader>
                            <CardTitle> Monthly Budget Watch </CardTitle>
                        </CardHeader>
                        <CardContent className="max-h-96 overflow-y-auto">
                            {budgets.map((budget) => {
                                // Filter transactions for this budget category that are from the current month and year
                                const filteredTransactions = transactions.filter(transaction => {
                                    const date = new Date(transaction.date);
                                    return (
                                        date.getMonth() === new Date().getMonth() &&
                                        date.getFullYear() === new Date().getFullYear() &&
                                        transaction.category.name === budget.category.name // Match the category name
                                    );
                                });

                                // Sum the amounts of these filtered transactions
                                const totalSpent = filteredTransactions.reduce((sum, transaction) => sum + parseInt(transaction.amount), 0);

                                return (
                                    <div key={budget.category.name}
                                         className="mb-5 p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-md">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-center">
                                                <span
                                                    className="text-lg font-semibold text-gray-800">{budget.category.name}</span>
                                                <Button variant="destructive" size="sm"
                                                        onClick={() => handleDeleteBudget(budget.id)}> Delete </Button>
                                            </div>
                                            <span
                                                className="text-base text-gray-600">({totalSpent}/{budget.amount}):</span>
                                            <Progress
                                                value={parseInt(totalSpent) / 100}
                                                max={budget.amount / 100}
                                                className="w-full h-2 rounded-full bg-gray-300"
                                            />
                                        </div>
                                    </div>
                                );

                            })}
                        </CardContent>

                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;