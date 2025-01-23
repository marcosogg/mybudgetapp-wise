import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit } from "lucide-react";
import { Budget } from "@/hooks/budget/types";

interface BudgetTableProps {
  budgets: Budget[];
  onEdit: (budget: Budget) => void;
}

export function BudgetTable({ budgets, onEdit }: BudgetTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {budgets.map((budget) => (
          <TableRow key={budget.id}>
            <TableCell>{budget.category?.name}</TableCell>
            <TableCell>${budget.amount.toFixed(2)}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(budget)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}