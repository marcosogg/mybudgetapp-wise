import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Papa from 'papaparse';
import { supabase } from "@/integrations/supabase/client";

// Constants for Wise CSV import
const REQUIRED_HEADERS = ['Date', 'Amount', 'Merchant'];

export interface ImportState {
  file: File | null;
  previewData: Array<{ date: string; description: string; amount: string; }>;
  error: string | null;
  isProcessing: boolean;
  totalRows: number;
  processedRows: number;
  isComplete: boolean;
}

const formatDate = (dateStr: string): string | null => {
  if (!dateStr?.trim()) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  return date.toISOString().split('T')[0];
};

const validateHeaders = (headers: string[]): string | null => {
  const missingHeaders = REQUIRED_HEADERS.filter(
    required => !headers.includes(required)
  );
  
  if (missingHeaders.length > 0) {
    return `Missing required columns: ${missingHeaders.join(', ')}`;
  }
  return null;
};

const validateRow = (row: any): string | null => {
  if (!row.Merchant?.trim()) {
    return 'Merchant name is required';
  }

  const date = formatDate(row.Date);
  if (!date) {
    return 'Invalid date format';
  }

  if (typeof row.Amount !== 'number' || row.Amount >= 0) {
    return 'Amount must be a negative number';
  }

  return null;
};

export const useCSVImport = () => {
  const [state, setState] = useState<ImportState>({
    file: null,
    previewData: [],
    error: null,
    isProcessing: false,
    totalRows: 0,
    processedRows: 0,
    isComplete: false,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const resetState = () => {
    setState(prev => ({
      ...prev,
      error: null,
      isComplete: false,
      processedRows: 0,
    }));
  };

  const transformWiseData = (row: any, userId: string) => ({
    user_id: userId,
    date: formatDate(row.Date)!,
    description: row.Merchant.trim(),
    amount: row.Amount,
    tags: [],
    category_id: null,
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    resetState();
    
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      setState(prev => ({ 
        ...prev, 
        error: "Please select a CSV file" 
      }));
      return;
    }

    setState(prev => ({ ...prev, file: selectedFile }));
    
    Papa.parse(selectedFile, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        const headerError = validateHeaders(Object.keys(results.data[0] || {}));
        
        if (headerError) {
          setState(prev => ({ ...prev, error: headerError }));
          return;
        }

        const validRows = results.data
          .map((row: any) => {
            const error = validateRow(row);
            return error ? null : row;
          })
          .filter((row): row is NonNullable<typeof row> => row !== null);

        if (validRows.length === 0) {
          setState(prev => ({
            ...prev,
            error: "No valid transactions found in the file"
          }));
          return;
        }

        setState(prev => ({
          ...prev,
          previewData: validRows.slice(0, 5).map(row => ({
            date: formatDate(row.Date)!,
            description: row.Merchant,
            amount: row.Amount.toString(),
          })),
          totalRows: validRows.length,
        }));
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
    if (!state.file) return;

    try {
      setState(prev => ({ ...prev, isProcessing: true }));
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const transactions = await new Promise<any[]>((resolve, reject) => {
        Papa.parse(state.file!, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim(),
          complete: (results) => {
            const validTransactions = results.data
              .map((row: any) => {
                const error = validateRow(row);
                return error ? null : transformWiseData(row, user.id);
              })
              .filter((t): t is NonNullable<typeof t> => t !== null);
            
            resolve(validTransactions);
          },
          error: reject,
        });
      });

      if (transactions.length === 0) {
        throw new Error("No valid transactions found in the file");
      }

      const { data, error } = await supabase.functions.invoke('process-csv', {
        body: { transactions, userId: user.id }
      });

      if (error) throw error;

      const interval = setInterval(() => {
        setState(prev => {
          const next = prev.processedRows + Math.floor(Math.random() * 5) + 1;
          return {
            ...prev,
            processedRows: next > prev.totalRows ? prev.totalRows : next
          };
        });
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        setState(prev => ({
          ...prev,
          processedRows: prev.totalRows,
          isComplete: true,
        }));
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
      console.error("Processing error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process file",
        variant: "destructive",
      });
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  return {
    ...state,
    handleFileChange,
    processFile,
  };
};