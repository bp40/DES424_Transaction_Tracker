import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const DashboardCard = ({ className, title, amount, percentage }: { className?: string, title?: string, amount?: number, percentage?: number }) => {
    return (
        <div className={className}>
            <Card className="w-90% h-full m-2">
                <CardHeader>
                    <CardTitle className="text-xl">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-extrabold">฿
                         {amount != null ? amount.toLocaleString() : 'N/A'}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardCard