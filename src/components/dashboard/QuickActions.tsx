import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
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
  );
};