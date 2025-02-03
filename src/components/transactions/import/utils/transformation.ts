import Papa from 'papaparse';
import { formatDate } from './validation';
import { CSVRow, CSVParseResult } from '../types';

const transformWiseData = (csvData: CSVParseResult) => {
  return csvData.data
    // Filter amount > 0
    .filter(row => row.Amount > 0)
    // Select only needed columns
    .map(row => ({
      date: formatDate(row.Date),
      amount: row.Amount,
      merchant: row.Merchant?.toString() || null,
    }));
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