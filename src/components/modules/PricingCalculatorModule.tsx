import React, { useState } from 'react';
import {
  Calculator,
  IndianRupee,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PricingCalculatorModule: React.FC = () => {
  const { t, language, orders } = useApp();

  const isHindi = language === 'hi';

  // Seeded with the exact numbers from prompt: 100 bags, total cost ₹9,000, target ₹11,250
  const [batchQuantity, setBatchQuantity] = useState<number>(100);
  const [rawMaterialCost, setRawMaterialCost] = useState<number>(4500);
  const [labourCost, setLabourCost] = useState<number>(3500);
  const [packagingCost, setPackagingCost] = useState<number>(500);
  const [transportCost, setTransportCost] = useState<number>(500);
  const [otherExpenses, setOtherExpenses] = useState<number>(0);
  const [profitMarginPercent, setProfitMarginPercent] = useState<number>(20);

  // Exact formula calculations from prompt:
  // Total Cost = Raw Material + Labour + Packaging + Transportation + Other Expenses
  const totalProductionCost =
    rawMaterialCost + labourCost + packagingCost + transportCost + otherExpenses;

  const costPerProduct = batchQuantity > 0 ? totalProductionCost / batchQuantity : 0;

  // Selling Price = Total Cost / (1 - Profit Margin)
  const marginDecimal = Math.min(profitMarginPercent / 100, 0.95);
  const suggestedSellingPrice =
    marginDecimal < 1 ? Math.round(totalProductionCost / (1 - marginDecimal)) : totalProductionCost;

  const pricePerProduct = batchQuantity > 0 ? suggestedSellingPrice / batchQuantity : 0;
  const expectedProfit = suggestedSellingPrice - totalProductionCost;
  const artisanWagePerPiece = batchQuantity > 0 ? labourCost / batchQuantity : 0;

  // Preset loader
  const loadPreset = (type: 'cotton_bags' | 'silk_pouches' | 'aprons') => {
    if (type === 'cotton_bags') {
      setBatchQuantity(100);
      setRawMaterialCost(4500);
      setLabourCost(3500);
      setPackagingCost(500);
      setTransportCost(500);
      setOtherExpenses(0);
      setProfitMarginPercent(20);
    } else if (type === 'silk_pouches') {
      setBatchQuantity(250);
      setRawMaterialCost(16500);
      setLabourCost(12500);
      setPackagingCost(1750);
      setTransportCost(1750);
      setOtherExpenses(0);
      setProfitMarginPercent(23);
    } else {
      setBatchQuantity(50);
      setRawMaterialCost(3500);
      setLabourCost(2200);
      setPackagingCost(400);
      setTransportCost(400);
      setOtherExpenses(0);
      setProfitMarginPercent(23.5);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">{t('pricing.title')}</h2>
          <p className="text-xs text-stone-500 mt-0.5">{t('pricing.subtitle')}</p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-stone-500">Presets:</span>
          <button
            onClick={() => loadPreset('cotton_bags')}
            className="px-2.5 py-1 text-xs rounded-md bg-purple-50 text-purple-900 border border-purple-200 font-semibold hover:bg-purple-100"
          >
            100 Cotton Bags
          </button>
          <button
            onClick={() => loadPreset('silk_pouches')}
            className="px-2.5 py-1 text-xs rounded-md bg-stone-100 text-stone-700 hover:bg-stone-200"
          >
            250 Silk Pouches
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs vs Real-time Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Cost & Margin Inputs */}
        <div className="lg:col-span-7 rounded-xl border border-stone-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-bold text-sm text-stone-900">
              {isHindi ? 'लागत इनपुट घटक (रुपये में)' : 'Production Cost Inputs'}
            </h3>
            <span className="text-[11px] text-stone-400">Instant Recalculation</span>
          </div>

          {/* Batch Size */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Batch Quantity (Number of Units)
            </label>
            <input
              type="number"
              min="1"
              value={batchQuantity}
              onChange={(e) => setBatchQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs font-mono font-bold text-stone-900 focus:outline-hidden focus:border-purple-600 bg-stone-50/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Raw Material */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                {t('pricing.rawMaterial')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-stone-400 font-mono">₹</span>
                <input
                  type="number"
                  min="0"
                  value={rawMaterialCost}
                  onChange={(e) => setRawMaterialCost(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full rounded-lg border border-stone-300 pl-7 pr-3 py-2 text-xs font-mono font-semibold text-stone-900 focus:outline-hidden focus:border-purple-600"
                />
              </div>
              <p className="text-[10px] text-stone-400 mt-1">Cotton canvas, threads, brass zippers</p>
            </div>

            {/* Labour Cost */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                {t('pricing.labourCost')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-stone-400 font-mono">₹</span>
                <input
                  type="number"
                  min="0"
                  value={labourCost}
                  onChange={(e) => setLabourCost(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full rounded-lg border border-stone-300 pl-7 pr-3 py-2 text-xs font-mono font-semibold text-stone-900 focus:outline-hidden focus:border-purple-600"
                />
              </div>
              <p className="text-[10px] text-emerald-700 mt-1 font-semibold">
                = ₹{artisanWagePerPiece.toFixed(2)}/piece guaranteed artisan wage
              </p>
            </div>

            {/* Packaging Cost */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                {t('pricing.packagingCost')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-stone-400 font-mono">₹</span>
                <input
                  type="number"
                  min="0"
                  value={packagingCost}
                  onChange={(e) => setPackagingCost(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full rounded-lg border border-stone-300 pl-7 pr-3 py-2 text-xs font-mono font-semibold text-stone-900 focus:outline-hidden focus:border-purple-600"
                />
              </div>
              <p className="text-[10px] text-stone-400 mt-1">Recycled paper wrap & craft tags</p>
            </div>

            {/* Transport Cost */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                {t('pricing.transportCost')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-stone-400 font-mono">₹</span>
                <input
                  type="number"
                  min="0"
                  value={transportCost}
                  onChange={(e) => setTransportCost(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full rounded-lg border border-stone-300 pl-7 pr-3 py-2 text-xs font-mono font-semibold text-stone-900 focus:outline-hidden focus:border-purple-600"
                />
              </div>
              <p className="text-[10px] text-stone-400 mt-1">Cluster dispatch courier / tempo</p>
            </div>
          </div>

          {/* Desired Profit Margin Slider */}
          <div className="pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-stone-700">{t('pricing.desiredMargin')}</span>
              <span className="font-bold font-mono text-purple-900 text-sm">
                {profitMarginPercent}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="45"
              step="1"
              value={profitMarginPercent}
              onChange={(e) => setProfitMarginPercent(parseInt(e.target.value))}
              className="w-full accent-purple-800 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-mono">
              <span>5% (Cost Recovery)</span>
              <span>20% (Sustainable SHG Standard)</span>
              <span>45% (High Craft/Luxury)</span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Calculated Pricing Card & Financial Breakdown */}
        <div className="lg:col-span-5 rounded-xl border border-purple-200 bg-gradient-to-b from-purple-50/60 to-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <span className="text-xs uppercase tracking-wider text-purple-900 font-bold">
                {isHindi ? 'सखी AI मूल्य निर्धारण परिणाम' : 'Intelligent Pricing Output'}
              </span>
              <span className="p-1.5 rounded-lg bg-purple-900 text-amber-300">
                <Calculator className="h-4 w-4" />
              </span>
            </div>

            {/* Primary Suggested Price */}
            <div className="mt-5 p-5 rounded-xl bg-purple-900 text-white shadow-xs">
              <div className="text-xs uppercase tracking-wide text-purple-200">
                {t('pricing.suggestedSellingPrice')}
              </div>
              <div className="text-3xl font-bold font-mono tracking-tight text-white mt-1">
                ₹{suggestedSellingPrice.toLocaleString('en-IN')}
              </div>
              <div className="text-xs font-mono text-amber-300 mt-1">
                ₹{pricePerProduct.toFixed(2)} / product
              </div>
            </div>

            {/* Key Cost Breakdown Metrics */}
            <div className="mt-5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-600">{t('pricing.totalCost')}</span>
                <span className="font-bold font-mono text-stone-900">
                  ₹{totalProductionCost.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-600">{t('pricing.costPerUnit')}</span>
                <span className="font-mono text-stone-900">
                  ₹{costPerProduct.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-600">{t('pricing.expectedProfit')}</span>
                <span className="font-bold font-mono text-emerald-700">
                  +₹{expectedProfit.toLocaleString('en-IN')} ({profitMarginPercent}%)
                </span>
              </div>
            </div>

            {/* Formula Explanation Callout */}
            <div className="mt-5 p-3.5 rounded-lg bg-white border border-purple-100 text-[11px] text-stone-600 space-y-1">
              <div className="font-semibold text-purple-950 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Deterministic Pricing Law</span>
              </div>
              <p className="font-mono text-purple-900 bg-purple-50 p-1.5 rounded">
                Selling Price = ₹{totalProductionCost.toLocaleString('en-IN')} / (1 - {profitMarginPercent}%) = ₹{suggestedSellingPrice.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-stone-500">
                Guarantees all production costs are protected before profit distribution to SHG corpus fund.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100">
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Protects Fair Artisan Wages (₹{artisanWagePerPiece.toFixed(2)}/unit)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
