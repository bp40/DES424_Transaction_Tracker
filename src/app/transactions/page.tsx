"use client"

import {Transaction, columns} from "./columns"
import {DataTable} from "./data-table"
import {useEffect, useState} from "react";


const Transactions = () => {

    const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() => {
        fetch("/api/transactions")
            .then(res => res.json())
            .then(data => {
                setTransactions(data)
                console.log(data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])


    return (
        <div className="py-20 h-screen flex justify-center w-full">
            <div className="w-full max-w-screen-xl flex flex-col items-center mx-6">
                <div className="flex justify-between items-center w-full">
                    <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">
                        All transactions
                    </h1>
                </div>
                <div className="w-full py-10">
                    <DataTable columns={columns} data={transactions} />
                </div>
            </div>
        </div>
    );
}

export default Transactions;



