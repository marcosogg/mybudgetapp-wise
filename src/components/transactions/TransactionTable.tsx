import { Table, TableBody } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { TransactionDialog } from "./TransactionDialog";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { TransactionFormValues } from "./TransactionForm";
import { TransactionTableHeader } from "./TransactionTableHeader";
import { TransactionTableRow } from "./TransactionTableRow";
import { Transaction } from "@/types/transaction";

type SortField = "date" | "description" | "amount" | "category";
type SortOrder = "asc" | "desc";

interface TransactionTableProps {
  transactions: Transaction[];
  sortField: SortField;
  sortOrder: SortOrder;
  toggleSort: (field: SortField) => void;
  formatCurrency: (amount: number) => string;
  selectedTags?: string[];
}

export const TransactionTable = ({
  transactions,
  sortField,
  sortOrder,
  toggleSort,
  formatCurrency,
  selectedTags = [],
}: TransactionTableProps) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Subscribe to real-time updates for mappings
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mappings'
        },
        () => {
          // Refresh transactions data when mappings change
          queryClient.invalidateQueries({ queryKey: ["transactions"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const filteredTransactions = selectedTags.length > 0
    ? transactions.filter(transaction => 
        selectedTags.every(tag => transaction.tags?.includes(tag))
      )
    : transactions;

  const handleEditTransaction = async (values: TransactionFormValues) => {
    if (!editingTransaction) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const updateData = {
        date: values.date,
        description: values.description,
        amount: values.amount,
        category_id: values.category_id === "null" ? null : values.category_id,
        tags: values.tags,
        user_id: user.id,
      };

      const { error } = await supabase
        .from("transactions")
        .update(updateData)
        .eq("id", editingTransaction.id)
        .eq("user_id", user.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setEditingTransaction(null);
      
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating transaction:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update transaction",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Table>
        <TransactionTableHeader toggleSort={toggleSort} />
        <TableBody>
          {filteredTransactions.map((transaction) => (
            <TransactionTableRow
              key={transaction.id}
              transaction={transaction}
              formatCurrency={formatCurrency}
              onEdit={setEditingTransaction}
            />
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