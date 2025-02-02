import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { validateHeaders, validateRow, formatDate } from '../utils/validation';
import { transformWiseData, parseCSVData } from '../utils/transformation';
import { ImportState, CSVRow, CSVParseResult } from '../types';

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
    
    try {
      const results = await parseCSVData(selectedFile);
      const headerError = validateHeaders(Object.keys(results.data[0] || {}));
      
      if (headerError) {
        setState(prev => ({ ...prev, error: headerError.message }));
        return;
      }

      const validRows = results.data
        .map((row: CSVRow) => {
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
    } catch (error: any) {
      toast({
        title: "Error parsing CSV",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const processFile = async () => {
    if (!state.file) return;

    try {
      setState(prev => ({ ...prev, isProcessing: true }));
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const results = await parseCSVData(state.file);
      const transactions = results.data
        .map((row: CSVRow) => {
          const error = validateRow(row);
          return error ? null : transformWiseData(row, user.id);
        })
        .filter((t): t is NonNullable<typeof t> => t !== null);

      if (transactions.length === 0) {
        throw new Error("No valid transactions found in the file");
      }

      const { data, error } = await supabase.functions.invoke('process-csv', {
        body: { transactions, userId: user.id }
      });

      if (error) throw error;

      simulateProgress(() => {
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
        setTimeout(() => navigate('/transactions'), 2000);
      });

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

  const simulateProgress = (onComplete: () => void) => {
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
      onComplete();
    }, 1000);
  };

  return {
    ...state,
    handleFileChange,
    processFile,
  };
};