import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TransactionDialog } from "./TransactionDialog";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const TransactionHeader = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleAddTransaction = async (values: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("transactions")
        .insert([{
          ...values,
          user_id: user.id,
          category_id: values.category_id === "null" ? null : values.category_id
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction added successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold">Transactions</h2>
        <p className="text-muted-foreground">
          Manage your financial transactions
        </p>
      </div>
      <Button onClick={() => setIsAddDialogOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Transaction
      </Button>

      <TransactionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddTransaction}
        mode="add"
      />
    </div>
  );
};