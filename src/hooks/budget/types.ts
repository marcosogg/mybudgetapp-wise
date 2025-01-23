import { Category } from "@/components/categories/types";

export interface Budget {
  id: string;
  category_id: string;
  category?: Category;
  amount: number;
  month: number;
  year: number;
}

export interface CreateBudgetInput {
  category_id: string;
  amount: number;
  month: number;
  year: number;
}