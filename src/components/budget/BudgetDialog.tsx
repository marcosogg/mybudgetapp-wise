import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useBudgetSubmit } from "@/hooks/budget/useBudgetSubmit";
import { Budget } from "@/hooks/budget/types";
import { BudgetForm } from "./BudgetForm";
import { BudgetFormValues } from "./types/budget-form";

interface BudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBudget?: Budget;
}

export function BudgetDialog({ open, onOpenChange, selectedBudget }: BudgetDialogProps) {
  const { mutate: submitBudget, isPending } = useBudgetSubmit();

  const handleSubmit = (values: BudgetFormValues) => {
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
        <BudgetForm
          onSubmit={handleSubmit}
          selectedBudget={selectedBudget}
          isPending={isPending}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}