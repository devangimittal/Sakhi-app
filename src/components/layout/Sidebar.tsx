import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Users2,
  Calculator,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Users,
  FileText,
  Settings,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeTab, setActiveTab, role, t } = useApp();

  const navItems = [
    { id: 'overview', label: t('nav.overview'), icon: LayoutDashboard },
    { id: 'orders', label: t('nav.orders'), icon: ShoppingBag },
    { id: 'allocation', label: t('nav.workAllocation'), icon: Users2 },
    { id: 'pricing', label: t('nav.pricingCalculator'), icon: Calculator },
    { id: 'quality', label: t('nav.qualityManagement'), icon: ShieldCheck },
    { id: 'payments', label: t('nav.payments'), icon: CreditCard },
    { id: 'sakhi-ai', label: t('nav.sakhiAI'), icon: Sparkles, highlight: true },
    { id: 'members', label: t('nav.members'), icon: Users },
    { id: 'reports', label: t('nav.reports'), icon: FileText },
    { id: 'settings', label: t('nav.settings'), icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col bg-[#2A0845] text-white transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-purple-900/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-500 to-amber-400 text-white font-bold text-lg shadow-sm">
              🌸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white">SakhiSetu AI</span>
                <span className="text-[10px] tracking-wide uppercase px-1.5 py-0.5 rounded bg-purple-900/80 text-amber-300 font-semibold">SHG OS</span>
              </div>
              <p className="text-[11px] text-purple-200/80 truncate max-w-[170px]">
                Sakhi Mahila SHG
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1 text-purple-300 hover:bg-purple-900/50 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* SHG Role Indicator Banner */}
        <div className="px-5 py-3 bg-[#23063A] border-b border-purple-950/80">
          <div className="text-[11px] uppercase tracking-wider text-purple-300/70 font-semibold mb-1">
            Active Workspace
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-purple-100">
              {role === 'LEADER'
                ? 'Smt. Sunita Devi (Leader)'
                : role === 'MEMBER'
                ? 'Meena Sharma (Artisan)'
                : 'FabCraft Exports (Buyer)'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-purple-800 text-purple-200">
              {role}
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-purple-800/90 text-white shadow-xs font-semibold'
                    : 'text-purple-200/80 hover:bg-purple-900/40 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? 'text-amber-300' : 'text-purple-300 group-hover:text-purple-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.highlight && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-400 text-purple-950">
                    Agent
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Mission / Trust Tagline */}
        <div className="p-4 border-t border-purple-900/50 bg-[#23063A]/80 text-[11px] text-purple-300/80">
          <p className="italic leading-relaxed text-amber-200/90">
            &ldquo;Empowering Women Through Technology, Transparency and Trust.&rdquo;
          </p>
          <div className="mt-2 text-[10px] text-purple-400/80 flex items-center justify-between">
            <span>Govt. NRLM Aligned</span>
            <span>v1.0 Hackathon</span>
          </div>
        </div>
      </aside>
    </>
  );
};
