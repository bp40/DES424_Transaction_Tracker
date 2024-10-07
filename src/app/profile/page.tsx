import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

const Profile = async () => {

    const supabase = createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    return (
        <>
            <h1 className="p-2"> Hello, this is the Profile page </h1>
            <p>Hello {data.user.id}</p>
        </>
    )
}

export default Profile;