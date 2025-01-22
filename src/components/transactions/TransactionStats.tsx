import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TransactionStatsProps {
  transactionCount: number;
  totalAmount: number;
  formatCurrency: (amount: number) => string;
}

export const TransactionStats = ({
  transactionCount,
  totalAmount,
  formatCurrency,
}: TransactionStatsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{transactionCount}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{formatCurrency(totalAmount)}</p>
        </CardContent>
      </Card>
    </div>
  );
};