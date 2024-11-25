import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest, response: NextResponse) {

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

    const budgets = await prisma.budget.findMany({
        select: {
            id: true,
            categoryId: true,
            amount: true,
            category: {
                select: {
                    name: true,
                },
            },
        },
    });


    return NextResponse.json(budgets)
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

        const budget = await prisma.budget.create({
            data: {
                userId: user.id,
                categoryId: parseInt(data.categoryId),
                userCategoryId: parseInt(data.userCategoryId),
                amount: data.amount
            },
        })

        return NextResponse.json(budget, {status: 201})
    } catch (error) {
        console.error('Budget creation failed:', error)
        return NextResponse.json({message: 'Budget creation failed'}, {status: 500})
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

    if (!user) {
        return NextResponse.json({message: 'User not found'}, {status: 404})
    }

    const budgetId = request.nextUrl.searchParams.get("id")

    if (!budgetId) {
        return NextResponse.json({message: 'Budget ID not found'}, {status: 400})
    }

    const delResult = prisma.budget.delete({
        where: {
            id: parseInt(budgetId)
        }
    }).then((res) => console.log(res))


    return NextResponse.json({message: 'Budget deleted'}, {status: 200})
}