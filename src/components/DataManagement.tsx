import { useState } from 'react';
import { storage } from '../utils/storage';

export const DataManagement = () => {
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState('');

  const handleExport = () => {
    const data = storage.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-calendar-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const income = storage.getIncome();
    const expenses = storage.getExpenses();

    // Helper function to escape CSV fields
    const escapeCSV = (value: string): string => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    // CSV header
    let csv = 'Type,Date,Amount,Description,Category,Recurring\n';

    // Income rows
    income.forEach(item => {
      const date = item.date.toISOString().split('T')[0];
      const amount = item.amount.toString();
      const desc = escapeCSV(item.description || '');
      csv += `Income,${date},${amount},${desc},,\n`;
    });

    // Expense rows
    expenses.forEach(item => {
      const date = item.date.toISOString().split('T')[0];
      const amount = item.amount.toString();
      const desc = escapeCSV(item.description || '');
      const cat = escapeCSV(item.category || '');
      const recurring = item.isRecurring ? 'Yes' : 'No';
      csv += `Expense,${date},${amount},${desc},${cat},${recurring}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-calendar-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importData.trim()) {
      alert('Please paste JSON data to import');
      return;
    }

    const result = storage.importData(importData);
    if (result.success) {
      alert('Data imported successfully! Please refresh the page.');
      setImportData('');
      setShowImport(false);
      window.location.reload();
    } else {
      alert(`Import failed: ${result.error}`);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone!')) {
      storage.clearAll();
      alert('All data cleared. Refreshing page...');
      window.location.reload();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Data Management</h2>
      
      <div className="space-y-3">
        <button
          onClick={handleExport}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Export to JSON
        </button>
        
        <button
          onClick={handleExportCSV}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          Export to CSV
        </button>

        <button
          onClick={() => setShowImport(!showImport)}
          className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
        >
          {showImport ? 'Cancel Import' : 'Import Data'}
        </button>

        {showImport && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Paste JSON data:
            </label>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
              rows={6}
              placeholder='{"income": [...], "expenses": [...]}'
            />
            <button
              onClick={handleImport}
              className="mt-2 w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
            >
              Import
            </button>
          </div>
        )}

        <button
          onClick={handleClearAll}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Clear All Data
        </button>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-300">
          💡 <strong>Tip:</strong> Export your data regularly to prevent data loss. Your data is stored locally in your browser.
        </p>
      </div>
    </div>
  );
};

