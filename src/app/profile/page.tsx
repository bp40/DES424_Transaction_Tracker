"use client"

import {redirect, useRouter} from 'next/navigation'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import '@/styles/globals.css';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select} from "@/components/ui/select";
import {SelectTrigger} from "@/components/ui/select-trigger"; // Assuming this file exists


import {createClient} from '@/utils/supabase/client'
import {View} from 'lucide-react'
import {useState} from "react";

const Profile = () => {

    const supabase = createClient()
    const router = useRouter()

    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")


    const handleSignout = async () => {

        const {
            data: {user},
        } = await supabase.auth.getUser()

        if (user) {
            await supabase.auth.signOut()
        }

        router.push("/")
        router.refresh()
    }


    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match")
        }

        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        })

        if (error) {
            alert("Error changing password: "+  error.name)
            console.log(error)
        } else {
            alert("Password changed successfully")
        }

    }


    return (
        <div className="min-h-screen flex flex-col p-4 mt-20 ml-10">
            <h1 className="text-3xl font-extrabold mb-10">User Account Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Profile Section */}
                <Card className="p-6">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold mb-4">Your Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center mb-6">
                            <div
                                className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-3xl text-white">
                                CN
                            </div>
                            <Button variant="secondary" className="mt-4">
                                Edit Profile
                            </Button>
                        </div>
                        <form className="space-y-4">
                            <Input placeholder="Enter your name"/>
                            <Input placeholder="Enter your email"/>
                            <Input placeholder="Enter your phone"/>
                            <Button variant="primary" className="w-full mt-4">
                                Save Changes
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Change Password Section */}
                <Card className="p-6">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold mb-4">Change Password</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleChangePassword}>
                            <Input onChange={e => setNewPassword(e.target.value)} type='password' placeholder="Enter your new password"/>
                            <Input onChange={e => setConfirmPassword(e.target.value)} type='password' placeholder="Confirm your new password"/>
                            <Button type="submit" variant="primary" className="w-full mt-4">
                                Change Password
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Change Currency Section */}
            <div className="mt-8">
                <Card className="p-6">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold mb-4">Currency</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-4">
                            <Select>
                                <SelectTrigger>
                                    <span>Thai Baht</span>
                                </SelectTrigger>

                            </Select>
                            <Button onClick={handleSignout} variant="secondary" size="lg"
                                    className="bg-red-500 hover:bg-red-600">Sign out</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Profile;