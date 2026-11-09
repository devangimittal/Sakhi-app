import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewModule } from './components/modules/OverviewModule';
import { OrdersModule } from './components/modules/OrdersModule';
import { WorkAllocationModule } from './components/modules/WorkAllocationModule';
import { PricingCalculatorModule } from './components/modules/PricingCalculatorModule';
import { QualityModule } from './components/modules/QualityModule';
import { PaymentsModule } from './components/modules/PaymentsModule';
import { SakhiAIModule } from './components/modules/SakhiAIModule';
import { MembersModule } from './components/modules/MembersModule';
import { ReportsModule } from './components/modules/ReportsModule';
import { SettingsModule } from './components/modules/SettingsModule';
import { QRScannerModal } from './components/common/QRScannerModal';
import { LayoutDashboard, ShoppingBag, Users2, Sparkles, CreditCard } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewModule />;
      case 'orders':
        return <OrdersModule />;
      case 'allocation':
        return <WorkAllocationModule />;
      case 'pricing':
        return <PricingCalculatorModule />;
      case 'quality':
        return <QualityModule />;
      case 'payments':
        return <PaymentsModule />;
      case 'sakhi-ai':
        return <SakhiAIModule />;
      case 'members':
        return <MembersModule />;
      case 'reports':
        return <ReportsModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <OverviewModule />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 flex flex-col font-sans">
      {/* Sidebar navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main app viewport (offset by sidebar width on lg screens) */}
      <div className="flex-1 lg:pl-72 flex flex-col">
        <Header setMobileOpen={setMobileOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 lg:pb-8">
          {renderActiveModule()}
        </main>
      </div>

      {/* Global Interactive QR Production Scanner Modal */}
      <QRScannerModal />

      {/* Mobile Bottom Navigation Bar (Thumb friendly on phones) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-stone-200/90 py-2 px-3 flex items-center justify-around lg:hidden backdrop-blur-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center text-[10px] font-medium ${
            activeTab === 'overview' ? 'text-purple-900 font-bold' : 'text-stone-500'
          }`}
        >
          <LayoutDashboard className="h-4 w-4 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center text-[10px] font-medium ${
            activeTab === 'orders' ? 'text-purple-900 font-bold' : 'text-stone-500'
          }`}
        >
          <ShoppingBag className="h-4 w-4 mb-0.5" />
          <span>Orders</span>
        </button>

        <button
          onClick={() => setActiveTab('sakhi-ai')}
          className={`flex flex-col items-center text-[10px] font-semibold ${
            activeTab === 'sakhi-ai' ? 'text-purple-950 font-bold' : 'text-purple-700'
          }`}
        >
          <div className="p-1 rounded-full bg-purple-900 text-amber-300 -mt-3 shadow-sm border-2 border-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="mt-0.5">Sakhi AI</span>
        </button>

        <button
          onClick={() => setActiveTab('allocation')}
          className={`flex flex-col items-center text-[10px] font-medium ${
            activeTab === 'allocation' ? 'text-purple-900 font-bold' : 'text-stone-500'
          }`}
        >
          <Users2 className="h-4 w-4 mb-0.5" />
          <span>Allocate</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex flex-col items-center text-[10px] font-medium ${
            activeTab === 'payments' ? 'text-purple-900 font-bold' : 'text-stone-500'
          }`}
        >
          <CreditCard className="h-4 w-4 mb-0.5" />
          <span>Ledger</span>
        </button>
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
