import React, { useState, useEffect } from 'react';
import { useAuth } from './components/auth/AuthProvider';
import { ViewState } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import FinanceList from './components/FinanceList';
import WhatsAppSender from './components/WhatsAppSender';
import NewClientForm from './components/NewClientForm';
import FinancialReports from './components/FinancialReports';
import Receivables from './components/Receivables';
import Developments from './components/Developments';
import SecuritySettings from './components/SecuritySettings';
import Comparison from './components/Comparison';
import Sidebar from './components/layout/Sidebar';
import MobileNavbar from './components/layout/MobileNavbar';

const App: React.FC = () => {
  const { session, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Privacy Mode State
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);

  // Dark Mode Logic
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      setIsMobile(mobile);

      if (mobile) {
        setIsSidebarOpen(false);
      } else if (width < 1280) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (isPrivacyMode) {
      document.body.classList.add('privacy-mode');
    } else {
      document.body.classList.remove('privacy-mode');
    }
  }, [isPrivacyMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const togglePrivacy = () => setIsPrivacyMode(!isPrivacyMode);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // If loading, show nothing or a spinner
  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-black text-white text-xl font-bold">Carregando FinPay...</div>;
  }

  // If not authenticated, show Login
  if (!session) {
    return <Login />;
  }

  const handleNavigation = (view: ViewState) => {
    setCurrentView(view);
    if (view !== ViewState.WHATSAPP) {
      setSelectedClientId(null);
    }
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleOpenWhatsApp = (clientId: number) => {
    setSelectedClientId(clientId);
    setCurrentView(ViewState.WHATSAPP);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.LOGIN: // Legacy state, fallback
        return <Dashboard onViewChange={handleNavigation} />;
      case ViewState.DASHBOARD:
        return <Dashboard onViewChange={handleNavigation} />;
      case ViewState.FINANCE_LIST:
        return <FinanceList onOpenWhatsApp={handleOpenWhatsApp} />;
      case ViewState.FINANCE_REPORTS:
        return <FinancialReports />;
      case ViewState.RECEIVABLES:
        return <Receivables onOpenWhatsApp={handleOpenWhatsApp} />;
      case ViewState.WHATSAPP:
        return <WhatsAppSender clientId={selectedClientId} onBack={() => handleNavigation(ViewState.FINANCE_LIST)} />;
      case ViewState.NEW_CLIENT:
        return <NewClientForm onCancel={() => handleNavigation(ViewState.DASHBOARD)} />;
      case ViewState.DEVELOPMENTS:
        return <Developments />;
      case ViewState.SETTINGS:
        return <SecuritySettings />;
      case ViewState.COMPARISON:
        return <Comparison />;
      default:
        return <Dashboard onViewChange={handleNavigation} />;
    }
  };

  // Login page renders without layout -> Now handled by session check above


  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-slate-900 transition-colors duration-300">
      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
        isDarkMode={isDarkMode}
        isPrivacyMode={isPrivacyMode}
        onNavigate={handleNavigation}
        onLogout={signOut}
        onToggleSidebar={toggleSidebar}
        onToggleTheme={toggleTheme}
        onTogglePrivacy={togglePrivacy}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
        {/* Mobile navbar */}
        <MobileNavbar onOpenSidebar={() => setIsSidebarOpen(true)} />

        {/* Page content */}
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
