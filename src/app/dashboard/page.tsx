import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import DashboardCard from "@/components/DashboardCard";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {IncomeChart} from "@/components/IncomeChart";
import TransactionListBlock from "@/components/TransactionListBlock";
import ManualAddTxModalButton from "@/app/dashboard/ManualAddTxModalButton";


const Dashboard = async () => {

    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/auth/login')
    }

    const recentTransactions = [
        {amount: 299, category: "Food", payee:"Some restaurant", expense:true},
        {amount: 15000, category: "Income", payee:"Job", expense:false},
    ]

    const cardInfo = [
        {title: "Last Month Income", amount: 8000, percentage: 8},
        {title: "Last Month Expense", amount: 6835, percentage: -12},
        {title: "Recurring Expenses", amount: 349, percentage: 0},
        {title: "Most Spent Category", amount: 0, percentage: 0},
    ]

    return (
        <div className="py-20 h-screen justify-center">
            <div className="flex justify-between items-center mx-6">
                <h1 className="mx-6 scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl "> Welcome, {data.user.email} </h1>
                <div>
                    <Button className="mx-2"> Import from QR-Payment Slip</Button>
                    <ManualAddTxModalButton/>
                </div>
            </div>
            <div className="flex flex-wrap h-screen sm:grid sm:grid-cols-5 sm:grid-rows-5 gap-4 content-center m-8">
                <div className="grid grid-cols-subgrid gap-4 col-span-2 row-span-2 h-full">
                    { cardInfo.map((info) => (
                        <DashboardCard
                            amount={info.amount}
                            percentage={info.percentage}
                            title={info.title}
                            key={info.title}
                        />
                        ))}
                </div>
                <Card className="col-start-1 col-end-3 row-start-3 row-end-6 m-2">
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        { recentTransactions.map((transaction) => (
                            <TransactionListBlock key={transaction.amount + transaction.payee} amount={transaction.amount} payee={transaction.payee} category={transaction.category} expense={transaction.expense}/>
                            ))}
                    </CardContent>
                </Card>
                <div className="col-start-3 col-end-6 row-start-1 row-end-4 m-2">
                    <IncomeChart/>
                </div>
                <div className="col-start-3 col-end-6 row-start-4 row-end-6 m-2 h-full my-2">
                    <Card>
                        <CardHeader>
                            <CardTitle> Transaction Trends </CardTitle>
                        </CardHeader>
                        <CardContent>

                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;