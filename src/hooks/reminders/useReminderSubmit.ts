import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReminderFormValues } from "@/types/reminder";
import { useToast } from "@/components/ui/use-toast";

export function useReminderSubmit() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (values: ReminderFormValues) => {
      const { data, error } = await supabase
        .from("reminders")
        .insert([values])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      toast({
        title: "Success",
        description: "Reminder has been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save reminder. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving reminder:", error);
    },
  });
}