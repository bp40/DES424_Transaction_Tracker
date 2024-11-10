import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest, response: NextResponse) {

    const categories = await prisma.category.findMany()

    return NextResponse.json(categories)

}