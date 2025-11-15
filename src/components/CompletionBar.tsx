import { Income, Expense } from '../types';

interface CompletionBarProps {
  income: Income[];
  expenses: Expense[];
}

export const CompletionBar = ({ income, expenses }: CompletionBarProps) => {
  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  
  // Calculate percentage (expenses / income * 100, capped at 100%)
  const percentage = totalIncome > 0 
    ? Math.min((totalExpenses / totalIncome) * 100, 100)
    : 0;
  
  const remaining = totalIncome - totalExpenses;
  const isOverBudget = remaining < 0;
  
  return (
    <div className="mb-6">
      {/* Sleek, thin progress bar */}
      <div className="relative">
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out ${
              percentage <= 100 
                ? 'bg-gradient-to-r from-green-400 to-green-500' 
                : 'bg-gradient-to-r from-red-400 to-red-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
      
      {/* Subtle stats row */}
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            <span className="text-gray-400 dark:text-gray-500">Income:</span>
            <span>${totalIncome.toFixed(2)}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            <span className="text-gray-400 dark:text-gray-500">Expenses:</span>
            <span>${totalExpenses.toFixed(2)}</span>
          </span>
        </div>
        <div className={`text-xs font-medium ${
          isOverBudget 
            ? 'text-red-500 dark:text-red-400' 
            : 'text-gray-600 dark:text-gray-400'
        }`}>
          {isOverBudget ? `-$${Math.abs(remaining).toFixed(2)}` : `$${remaining.toFixed(2)} left`}
        </div>
      </div>
    </div>
  );
};

