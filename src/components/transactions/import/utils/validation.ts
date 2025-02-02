import { ImportError } from '../types';

const REQUIRED_HEADERS = ['Date', 'Amount', 'Merchant'];

export const validateHeaders = (headers: string[]): ImportError | null => {
  const missingHeaders = REQUIRED_HEADERS.filter(
    required => !headers.includes(required)
  );
  
  return missingHeaders.length > 0
    ? { message: `Missing required columns: ${missingHeaders.join(', ')}` }
    : null;
};

export const validateRow = (row: any): ImportError | null => {
  if (!row.Merchant?.trim()) {
    return { message: 'Merchant name is required' };
  }

  const date = formatDate(row.Date);
  if (!date) {
    return { message: 'Invalid date format' };
  }

  if (typeof row.Amount !== 'number' || row.Amount >= 0) {
    return { message: 'Amount must be a negative number' };
  }

  return null;
};

export const formatDate = (dateStr: string): string | null => {
  if (!dateStr?.trim()) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  return date.toISOString().split('T')[0];
};