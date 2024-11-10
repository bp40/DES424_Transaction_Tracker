import { Button } from "@/components/ui/button";

const HeroSectionWithImage = () => {
    return (
        <>
            {/* Hero */}
            <div className="container mx-auto py-24 lg:py-32">
                {/* Grid */}
                <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
                    <div>
                        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                            Welcome to Transaction Tracker
                        </h1>
                        <p className="mt-3 text-xl text-muted-foreground">
                            Free & Easy to use Transaction tracker with QR code scanning function for Thai people.
                            Shows full graphic details of your spending.
                        </p>
                        {/* Buttons */}
                        <div className="mt-7 grid gap-3 w-full sm:inline-flex">
                            <Button size={"lg"}>Get started</Button>
                            <Button variant={"outline"} size={"lg"}>
                                Learn more
                            </Button>
                        </div>
                        {/* End Buttons */}

                    </div>
                    {/* Col */}
                    <div className="relative ms-4">
                        <img
                            className="w-full rounded-md"
                            src="https://placehold.co/800x700"
                            alt="Image Description"
                        />
                    </div>
                    {/* End Col */}
                </div>
                {/* End Grid */}
            </div>
            {/* End Hero */}
        </>
    );
}

export default HeroSectionWithImage;
