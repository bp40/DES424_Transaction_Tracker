"use client"

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {signup} from "@/app/auth/signup/actions";

const SignupPage = () => {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter()

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        signup(email, password).then(r => router.push('/dashboard'))

    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-sm">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle className="text-2xl">Sign up with your Email</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" onChange={(e) => setEmail(e.target.value)}
                                   placeholder="example@mail.com" required/>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" onChange={(e) => setPassword(e.target.value)} type="password"
                                   placeholder="Enter your password" required/>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Confirm Password</Label>
                            <Input id="password" type="password" onChange={(e) => setConfirmPassword(e.target.value)}
                                   placeholder="Enter your password" required/>
                        </div>


                    </CardContent>
                    <CardFooter>
                        <Button className="w-full"> Sign Up </Button>
                    </CardFooter>
                </form>
            </Card>

        </div>
    )
}

export default SignupPage