import React, { useState } from 'react';
import {
  Settings,
  RotateCcw,
  Globe,
  ShieldCheck,
  Building2,
  Cpu,
  FileCode,
  Download,
  Upload,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsModule: React.FC = () => {
  const { language, setLanguage, resetToDefaultData, hasApiKey } = useApp();
  const [resetSuccess, setResetSuccess] = useState(false);

  const isHindi = language === 'hi';

  const handleReset = () => {
    if (window.confirm('Reset all demo data back to default Sakhi Mahila SHG state?')) {
      resetToDefaultData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-stone-900 tracking-tight">
          {isHindi ? 'प्लेटफ़ॉर्म सेटिंग्स' : 'System Settings & SHG Profile'}
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          {isHindi
            ? 'समूह संगठन विवरण, भाषा प्राथमिकता और डेटा प्रबंधन'
            : 'Organization credentials, bilingual preferences, and demo environment settings'}
        </p>
      </div>

      {resetSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Demo state successfully restored to pristine initial hackathon data!</span>
        </div>
      )}

      {/* SHG Organization Profile */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
          <Building2 className="h-4 w-4 text-purple-800" />
          <h3 className="font-bold text-sm text-stone-900">
            {isHindi ? 'स्वयं सहायता समूह पहचान' : 'SHG Organization Profile'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-stone-500 block mb-1">SHG Name</label>
            <input
              type="text"
              readOnly
              value="Sakhi Mahila SHG"
              className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 font-semibold text-stone-900"
            />
          </div>

          <div>
            <label className="text-stone-500 block mb-1">President / Leader</label>
            <input
              type="text"
              readOnly
              value="Smt. Sunita Devi"
              className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 font-semibold text-stone-900"
            />
          </div>

          <div>
            <label className="text-stone-500 block mb-1">Craft Cluster Hub</label>
            <input
              type="text"
              readOnly
              value="Wardha Handloom & Textile Cluster"
              className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 font-semibold text-stone-900"
            />
          </div>

          <div>
            <label className="text-stone-500 block mb-1">NRLM / NABARD Registration Code</label>
            <input
              type="text"
              readOnly
              value="NRLM-MH-WRD-2021-094"
              className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 font-mono font-semibold text-stone-900"
            />
          </div>
        </div>
      </div>

      {/* Language Preference */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
          <Globe className="h-4 w-4 text-purple-800" />
          <h3 className="font-bold text-sm text-stone-900">
            {isHindi ? 'भाषा चयन (Language Preference)' : 'Language Preference'}
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="lang"
              checked={language === 'en'}
              onChange={() => setLanguage('en')}
              className="text-purple-900 focus:ring-purple-900"
            />
            <span className="font-semibold text-stone-800">English (Default)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="lang"
              checked={language === 'hi'}
              onChange={() => setLanguage('hi')}
              className="text-purple-900 focus:ring-purple-900"
            />
            <span className="font-semibold text-stone-800">हिन्दी (Hindi)</span>
          </label>
        </div>
        <p className="text-[11px] text-stone-500">
          Switches all navigation labels, operational cards, inspection guides, and AI agent responses to Hindi or English.
        </p>
      </div>

      {/* AI Intelligence Architecture */}
      <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-6 shadow-xs space-y-3 text-xs text-purple-950">
        <div className="flex items-center justify-between pb-3 border-b border-purple-200">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-purple-800" />
            <h3 className="font-bold text-sm text-purple-950">
              Agentic AI Architecture Overview
            </h3>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-purple-200 text-purple-900">
            {hasApiKey ? 'Gemini 3.8 Flash Active' : 'Deterministic Applied AI Mode'}
          </span>
        </div>

        <p className="leading-relaxed text-purple-900">
          SakhiSetu AI coordinates operations through a multi-agent operational swarm:
        </p>
        <ul className="list-disc list-inside space-y-1 text-purple-900">
          <li><strong>Order Intelligence Agent:</strong> Real-time run-rate analysis, delivery risk alerts, and SLA monitoring.</li>
          <li><strong>Work Allocation Agent:</strong> Fair distribution algorithm balancing artisan capacity, skills, and quotas.</li>
          <li><strong>Cost Intelligence Agent:</strong> Deterministic costing mathematical formulas with target margin protections.</li>
          <li><strong>Quality Intelligence Agent:</strong> Multi-point physical defect logging and root-cause analysis.</li>
          <li><strong>Payment Transparency Agent:</strong> Reconciles earnings strictly from quality-approved goods with cryptographic audit vouchers.</li>
        </ul>
      </div>

      {/* Demo Reset */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-stone-900">Reset Demo Data</h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Restore sample data (100 bags, 60 completed, 55 approved, 5 correction, ₹2,350 pending).
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold text-xs transition-colors shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset to Default State</span>
        </button>
      </div>
    </div>
  );
};
