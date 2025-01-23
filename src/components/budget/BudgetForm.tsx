import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/categories/useCategories";
import { Budget } from "@/hooks/budget/types";
import { useEffect } from "react";
import { budgetFormSchema, BudgetFormValues } from "./types/budget-form";

interface BudgetFormProps {
  onSubmit: (values: BudgetFormValues) => void;
  selectedBudget?: Budget;
  isPending: boolean;
  onCancel: () => void;
}

export function BudgetForm({ onSubmit, selectedBudget, isPending, onCancel }: BudgetFormProps) {
  const { categories, isLoading: categoriesLoading } = useCategories();
  
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

  return (
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
  );
}