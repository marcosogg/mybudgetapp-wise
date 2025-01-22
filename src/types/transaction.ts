export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category_id: string | null;
  tags: string[] | null;
  category?: {
    name: string;
  } | null;
}