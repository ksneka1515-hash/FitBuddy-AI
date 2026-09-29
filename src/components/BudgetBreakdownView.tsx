import React from 'react';
import { BudgetBreakdownCategory } from '../types';
import { PieChart, Layers } from 'lucide-react';

interface BudgetBreakdownViewProps {
  categories: BudgetBreakdownCategory[];
  totalBudget: number;
}

export const BudgetBreakdownView: React.FC<BudgetBreakdownViewProps> = ({ categories, totalBudget }) => {
  const categoryColors = [
    'from-blue-600 to-blue-700',
    'from-indigo-500 to-indigo-600',
    'from-cyan-500 to-teal-600',
    'from-amber-500 to-amber-600',
    'from-violet-500 to-purple-600',
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Category Breakdown
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Budget Distribution by Category
          </h3>
        </div>
        <div className="text-xs text-slate-500 font-mono tabular-nums">
          {categories.length} Categories
        </div>
      </div>

      {/* Stacked Visual Bar */}
      <div className="w-full bg-slate-100 rounded-xl h-3.5 flex overflow-hidden mb-6 p-0.5">
        {categories.map((cat, idx) => {
          const pct = Math.max(5, cat.percentage_of_budget || Math.round((cat.allocated_budget / totalBudget) * 100));
          const colorClass = categoryColors[idx % categoryColors.length];
          return (
            <div
              key={cat.category}
              className={`h-full bg-gradient-to-r ${colorClass} first:rounded-l-lg last:rounded-r-lg transition-all duration-500`}
              style={{ width: `${pct}%` }}
              title={`${cat.category}: ${pct}%`}
            />
          );
        })}
      </div>

      {/* Responsive Table / Card Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3 text-right">Allocated Budget</th>
              <th className="py-2.5 px-3 text-right">Share</th>
              <th className="py-2.5 px-3 text-right">Items Included</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {categories.map((cat, idx) => (
              <tr key={cat.category} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-3 font-semibold text-slate-800 flex items-center gap-2.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${categoryColors[idx % categoryColors.length]}`}
                  />
                  <span>{cat.category}</span>
                </td>
                <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-slate-900">
                  ₹{cat.allocated_budget.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-slate-600">
                  {cat.percentage_of_budget}%
                </td>
                <td className="py-3 px-3 text-right text-xs text-slate-500">
                  {cat.items?.length || 0} {cat.items?.length === 1 ? 'item' : 'items'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
