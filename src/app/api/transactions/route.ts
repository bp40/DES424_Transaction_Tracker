import {createClient} from "@/utils/supabase/server";
import {NextResponse} from "next/server";

export async function GET(request: Request, response: Response) {

    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    const status = error ? error.status : 200;

    return NextResponse.json({
        data,
        error
    }, { status })
}