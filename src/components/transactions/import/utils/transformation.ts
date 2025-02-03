import Papa from 'papaparse';
import { formatDate } from './validation';
import { CSVRow, CSVParseResult } from '../types';

export const transformWiseData = (row: CSVRow, userId: string) => {
  const amount = Number(row.Amount);
  
  // Only process rows with negative amounts and a merchant
  if (isNaN(amount) || amount >= 0 || !row.Merchant) {
    return null;
  }

  return {
    date: formatDate(row.Date),
    amount, // Keep the negative amount as is
    description: row.Merchant.toString(),
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