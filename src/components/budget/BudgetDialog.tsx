import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/categories/useCategories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBudgetSubmit } from "@/hooks/budget/useBudgetSubmit";

const budgetFormSchema = z.object({
  category_id: z.string().min(1, "Category is required"),
  amount: z.string().min(1, "Amount is required"),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

interface BudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BudgetDialog({ open, onOpenChange }: BudgetDialogProps) {
  const { data: categories } = useCategories();
  const { mutate: submitBudget, isLoading } = useBudgetSubmit();

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      category_id: "",
      amount: "",
    },
  });

  const onSubmit = (values: BudgetFormValues) => {
    const currentDate = new Date();
    submitBudget({
      category_id: values.category_id,
      amount: parseFloat(values.amount),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
    });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Budget</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Budget"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}