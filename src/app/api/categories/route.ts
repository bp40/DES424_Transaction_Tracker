import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest, response: NextResponse) {
    try {
        const categories = await prisma.category.findMany()

        return NextResponse.json(categories)
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Error fetching categories"}, {status: 500})
    }

}