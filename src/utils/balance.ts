import { Income, Expense, BalanceProjection } from '../types';
import { startOfDay, eachDayOfInterval, isSameDay, startOfMonth } from 'date-fns';

export const calculateBalanceProjection = (
  income: Income[],
  expenses: Expense[],
  startDate: Date,
  endDate: Date,
  startingBalance: number | null = null,
  monthStartDate?: Date
): BalanceProjection[] => {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const projections: BalanceProjection[] = [];
  let runningBalance = 0;
  const monthStart = monthStartDate ? startOfDay(monthStartDate) : startOfMonth(startDate);
  let startingBalanceApplied = false;

  for (const day of days) {
    const dayStart = startOfDay(day);
    
    // Apply starting balance only on the first day of the month
    if (isSameDay(dayStart, monthStart) && !startingBalanceApplied && startingBalance !== null) {
      runningBalance = startingBalance;
      startingBalanceApplied = true;
    }
    
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

