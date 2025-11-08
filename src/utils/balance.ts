import { Income, Expense, BalanceProjection } from '../types';
import { startOfDay, eachDayOfInterval, isSameDay } from 'date-fns';

export const calculateBalanceProjection = (
  income: Income[],
  expenses: Expense[],
  startDate: Date,
  endDate: Date
): BalanceProjection[] => {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const projections: BalanceProjection[] = [];
  let runningBalance = 0;

  for (const day of days) {
    const dayStart = startOfDay(day);
    
    // Calculate income for this day
    const dayIncome = income
      .filter(item => isSameDay(item.date, dayStart))
      .reduce((sum, item) => sum + item.amount, 0);

    // Calculate expenses for this day
    const dayExpenses = expenses
      .filter(item => isSameDay(item.date, dayStart))
      .reduce((sum, item) => sum + item.amount, 0);

    runningBalance += dayIncome - dayExpenses;

    projections.push({
      date: dayStart,
      balance: runningBalance,
      income: dayIncome,
      expenses: dayExpenses
    });
  }

  return projections;
};

