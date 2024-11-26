import {NextRequest, NextResponse} from 'next/server';
import {createClient} from "@/utils/supabase/server";

export async function middleware(request: NextRequest) {

    const supabase = createClient();

    try {
        const { data, error } = await supabase.auth.getUser();

        let status = 200;

        if (error) {
            status = error.status || 500;
        }

        if (data?.user?.role !== "authenticated") {
            status = 403;
        }


        if (status !== 200) {
            // Redirect if status is not 200
            return NextResponse.redirect(new URL('/auth/login', request.url));
        } else {
            const response = NextResponse.next();
            response.headers.set('x-supabase-id', <string>data.user?.id.toString());
            return response;
        }
    } catch (err) {
        console.error("Error during authentication", err);
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
}

export const config = {
    matcher: ['/api/:path*', '/dashboard', '/profile', '/transactions'], // Matches all routes under /api/*
};
