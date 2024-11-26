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
                categoryId: parseInt(data.categoryId),
                userCategoryId: parseInt(data.userCategoryId),
                date: data.date,
                note: data.note ? data.note : null,
                payee: data.payee,
                method: data.method,
                type: data.type,
                imageUrl: data.imageUrl ? data.imageUrl : null,
            },
        })

        return NextResponse.json(transaction, {status: 201})
    } catch (error) {
        console.error('Transaction creation failed:', error)
        return NextResponse.json({message: 'Transaction creation failed'}, {status: 500})
    }

}

export async function DELETE(request: NextRequest, response: NextResponse) {

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

        const transactionId = request.nextUrl.searchParams.get("id")

        console.log("TID", transactionId)

        if (!transactionId) {
            return NextResponse.json({message: 'Transaction ID not found'}, {status: 400})
        }


        const delResult = prisma.transaction.delete({
            where: {
                id: parseInt(transactionId)
            }
        })

        console.log(delResult.then((res) => console.log(res)))

        return NextResponse.json({message: 'Transaction deleted'}, {status: 200})

    }

   return NextResponse.json({message: 'Error fetching user or user transactions'}, {status: 500})

}

export async function PUT(request: NextRequest, response: NextResponse) {

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

        const transactionId = request.nextUrl.searchParams.get("id")

        if (!transactionId) {
            return NextResponse.json({message: 'Transaction ID not found'}, {status: 400})
        }

    }
}