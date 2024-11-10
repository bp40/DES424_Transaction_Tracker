'use server'

import { createClient } from '@/utils/supabase/server'
import {redirect} from "next/navigation";


export async function login(email: string, password: string) {
    const supabase = createClient()


    const data = {
        email: email,
        password: password,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (!error) {
        redirect('/')
    }

}

