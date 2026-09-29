import React, { useState } from 'react';
import { PlanResultData, PlanType } from '../types';
import { BudgetProgressBar } from './BudgetProgressBar';
import { BudgetBreakdownView } from './BudgetBreakdownView';
import { RecommendationCard } from './RecommendationCard';
import { 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  Printer, 
  Share2, 
  Lightbulb, 
  AlertTriangle, 
  X,
  ArrowRight
} from 'lucide-react';

interface PlanResultModalProps {
  planData: PlanResultData;
  planType: PlanType;
  totalBudget: number;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => Promise<void>;
  isAlreadySaved?: boolean;
  onPlanAnother?: () => void;
}

export const PlanResultModal: React.FC<PlanResultModalProps> = ({
  planData,
  planType,
  totalBudget,
  isOpen,
  onClose,
  onSave,
  isAlreadySaved = false,
  onPlanAnother,
}) => {
  const [isSaved, setIsSaved] = useState(isAlreadySaved);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (onSave && !isSaved) {
      try {
        setSaving(true);
        await onSave();
        setIsSaved(true);
      } catch (err) {
        console.error(err);
      } finally {
        setSaving(false);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `PocketSmart AI Plan: ${planData.title}\nTotal Budget: ₹${totalBudget.toLocaleString('en-IN')}\nBudget Used: ₹${planData.budget_used.toLocaleString('en-IN')}\nRemaining: ₹${planData.budget_remaining.toLocaleString('en-IN')}\nSummary: ${planData.summary}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Flatten all items across all categories for items view
  const allItems = planData.budget_breakdown.flatMap(cat => cat.items || []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 md:p-10 animate-in fade-in duration-200">
      <div className="relative bg-slate-50 rounded-3xl max-w-5xl w-full my-auto overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              {planType.toUpperCase()} PLAN
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">· AI-Optimized Allocation</span>
          </div>

          <div className="flex items-center gap-2">
            {onSave && (
              <button
                onClick={handleSave}
                disabled={isSaved || saving}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  isSaved
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                }`}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                    <span>Saved to History</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Plan'}</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleCopySummary}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Copy plan summary"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={handlePrint}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors hidden sm:inline-flex"
              title="Print Plan"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="p-5 sm:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          {/* Title & Summary */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2.5">
              {planData.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              {planData.summary}
            </p>
          </div>

          {/* Budget Overview Progress Bar & 3 Metric Cards */}
          <BudgetProgressBar
            totalBudget={totalBudget}
            budgetUsed={planData.budget_used}
            budgetRemaining={planData.budget_remaining}
          />

          {/* Budget Breakdown by Category */}
          <BudgetBreakdownView
            categories={planData.budget_breakdown}
            totalBudget={totalBudget}
          />

          {/* Recommended Items Grid */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Specific Recommendations
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Recommended Items & Instant Shopping Links
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                {allItems.length} Handpicked {allItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {allItems.map((item, idx) => (
                <RecommendationCard key={`${item.name}-${idx}`} item={item} />
              ))}
            </div>
          </div>

          {/* Smart Tips */}
          {planData.tips && planData.tips.length > 0 && (
            <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-base mb-3">
                <Lightbulb className="w-5 h-5 text-amber-600" />
                <span>Smart Budget Tips</span>
              </div>
              <ul className="space-y-2">
                {planData.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-amber-950/90">
                    <span className="font-bold text-amber-700 select-none">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="flex items-start gap-2.5 text-xs text-slate-400 bg-white p-4 rounded-xl border border-slate-200/60">
            <AlertTriangle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {planData.disclaimer ||
                'Prices and recommendations are estimates and may change based on availability, location, seller, and market conditions. Verify final prices before purchasing.'}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-white px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            Calculated in Indian Rupees (₹) with guaranteed budget ceiling.
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onPlanAnother && (
              <button
                onClick={() => {
                  onClose();
                  onPlanAnother();
                }}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
              >
                Plan Another Budget
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm text-center"
            >
              Done / Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
