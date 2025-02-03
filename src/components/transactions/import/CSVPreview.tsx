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
import { FileText } from "lucide-react";

interface CSVPreviewProps {
  headers: string[];
  previewData: Array<{ [key: string]: string }>;
  totalRows: number;
  onProcess: () => void;
  isProcessing: boolean;
}

export const CSVPreview = ({ 
  headers, 
  previewData, 
  totalRows,
  onProcess, 
  isProcessing 
}: CSVPreviewProps) => {
  if (!previewData.length) return null;

  // Calculate total amount from preview data
  const totalAmount = previewData.reduce((sum, row) => {
    const amount = Math.abs(parseFloat(row.amount)) || 0;
    return sum + amount;
  }, 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Import Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Total Transactions</p>
              <p className="text-2xl font-bold">{totalRows}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Total Amount (EUR)</p>
              <p className="text-2xl font-bold">€{totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-2">Preview (First 5 rows)</h3>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount (EUR)</TableHead>
                <TableHead>Merchant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>€{Math.abs(parseFloat(row.amount)).toFixed(2)}</TableCell>
                  <TableCell>{row.merchant}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={onProcess} 
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Process Import"}
        </Button>
      </div>
    </div>
  );
};