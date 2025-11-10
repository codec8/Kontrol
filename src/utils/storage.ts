import { Income, Expense } from '../types';

const INCOME_KEY = 'financial-calendar-income';
const EXPENSE_KEY = 'financial-calendar-expenses';
const STARTING_BALANCE_KEY = 'financial-calendar-starting-balances';

// Helper to serialize dates for localStorage
const serialize = (items: (Income | Expense)[]): string => {
  return JSON.stringify(items.map(item => ({
    ...item,
    date: item.date.toISOString()
  })));
};

// Helper to deserialize dates from localStorage
const deserializeIncome = (data: string): Income[] => {
  const parsed = JSON.parse(data);
  return parsed.map((item: any) => ({
    ...item,
    date: new Date(item.date)
  }));
};

const deserializeExpense = (data: string): Expense[] => {
  const parsed = JSON.parse(data);
  return parsed.map((item: any) => ({
    ...item,
    date: new Date(item.date)
  }));
};

export const storage = {
  // Income operations
  getIncome: (): Income[] => {
    try {
      const data = localStorage.getItem(INCOME_KEY);
      if (!data) return [];
      return deserializeIncome(data);
    } catch (error) {
      console.error('Error loading income:', error);
      return [];
    }
  },

  saveIncome: (income: Income[]): void => {
    try {
      localStorage.setItem(INCOME_KEY, serialize(income));
    } catch (error) {
      console.error('Error saving income:', error);
    }
  },

  addIncome: (income: Income): void => {
    const all = storage.getIncome();
    all.push(income);
    storage.saveIncome(all);
  },

  updateIncome: (id: string, updates: Partial<Income>): void => {
    const all = storage.getIncome();
    const index = all.findIndex(item => item.id === id);
    if (index !== -1) {
      all[index] = { ...all[index], ...updates };
      storage.saveIncome(all);
    }
  },

  deleteIncome: (id: string): void => {
    const all = storage.getIncome();
    storage.saveIncome(all.filter(item => item.id !== id));
  },

  // Expense operations
  getExpenses: (): Expense[] => {
    try {
      const data = localStorage.getItem(EXPENSE_KEY);
      if (!data) return [];
      return deserializeExpense(data);
    } catch (error) {
      console.error('Error loading expenses:', error);
      return [];
    }
  },

  saveExpenses: (expenses: Expense[]): void => {
    try {
      localStorage.setItem(EXPENSE_KEY, serialize(expenses));
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  },

  addExpense: (expense: Expense): void => {
    const all = storage.getExpenses();
    all.push(expense);
    storage.saveExpenses(all);
  },

  updateExpense: (id: string, updates: Partial<Expense>): void => {
    const all = storage.getExpenses();
    const index = all.findIndex(item => item.id === id);
    if (index !== -1) {
      all[index] = { ...all[index], ...updates };
      storage.saveExpenses(all);
    }
  },

  deleteExpense: (id: string): void => {
    const all = storage.getExpenses();
    storage.saveExpenses(all.filter(item => item.id !== id));
  },

  // Starting balance operations (keyed by month: "YYYY-MM")
  getStartingBalances: (): Record<string, number> => {
    try {
      const data = localStorage.getItem(STARTING_BALANCE_KEY);
      if (!data) return {};
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading starting balances:', error);
      return {};
    }
  },

  getStartingBalance: (monthKey: string): number | null => {
    const balances = storage.getStartingBalances();
    return balances[monthKey] ?? null;
  },

  setStartingBalance: (monthKey: string, balance: number): void => {
    try {
      const balances = storage.getStartingBalances();
      balances[monthKey] = balance;
      localStorage.setItem(STARTING_BALANCE_KEY, JSON.stringify(balances));
    } catch (error) {
      console.error('Error saving starting balance:', error);
    }
  },

  // Clear all data
  clearAll: (): void => {
    localStorage.removeItem(INCOME_KEY);
    localStorage.removeItem(EXPENSE_KEY);
    localStorage.removeItem(STARTING_BALANCE_KEY);
  },

  // Export data
  exportData: (): string => {
    const income = storage.getIncome();
    const expenses = storage.getExpenses();
    const startingBalances = storage.getStartingBalances();
    return JSON.stringify({ income, expenses, startingBalances }, null, 2);
  },

  // Import data
  importData: (data: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(data);
      
      // Validate structure
      if (typeof parsed !== 'object' || parsed === null) {
        return { success: false, error: 'Invalid data format' };
      }
      
      // Validate income array
      if (parsed.income !== undefined) {
        if (!Array.isArray(parsed.income)) {
          return { success: false, error: 'Income must be an array' };
        }
        // Validate each income item
        for (const item of parsed.income) {
          if (typeof item !== 'object' || item === null) {
            return { success: false, error: 'Invalid income item structure' };
          }
          if (typeof item.amount !== 'number' || item.amount <= 0 || !isFinite(item.amount)) {
            return { success: false, error: 'Invalid income amount' };
          }
          if (!item.date || isNaN(new Date(item.date).getTime())) {
            return { success: false, error: 'Invalid income date' };
          }
          if (item.id !== undefined && typeof item.id !== 'string') {
            return { success: false, error: 'Invalid income ID' };
          }
        }
      }
      
      // Validate expenses array
      if (parsed.expenses !== undefined) {
        if (!Array.isArray(parsed.expenses)) {
          return { success: false, error: 'Expenses must be an array' };
        }
        // Validate each expense item
        for (const item of parsed.expenses) {
          if (typeof item !== 'object' || item === null) {
            return { success: false, error: 'Invalid expense item structure' };
          }
          if (typeof item.amount !== 'number' || item.amount <= 0 || !isFinite(item.amount)) {
            return { success: false, error: 'Invalid expense amount' };
          }
          if (!item.date || isNaN(new Date(item.date).getTime())) {
            return { success: false, error: 'Invalid expense date' };
          }
          if (item.id !== undefined && typeof item.id !== 'string') {
            return { success: false, error: 'Invalid expense ID' };
          }
        }
      }
      
      // If validation passes, process the data
      if (parsed.income && Array.isArray(parsed.income)) {
        parsed.income.forEach((item: any) => {
          item.date = new Date(item.date);
        });
        storage.saveIncome(parsed.income);
      }
      if (parsed.expenses && Array.isArray(parsed.expenses)) {
        parsed.expenses.forEach((item: any) => {
          item.date = new Date(item.date);
        });
        storage.saveExpenses(parsed.expenses);
      }
      
      // Import starting balances if present
      if (parsed.startingBalances && typeof parsed.startingBalances === 'object') {
        const balances = storage.getStartingBalances();
        Object.assign(balances, parsed.startingBalances);
        localStorage.setItem(STARTING_BALANCE_KEY, JSON.stringify(balances));
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Invalid data format' };
    }
  }
};

