import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";

export function IncomeSummaryCard() {
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Income</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  const totalIncome = (profile?.salary || 0) + (profile?.bonus || 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Income</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Salary</span>
            <span className="font-medium">${profile?.salary?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Bonus</span>
            <span className="font-medium">${profile?.bonus?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between pt-4 border-t">
            <span className="font-medium">Total</span>
            <span className="font-bold text-primary">${totalIncome.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}