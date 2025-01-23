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
import { useProfile } from "@/hooks/useProfile";

interface BudgetTableProps {
  budgets: Budget[];
  onEdit: (budget: Budget) => void;
}

export function BudgetTable({ budgets, onEdit }: BudgetTableProps) {
  const { profile } = useProfile();
  const monthlyIncome = (profile?.salary || 0) + (profile?.bonus || 0);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>% of Income</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {budgets.map((budget) => {
          const percentage = monthlyIncome > 0 
            ? ((budget.amount / monthlyIncome) * 100).toFixed(1) 
            : '0.0';

          return (
            <TableRow key={budget.id}>
              <TableCell>{budget.category?.name}</TableCell>
              <TableCell>${budget.amount.toLocaleString()}</TableCell>
              <TableCell>{percentage}%</TableCell>
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
          )}
        )}
      </TableBody>
    </Table>
  );
}