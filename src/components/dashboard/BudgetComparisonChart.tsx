import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBudgetComparison } from "@/hooks/budget/useBudgetComparison";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function BudgetComparisonChart() {
  const { data: comparison } = useBudgetComparison();

  const chartData = comparison?.map((item) => ({
    name: item.category_name,
    planned: item.planned_amount,
    actual: item.actual_amount,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs. Actual Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="planned" name="Planned" fill="#93C5FD" />
              <Bar dataKey="actual" name="Actual" fill="#2563EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}