import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TransactionHeader } from "@/components/transactions/TransactionHeader";
import { TransactionStats } from "@/components/transactions/TransactionStats";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionTable } from "@/components/transactions/TransactionTable";

type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category_id: string | null;
  category?: {
    name: string;
  } | null;
};

type SortField = "date" | "description" | "amount" | "category";
type SortOrder = "asc" | "desc";

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          category:category_id (
            name
          )
        `)
        .order("date", { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name");

      if (error) throw error;
      return data;
    },
  });

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter((transaction) =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) =>
        selectedCategory === "uncategorized"
          ? !t.category_id
          : t.category_id === selectedCategory
      );
    }

    return filtered.sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;
      
      if (sortField === "date") {
        return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime());
      }
      if (sortField === "amount") {
        return multiplier * (a.amount - b.amount);
      }
      if (sortField === "category") {
        const categoryA = a.category?.name ?? "";
        const categoryB = b.category?.name ?? "";
        return multiplier * categoryA.localeCompare(categoryB);
      }
      return multiplier * a[sortField].localeCompare(b[sortField]);
    });
  }, [transactions, searchTerm, sortField, sortOrder, selectedCategory]);

  const totalAmount = filteredAndSortedTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

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
          />
        </CardHeader>
        <CardContent>
          <TransactionTable
            transactions={filteredAndSortedTransactions}
            sortField={sortField}
            sortOrder={sortOrder}
            toggleSort={toggleSort}
            formatCurrency={formatCurrency}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;