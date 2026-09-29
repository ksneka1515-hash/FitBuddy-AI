import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  PlanType, 
  HomePlannerInput, 
  PartyPlannerInput, 
  JewelryPlannerInput, 
  PlanResultData 
} from '../types';
import { AILoadingState } from '../components/AILoadingState';
import { PlanResultModal } from '../components/PlanResultModal';
import { 
  Home, 
  PartyPopper, 
  Gem, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  SlidersHorizontal,
  ShieldCheck,
  Check
} from 'lucide-react';

interface PlannerViewProps {
  initialType?: PlanType;
  onPlanCreated?: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  initialType = 'home',
  onPlanCreated,
  onOpenAuth,
}) => {
  const { user } = useAuth();
  const [activeType, setActiveType] = useState<PlanType>(initialType);

  // Sync initial type if parent prop changes
  useEffect(() => {
    setActiveType(initialType);
  }, [initialType]);

  // Form states
  const [homeInput, setHomeInput] = useState<HomePlannerInput>({
    budget: 50000,
    room: 'Living Room',
    home_type: 'Apartment',
    required_items: 'Modular Sofa, LED Ceiling Lighting, BLDC Fan, Coffee Table',
    style: 'Modern',
    priority: 'Balanced',
    additional_requirements: 'Space-saving layout with warm ambient lighting',
  });

  const [partyInput, setPartyInput] = useState<PartyPlannerInput>({
    budget: 30000,
    party_type: 'Birthday',
    guests: 25,
    location: 'Rooftop / Cafe Space',
    food_preference: 'Snacks & Beverages + Starters Platter',
    decoration_preference: 'Theme Based & Fairy Lights',
    entertainment_preference: 'DJ / High-Output Bluetooth Sound System',
    date: '2026-10-15',
    additional_requirements: 'Selfie photo booth corner with props',
  });

  const [jewelryInput, setJewelryInput] = useState<JewelryPlannerInput>({
    budget: 100000,
    jewelry_type: 'Set',
    occasion: 'Festive / Diwali & Weddings',
    preferred_metal: 'Gold',
    style: 'Elegant',
    main_piece: 'Lightweight 22K Gold Choker / Pendant Necklace',
    matching_requirements: 'Matching Jhumkas or Studs + Delicate Ring',
    additional_requirements: 'BIS 916 Hallmarked with HUID certification',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Result Modal states
  const [resultData, setResultData] = useState<PlanResultData | null>(null);
  const [resultBudget, setResultBudget] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Budget preset chips
  const homePresets = [25000, 50000, 100000, 200000];
  const partyPresets = [15000, 30000, 50000, 100000];
  const jewelryPresets = [20000, 50000, 100000, 250000];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let budget = 0;
    let requestPayload: any = {};

    if (activeType === 'home') {
      budget = Number(homeInput.budget);
      if (!budget || budget < 1000) {
        setError('Please enter a valid budget of at least ₹1,000.');
        return;
      }
      requestPayload = {
        plan_type: 'home',
        ...homeInput,
        budget,
      };
    } else if (activeType === 'party') {
      budget = Number(partyInput.budget);
      if (!budget || budget < 1000) {
        setError('Please enter a valid budget of at least ₹1,000.');
        return;
      }
      requestPayload = {
        plan_type: 'party',
        ...partyInput,
        budget,
      };
    } else {
      budget = Number(jewelryInput.budget);
      if (!budget || budget < 1000) {
        setError('Please enter a valid budget of at least ₹1,000.');
        return;
      }
      requestPayload = {
        plan_type: 'jewelry',
        ...jewelryInput,
        budget,
      };
    }

    try {
      setLoading(true);
      setResultBudget(budget);

      // Call AI recommendation engine
      const res = await api.generateAIPlan(requestPayload);
      setResultData(res.plan);

      // If user is logged in, auto-save to database
      if (user) {
        try {
          await api.savePlan({
            plan_type: activeType,
            title: res.plan.title,
            budget,
            budget_used: res.plan.budget_used,
            budget_remaining: res.plan.budget_remaining,
            request_data: requestPayload,
            result_data: res.plan,
          });
          setIsSaved(true);
          if (onPlanCreated) onPlanCreated();
        } catch (saveErr) {
          console.warn('Auto-save skipped:', saveErr);
          setIsSaved(false);
        }
      } else {
        setIsSaved(false);
      }

      setIsModalOpen(true);
    } catch (err: any) {
      console.error('Failed to generate plan:', err);
      setError(err.message || 'Something went wrong while generating your plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSave = async () => {
    if (!user) {
      onOpenAuth('login');
      return;
    }
    if (!resultData) return;

    let requestPayload: any = {};
    if (activeType === 'home') requestPayload = homeInput;
    else if (activeType === 'party') requestPayload = partyInput;
    else requestPayload = jewelryInput;

    await api.savePlan({
      plan_type: activeType,
      title: resultData.title,
      budget: resultBudget,
      budget_used: resultData.budget_used,
      budget_remaining: resultData.budget_remaining,
      request_data: requestPayload,
      result_data: resultData,
    });
    setIsSaved(true);
    if (onPlanCreated) onPlanCreated();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Tabs */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 block mb-1">
            PocketSmart AI Recommendation Engine
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {activeType === 'home'
              ? 'Home Budget Planner'
              : activeType === 'party'
              ? 'Party Budget Planner'
              : 'Jewelry Budget Planner'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            {activeType === 'home'
              ? 'Plan your home purchases based on your available budget.'
              : activeType === 'party'
              ? 'Create a complete party plan without exceeding your budget.'
              : 'Find suitable jewelry combinations within your budget.'}
          </p>
        </div>

        {/* Planner Category Switcher */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-lg mx-auto shadow-inner">
          <button
            type="button"
            onClick={() => setActiveType('home')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
              activeType === 'home'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="w-4 h-4 text-blue-600" />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType('party')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
              activeType === 'party'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PartyPopper className="w-4 h-4 text-indigo-600" />
            <span>Party</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType('jewelry')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
              activeType === 'jewelry'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gem className="w-4 h-4 text-amber-600" />
            <span>Jewelry</span>
          </button>
        </div>
      </div>

      {/* Loading state overlay or container */}
      {loading ? (
        <AILoadingState />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs sm:text-sm text-rose-800 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-6">
            
            {/* 1. HOME PLANNER FORM */}
            {activeType === 'home' && (
              <>
                {/* Total Budget */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Total Budget (₹ INR) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-xs text-slate-400">Strict limit</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-400 font-bold text-base">₹</span>
                    <input
                      type="number"
                      min={1000}
                      step={500}
                      required
                      value={homeInput.budget}
                      onChange={e => setHomeInput({ ...homeInput, budget: e.target.value === '' ? '' : Number(e.target.value) })}
                      placeholder="e.g. 50000"
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-mono tabular-nums font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* Preset chips */}
                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    <span className="text-[11px] text-slate-400">Quick Presets:</span>
                    {homePresets.map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setHomeInput({ ...homeInput, budget: amt })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                          homeInput.budget === amt
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Room / Area & Home Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Room / Area
                    </label>
                    <select
                      value={homeInput.room}
                      onChange={e => setHomeInput({ ...homeInput, room: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Living Room">Living Room</option>
                      <option value="Bedroom">Bedroom</option>
                      <option value="Kitchen">Kitchen</option>
                      <option value="Dining Room">Dining Room</option>
                      <option value="Full Home">Full Home</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Home Type
                    </label>
                    <select
                      value={homeInput.home_type}
                      onChange={e => setHomeInput({ ...homeInput, home_type: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="Independent House">Independent House</option>
                      <option value="Studio Apartment">Studio Apartment</option>
                      <option value="Villa">Villa</option>
                    </select>
                  </div>
                </div>

                {/* Style Preference & Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Style Preference
                    </label>
                    <select
                      value={homeInput.style}
                      onChange={e => setHomeInput({ ...homeInput, style: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Modern">Modern</option>
                      <option value="Minimal">Minimal</option>
                      <option value="Traditional">Traditional</option>
                      <option value="Budget Friendly">Budget Friendly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Allocation Priority
                    </label>
                    <select
                      value={homeInput.priority}
                      onChange={e => setHomeInput({ ...homeInput, priority: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Essential">Essential (Functionality first)</option>
                      <option value="Balanced">Balanced (Comfort & Decor)</option>
                      <option value="Premium">Premium (High durability & finish)</option>
                    </select>
                  </div>
                </div>

                {/* Required Items */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Required Items
                  </label>
                  <input
                    type="text"
                    value={homeInput.required_items}
                    onChange={e => setHomeInput({ ...homeInput, required_items: e.target.value })}
                    placeholder="e.g. Sofa, Dining Table, BLDC Fan, Curtains"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    AI will prioritize budgeting for these specific items first.
                  </span>
                </div>

                {/* Additional Requirements */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Additional Requirements
                  </label>
                  <textarea
                    rows={2}
                    value={homeInput.additional_requirements}
                    onChange={e => setHomeInput({ ...homeInput, additional_requirements: e.target.value })}
                    placeholder="e.g. Pet-friendly sofa fabric, warm ambient lighting, compact corner desk"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-slate-900/10 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Home Plan</span>
                </button>
              </>
            )}

            {/* 2. PARTY PLANNER FORM */}
            {activeType === 'party' && (
              <>
                {/* Total Budget */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Total Budget (₹ INR) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-xs text-slate-400">Strict limit</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-400 font-bold text-base">₹</span>
                    <input
                      type="number"
                      min={1000}
                      step={500}
                      required
                      value={partyInput.budget}
                      onChange={e => setPartyInput({ ...partyInput, budget: e.target.value === '' ? '' : Number(e.target.value) })}
                      placeholder="e.g. 30000"
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-mono tabular-nums font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* Preset chips */}
                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    <span className="text-[11px] text-slate-400">Quick Presets:</span>
                    {partyPresets.map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setPartyInput({ ...partyInput, budget: amt })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                          partyInput.budget === amt
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Party Type & Number of Guests */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Party Type
                    </label>
                    <select
                      value={partyInput.party_type}
                      onChange={e => setPartyInput({ ...partyInput, party_type: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Birthday">Birthday</option>
                      <option value="College Event">College Event</option>
                      <option value="Anniversary">Anniversary</option>
                      <option value="Family Function">Family Function</option>
                      <option value="Celebration">Celebration</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      min={2}
                      max={500}
                      value={partyInput.guests}
                      onChange={e => setPartyInput({ ...partyInput, guests: e.target.value === '' ? '' : Number(e.target.value) })}
                      placeholder="e.g. 25"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Location & Food Preference */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Location / Venue
                    </label>
                    <input
                      type="text"
                      value={partyInput.location}
                      onChange={e => setPartyInput({ ...partyInput, location: e.target.value })}
                      placeholder="e.g. Home, Clubhouse, Cafe, Rooftop"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Food Preference
                    </label>
                    <input
                      type="text"
                      value={partyInput.food_preference}
                      onChange={e => setPartyInput({ ...partyInput, food_preference: e.target.value })}
                      placeholder="e.g. Finger Foods, Veg Buffet, Cake & Mocktails"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Decoration Preference & Entertainment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Decoration Preference
                    </label>
                    <input
                      type="text"
                      value={partyInput.decoration_preference}
                      onChange={e => setPartyInput({ ...partyInput, decoration_preference: e.target.value })}
                      placeholder="e.g. Balloons & Fairy Lights, Floral, Minimal"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Entertainment Preference
                    </label>
                    <input
                      type="text"
                      value={partyInput.entertainment_preference}
                      onChange={e => setPartyInput({ ...partyInput, entertainment_preference: e.target.value })}
                      placeholder="e.g. Bluetooth Speaker & Mic, Games, Acoustic"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Date & Additional */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={partyInput.date}
                      onChange={e => setPartyInput({ ...partyInput, date: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Additional Requirements
                    </label>
                    <input
                      type="text"
                      value={partyInput.additional_requirements}
                      onChange={e => setPartyInput({ ...partyInput, additional_requirements: e.target.value })}
                      placeholder="e.g. Photo backdrop, eco-friendly plates"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-slate-900/10 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Party Plan</span>
                </button>
              </>
            )}

            {/* 3. JEWELRY PLANNER FORM */}
            {activeType === 'jewelry' && (
              <>
                {/* Total Budget */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Total Budget (₹ INR) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-xs text-slate-400">Strict limit</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-400 font-bold text-base">₹</span>
                    <input
                      type="number"
                      min={1000}
                      step={1000}
                      required
                      value={jewelryInput.budget}
                      onChange={e => setJewelryInput({ ...jewelryInput, budget: e.target.value === '' ? '' : Number(e.target.value) })}
                      placeholder="e.g. 100000"
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-mono tabular-nums font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* Preset chips */}
                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    <span className="text-[11px] text-slate-400">Quick Presets:</span>
                    {jewelryPresets.map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setJewelryInput({ ...jewelryInput, budget: amt })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                          jewelryInput.budget === amt
                            ? 'bg-amber-600 text-white font-bold'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Jewelry Type & Metal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Jewelry Type
                    </label>
                    <select
                      value={jewelryInput.jewelry_type}
                      onChange={e => setJewelryInput({ ...jewelryInput, jewelry_type: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Necklace">Necklace</option>
                      <option value="Earrings">Earrings</option>
                      <option value="Bracelet">Bracelet</option>
                      <option value="Ring">Ring</option>
                      <option value="Set">Complete Set</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Preferred Metal
                    </label>
                    <select
                      value={jewelryInput.preferred_metal}
                      onChange={e => setJewelryInput({ ...jewelryInput, preferred_metal: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Gold">Gold (22K / 18K Hallmarked)</option>
                      <option value="Silver">Silver (925 Sterling)</option>
                      <option value="Platinum">Platinum</option>
                      <option value="Other">Diamond / Other</option>
                    </select>
                  </div>
                </div>

                {/* Occasion & Style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Occasion
                    </label>
                    <select
                      value={jewelryInput.occasion}
                      onChange={e => setJewelryInput({ ...jewelryInput, occasion: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Festive / Diwali">Festive / Diwali</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Engagement">Engagement</option>
                      <option value="Daily Wear">Daily Wear</option>
                      <option value="Gift">Gift</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Style
                    </label>
                    <select
                      value={jewelryInput.style}
                      onChange={e => setJewelryInput({ ...jewelryInput, style: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Elegant">Elegant</option>
                      <option value="Traditional">Traditional</option>
                      <option value="Modern">Modern</option>
                      <option value="Minimal">Minimal</option>
                    </select>
                  </div>
                </div>

                {/* Main Piece & Matching Requirements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Main Piece
                    </label>
                    <input
                      type="text"
                      value={jewelryInput.main_piece}
                      onChange={e => setJewelryInput({ ...jewelryInput, main_piece: e.target.value })}
                      placeholder="e.g. 22K Gold Choker or Diamond Ring"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Matching Requirements
                    </label>
                    <input
                      type="text"
                      value={jewelryInput.matching_requirements}
                      onChange={e => setJewelryInput({ ...jewelryInput, matching_requirements: e.target.value })}
                      placeholder="e.g. Drop jhumkas, delicate matching band"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Additional Requirements */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Additional Requirements
                  </label>
                  <input
                    type="text"
                    value={jewelryInput.additional_requirements}
                    onChange={e => setJewelryInput({ ...jewelryInput, additional_requirements: e.target.value })}
                    placeholder="e.g. BIS Hallmarked, lightweight everyday wear, anti-tarnish storage"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-slate-900/10 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Jewelry Plan</span>
                </button>
              </>
            )}

          </form>
        </div>
      )}

      {/* Result Modal View */}
      {resultData && (
        <PlanResultModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          planData={resultData}
          planType={activeType}
          totalBudget={resultBudget}
          onSave={handleManualSave}
          isAlreadySaved={isSaved}
          onPlanAnother={() => {
            setIsModalOpen(false);
          }}
        />
      )}

    </div>
  );
};
