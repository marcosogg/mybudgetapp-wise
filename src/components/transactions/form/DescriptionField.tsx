import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TransactionFormValues } from "../TransactionForm";
import { useMappings } from "../hooks/useMappings";
import { useEffect } from "react";

interface DescriptionFieldProps {
  form: UseFormReturn<TransactionFormValues>;
}

export const DescriptionField = ({ form }: DescriptionFieldProps) => {
  const { data: mappings = [] } = useMappings();

  // Watch for description changes
  const description = form.watch("description");

  // Effect to update category when description matches a mapping
  useEffect(() => {
    if (description) {
      const mapping = mappings.find(m => m.description_keyword === description);
      if (mapping) {
        form.setValue("category_id", mapping.category_id);
      }
    }
  }, [description, mappings, form]);

  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};