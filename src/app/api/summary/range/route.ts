import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";
import {Decimal} from "@prisma/client/runtime/binary";

export async function GET(request: NextRequest, response: NextResponse) {

    const fromParam = request.nextUrl.searchParams.get("from")
    const toParam = request.nextUrl.searchParams.get("to")

    //Expects YYYY-MM-DD Format from params (2024-11-30) or (2024-05-01) needs padding

    if (!fromParam || !toParam) {
       return NextResponse.json({message: 'Both from and to parameters are required'}, {status: 400})
    }

    const fromDate = new Date(fromParam);
    const toDate = new Date(toParam);

    const supabaseId = request.headers.get("x-supabase-id")

    if (!supabaseId) {
        return NextResponse.json({message: "Error fetching user"}, {status: 401})
    }

    const user = await prisma.user.findUnique({
        where: {
            supabaseId: supabaseId
        }
    })

    if (user) {
        const transactions = await prisma.transaction.findMany({
            where: {
                userId: user.id,
                date: {
                    gte: fromDate.toISOString(),
                    lte: toDate.toISOString(),
                },
            },
            include: {
                category: {
                    select: {
                        name: true
                    }
                },
                userCategory: {
                    select: {
                        name: true
                    }
                }
            }
        })

        const result = [];

        const currentDate = new Date(fromDate);
        const today = new Date(); // Current date

        while (currentDate <= today) {

            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

            // If it's the current month, set the end date to today
            let endOfMonth: Date;
            if (currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()) {
                endOfMonth = today; // Current month ends today
            } else {
                // Otherwise, set the end date to the last day of the current month
                endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Last day of the month
            }

            // Filter transactions for the current month (from startOfMonth to endOfMonth)
            const txs = transactions.filter(transaction => {
                const transactionDate = transaction.date;
                return transactionDate >= startOfMonth && transactionDate <= endOfMonth;
            });

            // Calculate income
            const income = txs.reduce((total: Decimal, transaction) => {
                if (transaction.type === "Income") {
                    return total.plus(transaction.amount);
                }
                return total;
            }, new Decimal(0));

            // Calculate expense
            const expense = txs.reduce((total: Decimal, transaction) => {
                if (transaction.type === "Expense" || transaction.type === "RecurringExpense") {
                    return total.plus(transaction.amount);
                }
                return total;
            }, new Decimal(0));

            result.push({
                month: currentDate.toLocaleString("en-US", {month: "short", year: "numeric"}),
                fromDate: startOfMonth.toISOString(),
                toDate: endOfMonth.toISOString(),
                income: income.toNumber(),
                expense: expense.toNumber(),
            });

            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        return NextResponse.json(result)
    }

    return NextResponse.json({message: 'Error fetching user or transactions in range'}, {status: 500})
}