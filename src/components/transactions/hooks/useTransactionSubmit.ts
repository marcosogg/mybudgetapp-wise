import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TransactionFormValues } from "../types/formTypes";

export const useTransactionSubmit = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleMapping = async (
    description: string,
    categoryId: string | null,
    userId: string
  ) => {
    if (!description || !categoryId) return;

    const { data: existingMapping } = await supabase
      .from("mappings")
      .select()
      .eq("description_keyword", description)
      .eq("user_id", userId)
      .maybeSingle();

    if (!existingMapping) {
      await supabase.from("mappings").insert({
        description_keyword: description,
        category_id: categoryId,
        user_id: userId,
      });

      toast({
        title: "Category mapping created",
        description: "This category will be automatically applied to all transactions with the same description.",
      });
    } else if (existingMapping.category_id !== categoryId) {
      await supabase
        .from("mappings")
        .update({ category_id: categoryId })
        .eq("id", existingMapping.id);

      toast({
        title: "Category mapping updated",
        description: "All transactions with this description will be updated to use the new category.",
      });
    }

    queryClient.invalidateQueries({ queryKey: ["mappings"] });
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  };

  return { handleMapping };
};