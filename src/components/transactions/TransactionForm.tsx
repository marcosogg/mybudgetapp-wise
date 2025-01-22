import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DateField } from "./form/DateField";
import { DescriptionField } from "./form/DescriptionField";
import { AmountField } from "./form/AmountField";
import { CategoryField } from "./form/CategoryField";
import { TagsField } from "./form/TagsField";
import { normalizeTags } from "@/utils/tagUtils";

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
  const form = useForm<TransactionFormValues>({
    defaultValues: initialData || {
      date: new Date().toISOString().split('T')[0],
      description: "",
      amount: 0,
      category_id: null,
      tags: [],
    },
  });

  const handleSubmit = (values: TransactionFormValues) => {
    const normalizedTags = normalizeTags(values.tags.join(','));
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