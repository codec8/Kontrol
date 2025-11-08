import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { Income, Expense } from '../types';
import { calculateBalanceProjection } from '../utils/balance';

interface CalendarProps {
  income: Income[];
  expenses: Expense[];
  onDateClick?: (date: Date) => void;
}

export const Calendar = ({ income, expenses, onDateClick }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const balanceProjections = calculateBalanceProjection(
    income,
    expenses,
    calendarStart,
    calendarEnd
  );

  const getDayIncome = (day: Date) => {
    return income.filter(item => isSameDay(item.date, day));
  };

  const getDayExpenses = (day: Date) => {
    return expenses.filter(item => isSameDay(item.date, day));
  };

  const getDayBalance = (day: Date): number | null => {
    const projection = balanceProjections.find(p => isSameDay(p.date, day));
    return projection ? projection.balance : null;
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const dayIncome = getDayIncome(day);
          const dayExpenses = getDayExpenses(day);
          const balance = getDayBalance(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateClick?.(day)}
              className={`
                relative p-2 min-h-[80px] rounded-lg text-left transition-all
                ${isCurrentMonth ? 'bg-gray-50 dark:bg-gray-900' : 'bg-gray-100 dark:bg-gray-800 opacity-50'}
                ${isToday ? 'ring-2 ring-blue-500' : ''}
                hover:bg-gray-200 dark:hover:bg-gray-700
              `}
            >
              <div className={`text-sm font-medium mb-1 ${isCurrentMonth ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}`}>
                {format(day, 'd')}
              </div>
              
              {dayIncome.length > 0 && (
                <div className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">
                  +${dayIncome.reduce((sum, i) => sum + i.amount, 0).toFixed(2)}
                </div>
              )}
              
              {dayExpenses.length > 0 && (
                <div className="text-xs text-red-600 dark:text-red-400 font-semibold mb-1">
                  -${dayExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
                </div>
              )}
              
              {balance !== null && (
                <div className={`text-xs font-semibold ${balance < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  ${balance.toFixed(2)}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

