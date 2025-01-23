import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreateBudgetInput } from "./types";
import { toast } from "sonner";

interface BudgetSubmitInput extends CreateBudgetInput {
  id?: string;
}

export function useBudgetSubmit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budget: BudgetSubmitInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Check for existing budget for this category/period
      const { data: existingBudget } = await supabase
        .from("budgets")
        .select()
        .eq('category_id', budget.category_id)
        .eq('period', budget.period)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingBudget && !budget.id) {
        throw new Error(`A budget for this category already exists for ${budget.period}`);
      }

      if (budget.id) {
        // Update existing budget
        const { error } = await supabase
          .from("budgets")
          .update({
            amount: budget.amount,
            category_id: budget.category_id,
          })
          .eq('id', budget.id)
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        // Create new budget
        const { error } = await supabase
          .from("budgets")
          .insert({
            ...budget,
            user_id: user.id,
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Budget saved successfully");
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to save budget");
      }
      console.error("Error saving budget:", error);
    },
  });
}