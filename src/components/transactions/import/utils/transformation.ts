import Papa from 'papaparse';
import { formatDate } from './validation';
import { CSVRow, CSVParseResult } from '../types';

export const transformWiseData = (row: CSVRow, userId: string) => {
  return {
    date: formatDate(row.Date),
    amount: row.Amount,
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