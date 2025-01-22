import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionStatsProps {
  transactionCount: number;
  totalIncome: number;
  totalExpenses: number;
  formatCurrency: (amount: number) => string;
}

export const TransactionStats = ({
  transactionCount,
  totalIncome,
  totalExpenses,
  formatCurrency,
}: TransactionStatsProps) => {
  const netAmount = totalIncome - totalExpenses;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{transactionCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Income</CardTitle>
          <ArrowUpIcon className="h-4 w-4 text-budget-green" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-budget-green">
            {formatCurrency(totalIncome)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expenses</CardTitle>
          <ArrowDownIcon className="h-4 w-4 text-budget-red" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-budget-red">
            {formatCurrency(totalExpenses)}
          </div>
          <p className={cn(
            "text-xs mt-1",
            netAmount >= 0 ? "text-budget-green" : "text-budget-red"
          )}>
            Net: {formatCurrency(netAmount)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};