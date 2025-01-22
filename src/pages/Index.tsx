import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, DollarSign, PieChart, Upload, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Welcome to MyBudget</h2>
        <p className="text-muted-foreground">
          Track expenses, set budgets, and achieve your financial goals
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
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
                onClick={() => navigate("/reports")}
              >
                View Reports
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