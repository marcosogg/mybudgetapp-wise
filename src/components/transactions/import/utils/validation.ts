import { ImportError } from '../types';
import { parse, isValid } from 'date-fns';

const REQUIRED_HEADERS = ['Date', 'Amount', 'Merchant'];

export const validateHeaders = (headers: string[]): ImportError | null => {
  console.log("Validating headers:", headers);
  console.log("Required headers:", REQUIRED_HEADERS);
  
  const missingHeaders = REQUIRED_HEADERS.filter(
    required => !headers.includes(required)
  );
  
  if (missingHeaders.length > 0) {
    console.log("Missing headers:", missingHeaders);
  }
  
  return missingHeaders.length > 0
    ? { message: `Missing required columns: ${missingHeaders.join(', ')}` }
    : null;
};

export const validateRow = (row: any): ImportError | null => {
  console.log("Validating row:", row);
  
  const date = formatDate(row.Date);
  if (!date) {
    console.log("Invalid date:", row.Date);
    return { message: 'Invalid date format' };
  }

  const amount = Number(row.Amount);
  console.log("Parsed amount:", amount, "Original:", row.Amount);
  
  if (isNaN(amount) || amount >= 0) {
    console.log("Invalid amount:", amount);
    return { message: 'Amount must be a negative number' };
  }

  if (!row.Merchant?.trim()) {
    console.log("Invalid merchant:", row.Merchant);
    return { message: 'Merchant is required' };
  }

  return null;
};

export const formatDate = (dateStr: string): string | null => {
  console.log("Formatting date:", dateStr);
  
  if (!dateStr?.trim()) {
    console.log("Empty date string");
    return null;
  }
  
  // Try DD-MM-YYYY format (Wise CSV format)
  let date = parse(dateStr, 'dd-MM-yyyy', new Date());
  
  // If that fails, try DD/MM/YYYY format
  if (!isValid(date)) {
    date = parse(dateStr, 'dd/MM/yyyy', new Date());
  }
  
  // If that fails, try YYYY-MM-DD format
  if (!isValid(date)) {
    date = parse(dateStr, 'yyyy-MM-dd', new Date());
  }
  
  if (!isValid(date)) {
    console.log("Invalid date after parsing:", dateStr);
    return null;
  }
  
  const formattedDate = date.toISOString().split('T')[0];
  console.log("Formatted date:", formattedDate);
  return formattedDate;
};