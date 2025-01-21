import { useState, useMemo } from "react";
import { Plus, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const mockTransactions = [
  {
    id: "1",
    date: "2024-02-01",
    description: "Grocery Shopping",
    amount: 85.50,
    categoryId: "1",
  },
  {
    id: "2",
    date: "2024-02-02",
    description: "Gas Station",
    amount: 45.00,
    categoryId: "2",
  },
  {
    id: "3",
    date: "2024-02-03",
    description: "Movie Tickets",
    amount: 30.00,
    categoryId: "3",
  },
  {
    id: "4",
    date: "2024-02-04",
    description: "Electric Bill",
    amount: 120.00,
    categoryId: "4",
  },
];

type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  categoryId: string;
};

type SortField = "date" | "description" | "amount";
type SortOrder = "asc" | "desc";

const Transactions = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [amountFilter, setAmountFilter] = useState<"all" | "above" | "below">("all");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter((transaction) =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply amount filter
    if (amountFilter === "above") {
      filtered = filtered.filter((t) => t.amount >= 50);
    } else if (amountFilter === "below") {
      filtered = filtered.filter((t) => t.amount < 50);
    }

    // Sort transactions
    return filtered.sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;
      
      if (sortField === "date") {
        return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime());
      }
      if (sortField === "amount") {
        return multiplier * (a.amount - b.amount);
      }
      return multiplier * a[sortField].localeCompare(b[sortField]);
    });
  }, [transactions, searchTerm, sortField, sortOrder, amountFilter]);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Transactions</h2>
          <p className="text-muted-foreground">
            Manage your financial transactions
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{filteredAndSortedTransactions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(totalAmount)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <div className="flex flex-col gap-4 md:flex-row md:items-center mt-4">
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select
              value={amountFilter}
              onValueChange={(value: "all" | "above" | "below") => setAmountFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by amount" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All amounts</SelectItem>
                <SelectItem value="above">Above $50</SelectItem>
                <SelectItem value="below">Below $50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
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
              {filteredAndSortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;