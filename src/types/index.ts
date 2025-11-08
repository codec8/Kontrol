export interface Income {
  id: string;
  date: Date;
  amount: number;
  description?: string;
}

export interface Expense {
  id: string;
  date: Date;
  amount: number;
  description?: string;
  category?: string;
  isRecurring?: boolean;
}

export interface Allocation {
  expenseId: string;
  expense: Expense;
  paycheckIds: string[];
  paychecks: Income[];
  amounts: number[];
  canPay: boolean;
  totalAllocated: number;
}

export interface BalanceProjection {
  date: Date;
  balance: number;
  income: number;
  expenses: number;
}

