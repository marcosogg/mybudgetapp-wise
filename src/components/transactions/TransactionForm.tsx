import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DateField } from "./form/DateField";
import { DescriptionField } from "./form/DescriptionField";
import { AmountField } from "./form/AmountField";
import { CategoryField } from "./form/CategoryField";
import { TagsField } from "./form/TagsField";
import { normalizeTags } from "@/utils/tagUtils";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface TransactionFormProps {
  initialData?: TransactionFormValues;
  onSubmit: (values: TransactionFormValues) => void;
  onCancel: () => void;
}

export interface TransactionFormValues {
  date: string;
  description: string;
  amount: number;
  category_id: string | null;
  tags: string[];
}

export function TransactionForm({ initialData, onSubmit, onCancel }: TransactionFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<TransactionFormValues>({
    defaultValues: initialData || {
      date: new Date().toISOString().split('T')[0],
      description: "",
      amount: 0,
      category_id: null,
      tags: [],
    },
  });

  // Subscribe to real-time updates for transactions
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions'
        },
        () => {
          // Refresh transactions data when changes occur
          queryClient.invalidateQueries({ queryKey: ["transactions"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleSubmit = async (values: TransactionFormValues) => {
    const normalizedTags = normalizeTags(values.tags.join(','));
    
    // If we have both a description and category, create a mapping
    if (values.description && values.category_id) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Check if mapping already exists
          const { data: existingMapping } = await supabase
            .from("mappings")
            .select()
            .eq("description_keyword", values.description)
            .eq("user_id", user.id)
            .maybeSingle();

          if (!existingMapping) {
            // Only create mapping if category_id is not null
            await supabase.from("mappings").insert({
              description_keyword: values.description,
              category_id: values.category_id,
              user_id: user.id,
            });
            
            queryClient.invalidateQueries({ queryKey: ["mappings"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            
            toast({
              title: "Category mapping created",
              description: "This category will be automatically applied to all transactions with the same description.",
            });
          } else if (existingMapping.category_id !== values.category_id) {
            // Update existing mapping if category has changed
            await supabase
              .from("mappings")
              .update({ category_id: values.category_id })
              .eq("id", existingMapping.id);
            
            queryClient.invalidateQueries({ queryKey: ["mappings"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            
            toast({
              title: "Category mapping updated",
              description: "All transactions with this description will be updated to use the new category.",
            });
          }
        }
      } catch (error) {
        console.error("Error managing mapping:", error);
      }
    }

    onSubmit({ ...values, tags: normalizedTags });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <DateField form={form} />
        <DescriptionField form={form} />
        <AmountField form={form} />
        <CategoryField form={form} />
        <TagsField form={form} />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update" : "Create"} Transaction
          </Button>
        </div>
      </form>
    </Form>
  );
}