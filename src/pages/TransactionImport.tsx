import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Papa from 'papaparse';
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FileUpload } from "@/components/transactions/import/FileUpload";
import { CSVPreview } from "@/components/transactions/import/CSVPreview";
import { ImportProgress } from "@/components/transactions/import/ImportProgress";

// Expected CSV headers in order
const EXPECTED_HEADERS = [
  'Type', 'Product', 'Started Date', 'Completed Date', 
  'Description', 'Amount', 'Fee', 'Currency', 'State', 'Balance'
];

// Indices for the columns we care about
const DATE_INDEX = 3; // Completed Date
const DESCRIPTION_INDEX = 4;
const AMOUNT_INDEX = 5;

const TransactionImport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<Array<{ date: string; description: string; amount: string; }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [processedRows, setProcessedRows] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setError(null);
    setIsComplete(false);
    setProcessedRows(0);
    
    if (!selectedFile) return;

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
        if (results.data.length === 0) {
          setError("The CSV file is empty");
          return;
        }

        const headers = results.data[0] as string[];
        
        // Simple header validation
        if (!EXPECTED_HEADERS.every((header, index) => headers[index] === header)) {
          setError("Invalid CSV format. Please ensure the file matches the expected format.");
          return;
        }

        const rows = results.data.slice(1) as string[][];
        const parsedData = rows.map(row => ({
          date: row[DATE_INDEX],
          description: row[DESCRIPTION_INDEX],
          amount: row[AMOUNT_INDEX],
        }));

        setPreviewData(parsedData.slice(0, 5));
        setTotalRows(parsedData.length);
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

      const filePath = `${user.id}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('temp_csv_files')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data, error } = await supabase.functions.invoke('process-csv', {
        body: { filePath, userId: user.id }
      });

      if (error) throw error;

      // Simulate progress updates
      const interval = setInterval(() => {
        setProcessedRows(prev => {
          const next = prev + Math.floor(Math.random() * 5) + 1;
          return next > totalRows ? totalRows : next;
        });
      }, 100);

      // Cleanup and complete
      setTimeout(() => {
        clearInterval(interval);
        setProcessedRows(totalRows);
        setIsComplete(true);
        toast({
          title: "Success",
          description: `Successfully imported ${data.transactionsCreated} transactions`,
        });
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        
        setTimeout(() => {
          navigate('/transactions');
        }, 2000);
      }, 1000);

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
            <FileUpload
              onFileChange={handleFileChange}
              error={error}
              file={file}
            />

            {file && !error && (
              <CSVPreview
                headers={['Date', 'Description', 'Amount']}
                previewData={previewData}
                totalRows={totalRows}
                onProcess={processFile}
                isProcessing={isProcessing}
              />
            )}

            {isProcessing && (
              <ImportProgress
                totalRows={totalRows}
                processedRows={processedRows}
                isComplete={isComplete}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionImport;