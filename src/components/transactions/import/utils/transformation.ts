import Papa from 'papaparse';
import { formatDate } from './validation';
import { CSVRow, CSVParseResult } from '../types';

export const transformWiseData = (row: CSVRow, userId: string) => {
  // Convert positive amounts to negative for expenses
  const amount = row.Merchant ? 
    // If there's a merchant, it's an expense - make it negative
    (Number(row.Amount) > 0 ? -Number(row.Amount) : Number(row.Amount)) :
    // If no merchant, it's income - keep the original sign
    Number(row.Amount);

  return {
    date: formatDate(row.Date),
    amount,
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
