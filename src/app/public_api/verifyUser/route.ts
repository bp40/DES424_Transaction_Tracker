import prisma from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {

    console.log("syncing user")

    const supabaseId = request.nextUrl.searchParams.get("supid")

    const userInDb = await prisma.user.findFirst({
        where: {
            supabaseId: supabaseId as string
        }
    })

    // If the supabase user is not in the database, create it
    if (!userInDb) {
        const user = await prisma.user.create({
            data: {
                supabaseId: supabaseId as string,
                username: 'user'
            }
        })

        console.log(user)

        return NextResponse.json({
            status: 'new',
            message: "User synced successfully"
        }, {status: 201})
    }

    return NextResponse.json({
        status: 'existing',
        message: "User already exists"
    }, {status: 200})
}