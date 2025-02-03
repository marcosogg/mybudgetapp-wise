import { ImportError } from '../types';
import { parse, isValid } from 'date-fns';

const REQUIRED_HEADERS = ['Date', 'Amount'];

export const validateHeaders = (headers: string[]): ImportError | null => {
  const missingHeaders = REQUIRED_HEADERS.filter(
    required => !headers.includes(required)
  );
  
  return missingHeaders.length > 0
    ? { message: `Missing required columns: ${missingHeaders.join(', ')}` }
    : null;
};

export const validateRow = (row: any): ImportError | null => {
  const date = formatDate(row.Date);
  if (!date) {
    return { message: 'Invalid date format' };
  }

  const amount = Number(row.Amount);
  if (isNaN(amount) || amount >= 0) {
    return { message: 'Amount must be a negative number' };
  }

  return null;
};

export const formatDate = (dateStr: string): string | null => {
  if (!dateStr?.trim()) return null;
  
  // Try DD/MM/YYYY format
  let date = parse(dateStr, 'dd/MM/yyyy', new Date());
  
  // If that fails, try YYYY-MM-DD format
  if (!isValid(date)) {
    date = parse(dateStr, 'yyyy-MM-dd', new Date());
  }
  
  if (!isValid(date)) return null;
  
  return date.toISOString().split('T')[0];
};