import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  TrendingUp, 
  History, 
  Sliders, 
  CheckCircle2, 
  Home, 
  PartyPopper, 
  Gem, 
  Send, 
  AlertCircle
} from 'lucide-react';

interface LandingViewProps {
  onSelectTab: (tab: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onSelectTab, onOpenAuth }) => {
  const { user, demoLogin } = useAuth();

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSending, setContactSending] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError(null);
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      setContactError('Please fill in all fields.');
      return;
    }

    try {
      setContactSending(true);
      await api.sendContact(contactName, contactEmail, contactMessage);
      setContactSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setTimeout(() => setContactSuccess(false), 5000);
    } catch (err: any) {
      setContactError(err.message || 'Failed to send message.');
    } finally {
      setContactSending(false);
    }
  };

  const handleStartPlanning = () => {
    if (user) {
      onSelectTab('dashboard');
    } else {
      onSelectTab('home-planner');
    }
  };

  const handleDemoClick = async () => {
    try {
      await demoLogin();
      onSelectTab('dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Next-Gen Smart Budget & Recommendation Assistant</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                PocketSmart <span className="text-blue-600">AI</span>
              </h1>

              <p className="text-lg sm:text-xl font-medium text-slate-700 leading-snug">
                Your Smart Budget & Recommendation Assistant
              </p>

              <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                Set your budget, tell us what you need, and get smart recommendations that fit your spending limit. Plan smarter, spend better, and choose confidently.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={handleStartPlanning}
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-md shadow-slate-900/10 flex items-center gap-2 group min-h-[48px]"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {!user ? (
                  <>
                    <button
                      onClick={() => onOpenAuth('login')}
                      className="px-5 py-3.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-semibold text-sm transition-colors hover:bg-slate-50 min-h-[48px]"
                    >
                      Login
                    </button>
                    <button
                      onClick={handleDemoClick}
                      className="px-4 py-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors min-h-[48px]"
                    >
                      Instant Demo Account
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onSelectTab('dashboard')}
                    className="px-5 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm min-h-[48px]"
                  >
                    Go to Dashboard
                  </button>
                )}
              </div>

              {/* Quick Trust markers */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Strict ₹ budget enforcement</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Google Gemini 3.8 Intelligence</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Real shopping link generation</span>
                </div>
              </div>
            </div>

            {/* Right Illustration Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 bg-white">
                <img
                  src="/src/assets/images/hero_budget_illustration_1790662823959.jpg"
                  alt="PocketSmart AI 3D Budget & Recommendation Illustration"
                  className="w-full h-auto object-cover object-center max-h-[460px]"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Styled CSS fallback container
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.classList.add('p-8', 'bg-gradient-to-br', 'from-slate-900', 'to-blue-900', 'text-white', 'min-h-[360px]', 'flex', 'flex-col', 'justify-center', 'items-center');
                      parent.innerHTML = `
                        <div class="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                          <svg class="w-8 h-8 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                        </div>
                        <h3 class="text-xl font-bold">PocketSmart AI Core</h3>
                        <p class="text-xs text-blue-200 mt-1 text-center">Smart Budgeting & Live Recommendation Assistant</p>
                      `;
                    }
                  }}
                />
              </div>

              {/* Floating Mini Overlay Badge */}
              <div className="absolute -bottom-4 -left-3 sm:-left-6 bg-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                  ₹
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    Zero Overspending
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    Always Under Limit
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (4-STEP SECTION) */}
      <section className="bg-slate-100/70 py-16 sm:py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 block mb-2">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How PocketSmart AI Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Transform your raw spending limit into a verified, category-wise purchasing blueprint in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-mono font-bold text-sm mb-4">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Enter Budget
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Specify your total spending ceiling in Indian Rupees (₹) for your room, celebration, or jewelry purchase.
                </p>
              </div>
              <div className="mt-4 text-[11px] text-blue-600 font-medium">Step 1</div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-mono font-bold text-sm mb-4">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Tell AI What You Need
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Select your occasion, preferred style, room dimensions, number of guests, or metal preferences.
                </p>
              </div>
              <div className="mt-4 text-[11px] text-blue-600 font-medium">Step 2</div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-mono font-bold text-sm mb-4">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  AI Creates a Budget Plan
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Gemini analyzes real market prices, divides your budget across categories, and reserves an emergency buffer.
                </p>
              </div>
              <div className="mt-4 text-[11px] text-blue-600 font-medium">Step 3</div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-mono font-bold text-sm mb-4">
                  04
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Recommendations That Fit
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Browse handpicked items with instant links to Google Shopping, Amazon, and Flipkart—all guaranteed within budget.
                </p>
              </div>
              <div className="mt-4 text-[11px] text-emerald-600 font-medium">Step 4: Done</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURE SECTION (6 CARDS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 block mb-2">
            Why PocketSmart AI
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Budgeting & Smart Choices
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Engineered specifically to solve impulse overspending and unorganized shopping lists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              1. Smart Budget Planning
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every single rupee is accounted for. The platform guarantees the total recommended items never exceed your entered spending limit.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              2. AI Recommendations
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Powered by Google Gemini 3.8 Flash, our engine evaluates user aesthetics, priorities, and functional requirements into realistic item lists.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              3. Multiple Planning Categories
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dedicated, domain-calibrated planners for Home Furnishing, Event & Party Celebrations, and Fine Jewelry collections.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              4. Budget Tracking
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clear visual progress bars, category breakdown distributions, and calculated emergency buffers to protect your wallet.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
              <History className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              5. Recommendation History
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Save your generated plans securely. Review previous recommendations, track budget utilization history, and retrieve shopping links anytime.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              6. Personalized Suggestions
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              From vegetarian menus and acoustic entertainment to 22K HUID gold hallmarking precautions, suggestions reflect real domain practicalities.
            </p>
          </div>
        </div>
      </section>

      {/* 4. THE 3 SPECIALIZED PLANNERS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 block mb-2">
            Tailored Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            What Would You Like to Plan Today?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Select one of our specialized financial budgeting engines to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Planner Card 1: Home */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="h-48 overflow-hidden bg-slate-100 relative">
                <img
                  src="/src/assets/images/home_budget_showcase_1790662837606.jpg"
                  alt="Modern Home Interior Decor Showcase"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-bold text-slate-800">
                  Home Interior
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <Home className="w-4 h-4 text-blue-600" />
                  <span>Living · Bedroom · Kitchen · Full Home</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Home Budget Planner
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  "Plan your home purchases based on your available budget." Furnish rooms with balanced allocations for furniture, lighting, BLDC fans, and decor.
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => onSelectTab('home-planner')}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <span>Launch Home Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Planner Card 2: Party */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="h-48 overflow-hidden bg-slate-100 relative">
                <img
                  src="/src/assets/images/party_event_showcase_1790662848897.jpg"
                  alt="Party Celebration Event Showcase"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-bold text-slate-800">
                  Events & Parties
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <PartyPopper className="w-4 h-4 text-indigo-600" />
                  <span>Birthday · College Event · Celebration</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Party Budget Planner
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  "Create a complete party plan without exceeding your budget." Organize venue rentals, food catering, decorations, and DJ entertainment effortlessly.
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => onSelectTab('party-planner')}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <span>Launch Party Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Planner Card 3: Jewelry */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="h-48 overflow-hidden bg-slate-100 relative">
                <img
                  src="/src/assets/images/jewelry_craft_showcase_1790662864068.jpg"
                  alt="Luxury Jewelry Craft Showcase"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-bold text-slate-800">
                  Gold & Jewelry
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <Gem className="w-4 h-4 text-amber-600" />
                  <span>Gold · Silver · Platinum · Diamond</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Jewelry Budget Planner
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  "Find suitable jewelry combinations within your budget." Pair certified hallmarked necklaces, jhumkas, and rings with price buffers for market rate fluctuations.
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => onSelectTab('jewelry-planner')}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <span>Launch Jewelry Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 5. ABOUT SECTION (Section 30) */}
      <section id="about" className="bg-white py-16 sm:py-20 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            About the Platform
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            About PocketSmart AI
          </h2>

          <p className="text-base text-slate-700 leading-relaxed">
            PocketSmart AI is a smart budgeting and recommendation platform designed to help users make better spending decisions based on their available budget and personal requirements.
          </p>

          <p className="text-sm text-slate-600 leading-relaxed">
            Unlike generic shopping search engines that promote high-commission items regardless of your limits, PocketSmart AI inverts the equation: <strong>Your budget is the absolute ceiling</strong>. We mathematically divide your budget across essential categories, provide handpicked items with verified direct search links across Amazon, Flipkart, and Google Shopping, and always retain a buffer for logistics or unexpected costs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-sm text-slate-900 mb-1">Home Planning</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Furnish apartments or houses room-by-room with balanced comfort, climate appliances, and lighting.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-sm text-slate-900 mb-1">Party Planning</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Organize birthdays, college events, and celebrations with catering, entertainment, and decor.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-sm text-slate-900 mb-1">Jewelry Planning</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Assemble matching ensembles with BIS hallmarked gold, silver, and precious stones with daily rate buffers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONTACT SECTION (Section 31) */}
      <section id="contact" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 block mb-2">
              Get in Touch
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Contact PocketSmart AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Have feedback, questions, or custom partnership ideas? Send us a message directly.
            </p>
          </div>

          {contactSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-800 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Thank you for reaching out! Your message has been received by our team.</span>
            </div>
          )}

          {contactError && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs sm:text-sm text-rose-800 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{contactError}</span>
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
              <textarea
                rows={4}
                required
                placeholder="Tell us what you think or how we can improve your budgeting experience..."
                value={contactMessage}
                onChange={e => setContactMessage(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={contactSending}
              className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{contactSending ? 'Sending Message...' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};
