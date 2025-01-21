import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const TransactionHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold">Transactions</h2>
        <p className="text-muted-foreground">
          Manage your financial transactions
        </p>
      </div>
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Add Transaction
      </Button>
    </div>
  );
};