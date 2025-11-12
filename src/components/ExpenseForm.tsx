import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Expense } from '../types';
import { storage } from '../utils/storage';
import { useSubscription } from '../contexts/SubscriptionContext';
import { UpgradePrompt } from './UpgradePrompt';

interface ExpenseFormProps {
  onUpdate: () => void;
}

const FREE_TIER_ENTRY_LIMIT = 15;

export const ExpenseForm = ({ onUpdate }: ExpenseFormProps) => {
  const { subscription } = useSubscription();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    amount: '',
    description: '',
    category: '',
    isRecurring: false
  });

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = () => {
    const loaded = storage.getExpenses();
    setExpenses(loaded.sort((a, b) => a.date.getTime() - b.date.getTime()));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // Check entry limit for free tier (only when adding new, not editing)
    if (!editingId && subscription.tier === 'free') {
      const totalEntries = storage.getTotalEntryCount();
      if (totalEntries >= FREE_TIER_ENTRY_LIMIT) {
        setShowUpgradePrompt(true);
        return;
      }
    }

    const expense: Expense = {
      id: editingId || `expense-${Date.now()}`,
      date: new Date(formData.date),
      amount,
      description: formData.description || undefined,
      category: formData.category || undefined,
      isRecurring: formData.isRecurring
    };

    if (editingId) {
      storage.updateExpense(editingId, expense);
    } else {
      storage.addExpense(expense);
    }

    resetForm();
    loadExpenses();
    onUpdate();
  };

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setFormData({
      date: format(expense.date, 'yyyy-MM-dd'),
      amount: expense.amount.toString(),
      description: expense.description || '',
      category: expense.category || '',
      isRecurring: expense.isRecurring || false
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      storage.deleteExpense(id);
      loadExpenses();
      onUpdate();
    }
  };

  const resetForm = () => {
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      amount: '',
      description: '',
      category: '',
      isRecurring: false
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const totalEntries = storage.getTotalEntryCount();
  const isAtLimit = subscription.tier === 'free' && totalEntries >= FREE_TIER_ENTRY_LIMIT;
  const remainingEntries = subscription.tier === 'free' 
    ? Math.max(0, FREE_TIER_ENTRY_LIMIT - totalEntries)
    : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {showUpgradePrompt && (
        <UpgradePrompt
          title="Entry Limit Reached"
          message={`You've reached the free tier limit of ${FREE_TIER_ENTRY_LIMIT} entries. Upgrade to Pro for unlimited entries!`}
          onClose={() => setShowUpgradePrompt(false)}
        />
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Bills & Expenses</h2>
          {subscription.tier === 'free' && remainingEntries !== null && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {remainingEntries} of {FREE_TIER_ENTRY_LIMIT} entries remaining
            </p>
          )}
        </div>
        <button
          onClick={() => {
            if (isAtLimit && !editingId) {
              setShowUpgradePrompt(true);
            } else {
              setIsFormOpen(!isFormOpen);
            }
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isAtLimit && !isFormOpen && !editingId}
        >
          {isFormOpen ? 'Cancel' : '+ Add Expense'}
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="e.g., Rent, Utilities, Groceries"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category (optional)
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="e.g., Housing, Food, Transportation"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Recurring monthly expense</span>
              </label>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              {editingId ? 'Update' : 'Add'} Expense
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {expenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No expenses yet. Click "Add Expense" to get started.
        </div>
      ) : (
        <div className="space-y-2">
          {expenses.map(expense => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex-1">
                <div className="font-semibold text-red-600 dark:text-red-400">
                  ${expense.amount.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {format(expense.date, 'MMM d, yyyy')} • {expense.description}
                  {expense.category && ` • ${expense.category}`}
                  {expense.isRecurring && <span className="text-blue-600 dark:text-blue-400"> (Recurring)</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(expense)}
                  className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

