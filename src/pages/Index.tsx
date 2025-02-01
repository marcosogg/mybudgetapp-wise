import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BudgetSummaryCard } from "@/components/dashboard/BudgetSummaryCard";
import { IncomeSummaryCard } from "@/components/dashboard/IncomeSummaryCard";
import { TransactionSummaryCard } from "@/components/dashboard/TransactionSummaryCard";
import { BudgetComparisonChart } from "@/components/dashboard/BudgetComparisonChart";
import { UpcomingReminders } from "@/components/reminders/UpcomingReminders";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch recent transaction count and total
  const { data: transactionStats } = useQuery({
    queryKey: ['transactionStats'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', session.session.user.id)
        .gte('date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
        .lte('date', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString());

      if (error) {
        console.error('Error fetching transaction stats:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch transaction statistics",
        });
        throw error;
      }

      return {
        count: data?.length || 0,
        total: data?.reduce((sum, t) => sum + (t.amount < 0 ? Math.abs(t.amount) : 0), 0) || 0
      };
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">
            Your financial overview
          </p>
        </div>
        <Button
          onClick={() => navigate("/transactions/import")}
          variant="outline"
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Import CSV
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <BudgetSummaryCard />
        <IncomeSummaryCard />
        <TransactionSummaryCard 
          count={transactionStats?.count || 0}
          total={transactionStats?.total || 0}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <BudgetComparisonChart />
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[350px] flex items-center justify-center">
            <p className="text-muted-foreground text-lg">PLACEHOLDER</p>
          </CardContent>
        </Card>
      </div>

      <UpcomingReminders />
    </div>
  );
};

export default Index;