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
    return { message: `Missing required columns: ${missingHeaders.join(', ')}` };
  }
  
  return null;
};

export const validateRow = (row: any): ImportError | null => {
  console.log("Validating row:", row);
  
  // Check if date is valid
  const date = formatDate(row.Date);
  if (!date) {
    console.log("Invalid date:", row.Date);
    return { message: 'Invalid date format' };
  }

  // Check if amount is a valid negative number
  const amount = Number(row.Amount);
  if (isNaN(amount)) {
    console.log("Invalid amount:", amount);
    return { message: 'Amount must be a number' };
  }

  // Check if merchant exists
  if (!row.Merchant?.trim()) {
    console.log("Missing merchant");
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