import React from 'react';
import { Wallet, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

interface BudgetProgressBarProps {
  totalBudget: number;
  budgetUsed: number;
  budgetRemaining: number;
  compact?: boolean;
}

export const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({
  totalBudget,
  budgetUsed,
  budgetRemaining,
  compact = false,
}) => {
  const percentage = totalBudget > 0 ? Math.min(100, Math.round((budgetUsed / totalBudget) * 100)) : 0;
  
  // Color determination based on utilization
  const isHealthy = percentage <= 95;
  const isNearLimit = percentage > 95 && percentage <= 100;
  const isExceeded = percentage > 100;

  const barColor = isExceeded
    ? 'bg-rose-600'
    : isNearLimit
    ? 'bg-amber-500'
    : 'bg-gradient-to-r from-blue-600 to-indigo-600';

  if (compact) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Utilization:</span>
          <span className="font-semibold text-slate-800 font-mono tabular-nums">{percentage}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Budget Overview & Allocation
          </span>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Utilization Rate</span>
            <span className="font-mono tabular-nums text-blue-600 font-extrabold text-xl">
              {percentage}%
            </span>
          </h3>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Guaranteed within entered budget</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative mb-6">
        <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
          <span className="text-xs text-slate-500 block mb-0.5">Total Budget</span>
          <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono tabular-nums">
            ₹{totalBudget.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-400">Target spending ceiling</span>
        </div>

        <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100">
          <span className="text-xs text-blue-700 block mb-0.5 font-medium">Budget Used</span>
          <div className="text-lg sm:text-xl font-bold text-blue-900 font-mono tabular-nums">
            ₹{budgetUsed.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-blue-600/80">{percentage}% of your limit</span>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
          <span className="text-xs text-amber-800 block mb-0.5 font-medium">Remaining Buffer</span>
          <div className="text-lg sm:text-xl font-bold text-amber-700 font-mono tabular-nums">
            ₹{budgetRemaining.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-amber-700/80">Saved / Available buffer</span>
        </div>
      </div>
    </div>
  );
};
