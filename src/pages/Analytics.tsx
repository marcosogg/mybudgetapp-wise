import { useTransactions } from "@/components/transactions/hooks/useTransactions";
import { formatCurrency } from "@/components/transactions/utils/transactionUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, ShoppingCart, Car, Tv, Home, CreditCard, Wallet } from "lucide-react";
import { useMemo } from "react";

const CATEGORY_ICONS: Record<string, any> = {
  "Food & Dining": Coffee,
  "Shopping": ShoppingCart,
  "Transportation": Car,
  "Entertainment": Tv,
  "Housing": Home,
  "Utilities": CreditCard,
};

export default function Analytics() {
  const { data: transactions = [], isLoading } = useTransactions();

  const { totalSpent, categoryTotals } = useMemo(() => {
    const totals = transactions.reduce((acc, transaction) => {
      const categoryName = transaction.category?.name || "Uncategorized";
      acc[categoryName] = (acc[categoryName] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(totals).reduce((sum, amount) => sum + amount, 0);

    return {
      totalSpent: total,
      categoryTotals: Object.entries(totals).map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / total) * 100,
      })),
    };
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Wallet className="w-6 h-6" />
            Total Spending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-primary">
            {formatCurrency(totalSpent)}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Across {transactions.length} transactions
          </p>
        </CardContent>
      </Card>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryTotals.map(({ category, amount, percentage }) => {
          const IconComponent = CATEGORY_ICONS[category] || CreditCard;
          return (
            <Card 
              key={category}
              className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium flex items-center gap-2">
                  <IconComponent className="w-5 h-5 text-muted-foreground" />
                  {category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{formatCurrency(amount)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}