import React from 'react';
import { Menu, Globe, Sparkles, UserCheck, ShieldAlert, ShoppingBag, Eye, ScanLine } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { NotificationCenter } from '../common/NotificationCenter';

interface HeaderProps {
  setMobileOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ setMobileOpen }) => {
  const { role, setRole, language, setLanguage, activeTab, setActiveTab, t, orders, openScanner } = useApp();

  const urgentOrderCount = orders.filter((o) => o.riskLevel === 'HIGH').length;

  const breadcrumbLabels: Record<string, string> = {
    overview: t('nav.overview'),
    orders: t('nav.orders'),
    allocation: t('nav.workAllocation'),
    pricing: t('nav.pricingCalculator'),
    quality: t('nav.qualityManagement'),
    payments: t('nav.payments'),
    'sakhi-ai': t('nav.sakhiAI'),
    members: t('nav.members'),
    reports: t('nav.reports'),
    settings: t('nav.settings'),
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-stone-200/80 bg-white/95 px-4 md:px-8 backdrop-blur-xs">
      {/* Left: Mobile hamburger & Contextual Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-sm font-medium text-stone-500">
          <span className="hidden sm:inline hover:text-stone-900 cursor-pointer" onClick={() => setActiveTab('overview')}>
            SakhiSetu
          </span>
          <span className="hidden sm:inline text-stone-300">/</span>
          <h1 className="text-base font-semibold text-stone-900 tracking-tight">
            {breadcrumbLabels[activeTab] || 'Dashboard'}
          </h1>
        </div>
      </div>

      {/* Right Controls: Role Selector, Language Toggle & AI Agent Trigger */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Role Switcher Pill Bar */}
        <div className="flex items-center p-1 bg-stone-100 rounded-lg border border-stone-200/80">
          <button
            onClick={() => setRole('LEADER')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              role === 'LEADER'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
            title="Switch to SHG Leader View (Sunita Devi)"
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Leader</span>
          </button>

          <button
            onClick={() => setRole('MEMBER')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              role === 'MEMBER'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
            title="Switch to Member Artisan View (Meena Sharma)"
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Member</span>
          </button>

          <button
            onClick={() => setRole('BUYER')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              role === 'BUYER'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
            title="Switch to Buyer View (FabCraft Exports)"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Buyer</span>
          </button>
        </div>

        {/* Scan QR Button */}
        <button
          onClick={() => openScanner()}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-purple-200 bg-purple-50 text-purple-900 hover:bg-purple-100 hover:border-purple-300 transition-colors shadow-2xs"
          title="Open QR Production Scanner"
        >
          <ScanLine className="h-3.5 w-3.5 text-purple-700" />
          <span className="hidden sm:inline">Scan QR</span>
        </button>

        {/* Language Toggle (EN / हिंदी) */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:border-purple-300 transition-colors"
          title="Toggle Language / भाषा बदलें"
        >
          <Globe className="h-3.5 w-3.5 text-purple-700" />
          <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>

        {/* Real-time Notification Center */}
        <NotificationCenter />

        {/* Urgent Risk indicator button (leads to Sakhi AI / Allocation) */}
        {urgentOrderCount > 0 && role === 'LEADER' && (
          <button
            onClick={() => setActiveTab('allocation')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
            <span>1 At-Risk Order</span>
          </button>
        )}

        {/* Sakhi AI Fast Launcher */}
        <button
          onClick={() => setActiveTab('sakhi-ai')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-800 to-purple-950 rounded-lg hover:from-purple-900 hover:to-black shadow-xs transition-all"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span className="hidden sm:inline">Sakhi AI</span>
        </button>
      </div>
    </header>
  );
};
