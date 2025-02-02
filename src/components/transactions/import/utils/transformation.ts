import { formatDate } from './validation';

export const transformWiseData = (row: any, userId: string) => ({
  user_id: userId,
  date: formatDate(row.Date)!,
  description: row.Merchant.trim(),
  amount: Math.abs(row.Amount),
  tags: [],
  category_id: null,
});

export const parseCSVData = (file: File) => {
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