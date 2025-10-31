import React from 'react';
import { CheckIcon, ContentIcon, DashboardIcon, RobotIcon, TradeIcon } from './icons/Icons';

interface LandingPageProps {
  onEnterApp: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-600 text-white mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{children}</p>
  </div>
);

const PricingTier: React.FC<{
    tier: string;
    price: string;
    description: string;
    features: string[];
    isFeatured?: boolean;
    onSelect: () => void;
}> = ({ tier, price, description, features, isFeatured, onSelect }) => (
    <div className={`border rounded-xl p-6 flex flex-col ${isFeatured ? 'bg-gray-800 border-indigo-500' : 'bg-gray-900 border-gray-700'}`}>
        {isFeatured && <span className="text-center bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full -mt-9 mb-3 mx-auto">Most Popular</span>}
        <h3 className="text-2xl font-bold text-white text-center">{tier}</h3>
        <p className="text-4xl font-extrabold text-white text-center my-4">{price}<span className="text-base font-medium text-gray-400">/mo</span></p>
        <p className="text-gray-400 text-center mb-6 h-10">{description}</p>
        <ul className="space-y-3 mb-8">
            {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-indigo-400 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-300">{feature}</span>
                </li>
            ))}
        </ul>
        <button
            onClick={onSelect}
            className={`w-full mt-auto py-2 px-4 rounded-md font-semibold transition-colors ${isFeatured ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
        >
            Get Started
        </button>
    </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      {/* Header */}
      <header className="py-4 px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Prop AI</h1>
          <button onClick={onEnterApp} className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
            Launch App
          </button>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="text-center py-20 sm:py-28 px-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            Wall Street Grade Tools,
            <br />
            <span className="text-indigo-400">Built for Prop Firm Traders</span>
          </h2>
          <p className="max-w-2xl mx-auto mt-6 text-lg text-gray-400">
            Access an institutional-grade toolkit designed to streamline your workflow, automate execution, and deliver an analytical edge previously reserved for Wall Street's elite.
          </p>
          <div className="mt-8">
            <button onClick={onEnterApp} className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg text-lg hover:bg-indigo-700 transition-transform hover:scale-105">
              Get Started for Free
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-20 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white">Replace Three Tools With One</h3>
              <p className="text-gray-400 mt-2">A dashboard, trade copier, and execution tool, all in a single interface.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard icon={<DashboardIcon />} title="Unified Dashboard">
                Your institutional command center. Aggregate unlimited accounts across platforms for a complete, real-time view of your entire portfolio.
              </FeatureCard>
              <FeatureCard icon={<TradeIcon />} title="Cross-Platform Copier">
                The first of its kind. A cross-platform trade copier that executes with institutional speed and precision. Replicate trades from ProjectX to Tradovate flawlessly.
              </FeatureCard>
              <FeatureCard icon={<RobotIcon />} title="AI Trading Coach">
                Your personal AI quant. Leverage Gemini to get institutional-level performance reviews, tactical pre-market plans, and advanced chart analysis.
              </FeatureCard>
              <FeatureCard icon={<ContentIcon />} title="Premium Content Hub">
                The professional's briefing room. Access exclusive playbooks, institutional research, and pro analysis from market veterans to sharpen your edge.
              </FeatureCard>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white">Unlock Your Professional Edge</h3>
              <p className="text-gray-400 mt-2">Start for free, then upgrade as you grow.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <PricingTier
                tier="Pro"
                price="$29"
                description="For traders managing a few accounts and needing a unified view."
                features={[
                  'Connect up to 10 accounts',
                  'Full Dashboard & Rules Tracking',
                  'Manual Multi-Account Terminal',
                  'Basic AI Coach Features',
                ]}
                onSelect={onEnterApp}
              />
              <PricingTier
                tier="Advanced"
                price="$49"
                description="For traders wanting advanced AI insights and expert content."
                features={[
                  'Everything in Pro',
                  'Advanced AI (Chart Review, Market Briefing)',
                  'Premium Content & Media Hub',
                  'TTS Audio for Market Briefings',
                ]}
                isFeatured
                onSelect={onEnterApp}
              />
              <PricingTier
                tier="Elite"
                price="$79"
                description="The ultimate toolkit for serious traders scaling multiple accounts."
                features={[
                    'Everything in Advanced',
                    'Unlimited Account Aggregation',
                    'Automated Trade Copier',
                    'Priority Support',
                ]}
                onSelect={onEnterApp}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          &copy; {new Date().getFullYear()} Prop AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;