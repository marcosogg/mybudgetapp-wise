import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { CategoryBadge } from "./CategoryBadge";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types/transaction";
import { getTagStyle } from "@/utils/tagUtils";

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
  console.log("Transaction tags:", transaction.tags); // Debug log

  return (
    <TableRow key={transaction.id}>
      <TableCell>{transaction.date}</TableCell>
      <TableCell>{transaction.description}</TableCell>
      <TableCell>
        <CategoryBadge categoryName={transaction.category?.name ?? null} />
      </TableCell>
      <TableCell>{formatCurrency(transaction.amount)}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {transaction.tags?.map((tag) => {
            const style = getTagStyle(tag);
            const Icon = style.icon;
            return (
              <Badge
                key={tag}
                variant="secondary"
                className={`flex items-center gap-1 ${style.bg} ${style.text}`}
              >
                <Icon className="h-3 w-3" />
                {tag}
              </Badge>
            );
          })}
        </div>
      </TableCell>
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