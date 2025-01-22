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
            .single();

          if (!existingMapping) {
            // Create new mapping
            await supabase.from("mappings").insert({
              description_keyword: values.description,
              category_id: values.category_id,
              user_id: user.id,
            });
            
            // Invalidate mappings query to refresh the data
            queryClient.invalidateQueries({ queryKey: ["mappings"] });
            
            toast({
              title: "Category mapping created",
              description: "This category will be automatically selected for future transactions with the same description.",
            });
          }
        }
      } catch (error) {
        console.error("Error creating mapping:", error);
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