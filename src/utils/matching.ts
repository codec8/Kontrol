import { Income, Expense, Allocation } from '../types';
import { isBefore, isSameDay, startOfDay } from 'date-fns';

export const matchPaychecksToBills = (
  income: Income[],
  expenses: Expense[]
): Allocation[] => {
  // Sort expenses by due date (earliest first)
  const sortedExpenses = [...expenses].sort((a, b) => 
    a.date.getTime() - b.date.getTime()
  );

  // Sort income by date (earliest first)
  const sortedIncome = [...income].sort((a, b) => 
    a.date.getTime() - b.date.getTime()
  );

  // Track remaining balance for each paycheck
  const paycheckBalances = new Map<string, number>();
  sortedIncome.forEach(paycheck => {
    paycheckBalances.set(paycheck.id, paycheck.amount);
  });

  const allocations: Allocation[] = [];

  // For each expense, find paychecks to cover it
  for (const expense of sortedExpenses) {
    const expenseDate = startOfDay(expense.date);
    const paycheckIds: string[] = [];
    const paychecks: Income[] = [];
    const amounts: number[] = [];
    let remainingNeeded = expense.amount;

    // Find paychecks that arrive before or on the due date
    for (const paycheck of sortedIncome) {
      const paycheckDate = startOfDay(paycheck.date);
      const availableBalance = paycheckBalances.get(paycheck.id) || 0;

      // Check if paycheck arrives before or on due date and has available balance
      if (
        (isBefore(paycheckDate, expenseDate) || isSameDay(paycheckDate, expenseDate)) &&
        availableBalance > 0 &&
        remainingNeeded > 0
      ) {
        const amountToUse = Math.min(availableBalance, remainingNeeded);
        paycheckIds.push(paycheck.id);
        paychecks.push(paycheck);
        amounts.push(amountToUse);
        remainingNeeded -= amountToUse;

        // Update the remaining balance for this paycheck
        paycheckBalances.set(paycheck.id, availableBalance - amountToUse);

        if (remainingNeeded <= 0) break;
      }
    }

    const canPay = remainingNeeded <= 0;
    const totalAllocated = expense.amount - remainingNeeded;

    allocations.push({
      expenseId: expense.id,
      expense,
      paycheckIds,
      paychecks,
      amounts,
      canPay,
      totalAllocated
    });
  }

  return allocations;
};

