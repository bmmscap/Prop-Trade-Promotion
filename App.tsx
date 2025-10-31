import React, { useState, useMemo } from 'react';
import { Account, MarketQuote } from './types';
import { useMockData } from './hooks/useMockData';
import GlobalStats from './components/GlobalStats';
import AccountList from './components/AccountList';
import MarketData from './components/MarketData';
import TradeTerminal from './components/TradeTerminal';
import TradeCopier from './components/TradeCopier';
import AiCoach from './components/AiCoach';
import PremiumHub from './components/PremiumHub';
import { DashboardIcon, RobotIcon, ContentIcon } from './components/icons/Icons';
import LandingPage from './components/LandingPage';

type View = 'DASHBOARD' | 'AI_COACH' | 'PREMIUM_HUB';

const App: React.FC = () => {
  const { accounts, setAccounts, marketData } = useMockData();
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<View>('DASHBOARD');
  const [appState, setAppState] = useState<'LANDING' | 'APP'>('LANDING');

  const globalStats = useMemo(() => {
    return accounts.reduce(
      (acc, account) => {
        acc.totalBalance += account.balance;
        acc.totalCushion += account.cushion;
        return acc;
      },
      { totalBalance: 0, totalCushion: 0 }
    );
  }, [accounts]);

  const handleAccountSelection = (accountId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };
  
  const handleEnterApp = () => {
    setAppState('APP');
  };

  if (appState === 'LANDING') {
    return <LandingPage onEnterApp={handleEnterApp} />;
  }

  const NavButton: React.FC<{
    label: string;
    view: View;
    icon: React.ReactNode;
  }> = ({ label, view, icon }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex flex-col items-center justify-center space-y-1 w-24 h-20 rounded-lg transition-colors duration-200 ${
        activeView === view
          ? 'bg-indigo-600 text-white'
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 font-sans p-4 lg:p-6 flex flex-col lg:flex-row gap-6">
      <nav className="flex lg:flex-col gap-4 bg-gray-900 lg:bg-transparent p-2 lg:p-0 rounded-xl lg:rounded-none lg:w-28">
          <div className="flex-shrink-0 flex items-center mb-0 lg:mb-6">
              <h1 className="text-xl font-bold text-white hidden lg:block">Prop AI</h1>
          </div>
          <div className="flex lg:flex-col gap-2 justify-center flex-grow">
            <NavButton label="Dashboard" view="DASHBOARD" icon={<DashboardIcon />} />
            <NavButton label="AI Coach" view="AI_COACH" icon={<RobotIcon />} />
            <NavButton label="Premium" view="PREMIUM_HUB" icon={<ContentIcon />} />
          </div>
      </nav>

      <main className="flex-1 overflow-auto">
        {activeView === 'DASHBOARD' && (
          <div className="space-y-6">
            <GlobalStats
              totalBalance={globalStats.totalBalance}
              totalCushion={globalStats.totalCushion}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <AccountList
                  accounts={accounts}
                  selectedAccounts={selectedAccounts}
                  onAccountSelect={handleAccountSelection}
                />
              </div>
              <div className="space-y-6">
                <MarketData initialMarketData={marketData} />
                <TradeTerminal
                  accounts={accounts}
                  selectedAccountIds={selectedAccounts}
                />
                <TradeCopier accounts={accounts} />
              </div>
            </div>
          </div>
        )}

        {activeView === 'AI_COACH' && <AiCoach accounts={accounts} />}
        {activeView === 'PREMIUM_HUB' && <PremiumHub />}
      </main>
    </div>
  );
};

export default App;