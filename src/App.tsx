import { useState, useEffect } from 'react';
import { Income, Expense } from './types';
import { storage } from './utils/storage';
import { Calendar } from './components/Calendar';
import { IncomeForm } from './components/IncomeForm';
import { ExpenseForm } from './components/ExpenseForm';
import { MatchingResults } from './components/MatchingResults';
import { DataManagement } from './components/DataManagement';
import { StartingBalanceForm } from './components/StartingBalanceForm';
import { Privacy } from './components/Privacy';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [income, setIncome] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [refreshKey, setRefreshKey] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('dark-mode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dark-mode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIncome(storage.getIncome());
    setExpenses(storage.getExpenses());
    setRefreshKey(prev => prev + 1);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (showPrivacy) {
    return <Privacy onBack={() => setShowPrivacy(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Financial Calendar Tool
          </h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <IncomeForm onUpdate={loadData} />
          <ExpenseForm onUpdate={loadData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <StartingBalanceForm currentMonth={currentMonth} onUpdate={loadData} />
          <MatchingResults income={income} expenses={expenses} />
        </div>

        <div className="mb-6">
          <Calendar 
            income={income} 
            expenses={expenses} 
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            refreshKey={refreshKey}
          />
        </div>

        <div className="max-w-md mx-auto">
          <DataManagement />
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>Free Financial Calendar Tool - Plan your finances with ease</p>
          <p className="mt-2">All data is stored locally in your browser. No server, no tracking, no cost.</p>
          <p className="mt-4">
            <button
              onClick={() => setShowPrivacy(true)}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </footer>
      <Analytics />
    </div>
  );
}

export default App;

