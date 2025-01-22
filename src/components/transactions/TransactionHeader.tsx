import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TransactionDialog } from "./TransactionDialog";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TransactionFormValues } from "./types/formTypes";
import { normalizeTags } from "@/utils/tagUtils";

export const TransactionHeader = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleAddTransaction = async (values: TransactionFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const normalizedTags = normalizeTags(values.tags.join(','));

      const { error } = await supabase
        .from("transactions")
        .insert([{
          date: values.date,
          description: values.description,
          amount: values.amount,
          category_id: values.category_id === "null" ? null : values.category_id,
          tags: normalizedTags,
          user_id: user.id,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction added successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setIsAddDialogOpen(false);
    } catch (error: any) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add transaction",
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