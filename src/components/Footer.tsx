import React from 'react';
import { Sparkles, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onOpenContact: () => void;
  onOpenAbout: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenContact, onOpenAbout }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                PocketSmart <span className="text-blue-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Your Smart Budget & Recommendation Assistant. Plan smarter, spend better, and choose confidently. Delivering AI-tailored purchasing plans that never exceed your financial limit.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Calibrated for Indian market prices in Indian Rupees (₹)</span>
            </div>
          </div>

          {/* Quick Planners */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Smart Planners
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onSelectTab('home-planner')}
                  className="hover:text-white transition-colors text-left"
                >
                  Home Budget Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('party-planner')}
                  className="hover:text-white transition-colors text-left"
                >
                  Party Budget Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('jewelry-planner')}
                  className="hover:text-white transition-colors text-left"
                >
                  Jewelry Budget Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('history')}
                  className="hover:text-white transition-colors text-left"
                >
                  Recommendation History
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Explore & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onSelectTab('landing')}
                  className="hover:text-white transition-colors text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('dashboard')}
                  className="hover:text-white transition-colors text-left"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAbout}
                  className="hover:text-white transition-colors text-left"
                >
                  About PocketSmart AI
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-white transition-colors text-left"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 PocketSmart AI. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with precision for smart consumer spending</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
