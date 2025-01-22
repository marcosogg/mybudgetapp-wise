import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionHeader } from "@/components/transactions/TransactionHeader";
import { TransactionStats } from "@/components/transactions/TransactionStats";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { useTransactions } from "@/components/transactions/hooks/useTransactions";
import { useCategories } from "@/components/transactions/hooks/useCategories";
import { filterTransactions, sortTransactions, formatCurrency } from "@/components/transactions/utils/transactionUtils";
import { SortField, SortOrder } from "@/components/transactions/types";

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: transactions = [], isLoading: isLoadingTransactions } = useTransactions();
  const { data: categories = [] } = useCategories();

  const availableTags = useMemo(() => {
    const allTags = new Set<string>();
    transactions.forEach((transaction) => {
      transaction.tags?.forEach((tag) => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  }, [transactions]);

  const filteredAndSortedTransactions = useMemo(() => {
    const filtered = filterTransactions(transactions, searchTerm, selectedCategory, selectedTags);
    return sortTransactions(filtered, sortField, sortOrder);
  }, [transactions, searchTerm, sortField, sortOrder, selectedCategory, selectedTags]);

  const totalAmount = filteredAndSortedTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  if (isLoadingTransactions) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <TransactionHeader />
      
      <TransactionStats 
        transactionCount={filteredAndSortedTransactions.length}
        totalAmount={totalAmount}
        formatCurrency={formatCurrency}
      />

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <TransactionFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            availableTags={availableTags}
          />
        </CardHeader>
        <CardContent>
          <TransactionTable
            transactions={filteredAndSortedTransactions}
            sortField={sortField}
            sortOrder={sortOrder}
            toggleSort={toggleSort}
            formatCurrency={formatCurrency}
            selectedTags={selectedTags}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;