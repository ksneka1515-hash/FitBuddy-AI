import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { PlannerView } from './views/PlannerView';
import { HistoryView } from './views/HistoryView';
import { ProfileView } from './views/ProfileView';
import { Plan, PlanType } from './types';

function AppContent() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  
  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Plan to inspect in history modal
  const [selectedPlanToView, setSelectedPlanToView] = useState<Plan | null>(null);

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleSelectTab = (tab: string) => {
    // If user tries to access dashboard, history, or profile while logged out, open auth modal
    if (['dashboard', 'history', 'profile'].includes(tab) && !user) {
      handleOpenAuth('login');
      return;
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewPlanFromDashboard = (plan: Plan) => {
    setSelectedPlanToView(plan);
    setCurrentTab('history');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingView
            onSelectTab={handleSelectTab}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            onSelectTab={handleSelectTab}
            onViewPlan={handleViewPlanFromDashboard}
          />
        )}

        {currentTab === 'home-planner' && (
          <PlannerView
            initialType="home"
            onPlanCreated={() => {}}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentTab === 'party-planner' && (
          <PlannerView
            initialType="party"
            onPlanCreated={() => {}}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentTab === 'jewelry-planner' && (
          <PlannerView
            initialType="jewelry"
            onPlanCreated={() => {}}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentTab === 'history' && (
          <HistoryView
            onSelectTab={handleSelectTab}
            selectedPlanToView={selectedPlanToView}
            onClearSelectedPlan={() => setSelectedPlanToView(null)}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView onLogout={() => handleSelectTab('landing')} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={handleSelectTab}
        onOpenContact={() => {
          setCurrentTab('landing');
          setTimeout(() => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onOpenAbout={() => {
          setCurrentTab('landing');
          setTimeout(() => {
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={() => {
          // If was on landing and logged in, jump to dashboard
          if (currentTab === 'landing') {
            setCurrentTab('dashboard');
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
