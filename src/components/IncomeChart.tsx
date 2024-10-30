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

const chartData = [
    {month: "February", income: 305, expense: 200},
    {month: "March", income: 237, expense: 120},
    {month: "April", income: 73, expense: 190},
    {month: "May", income: 209, expense: 130},
    {month: "June", income: 214, expense: 140},
]

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
    return (
        <Card className="mb-2 max-h-full">
            <CardHeader>
                <CardTitle> Income / Expense Overview</CardTitle>
                <CardDescription> February - June 2024</CardDescription>
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
