import React, { useState, useEffect } from 'react';
import { Plan, PlanType } from '../types';
import { api } from '../services/api';
import { PlanResultModal } from '../components/PlanResultModal';
import { 
  Bookmark, 
  Search, 
  Eye, 
  Trash2, 
  Plus, 
  Calendar, 
  Wallet, 
  ArrowUpRight, 
  Home, 
  PartyPopper, 
  Gem,
  AlertCircle
} from 'lucide-react';

interface HistoryViewProps {
  onSelectTab: (tab: string) => void;
  selectedPlanToView?: Plan | null;
  onClearSelectedPlan?: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  onSelectTab,
  selectedPlanToView,
  onClearSelectedPlan,
}) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal view for previous plan
  const [activePlan, setActivePlan] = useState<Plan | null>(selectedPlanToView || null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPlanToView) {
      setActivePlan(selectedPlanToView);
    }
  }, [selectedPlanToView]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const res = await api.getPlans();
      setPlans(res.plans);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleDelete = async (planId: string) => {
    try {
      await api.deletePlan(planId);
      setPlans(prev => prev.filter(p => p.id !== planId));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete plan:', err);
    }
  };

  const filteredPlans = plans.filter(p => {
    const matchesType = filterType === 'all' || p.plan_type === filterType;
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.plan_type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Plan History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse and inspect all your saved budget allocations and shopping recommendations.
          </p>
        </div>

        <button
          onClick={() => onSelectTab('home-planner')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-2 self-start sm:self-auto min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>New Budget Plan</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Category Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Plans
          </button>
          <button
            onClick={() => setFilterType('home')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'home' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setFilterType('party')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'party' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Party
          </button>
          <button
            onClick={() => setFilterType('jewelry')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'jewelry' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jewelry
          </button>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search plans by title..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Plan Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Loading plan history...</div>
      ) : filteredPlans.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No plans yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
            "Create your first smart budget plan and it will appear here."
          </p>
          <button
            onClick={() => onSelectTab('home-planner')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm"
          >
            Create a Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map(plan => {
            const utilization = Math.min(100, Math.round((plan.budget_used / plan.budget) * 100));

            return (
              <div
                key={plan.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold uppercase text-blue-600">
                      {plan.plan_type} PLAN
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(plan.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug">
                    {plan.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {plan.result_data?.summary || 'Custom budget plan with smart recommendations.'}
                  </p>

                  {/* Utilization Bar */}
                  <div className="space-y-1.5 mb-5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500">Utilization:</span>
                      <span className="text-slate-900 font-mono tabular-nums">{utilization}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                        style={{ width: `${utilization}%` }}
                      />
                    </div>
                  </div>

                  {/* Financial Metrics */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl mb-4 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Budget</span>
                      <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                        ₹{plan.budget.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-blue-600 block uppercase">Used</span>
                      <span className="text-xs font-bold text-blue-700 font-mono tabular-nums">
                        ₹{plan.budget_used.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-700 block uppercase">Buffer</span>
                      <span className="text-xs font-bold text-amber-700 font-mono tabular-nums">
                        ₹{plan.budget_remaining.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActivePlan(plan)}
                    className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm min-h-[44px]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Plan</span>
                  </button>

                  {deleteConfirmId === plan.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="px-2.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg min-h-[44px]"
                        title="Confirm deletion"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-lg min-h-[44px]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(plan.id)}
                      className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Delete plan"
                      aria-label="Delete plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Plan Details Modal */}
      {activePlan && (
        <PlanResultModal
          isOpen={!!activePlan}
          onClose={() => {
            setActivePlan(null);
            if (onClearSelectedPlan) onClearSelectedPlan();
          }}
          planData={activePlan.result_data}
          planType={activePlan.plan_type}
          totalBudget={activePlan.budget}
          isAlreadySaved={true}
          onPlanAnother={() => {
            setActivePlan(null);
            onSelectTab(`${activePlan.plan_type}-planner`);
          }}
        />
      )}

    </div>
  );
};
