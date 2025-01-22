import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/transaction";

export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          category:categories(name)
        `)
        .eq('user_id', user.id)
        .order("date", { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    },
  });
};