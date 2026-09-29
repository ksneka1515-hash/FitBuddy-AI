import React from 'react';
import { PlanItem } from '../types';
import { ShoppingBag, ExternalLink, Tag } from 'lucide-react';

interface RecommendationCardProps {
  item: PlanItem;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ item }) => {
  const query = encodeURIComponent(item.shopping_query || `${item.name} ${item.category}`);
  const googleShoppingUrl = `https://www.google.com/search?tbm=shop&q=${query}`;
  const amazonUrl = `https://www.amazon.in/s?k=${query}`;
  const flipkartUrl = `https://www.flipkart.com/search?q=${query}`;

  const totalPrice = item.estimated_price * (item.quantity || 1);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {/* Unboxed category metadata with separator */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <span className="font-medium text-blue-600">{item.category}</span>
          <span aria-hidden="true">·</span>
          <span>Qty: {item.quantity}</span>
        </div>

        {/* Title */}
        <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-2">
          {item.name}
        </h4>

        {/* Reason */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
          {item.reason}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100">
        {/* Pricing */}
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-[11px] text-slate-400 block">Estimated Price</span>
            <div className="text-lg sm:text-xl font-bold text-slate-900 font-mono tabular-nums">
              ₹{item.estimated_price.toLocaleString('en-IN')}
              {item.quantity > 1 && (
                <span className="text-xs font-normal text-slate-500 ml-1">
                  (Total: ₹{totalPrice.toLocaleString('en-IN')})
                </span>
              )}
            </div>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">
            In-Budget
          </span>
        </div>

        {/* Dynamic Shopping Links */}
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Compare & Purchase
          </span>
          <div className="grid grid-cols-3 gap-2">
            <a
              href={amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-200 border border-slate-200 rounded-lg transition-colors text-center"
              title="Search on Amazon.in"
            >
              <span>Amazon</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <a
              href={flipkartUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-blue-50 hover:text-blue-900 hover:border-blue-200 border border-slate-200 rounded-lg transition-colors text-center"
              title="Search on Flipkart"
            >
              <span>Flipkart</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <a
              href={googleShoppingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-200 border border-slate-200 rounded-lg transition-colors text-center"
              title="Compare prices on Google Shopping"
            >
              <span>Google</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
