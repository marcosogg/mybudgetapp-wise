import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { CategoryBadge } from "./CategoryBadge";
import { Pencil } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category_id: string | null;
  category?: {
    name: string;
  } | null;
}

interface TransactionTableRowProps {
  transaction: Transaction;
  formatCurrency: (amount: number) => string;
  onEdit: (transaction: Transaction) => void;
}

export const TransactionTableRow = ({
  transaction,
  formatCurrency,
  onEdit,
}: TransactionTableRowProps) => {
  return (
    <TableRow key={transaction.id}>
      <TableCell>{transaction.date}</TableCell>
      <TableCell>{transaction.description}</TableCell>
      <TableCell>
        <CategoryBadge categoryName={transaction.category?.name ?? null} />
      </TableCell>
      <TableCell>{formatCurrency(transaction.amount)}</TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(transaction)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};