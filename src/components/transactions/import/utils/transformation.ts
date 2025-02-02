import Papa from 'papaparse';
import { formatDate } from './validation';
import { CSVRow, CSVParseResult } from '../types';

export const transformWiseData = (row: CSVRow, userId: string) => ({
  user_id: userId,
  date: formatDate(row.Date)!,
  description: row.Merchant?.toString() || null, // Accept any merchant value, including null
  amount: row.Amount,
  tags: [],
  category_id: null,
});

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