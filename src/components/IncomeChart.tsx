"use client"

import {Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {useEffect, useState} from "react";

interface MonthlyData {
    month: string;
    income: number;
    expense: number;
}

type ChartData = MonthlyData[];

const chartConfig = {
    income: {
        label: "Income",
        color: "#A4F194",
    },
    expense: {
        label: "Expense",
        color: "#EB7360",
    },
} satisfies ChartConfig

export function IncomeChart() {

    const [chartData, setChartData] = useState<ChartData>([]);
    const [error, setError] = useState("");

    const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    const currentMonth = new Date().getMonth();  // Zero-indexed month
    const [currentDate, setCurrentDate] = useState(currentMonth + 1); // 1-based month

    const [fromDate, setFromDate] = useState(new Date(new Date().setMonth(currentDate - 6)).setDate(1));
    const [fromDateString, setFromDateString] = useState(new Intl.DateTimeFormat('en-US', dateOptions).format(fromDate));
    const [currentDateString, setCurrentDateString] = useState(new Intl.DateTimeFormat('en-US', dateOptions).format(new Date()));

    useEffect(() => {
        const fromDateISOString = new Date(fromDate).toISOString();
        const toDateISOString = new Date().toISOString();

        fetch(`/api/summary/range?from=${fromDateISOString}&to=${toDateISOString}`)
            .then(res => res.json())
            .then((data: MonthlyData[]) => {
                setChartData(data.map(month => ({
                    month: month.month,
                    income: month.income,
                    expense: month.expense,
                })));
            })
            .catch(err => {
                console.error(err);
                setError("Failed to fetch data");
            });
    }, [currentDate, fromDate]);

    return (
        <Card className="mb-2 max-h-full">
            <CardHeader>
                <CardTitle> Income / Expense Overview</CardTitle>
                <CardDescription> From  {fromDateString} to {currentDateString}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[200px] max-h-fit w-full">
                    <ResponsiveContainer aspect={2.2}>
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false}/>
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line"/>}
                            />
                            <Bar dataKey="income" fill="var(--color-income)" radius={4}/>
                            <Bar dataKey="expense" fill="var(--color-expense)" radius={4}/>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
