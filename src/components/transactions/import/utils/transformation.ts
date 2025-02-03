import Papa from 'papaparse';
import { formatDate } from './validation';
import { CSVRow, CSVParseResult } from '../types';

export const transformWiseData = (row: CSVRow, userId: string) => {
  // Keep the original amount sign - negative for expenses, positive for income
  return {
    date: formatDate(row.Date),
    amount: Number(row.Amount), // Don't use Math.abs anymore
    description: row.Merchant?.toString() || null,
    user_id: userId
  };
};

export const parseCSVData = (file: File): Promise<CSVParseResult> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: resolve,
      error: reject,
    });
  });
};
