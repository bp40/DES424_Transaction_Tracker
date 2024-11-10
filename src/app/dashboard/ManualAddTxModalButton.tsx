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
import {revalidatePath} from "next/cache";
import prisma from "@/lib/db";
import {useEffect, useState} from "react";


const ManualAddTxModalButton = () => {

    const [categories, setCategories] = useState([])

    useEffect(() => {
        fetch("/api/categories")
            .then(res => res.json())
            .then(data => {
                setCategories(data.map((category: { name: string; }) => category.name))
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    const methods = ["Cash", "Credit Card", "Bank Transfer", "Debit Card"] as const

    const formSchema = z.object({
        amount: z.coerce.number({
            required_error: "Amount is required"
        }).min(1, {
            message: "Amount must be greater than 0"
        }),
        category: z.enum(categories),
        date: z.string().refine(date => !isNaN(Date.parse(date)), {message: "Invalid date"}),
        method: z.enum(methods),
        merchant: z.string(),
        expense: z.boolean(),
        note: z.string(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: 0,
            category: "Food",
            date: "",
            method: "Bank Transfer",
            merchant: "",
            expense: true,
            note: "",
        },
    });


    function onSubmit(values: z.infer<typeof formSchema>) {
        const data = {
            amount: values.amount,
            category: values.category,
            date: new Date(values.date).toISOString(),
            method: values.method,
            payee: values.merchant,
            expense: values.expense,
            note: values.note,
        }

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

        revalidatePath('/dashboard')
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
                                                <SelectValue value={field.value} placeholder="Expense"/>
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem value={category} key={category}>{category}</SelectItem>
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
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Method</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a method"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {methods.map((method) => (
                                                    <SelectItem value={method} key={method}>{method}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>)}
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