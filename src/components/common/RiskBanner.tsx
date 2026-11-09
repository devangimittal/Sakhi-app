import React from 'react';
import { AlertTriangle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RiskBanner: React.FC = () => {
  const { orders, setActiveTab, sendAgentMessage, role, language } = useApp();

  const urgentOrder = orders.find((o) => o.riskLevel === 'HIGH');
  if (!urgentOrder || role !== 'LEADER') return null;

  const isHindi = language === 'hi';

  const handleResolveRisk = () => {
    setActiveTab('allocation');
    sendAgentMessage(
      isHindi
        ? 'ऑर्डर ORD-2026-001 में 40 बैग 2 दिन में पूरे करने के लिए शेष कार्य का निष्पक्ष पुनर्वितरण करें।'
        : 'Analyze order ORD-2026-001 risk and recommend fair redistribution of remaining 40 cotton bags to secure deadline.',
      'WORK_ALLOCATION_AGENT'
    );
  };

  return (
    <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50/90 p-4 shadow-xs text-amber-950">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-amber-900">
                {isHindi ? 'चेतावनी: ऑर्डर डिलीवरी समयसीमा जोखिम' : 'Delivery Risk Detected: ORD-2026-001'}
              </span>
              <span className="text-xs px-2 py-0.5 rounded font-semibold bg-amber-200/80 text-amber-900 uppercase">
                {isHindi ? '2 दिन शेष' : '2 Days Left'}
              </span>
            </div>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              {urgentOrder.riskReason ||
                '40 bags remaining. Daily run-rate of 20 bags/day required. Suman Lata bottlenecked with 0 units.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleResolveRisk}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-900 text-white text-xs font-semibold hover:bg-amber-950 transition-colors shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>{isHindi ? 'सखी AI द्वारा कार्य पुनर्वितरित करें' : 'Trigger Sakhi AI Rebalance'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
