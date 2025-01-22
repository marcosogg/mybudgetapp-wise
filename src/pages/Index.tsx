import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, DollarSign, FileUp, PieChart, Upload, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TransactionStats } from "@/components/transactions/TransactionStats";

const Index = () => {
  const navigate = useNavigate();

  // Fetch transaction statistics
  const { data: stats } = useQuery({
    queryKey: ['transactionStats'],
    queryFn: async () => {
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount');

      if (!transactions) return { count: 0, income: 0, expenses: 0 };

      return transactions.reduce((acc, transaction) => ({
        count: acc.count + 1,
        income: transaction.amount > 0 ? acc.income + transaction.amount : acc.income,
        expenses: transaction.amount < 0 ? acc.expenses + Math.abs(transaction.amount) : acc.expenses,
      }), { count: 0, income: 0, expenses: 0 });
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Welcome to MyBudget</h2>
        <p className="text-muted-foreground">
          Track expenses, set budgets, and achieve your financial goals
        </p>
      </div>

      <TransactionStats
        transactionCount={stats?.count ?? 0}
        totalIncome={stats?.income ?? 0}
        totalExpenses={stats?.expenses ?? 0}
        formatCurrency={formatCurrency}
      />

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Transaction Management</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Transactions</span>
                <span className="text-2xl font-bold">{stats?.count ?? 0}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  className="w-full" 
                  variant="default"
                  onClick={() => navigate("/transactions")}
                >
                  View All
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => navigate("/transactions/import")}
                >
                  Import CSV
                  <FileUp className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <FeatureItem
              icon={<DollarSign className="w-6 h-6" />}
              title="Track Expenses"
              description="Import and categorize your transactions automatically"
            />
            <FeatureItem
              icon={<PieChart className="w-6 h-6" />}
              title="Visual Insights"
              description="See where your money goes with beautiful charts"
            />
            <FeatureItem
              icon={<Wallet className="w-6 h-6" />}
              title="Budget Management"
              description="Set and track budgets for different categories"
            />
          </div>
        </div>

        <div>
          <Card className="p-6">
            <h3 className="text-2xl font-bold mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <Button 
                className="w-full" 
                variant="default"
                onClick={() => navigate("/transactions")}
              >
                Add Transaction
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                className="w-full" 
                variant="default"
                onClick={() => navigate("/transactions/import")}
              >
                Import Transactions
                <Upload className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                className="w-full" 
                variant="default"
                onClick={() => navigate("/categories")}
              >
                Manage Categories
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="flex items-start space-x-4">
    <div className="bg-primary/10 p-2 rounded-lg text-primary">{icon}</div>
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default Index;