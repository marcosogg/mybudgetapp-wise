import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMonth } from "@/contexts/MonthContext";
import { format } from "date-fns";

interface BudgetComparison {
  category_id: string;
  category_name: string;
  planned_amount: number;
  actual_amount: number;
  variance: number;
}

export function useBudgetComparison() {
  const { selectedMonth } = useMonth();
  const formattedDate = format(selectedMonth, "yyyy-MM-dd");

  return useQuery({
    queryKey: ["budgetComparison", formattedDate],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .rpc('get_budget_comparison', {
          p_user_id: user.id,
          p_period: formattedDate
        });

      if (error) throw error;
      return data as BudgetComparison[];
    },
  });
}