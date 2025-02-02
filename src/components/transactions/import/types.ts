import { ParseResult } from 'papaparse';

export interface ImportError {
  message: string;
}

export interface ImportState {
  file: File | null;
  previewData: Array<{ date: string; description: string; amount: string; }>;
  error: string | null;
  isProcessing: boolean;
  totalRows: number;
  processedRows: number;
  isComplete: boolean;
}

export interface CSVRow {
  Date: string;
  Amount: number;
  Merchant: string;
}

export type CSVParseResult = ParseResult<CSVRow>;