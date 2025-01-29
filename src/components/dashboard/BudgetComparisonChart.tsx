import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMonthlyBudgetComparison } from "@/hooks/budget/useMonthlyBudgetComparison";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

export function BudgetComparisonChart() {
  const { data: comparison, isLoading } = useMonthlyBudgetComparison();

  const chartData = comparison?.map((item) => ({
    name: format(new Date(item.month), 'MMM yyyy'),
    planned: item.planned_total,
    actual: item.actual_total,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => 
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(value)
                }
              />
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