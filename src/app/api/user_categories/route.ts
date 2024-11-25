import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest, response: NextResponse) {
    const supabaseId = request.headers.get("x-supabase-id")

    const user = await prisma.user.findUnique({
        where: {
            supabaseId: supabaseId as string
        }
    })

    if(user){

        const userCategories = await prisma.userCategory.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                createdAt: "desc"
            },
        })

        return NextResponse.json(userCategories)
    }

    return NextResponse.json({message: 'Error fetching user or user transactions'}, {status: 500})
}