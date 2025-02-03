import { ParseResult } from 'papaparse';

export interface ImportError {
  message: string;
}

export interface ImportState {
  file: File | null;
  previewData: Array<{ date: string; description: string | null; amount: string; }>;
  error: string | null;
  isProcessing: boolean;
  totalRows: number;
  processedRows: number;
  isComplete: boolean;
}

export interface CSVRow {
  Date: string;
  Amount: string | number;
  Merchant?: string | null;
}

export type CSVParseResult = ParseResult<CSVRow>;