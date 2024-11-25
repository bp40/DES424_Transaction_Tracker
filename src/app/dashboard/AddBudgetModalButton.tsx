"use client"

import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {SubmitHandler, useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {createClient} from "@/utils/supabase/client";

type FormFields = {
    name: string;
    categoryId: number;
    userCategoryId: number;
    amount: number;
}

const AddBudgetModalButton = () => {

    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<FormFields>();
    const [user, setUser] = useState<User>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const supabase = createClient()

    useEffect(() => {
        supabase.auth.getUser()
            .then(({data: {user}}) => {
                setUser(user)
            })

        fetch("/api/categories")
            .then(res => res.json())
            .then(data => {
                const updatedCategories = data.filter(category => category.name !== "Income");
                setCategories(updatedCategories)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    const onSubmit: SubmitHandler<FormFields> = (data) => {
        console.log(data)

        fetch('/api/budget', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-supabase-id': user?.id
            },
            body: JSON.stringify({
                categoryId: data.categoryId,
                userCategoryId: data.userCategoryId,
                amount: data.amount
            })
        }).then(res => {
            res.json().then(data => {
                console.log(data)
            })
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="px-2 mx-2"> Add Monthly Budget Limit </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle> Add Monthly Budget Limit </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div>
                        <label htmlFor="categoryId"
                               className="block text-sm font-semibold text-gray-700">Category</label>
                        <select
                            {...register("categoryId")}
                            id="categoryId"
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Select a Category</option>
                            {categories.map((category: Category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="amount" className="block text-sm font-semibold text-gray-700">Amount</label>
                        <input
                            {...register("amount", {required: "Amount is required"})}
                            type="number"
                            placeholder="THB per month"
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {errors.amount && <div className="text-red-600 text-sm mt-1">{errors.amount.message}</div>}
                    </div>

                    <div className="mt-6">
                        <Button
                            disabled={isSubmitting}
                            type="submit"
                            className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            {isSubmitting ? "Loading..." : "Submit"}
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddBudgetModalButton;