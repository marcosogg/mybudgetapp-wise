import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BudgetSummary } from "@/components/budget/BudgetSummary";
import { UpcomingReminders } from "@/components/reminders/UpcomingReminders";
import { TransactionManagement } from "@/components/dashboard/TransactionManagement";
import { Features } from "@/components/dashboard/Features";
import { QuickActions } from "@/components/dashboard/QuickActions";

const Index = () => {
  // Fetch recent transaction count
  const { data: transactionCount } = useQuery({
    queryKey: ['transactionCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Welcome to MyBudget</h2>
        <p className="text-muted-foreground">
          Track expenses, set budgets, and achieve your financial goals
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <BudgetSummary />
        <UpcomingReminders />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <TransactionManagement transactionCount={transactionCount} />
          <Features />
        </div>

        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Index;