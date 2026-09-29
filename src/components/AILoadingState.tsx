import React, { useState, useEffect } from 'react';
import { Sparkles, Calculator, CheckCircle2, ShieldAlert } from 'lucide-react';

export const AILoadingState: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    'Analyzing your budget ceiling and preferences...',
    'Consulting Gemini AI recommendation algorithms...',
    'Verifying category limits and item allocations...',
    'Clamping total sum to ensure budget is never exceeded...',
    'Generating verified shopping links and smart purchasing tips...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xl">
      <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-60" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center text-white shadow-lg shadow-blue-900/30">
          <Sparkles className="w-8 h-8 text-amber-300 animate-pulse" />
        </div>
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
        PocketSmart AI is creating your smart plan...
      </h3>
      <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
        Crafting a balanced allocation that fits your exact budget limit.
      </p>

      {/* Steps indicator */}
      <div className="space-y-3 text-left max-w-sm mx-auto bg-slate-50 p-4 rounded-xl border border-slate-100">
        {steps.map((text, idx) => {
          const isDone = idx < stepIndex;
          const isCurrent = idx === stepIndex;
          return (
            <div key={text} className="flex items-center gap-3 text-xs">
              {isDone ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              ) : isCurrent ? (
                <div className="w-5 h-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-slate-200 shrink-0" />
              )}
              <span
                className={`transition-colors ${
                  isCurrent ? 'font-semibold text-slate-900' : isDone ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                {text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
