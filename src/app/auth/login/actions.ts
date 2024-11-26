'use server'

import {createClient} from '@/utils/supabase/server'
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {NextResponse} from "next/server";


export async function login(email: string, password: string) {
    const supabase = createClient()

    const data = {
        email: email,
        password: password,
    }

    const {error} = await supabase.auth.signInWithPassword(data)

    if (error) {
        console.log("Auth error (login):" + error.message)
        return JSON.parse(JSON.stringify({success: false, error: error.message}))
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

