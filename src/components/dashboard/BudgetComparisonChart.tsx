import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useMonthlyBudgetComparison } from "@/hooks/budget/useMonthlyBudgetComparison";
import { format, startOfYear, addMonths } from "date-fns";

const chartConfig = {
  planned: {
    label: "Planned",
    color: "hsl(var(--chart-1))", // Light blue
  },
  actual: {
    label: "Actual",
    color: "hsl(var(--chart-2))", // Dark blue
  },
} satisfies ChartConfig;

export function BudgetComparisonChart() {
  const startDate = startOfYear(new Date(2025, 0, 1));
  const endDate = addMonths(startDate, 5);
  
  const { data: comparison, isError, error } = useMonthlyBudgetComparison();

  if (isError) {
    console.error("Error fetching budget comparison:", error);
  }

  const chartData = comparison?.map((item) => ({
    month: format(new Date(item.month), 'MMMM'),
    planned: item.planned_total,
    actual: item.actual_total,
  }))?.sort((a, b) => {
    // Sort months chronologically
    const monthA = new Date(Date.parse(`${a.month} 1, 2025`));
    const monthB = new Date(Date.parse(`${b.month} 1, 2025`));
    return monthA.getTime() - monthB.getTime();
  }) || [];

  // Calculate trend percentage
  const lastTwoMonths = chartData.slice(-2);
  const trend = lastTwoMonths.length === 2
    ? ((lastTwoMonths[1].actual - lastTwoMonths[0].actual) / lastTwoMonths[0].actual) * 100
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Budget Overview</CardTitle>
        <CardDescription>January - June 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} height={350}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={({ label, payload }) => (
                <ChartTooltipContent 
                  label={label}
                  payload={payload}
                  indicator="dashed"
                  formatter={(value: number) => 
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(value)
                  }
                />
              )}
            />
            <Bar 
              dataKey="planned" 
              fill={chartConfig.planned.color}
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              dataKey="actual" 
              fill={chartConfig.actual.color}
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {trend > 0 ? (
            <>
              Trending up by {Math.abs(trend).toFixed(1)}% this month
              <TrendingUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Trending down by {Math.abs(trend).toFixed(1)}% this month
              <TrendingDown className="h-4 w-4" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing budget comparison for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}