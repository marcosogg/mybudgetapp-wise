import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { BudgetDialog } from "./BudgetDialog";
import { BudgetTable } from "./BudgetTable";
import { useBudgets } from "@/hooks/budget/useBudgets";

export function BudgetSection() {
  const [open, setOpen] = useState(false);
  const { data: budgets, isLoading } = useBudgets();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Budget Allocation</CardTitle>
        <Button onClick={() => setOpen(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Budget
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground">Loading budgets...</p>
        ) : (
          <BudgetTable budgets={budgets || []} onEdit={() => setOpen(true)} />
        )}
      </CardContent>
      <BudgetDialog open={open} onOpenChange={setOpen} />
    </Card>
  );
}