"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {useEffect, useState} from "react";
import {createClient} from "@/utils/supabase/client";
import {useRouter} from "next/navigation";

const Navbar = () => {

    const [session, setSession] = useState<Session | null>(null);

    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        // Check the initial session
        const fetchSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
        };

        fetchSession();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleSignout = async () => {

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (user) {
            await supabase.auth.signOut()
        }

        setSession(null)
        router.push("/")
        router.refresh()
    }


    if (!session) {
        return (
            <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90">
                <div className="w-fullpx-4">
                    <div className="flex justify-between h-14 items-center mx-5">
                        <Link href="#" className="flex items-center" prefetch={false}>
                            LOGO
                            <span className="sr-only">Acme Inc</span>
                        </Link>
                        <nav className="hidden md:flex gap-4">
                            <Link
                                href={{
                                    pathname: "/",
                                }}
                                className="font-medium flex items-center text-sm transition-colors hover:underline"
                                prefetch={false}
                            >
                                Home
                            </Link>
                            <Link
                                href={{
                                    pathname: "/dashboard",
                                }}
                                className="font-medium flex items-center text-sm transition-colors hover:underline"
                                prefetch={false}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href={{
                                    pathname: "/documentation",
                                }}
                                className="font-medium flex items-center text-sm transition-colors hover:underline"
                                prefetch={false}
                            >
                                Documentation
                            </Link>
                        </nav>
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="sm">
                                <Link href="/auth/login" className="flex items-center gap-2"> Sign In </Link>
                            </Button>
                            <Button size="sm">
                                <Link href="/auth/signup" className="flex items-center gap-2"> Sign Up </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>
        )
    } else {
        return (
            <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90">
                <div className="w-full mx-auto px-4">
                    <div className="flex justify-between h-14 items-center mx-5">
                        <Link href="#" className="flex items-center" prefetch={false}>
                            LOGO
                            <span className="sr-only">Acme Inc</span>
                        </Link>
                        <nav className="hidden md:flex gap-8">
                            <Link
                                href={{
                                    pathname: "/",
                                }}
                                className="font-medium flex items-center text-sm transition-colors hover:underline"
                                prefetch={false}
                            >
                                Home
                            </Link>
                            <Link
                                href={{
                                    pathname: "/dashboard",
                                }}
                                className="font-medium flex items-center text-sm transition-colors hover:underline"
                                prefetch={false}
                            >
                                My Dashboard
                            </Link>
                            <Link
                                href={{
                                    pathname: "/documentation",
                                }}
                                className="font-medium flex items-center text-sm transition-colors hover:underline"
                                prefetch={false}
                            >
                                Documentation
                            </Link>
                        </nav>
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="sm" onClick={() => router.push("/profile")}> Profile </Button>
                            <Button variant="outline" size="sm" onClick={handleSignout}> Sign out </Button>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }

}

export default Navbar;

