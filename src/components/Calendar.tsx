import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { Income, Expense } from '../types';
import { calculateBalanceProjection } from '../utils/balance';
import { storage } from '../utils/storage';

interface CalendarProps {
  income: Income[];
  expenses: Expense[];
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
  onDateClick?: (date: Date) => void;
  refreshKey?: number;
}

export const Calendar = ({ income, expenses, currentMonth, onMonthChange, onDateClick, refreshKey }: CalendarProps) => {
  const [startingBalance, setStartingBalance] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  useEffect(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthKey = format(monthStart, 'yyyy-MM');
    const balance = storage.getStartingBalance(monthKey);
    setStartingBalance(balance);
  }, [currentMonth, refreshKey]);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const balanceProjections = calculateBalanceProjection(
    income,
    expenses,
    calendarStart,
    calendarEnd,
    startingBalance,
    monthStart
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

  const formatBalanceForMobile = (balance: number): string => {
    const absBalance = Math.abs(balance);
    if (absBalance >= 1000000) {
      return `${balance < 0 ? '-' : ''}$${(absBalance / 1000000).toFixed(1)}M`;
    } else if (absBalance >= 1000) {
      return `${balance < 0 ? '-' : ''}$${(absBalance / 1000).toFixed(1)}K`;
    }
    return `$${balance.toFixed(2)}`;
  };

  const nextMonth = () => onMonthChange(addMonths(currentMonth, 1));
  const prevMonth = () => onMonthChange(subMonths(currentMonth, 1));
  const goToToday = () => onMonthChange(new Date());

  const handleDayClick = (day: Date) => {
    const dayIncome = getDayIncome(day);
    const dayExpenses = getDayExpenses(day);
    const hasFinancialData = dayIncome.length > 0 || dayExpenses.length > 0;
    
    // On mobile, open modal if there is any financial data
    // On desktop, use the existing onDateClick callback
    if (window.innerWidth < 768 && hasFinancialData) {
      setSelectedDay(day);
      setIsModalOpen(true);
    } else {
      onDateClick?.(day);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDay(null);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white dark:bg-gray-800 p-2 sm:p-4 md:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={prevMonth}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            aria-label="Previous month"
          >
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToToday}
            className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            aria-label="Go to today"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            aria-label="Next month"
          >
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-t border-l border-gray-200 dark:border-gray-700">
        {weekDays.map(day => (
          <div key={day} className="text-center text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 py-1.5 sm:py-2 border-r border-b border-gray-200 dark:border-gray-700">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 border-t border-l border-gray-200 dark:border-gray-700">
        {days.map(day => {
          const dayIncome = getDayIncome(day);
          const dayExpenses = getDayExpenses(day);
          const balance = getDayBalance(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());
          const hasMultipleEntries = dayIncome.length > 0 && dayExpenses.length > 0;
          const totalIncome = dayIncome.reduce((sum, i) => sum + i.amount, 0);
          const totalExpenses = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
          const netAmount = totalIncome - totalExpenses;
          const hasFinancialData = dayIncome.length > 0 || dayExpenses.length > 0;

          // Determine background color based on net amount
          let backgroundClass = '';
          if (hasFinancialData) {
            if (netAmount > 0) {
              // Positive net: green background
              backgroundClass = isToday 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : 'bg-green-50 dark:bg-green-900/20';
            } else if (netAmount < 0) {
              // Negative net: red background
              backgroundClass = isToday 
                ? 'bg-red-100 dark:bg-red-900/30' 
                : 'bg-red-50 dark:bg-red-900/20';
            } else {
              // Net is zero but has data: use today highlight if applicable
              backgroundClass = isToday ? 'bg-blue-50 dark:bg-blue-900/20' : '';
            }
          } else {
            // No financial data: use default or today highlight
            backgroundClass = isToday ? 'bg-blue-50 dark:bg-blue-900/20' : '';
          }

          // Base background for current month vs other months
          const baseBackground = isCurrentMonth 
            ? (backgroundClass || 'bg-white dark:bg-gray-800')
            : (backgroundClass || 'bg-gray-50 dark:bg-gray-900');

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDayClick(day)}
              className={`
                relative p-1.5 sm:p-2 md:p-3 min-h-[60px] sm:min-h-[80px] md:min-h-[100px] text-left border-r border-b border-gray-200 dark:border-gray-700
                transition-all flex flex-col
                ${baseBackground}
                ${hasFinancialData ? 'hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}
              `}
            >
              <div className="flex items-start justify-between mb-1.5 md:mb-1">
                <div className={`text-xs sm:text-sm leading-tight ${isCurrentMonth ? 'font-semibold text-gray-900 dark:text-gray-100' : 'font-normal text-gray-400 dark:text-gray-500'}`}>
                  {format(day, 'd')}
                </div>
                {/* Badge indicator for mobile when multiple entries exist */}
                {hasMultipleEntries && (
                  <div className="md:hidden flex items-center gap-0.5 shrink-0 ml-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                  </div>
                )}
              </div>
              
              {/* Mobile: Show only balance */}
              <div className="md:hidden mt-auto pt-0.5 w-full min-w-0">
                {balance !== null && (
                  <div className={`text-[8px] font-normal leading-tight truncate w-full ${balance < 0 ? 'text-red-600 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                    {formatBalanceForMobile(balance)}
                  </div>
                )}
              </div>

              {/* Desktop: Show full breakdown */}
              <div className="hidden md:block space-y-1">
                {dayIncome.length > 0 && (
                  <div className="text-[10px] text-green-600 dark:text-green-500 font-normal leading-tight opacity-75">
                    +${totalIncome.toFixed(2)}
                  </div>
                )}
                
                {dayExpenses.length > 0 && (
                  <div className="text-[10px] text-red-600 dark:text-red-500 font-normal leading-tight opacity-75">
                    -${totalExpenses.toFixed(2)}
                  </div>
                )}
                
                {balance !== null && (
                  <div className={`text-[10px] font-normal leading-tight ${balance < 0 ? 'text-red-600 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'} opacity-70`}>
                    ${balance.toFixed(2)}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Modal for mobile detailed view */}
      {isModalOpen && selectedDay && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 md:hidden"
          onClick={closeModal}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {format(selectedDay, 'EEEE, MMMM d, yyyy')}
              </h3>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-4">
              {(() => {
                const dayIncome = getDayIncome(selectedDay);
                const dayExpenses = getDayExpenses(selectedDay);
                const balance = getDayBalance(selectedDay);

                return (
                  <>
                    {dayIncome.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Income ({dayIncome.length})
                        </h4>
                        <div className="space-y-2">
                          {dayIncome.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                              <div className="flex-1">
                                <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                                  +${item.amount.toFixed(2)}
                                </div>
                                {item.description && (
                                  <div className="text-xs text-gray-600 dark:text-gray-400">
                                    {item.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                              Total: +${dayIncome.reduce((sum, i) => sum + i.amount, 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {dayExpenses.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Expenses ({dayExpenses.length})
                        </h4>
                        <div className="space-y-2">
                          {dayExpenses.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                              <div className="flex-1">
                                <div className="text-sm font-semibold text-red-600 dark:text-red-400">
                                  -${item.amount.toFixed(2)}
                                </div>
                                {item.description && (
                                  <div className="text-xs text-gray-600 dark:text-gray-400">
                                    {item.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-sm font-semibold text-red-600 dark:text-red-400">
                              Total: -${dayExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {balance !== null && (
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Balance:
                          </span>
                          <span className={`text-lg font-bold ${balance < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                            ${balance.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

