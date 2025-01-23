import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IncomeSection } from "@/components/budget/IncomeSection";

const Budget = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Budget Management</h1>
      </div>

      <div className="grid gap-6">
        <IncomeSection />

        <Card>
          <CardHeader>
            <CardTitle>Budget Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Budget management coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Budget;