"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import {SubmitHandler, useForm} from "react-hook-form";

import {ChangeEvent, useEffect, useRef, useState} from "react";
import {createClient} from "@/utils/supabase/client";
import {User} from "@supabase/auth-js";
import {nanoid} from "nanoid";

interface Category {
    id: number;
    name: string;
    createdAt: string; // ISO string format for the created date
}


type FormFields = {
    amount: number;
    categoryId: number;
    userCategoryId: number;
    date: string;
    note: string;
    payee: string;
    method: string;
    type: string;
    imageUrl: string;
}


const ManualAddTxModalButton = () => {

    const [user, setUser] = useState<User>(null)
    const [image, setImage] = useState(null)
    const [categories, setCategories] = useState<Category[]>([])
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<FormFields>();

    const supabase = createClient()

    useEffect(() => {
        supabase.auth.getUser()
            .then(({data: {user}}) => {
                setUser(user)
            })

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
        {label: "Cash", value: "Cash"},
        {label: "Credit Card", value: "CreditCard"},
        {label: "Bank Transfer", value: "BankTransfer"},
        {label: "Debit Card", value: "DebitCard"}
    ] as const;

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        const imageUrl = await handleImageUpload()
        console.log(data)

        fetch('/api/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-supabase-id': user?.id
            },
            body: JSON.stringify({
                amount: data.amount,
                categoryId: data.categoryId,
                userCategoryId: data.userCategoryId,
                date: new Date(data.date).toISOString(),
                note: data.note,
                payee: data.payee,
                method: data.method,
                type: data.type,
                imageUrl: imageUrl
            })
        })


    }

    const imageInputRef = useRef<HTMLInputElement>(null)

    const handleImageUpload = async () => {
        if (image) {
            const filename = nanoid()

            const {data, error} = await supabase.storage
                .from('transaction-user-upload')
                .upload(user.id + '/' + filename, image)

            if (error) {
                console.log(error)
            }

            const {data: signedUrl} = await supabase.storage
                .from('transaction-user-upload')
                .createSignedUrl(data.path, 60 * 60 * 24 * 365);

            console.log(data)
            console.log(signedUrl)
            return signedUrl?.signedUrl

        }


    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" className="px-2 mx-2"> Add Transaction </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle> Add Transaction </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}
                      className="max-w-2xl mx-auto p-6 bg-white rounded-lg space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-semibold text-gray-700">Amount</label>
                        <input
                            {...register("amount", {required: "Amount is required"})}
                            type="number"
                            placeholder="Amount"
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {errors.amount && <div className="text-red-600 text-sm mt-1">{errors.amount.message}</div>}
                    </div>

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
                        <label htmlFor="date" className="block text-sm font-semibold text-gray-700">Date</label>
                        <input
                            {...register("date")}
                            type="datetime-local"
                            placeholder="Date"
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="note" className="block text-sm font-semibold text-gray-700">Note</label>
                        <input
                            {...register("note")}
                            type="text"
                            placeholder="Note"
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="payee" className="block text-sm font-semibold text-gray-700">Merchant</label>
                        <input
                            {...register("payee")}
                            type="text"
                            placeholder="Payee"
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="method" className="block text-sm font-semibold text-gray-700">Payment
                            Method</label>
                        <select
                            {...register("method")}
                            id="method"
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Select a Payment Method</option>
                            {methods.map((method) => (
                                <option key={method.value} value={method.value}>
                                    {method.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex space-x-4">
                        <div>
                            <label htmlFor="expense" className="text-sm font-semibold text-gray-700">Expense</label>
                            <input
                                type="radio"
                                id="expense"
                                value="expense"
                                {...register('type')}
                                className="ml-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="income" className="text-sm font-semibold text-gray-700">Income</label>
                            <input
                                type="radio"
                                id="income"
                                value="income"
                                {...register('type')}
                                className="ml-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-700">Upload
                            Image</label>
                        <input
                            {...register("imageUrl")}
                            type="file"
                            ref={imageInputRef}
                            onChange={e => setImage(e?.target.files?.[0])}
                            placeholder="Image Url"
                            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="mt-6">
                        <Button
                            disabled={isSubmitting}
                            type="submit"
                            className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            {isSubmitting ? "Loading..." : "Submit"}
                        </Button>
                    </div>
                </form>

            </DialogContent>
        </Dialog>
    );


}

export default ManualAddTxModalButton;