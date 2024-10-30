import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const DashboardCard = ({ className, title, amount, percentage }: { className?: string, title?: string, amount?: number, percentage?: number }) => {
    return (
        <div className={className}>
            <Card className="w-90% h-[130px] m-2">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-extrabold">฿
                         {amount != null ? amount.toLocaleString() : 'N/A'}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardCard