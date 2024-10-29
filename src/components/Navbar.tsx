import Link from "next/link"
import { Button } from "@/components/ui/button"

const Navbar = () => {
    return (
        <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90">
            <div className="w-full max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-14 items-center">
                    <Link href="#" className="flex items-center" prefetch={false}>
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
                        <Button variant="outline" size="sm" >
                            <Link href="/auth/login" className="flex items-center gap-2"> Sign In </Link>
                        </Button>
                        <Button size="sm" >
                            <Link href="/auth/signup" className="flex items-center gap-2"> Sign Up </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;

