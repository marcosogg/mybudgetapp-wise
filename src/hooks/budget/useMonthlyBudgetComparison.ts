import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMonth } from "@/contexts/MonthContext";
import { addMonths, subMonths } from "date-fns";

interface MonthlyComparison {
  month: string;
  planned_total: number;
  actual_total: number;
}

export function useMonthlyBudgetComparison() {
  const { selectedMonth } = useMonth();
  
  return useQuery({
    queryKey: ['monthlyBudgetComparison', selectedMonth],
    queryFn: async () => {
      const endDate = selectedMonth;
      const startDate = subMonths(endDate, 5); // Get 6 months of data

      const { data, error } = await supabase
        .rpc('get_monthly_budget_comparison', {
          p_user_id: (await supabase.auth.getUser()).data.user?.id,
          p_start_date: startDate.toISOString(),
          p_end_date: endDate.toISOString()
        });

      if (error) throw error;
      return data as MonthlyComparison[];
    }
  });
}