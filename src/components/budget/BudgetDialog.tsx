import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Budget } from "@/hooks/budget/types";
import { useEffect } from "react";

const budgetFormSchema = z.object({
  category_id: z.string().min(1, "Please select a category"),
  amount: z.string()
    .min(1, "Amount is required")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      "Please enter a valid amount greater than 0"
    ),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

interface BudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBudget?: Budget;
}

export function BudgetDialog({ open, onOpenChange, selectedBudget }: BudgetDialogProps) {
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { mutate: submitBudget, isPending } = useBudgetSubmit();

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      category_id: "",
      amount: "",
    },
  });

  useEffect(() => {
    if (selectedBudget) {
      form.reset({
        category_id: selectedBudget.category_id,
        amount: selectedBudget.amount.toString(),
      });
    } else {
      form.reset({
        category_id: "",
        amount: "",
      });
    }
  }, [selectedBudget, form]);

  const onSubmit = (values: BudgetFormValues) => {
    const currentDate = new Date();
    // Format the date as YYYY-MM-DD for the first day of the current month
    const period = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-01`;
    
    submitBudget({
      id: selectedBudget?.id,
      category_id: values.category_id,
      amount: parseFloat(values.amount),
      period,
    });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedBudget ? "Edit Budget" : "Add Budget"}</DialogTitle>
          <DialogDescription>
            {selectedBudget 
              ? "Update your budget allocation for this category" 
              : "Set a budget allocation for a category"}
          </DialogDescription>
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
                    value={field.value}
                    disabled={categoriesLoading}
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
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isPending || !form.formState.isValid}
            >
              {isPending 
                ? (selectedBudget ? "Updating..." : "Adding...") 
                : (selectedBudget ? "Update Budget" : "Add Budget")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}