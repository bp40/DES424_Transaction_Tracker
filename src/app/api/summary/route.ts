import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";
import {Decimal} from "@prisma/client/runtime/binary";

export async function GET(request: NextRequest, response: NextResponse) {

    const supabaseId = request.headers.get("x-supabase-id")

    if (!supabaseId) {
        return NextResponse.json({message: "Error fetching user"}, {status: 401})
    }

    const user = prisma.user.findUnique({
        where: {
            supabaseId: supabaseId
        }
    })

    const lastMonthTransactions = await prisma.transaction.findMany({
        where: {
            userId: user.id,
            date: {
                gte: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
            },
        },
    })

    const lastMonthIncome = lastMonthTransactions.reduce((total: Decimal, transaction) => {

        if (transaction.type === "Income") {
            return total.plus(transaction.amount);
        }

        return total;

    }, new Decimal(0));

    const lastMonthExpense = lastMonthTransactions.reduce((total: Decimal, transaction) => {
        if (transaction.type === "Expense" || transaction.type === "RecurringExpense") {
            return total.plus(transaction.amount);
        }

        return total;
    }, new Decimal(0));

    const lastMonthRecurringExpense = lastMonthTransactions.reduce((total: Decimal, transaction) => {
        if (transaction.type === "RecurringExpense") {
            return total.plus(transaction.amount);
        }

        return total;
    }, new Decimal(0));

    const NetIncome = lastMonthIncome.minus(lastMonthExpense).minus(lastMonthRecurringExpense);

    return NextResponse.json({
        lastMonthIncome: lastMonthIncome.toNumber(),
        lastMonthExpense: lastMonthExpense.toNumber(),
        lastMonthRecurringExpense: lastMonthRecurringExpense.toNumber(),
        NetIncome: NetIncome.toNumber(),
    })
}