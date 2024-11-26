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
                            <Button id="get-started-btn" size={"lg"}>Get started</Button>
                        </div>
                        {/* End Buttons */}

                    </div>
                    {/* Col */}
                    <div className="relative ms-4">
                        <img
                            className="w-full rounded-md"
                            src="https://epbciwgmyktuezeyjowg.supabase.co/storage/v1/object/sign/transaction-user-upload/home_image.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0cmFuc2FjdGlvbi11c2VyLXVwbG9hZC9ob21lX2ltYWdlLnBuZyIsImlhdCI6MTczMjYwOTMwOSwiZXhwIjoxNzY0MTQ1MzA5fQ.IxgqVAtI4ximrd8mk1_ZTk5j3jfiYhUPQ7y87iJFyp4&t=2024-11-26T08%3A21%3A49.564Z"
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
