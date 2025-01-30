import { useMemo } from "react";
import { Budget } from "./types";
import {
  calculateTotalBudget,
  calculateRemainingBudget,
  calculateBudgetPercentage,
} from "@/utils/budget/calculations";

interface BudgetMetrics {
  totalBudget: number;
  remainingBudget: number;
  budgetPercentage: number;
  isOverBudget: boolean;
}

export const useBudgetMetrics = (
  budgets: Budget[] = [],
  monthlyIncome: number = 0
): BudgetMetrics => {
  return useMemo(() => {
    const totalBudget = calculateTotalBudget(budgets);
    const remainingBudget = calculateRemainingBudget(totalBudget, monthlyIncome);
    const budgetPercentage = calculateBudgetPercentage(totalBudget, monthlyIncome);

    return {
      totalBudget,
      remainingBudget,
      budgetPercentage,
      isOverBudget: remainingBudget < 0,
    };
  }, [budgets, monthlyIncome]);
};