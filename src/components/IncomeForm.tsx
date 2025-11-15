import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Income } from '../types';
import { storage } from '../utils/storage';
import { useSubscription } from '../contexts/SubscriptionContext';
import { UpgradePrompt } from './UpgradePrompt';

interface IncomeFormProps {
  onUpdate: () => void;
}

const FREE_TIER_ENTRY_LIMIT = 15;

export const IncomeForm = ({ onUpdate }: IncomeFormProps) => {
  const { subscription } = useSubscription();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    amount: '',
    description: ''
  });

  useEffect(() => {
    loadIncomes();
  }, []);

  const loadIncomes = () => {
    const loaded = storage.getIncome();
    setIncomes(loaded.sort((a, b) => a.date.getTime() - b.date.getTime()));
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

    const income: Income = {
      id: editingId || `income-${Date.now()}`,
      date: new Date(formData.date),
      amount,
      description: formData.description || undefined
    };

    if (editingId) {
      storage.updateIncome(editingId, income);
    } else {
      storage.addIncome(income);
    }

    resetForm();
    loadIncomes();
    onUpdate();
  };

  const handleEdit = (income: Income) => {
    setEditingId(income.id);
    setFormData({
      date: format(income.date, 'yyyy-MM-dd'),
      amount: income.amount.toString(),
      description: income.description || ''
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this income entry?')) {
      storage.deleteIncome(id);
      loadIncomes();
      onUpdate();
    }
  };

  const resetForm = () => {
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      amount: '',
      description: ''
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      {showUpgradePrompt && (
        <UpgradePrompt
          title="Entry Limit Reached"
          message={`You've reached the free tier limit of ${FREE_TIER_ENTRY_LIMIT} entries. Upgrade to Pro for unlimited entries!`}
          onClose={() => setShowUpgradePrompt(false)}
        />
      )}
      
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">Expected Income</h2>
          {subscription.tier === 'free' && remainingEntries !== null && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
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
          className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isAtLimit && !isFormOpen && !editingId}
        >
          {isFormOpen ? 'Cancel' : '+ Add Income'}
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
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
                Description (optional)
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="e.g., Paycheck, Freelance"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              {editingId ? 'Update' : 'Add'} Income
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

      {incomes.length === 0 ? (
        <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
          No income entries yet. Click "Add Income" to get started.
        </div>
      ) : (
        <div className="space-y-1">
          {incomes.map(income => (
            <div
              key={income.id}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-green-600 dark:text-green-400">
                  ${income.amount.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {format(income.date, 'MMM d, yyyy')}
                  {income.description && ` • ${income.description}`}
                </div>
              </div>
              <div className="flex gap-1.5 ml-2">
                <button
                  onClick={() => handleEdit(income)}
                  className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(income.id)}
                  className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
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

