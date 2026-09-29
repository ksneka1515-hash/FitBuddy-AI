import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Plan, DashboardStats } from '../types';
import { 
  Sparkles, 
  Home, 
  PartyPopper, 
  Gem, 
  ArrowRight, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Bookmark, 
  Wallet,
  Eye,
  Plus
} from 'lucide-react';

interface DashboardViewProps {
  onSelectTab: (tab: string) => void;
  onViewPlan: (plan: Plan) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectTab, onViewPlan }) => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await api.getPlans();
        setPlans(res.plans);
        setStats(res.stats);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const recentPlan = stats?.recent_plan || plans[0] || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* 1. WELCOME HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, {user?.name || 'Smart Planner'}!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Let's plan your spending smarter today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTab('home-planner')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-2 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Plan</span>
          </button>
        </div>
      </div>

      {/* 2. SUMMARY METRIC CARDS (Section 6) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Plans */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Plans</span>
            <Bookmark className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {loading ? '-' : stats?.total_plans || 0}
          </div>
          <span className="text-xs text-slate-500 mt-2">
            Number of plans created
          </span>
        </div>

        {/* Recent Plan */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Recent Plan</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 truncate">
            {loading ? '-' : recentPlan ? recentPlan.title : 'None Yet'}
          </div>
          <span className="text-xs text-slate-500 mt-2">
            {recentPlan ? new Date(recentPlan.created_at).toLocaleDateString() : 'Ready to start'}
          </span>
        </div>

        {/* Budget Planned */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Budget Planned</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            ₹{loading ? '-' : (stats?.total_budget_planned || 0).toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-slate-500 mt-2">
            Total budget from recent plans
          </span>
        </div>

        {/* Remaining Budget */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-amber-200/80 bg-amber-50/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Remaining Buffer</span>
            <Wallet className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-mono tabular-nums">
            ₹{loading ? '-' : (recentPlan ? recentPlan.budget_remaining : 0).toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-amber-800/80 mt-2">
            Remaining from selected/recent plan
          </span>
        </div>
      </div>

      {/* 3. MAIN PLANNER SECTION: "What would you like to plan today?" */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              What would you like to plan today?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Choose an AI budget category tailored to your current project.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card A: Home Planner */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Home Budget Planner</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  "Plan your home purchases based on your available budget." Furnishing, lighting, BLDC fans, and essentials for any room size.
                </p>
              </div>
              <div className="pt-2 text-xs text-slate-400">
                Options: Living Room, Bedroom, Kitchen, Dining Room, Full Home
              </div>
            </div>

            <button
              onClick={() => onSelectTab('home-planner')}
              className="mt-6 w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>Generate Home Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card B: Party Planner */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <PartyPopper className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Party Budget Planner</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  "Create a complete party plan without exceeding your budget." Catering, venue reservations, theme decor, and sound entertainment.
                </p>
              </div>
              <div className="pt-2 text-xs text-slate-400">
                Options: Birthday, College Event, Anniversary, Celebration
              </div>
            </div>

            <button
              onClick={() => onSelectTab('party-planner')}
              className="mt-6 w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>Generate Party Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card C: Jewelry Planner */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Gem className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Jewelry Budget Planner</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  "Find suitable jewelry combinations within your budget." Matching sets, hallmarked gold, silver, and wedding ensembles.
                </p>
              </div>
              <div className="pt-2 text-xs text-slate-400">
                Options: Gold, Silver, Platinum, Diamond · Necklaces & Rings
              </div>
            </div>

            <button
              onClick={() => onSelectTab('jewelry-planner')}
              className="mt-6 w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>Generate Jewelry Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. RECENT PLANS PREVIEW TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Plans</h3>
            <p className="text-xs text-slate-500">Quickly reopen and review your saved budgeting blueprints.</p>
          </div>
          {plans.length > 0 && (
            <button
              onClick={() => onSelectTab('history')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View All ({plans.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading plans...</div>
        ) : plans.length === 0 ? (
          <div className="py-12 text-center">
            <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700">No plans yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              "Create your first smart budget plan and it will appear here."
            </p>
            <button
              onClick={() => onSelectTab('home-planner')}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              Create a Plan
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Plan Title</th>
                  <th className="py-3 px-3 text-right">Budget</th>
                  <th className="py-3 px-3 text-right">Used</th>
                  <th className="py-3 px-3 text-right">Remaining</th>
                  <th className="py-3 px-3 text-right">Date</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {plans.slice(0, 5).map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <span className="text-xs font-semibold uppercase text-slate-700">
                        {p.plan_type}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 max-w-[220px] truncate">
                      {p.title}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-medium text-slate-700">
                      ₹{p.budget.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-blue-600">
                      ₹{p.budget_used.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-amber-600">
                      ₹{p.budget_remaining.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right text-xs text-slate-400">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onViewPlan(p)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Plan</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
