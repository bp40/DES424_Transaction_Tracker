'use server'

import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";

export async function signup(email: string, password: string) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: email as string,
        password: password as string,
    }

    console.log("ADDING USER TO AWS DB FROM SUPABASE")

    await supabase.auth.signUp(data).then(r => {

        const sup_id = r.data.user.id

        const url = `http://localhost:3000/public_api/verifyUser?supid=${sup_id}`

        console.log("verifying...")
        fetch(url).then(res => {
            res.json().then(data => {
                console.log(data.status);  // This will log the status of the promise
                console.log(data);  // Now this will log the actual data after the promise resolves
            })
        })



    })

    revalidatePath('/', 'layout')
    redirect('/')
}