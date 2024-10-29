import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'


const Dashboard = async () => {

    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/auth/login')
    }

    return (
        <div className="py-20">
            <h1 className="p-2 ">Hello, this is the Dashboard page</h1>
            <h2>You are logged in as {data.user.email}</h2>
        </div>
    )
}

export default Dashboard;