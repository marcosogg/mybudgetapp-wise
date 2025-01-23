import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { BudgetDialog } from "./BudgetDialog";
import { BudgetTable } from "./BudgetTable";
import { useBudgets } from "@/hooks/budget/useBudgets";
import { useProfile } from "@/hooks/useProfile";
import { Progress } from "@/components/ui/progress";

export function BudgetSection() {
  const [open, setOpen] = useState(false);
  const { data: budgets, isLoading: isLoadingBudgets } = useBudgets();
  const { profile, isLoading: isLoadingProfile } = useProfile();

  const totalBudget = budgets?.reduce((sum, budget) => sum + budget.amount, 0) || 0;
  const monthlyIncome = (profile?.salary || 0) + (profile?.bonus || 0);
  const budgetPercentage = monthlyIncome > 0 ? (totalBudget / monthlyIncome) * 100 : 0;
  const remainingBudget = monthlyIncome - totalBudget;

  const isLoading = isLoadingBudgets || isLoadingProfile;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Budget Allocation</CardTitle>
        <Button onClick={() => setOpen(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Budget
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <p className="text-muted-foreground">Loading budgets...</p>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Budget</span>
                <span className="font-medium">${totalBudget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Income</span>
                <span className="font-medium">${monthlyIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining</span>
                <span className={`font-medium ${remainingBudget < 0 ? 'text-destructive' : 'text-green-600'}`}>
                  ${remainingBudget.toLocaleString()}
                </span>
              </div>
              <Progress 
                value={Math.min(budgetPercentage, 100)} 
                className="h-2"
                indicatorClassName={budgetPercentage > 100 ? 'bg-destructive' : ''}
              />
              <p className="text-xs text-muted-foreground text-right">
                {budgetPercentage.toFixed(1)}% of income budgeted
              </p>
            </div>
            <BudgetTable budgets={budgets || []} onEdit={() => setOpen(true)} />
          </>
        )}
      </CardContent>
      <BudgetDialog open={open} onOpenChange={setOpen} />
    </Card>
  );
}