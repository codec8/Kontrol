import { useState } from 'react';
import { format } from 'date-fns';
import { Allocation } from '../types';
import { matchPaychecksToBills } from '../utils/matching';
import { Income, Expense } from '../types';

interface MatchingResultsProps {
  income: Income[];
  expenses: Expense[];
}

export const MatchingResults = ({ income, expenses }: MatchingResultsProps) => {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);

  const handleCalculate = () => {
    if (income.length === 0) {
      alert('Please add at least one income entry first.');
      return;
    }
    if (expenses.length === 0) {
      alert('Please add at least one expense first.');
      return;
    }

    const results = matchPaychecksToBills(income, expenses);
    setAllocations(results);
    setIsCalculated(true);
  };

  const unpaidBills = allocations.filter(a => !a.canPay);
  const paidBills = allocations.filter(a => a.canPay);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Paycheck-to-Bill Matching</h2>
        <button
          onClick={handleCalculate}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
        >
          Calculate Match
        </button>
      </div>

      {!isCalculated ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Click "Calculate Match" to see which paychecks should be used for which bills.
        </div>
      ) : (
        <div className="space-y-6">
          {unpaidBills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-3">
                ⚠️ Bills That Cannot Be Paid ({unpaidBills.length})
              </h3>
              <div className="space-y-3">
                {unpaidBills.map(allocation => (
                  <div
                    key={allocation.expenseId}
                    className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-red-800 dark:text-red-300">
                        {allocation.expense.description} - ${allocation.expense.amount.toFixed(2)}
                      </div>
                      <div className="text-sm text-red-600 dark:text-red-400">
                        Due: {format(allocation.expense.date, 'MMM d, yyyy')}
                      </div>
                    </div>
                    <div className="text-sm text-red-700 dark:text-red-300">
                      Shortfall: ${(allocation.expense.amount - allocation.totalAllocated).toFixed(2)}
                      {allocation.totalAllocated > 0 && (
                        <span className="ml-2">
                          (${allocation.totalAllocated.toFixed(2)} can be covered)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {paidBills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">
                ✓ Bills That Can Be Paid ({paidBills.length})
              </h3>
              <div className="space-y-3">
                {paidBills.map(allocation => (
                  <div
                    key={allocation.expenseId}
                    className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-green-800 dark:text-green-300">
                        {allocation.expense.description} - ${allocation.expense.amount.toFixed(2)}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        Due: {format(allocation.expense.date, 'MMM d, yyyy')}
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Pay from these paychecks:
                      </div>
                      {allocation.paychecks.map((paycheck, index) => (
                        <div
                          key={paycheck.id}
                          className="text-sm text-gray-600 dark:text-gray-400 ml-4"
                        >
                          • ${allocation.amounts[index].toFixed(2)} from ${paycheck.description || 'Paycheck'} 
                          ({format(paycheck.date, 'MMM d, yyyy')})
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {allocations.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No allocations found. Please add income and expenses first.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

