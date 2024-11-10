"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";

import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useEffect, useState} from "react";

interface Category {
    id: number;
    name: string;
    createdAt: string; // ISO string format for the created date
}

type CategoryList = Category[];

const ManualAddTxModalButton = () => {

    const [categories, setCategories] = useState<CategoryList>([])

    useEffect(() => {
        fetch("/api/categories")
            .then(res => res.json())
            .then(data => {
                setCategories(data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    const methods = [
        { label: "Cash", value: "Cash" },
        { label: "Credit Card", value: "CreditCard" },
        { label: "Bank Transfer", value: "BankTransfer" },
        { label: "Debit Card", value: "DebitCard" }
    ] as const;

    const formSchema = z.object({
        amount: z.coerce.number({
            required_error: "Amount is required"
        }).min(1, {
            message: "Amount must be greater than 0"
        }),
        category: z.string(),
        date: z.string().refine(date => !isNaN(Date.parse(date)), {message: "Invalid date"}),
        method: z.enum(["Cash", "CreditCard", "BankTransfer", "DebitCard"]).default("BankTransfer"),
        merchant: z.string(),
        expense: z.boolean(),
        note: z.string(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: 0,
            category: "1",
            date: "",
            method: "BankTransfer",
            merchant: "",
            expense: true,
            note: "",
        },
    });


    function onSubmit(values: z.infer<typeof formSchema>) {
        const data = {
            amount: values.amount,
            category: parseInt(values.category),
            date: new Date(values.date).toISOString(),
            method: values.method,
            payee: values.merchant,
            expense: values.expense,
            note: values.note,
        }

        console.log(data)

        fetch("/api/transactions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                form.reset()
            })
            .catch(err => {
                console.log(err)
            })

    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="px-2 mx-2"> Manually Add Transaction </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle> Add Transaction </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="expense"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select onValueChange={(value) => field.onChange(value === 'true')}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Expense"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="true">Expense</SelectItem>
                                            <SelectItem value="false">Income</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem value={category.id.toString()}
                                                            key={category.id}>{category.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div className="flex my-2">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({field}) => (
                                    <FormItem className="mr-4">
                                        <FormLabel>Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="method"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Method</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue>{field.value ? methods.find(method => method.value === field.value)?.label : "Select a method"}</SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {methods.map((method) => (
                                                    <SelectItem value={method.value} key={method.value}>
                                                        {method.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="merchant"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Merchant / Location</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="note"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Note</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full mt-4">Add Transaction</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}


export default ManualAddTxModalButton;