import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest, response: NextResponse) {

    const supabaseId = request.headers.get("x-supabase-id")

    if (!supabaseId) {
        return NextResponse.json({message: "Error fetching user"}, {status: 401})
    }

    const startFromIndex = parseInt(<string>request.nextUrl.searchParams.get("index")) || 0;

    const user = await prisma.user.findUnique({
        where: {
            supabaseId: supabaseId
        }
    })

    if (user) {
        const transactions = await prisma.transaction.findMany({
            where: {
                userId: user.id
            },
            take: 10,
            skip: startFromIndex,
            orderBy: {
                date: 'desc'
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
        });
        return NextResponse.json(transactions)
    }

    return NextResponse.json({message: 'Error fetching user or user transactions'}, {status: 500})
}

export async function POST(request: NextRequest, response: NextResponse) {

    const supabaseId = request.headers.get("x-supabase-id")

    if (!supabaseId) {
        return NextResponse.json({message: "Error fetching user"}, {status: 401})
    }


    const user = await prisma.user.findUnique({
        where: {
            supabaseId: supabaseId
        }
    })

    if (!user) {
        return NextResponse.json({message: 'User not found'}, {status: 404})
    }

    const data = await request.json()


    try {

        const transaction = await prisma.transaction.create({
            data: {
                userId: user.id,
                amount: data.amount,
                categoryId: data.category,
                date: data.date,
                note: data.note ? data.note : null,
                payee: data.payee,
                method: data.method,
                type: data.expense ? "Expense" : "Income",
            },
        })

        return NextResponse.json(transaction, {status: 201})
    } catch (error) {
        console.error('Transaction creation failed:', error)
        return NextResponse.json({message: 'Transaction creation failed'}, {status: 500})
    }


}