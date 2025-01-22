import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import Papa from 'papaparse';
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface CSVRow {
  date: string;
  description: string;
  amount: string;
  [key: string]: string;
}

const TransactionImport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<CSVRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setError(null);
    
    if (!selectedFile) {
      return;
    }

    if (!selectedFile.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV file",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    
    Papa.parse(selectedFile, {
      complete: (results) => {
        if (results.data.length > 0) {
          const headers = results.data[0] as string[];
          const rows = results.data.slice(1) as string[][];
          
          const requiredColumns = ['date', 'description', 'amount'];
          const headerLower = headers.map(h => h.toLowerCase());
          const missingColumns = requiredColumns.filter(
            col => !headerLower.includes(col)
          );

          if (missingColumns.length > 0) {
            setError(`Missing required columns: ${missingColumns.join(', ')}`);
            return;
          }

          const parsedData = rows.map(row => {
            const rowData: { [key: string]: string } = {};
            headers.forEach((header, index) => {
              rowData[header.toLowerCase()] = row[index] || '';
            });
            return rowData as CSVRow;
          });

          setHeaders(headers);
          setPreviewData(parsedData.slice(0, 5));
        }
      },
      error: (error) => {
        toast({
          title: "Error parsing CSV",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const processFile = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Upload to temp storage
      const filePath = `${user.id}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('temp_csv_files')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Process the CSV file
      const { data, error } = await supabase.functions.invoke('process-csv', {
        body: { filePath, userId: user.id }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Successfully imported ${data.transactionsCreated} transactions`,
      });

      // Refresh transactions data and navigate back
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
      navigate('/transactions');

    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process file",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Import Transactions</h2>
        <p className="text-muted-foreground">
          Import your transactions from a CSV file
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Select CSV File
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to select</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    CSV files only
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {file && !error && (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Selected file: {file.name}
                </div>

                {previewData.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Preview (First 5 rows)</h3>
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {headers.map((header) => (
                              <TableHead key={header}>{header}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {previewData.map((row, index) => (
                            <TableRow key={index}>
                              {headers.map((header) => (
                                <TableCell key={header}>
                                  {row[header.toLowerCase()]}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="flex justify-end">
                      <Button 
                        onClick={processFile} 
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : "Process Import"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionImport;