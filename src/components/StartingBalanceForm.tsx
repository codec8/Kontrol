import { useState, useEffect } from 'react';
import { format, startOfMonth } from 'date-fns';
import { storage } from '../utils/storage';

interface StartingBalanceFormProps {
  currentMonth: Date;
  onUpdate: () => void;
}

export const StartingBalanceForm = ({ currentMonth, onUpdate }: StartingBalanceFormProps) => {
  const monthKey = format(startOfMonth(currentMonth), 'yyyy-MM');
  const [startingBalance, setStartingBalance] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadStartingBalance();
  }, [monthKey]);

  const loadStartingBalance = () => {
    const balance = storage.getStartingBalance(monthKey);
    setStartingBalance(balance);
    setInputValue(balance !== null ? balance.toString() : '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(inputValue);
    if (isNaN(amount)) {
      alert('Please enter a valid number');
      return;
    }

    storage.setStartingBalance(monthKey, amount);
    loadStartingBalance();
    setIsFormOpen(false);
    onUpdate();
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the starting balance for this month?')) {
      const balances = storage.getStartingBalances();
      delete balances[monthKey];
      localStorage.setItem('financial-calendar-starting-balances', JSON.stringify(balances));
      loadStartingBalance();
      setIsFormOpen(false);
      onUpdate();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">Starting Balance</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {format(currentMonth, 'MMMM yyyy')}
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          {isFormOpen ? 'Cancel' : startingBalance !== null ? 'Edit' : 'Set Balance'}
        </button>
      </div>

      {startingBalance !== null && !isFormOpen && (
        <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Current Starting Balance</div>
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                ${startingBalance.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mb-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Starting Balance for {format(currentMonth, 'MMMM yyyy')} ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="0.00"
              autoFocus
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Enter your account balance at the start of this month. This will be used as the baseline for all calculations.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Save Balance
            </button>
            {startingBalance !== null && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                loadStartingBalance();
              }}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {startingBalance === null && !isFormOpen && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-xs">
          No starting balance set for this month. Click "Set Balance" to add one.
        </div>
      )}
    </div>
  );
};

