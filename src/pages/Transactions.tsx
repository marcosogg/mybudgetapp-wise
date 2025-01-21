import { useState } from "react";
import { Plus } from "lucide-react";
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

const Transactions = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

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
            <p className="text-3xl font-bold">{transactions.length}</p>
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
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
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