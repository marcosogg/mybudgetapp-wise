import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useBudgetComparison } from "@/hooks/budget/useBudgetComparison";
import { useMonth } from "@/contexts/MonthContext";

export function BudgetSummaryCard() {
  const { selectedMonth } = useMonth();
  const { data: comparison } = useBudgetComparison();

  const totalBudget = comparison?.reduce((sum, item) => sum + item.planned_amount, 0) || 0;
  const totalSpent = comparison?.reduce((sum, item) => sum + item.actual_amount, 0) || 0;
  const remaining = totalBudget - totalSpent;
  const progress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Budget</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total Budget</span>
            <span className="font-medium">${totalBudget.toLocaleString()}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Remaining</span>
            <span className={`font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(remaining).toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}