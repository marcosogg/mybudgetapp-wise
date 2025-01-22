import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/transactions/CategoryBadge";
import { ArrowUpDown, Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { TransactionDialog } from "./TransactionDialog";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { TransactionFormValues } from "./TransactionForm";

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

type SortField = "date" | "description" | "amount" | "category";
type SortOrder = "asc" | "desc";

interface TransactionTableProps {
  transactions: Transaction[];
  sortField: SortField;
  sortOrder: SortOrder;
  toggleSort: (field: SortField) => void;
  formatCurrency: (amount: number) => string;
}

export const TransactionTable = ({
  transactions,
  sortField,
  sortOrder,
  toggleSort,
  formatCurrency,
}: TransactionTableProps) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleEditTransaction = async (values: TransactionFormValues) => {
    if (!editingTransaction) return;

    try {
      const { error } = await supabase
        .from("transactions")
        .update(values)
        .eq("id", editingTransaction.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setEditingTransaction(null);
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => toggleSort("date")}
                className="flex items-center gap-2"
              >
                Date
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => toggleSort("description")}
                className="flex items-center gap-2"
              >
                Description
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => toggleSort("category")}
                className="flex items-center gap-2"
              >
                Category
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => toggleSort("amount")}
                className="flex items-center gap-2"
              >
                Amount
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
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
                  onClick={() => setEditingTransaction(transaction)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TransactionDialog
        open={!!editingTransaction}
        onOpenChange={(open) => !open && setEditingTransaction(null)}
        onSubmit={handleEditTransaction}
        initialData={editingTransaction || undefined}
        mode="edit"
      />
    </>
  );
};