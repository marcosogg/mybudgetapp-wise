import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Reminder } from "@/types/reminder";

export function useReminders(status: 'active' | 'archived' = 'active') {
  return useQuery({
    queryKey: ["reminders", status],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("status", status)
        .order("due_date", { ascending: true });

      if (error) throw error;
      return data as Reminder[];
    },
  });
}