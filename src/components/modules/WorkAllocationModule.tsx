import React, { useState } from 'react';
import {
  Users2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Info,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AllocationProposal } from '../../types';

export const WorkAllocationModule: React.FC = () => {
  const {
    orders,
    members,
    allocations,
    updateAllocations,
    approveAllocation,
    language,
    t,
    role,
    sendAgentMessage,
  } = useApp();

  const [selectedOrderId, setSelectedOrderId] = useState<string>('ORD-2026-001');
  const [editingAllocations, setEditingAllocations] = useState<AllocationProposal[]>(allocations);
  const [isModified, setIsModified] = useState(false);
  const [aiRationaleExpanded, setAiRationaleExpanded] = useState(true);

  const isHindi = language === 'hi';
  const targetOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  // Filter allocations for selected order
  const orderAllocations = editingAllocations.filter((a) => a.orderId === selectedOrderId);
  const totalAllocated = orderAllocations.reduce((sum, a) => sum + a.assignedQuantity, 0);
  const targetQuantity = targetOrder.totalQuantity;
  const isBalanced = totalAllocated === targetQuantity;
  const difference = targetQuantity - totalAllocated;

  // Handle manual quantity adjustment by Leader
  const handleQuantityChange = (memberId: string, val: number) => {
    const safeVal = Math.max(0, val);
    setEditingAllocations((prev) =>
      prev.map((item) =>
        item.orderId === selectedOrderId && item.memberId === memberId
          ? { ...item, assignedQuantity: safeVal }
          : item
      )
    );
    setIsModified(true);
  };

  // Run Sakhi AI Fair Allocation Optimizer
  const handleRunAiOptimizer = () => {
    sendAgentMessage(
      isHindi
        ? 'ऑर्डर ORD-2026-001 के 100 बैग्स का उपलब्ध सदस्यों में निष्पक्ष वितरण मॉडल तैयार करें।'
        : 'Run fair work distribution optimization for order ORD-2026-001 ensuring zero member overload and SLA protection.',
      'WORK_ALLOCATION_AGENT'
    );

    // AI Fair Algorithm calculation:
    // Distribute 100 bags proportional to available daily capacity:
    // Meena (available 3, capacity 6): gets 25
    // Radha (available 3, capacity 5): gets 20
    // Rekha (available 4, capacity 5): gets 20 (boosted from 15)
    // Pooja (available 2, capacity 4): gets 15
    // Anita (available 2, capacity 4): gets 15
    // Suman (available 0, capacity 3): gets 5 (relieved from 10)
    // Sum = 25 + 20 + 20 + 15 + 15 + 5 = 100!
    const optimized = editingAllocations.map((a) => {
      if (a.orderId !== selectedOrderId) return a;
      if (a.memberId === 'm1') return { ...a, assignedQuantity: 25, suggestedQuantity: 25, rationale: 'Master artisan, high precision, capacity 6/day' };
      if (a.memberId === 'm2') return { ...a, assignedQuantity: 20, suggestedQuantity: 20, rationale: 'Fast assembler, available capacity 3/day' };
      if (a.memberId === 'm5') return { ...a, assignedQuantity: 20, suggestedQuantity: 20, rationale: 'High spare capacity (4/day), reliable seamstress' };
      if (a.memberId === 'm3') return { ...a, assignedQuantity: 15, suggestedQuantity: 15, rationale: 'Pattern cutter, daily quota 15' };
      if (a.memberId === 'm4') return { ...a, assignedQuantity: 15, suggestedQuantity: 15, rationale: 'Machine operator, handle specialist' };
      if (a.memberId === 'm6') return { ...a, assignedQuantity: 5, suggestedQuantity: 5, rationale: 'Relieved from 10 to 5 units to alleviate bottleneck' };
      return a;
    });

    setEditingAllocations(optimized);
    setIsModified(true);
  };

  const handleSaveAndApprove = () => {
    if (!isBalanced) return;
    updateAllocations(selectedOrderId, editingAllocations);
    approveAllocation(selectedOrderId);
    setIsModified(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">{t('allocation.title')}</h2>
          <p className="text-xs text-stone-500 mt-0.5">{t('allocation.subtitle')}</p>
        </div>

        {/* Order Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-stone-600">Select Order:</label>
          <select
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="text-xs font-semibold rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-stone-800 focus:outline-hidden focus:border-purple-600"
          >
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.orderNumber} – {o.productName} ({o.totalQuantity} pcs)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Allocation Summary & Balance Verification Strip */}
      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100 text-purple-900">
              <Users2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-stone-900">{targetOrder.productName}</h3>
                <span className="text-xs font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  {targetOrder.orderNumber}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Target Order Requirement: <span className="font-bold font-mono text-stone-900">{targetQuantity} units</span>
              </p>
            </div>
          </div>

          {/* Allocation Balance Math Badge */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[11px] text-stone-500 uppercase tracking-wide">
                Total Allocated Units
              </div>
              <div className="text-2xl font-bold font-mono flex items-center justify-end gap-1.5">
                <span className={isBalanced ? 'text-emerald-700' : 'text-amber-800'}>
                  {totalAllocated}
                </span>
                <span className="text-sm font-normal text-stone-400">/ {targetQuantity}</span>
              </div>
            </div>

            {isBalanced ? (
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 flex items-center gap-1.5 text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                <span>100% Balanced</span>
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-amber-100 text-amber-900 flex items-center gap-1.5 text-xs font-semibold">
                <AlertTriangle className="h-4 w-4" />
                <span>{difference > 0 ? `${difference} Unassigned` : `${Math.abs(difference)} Over-assigned`}</span>
              </div>
            )}
          </div>
        </div>

        {/* AI Allocation Explanation Box */}
        {aiRationaleExpanded && (
          <div className="mt-5 p-4 rounded-lg bg-purple-50/80 border border-purple-200 text-xs text-purple-950 leading-relaxed">
            <div className="flex items-center justify-between font-semibold text-purple-900 mb-1">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>{t('allocation.aiExplanation')}</span>
              </span>
              <button
                onClick={handleRunAiOptimizer}
                className="text-[11px] underline text-purple-700 hover:text-purple-900 font-semibold"
              >
                Re-run AI Fair Optimizer
              </button>
            </div>
            <p>
              {isHindi
                ? 'सखी AI प्रत्येक कारीगर दीदी की दैनिक क्षमता, वर्तमान में चल रहे कार्य और सिलाई की विशेषज्ञता का विश्लेषण करता है। किसी भी दीदी पर 85% से अधिक भार नहीं डाला गया है ताकि थकान या गुणवत्ता में गिरावट न आए। सुमन लता दीदी की बीमारी के कारण उनके 5 बैग्स रेखा देवी (उच्च अतिरिक्त क्षमता 4/दिन) को स्थानांतरित किए गए हैं।'
                : 'Sakhi AI dynamically balances workload based on daily throughput capacity, active backlog, and product specialization. Rekha Devi has 4 units/day unutilized capacity, absorbing 5 units relieved from Suman Lata to resolve the bottleneck without artisan burnout.'}
            </p>
          </div>
        )}
      </div>

      {/* Allocation Table */}
      <div className="rounded-xl border border-stone-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Artisan Member</th>
                <th className="px-5 py-3.5 text-center">Daily Capacity</th>
                <th className="px-5 py-3.5 text-center">Available Capacity</th>
                <th className="px-5 py-3.5 text-center">AI Suggested</th>
                <th className="px-5 py-3.5 text-center">Assigned Units</th>
                <th className="px-5 py-3.5 text-center">Completed</th>
                <th className="px-5 py-3.5">Allocation Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orderAllocations.map((alloc) => {
                const member = members.find((m) => m.id === alloc.memberId);

                return (
                  <tr key={alloc.memberId} className="hover:bg-purple-50/20 transition-colors">
                    {/* Member Name & Skills */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-stone-900">{alloc.memberName}</div>
                      <div className="text-[11px] text-stone-400">
                        {member?.skills.slice(0, 2).join(' · ')}
                      </div>
                    </td>

                    {/* Daily Capacity */}
                    <td className="px-5 py-4 text-center font-mono font-medium text-stone-800">
                      {alloc.dailyCapacity} / day
                    </td>

                    {/* Available Capacity */}
                    <td className="px-5 py-4 text-center font-mono">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded ${
                          alloc.availableCapacity > 2
                            ? 'bg-emerald-100 text-emerald-900'
                            : alloc.availableCapacity > 0
                            ? 'bg-purple-100 text-purple-900'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {alloc.availableCapacity} / day
                      </span>
                    </td>

                    {/* AI Suggested */}
                    <td className="px-5 py-4 text-center font-mono font-bold text-purple-900">
                      {alloc.suggestedQuantity}
                    </td>

                    {/* Assigned Units (Editable by Leader) */}
                    <td className="px-5 py-4 text-center">
                      {role === 'LEADER' ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={alloc.assignedQuantity}
                          onChange={(e) => handleQuantityChange(alloc.memberId, parseInt(e.target.value) || 0)}
                          className="w-16 rounded-md border border-stone-300 py-1 px-2 text-center font-mono font-bold text-stone-900 focus:outline-hidden focus:border-purple-600 bg-white"
                        />
                      ) : (
                        <span className="font-mono font-bold text-stone-900">{alloc.assignedQuantity}</span>
                      )}
                    </td>

                    {/* Completed */}
                    <td className="px-5 py-4 text-center font-mono text-emerald-700 font-semibold">
                      {alloc.completedQuantity}
                    </td>

                    {/* Rationale */}
                    <td className="px-5 py-4 text-stone-500 max-w-xs text-[11px] leading-relaxed">
                      {alloc.rationale}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        {role === 'LEADER' && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-stone-500">
              {isBalanced ? (
                <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  Exact 100 units assigned. Ready for leader approval.
                </span>
              ) : (
                <span className="text-amber-800 font-medium flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" />
                  Total assigned units must equal order target ({targetQuantity} units).
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRunAiOptimizer}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-200 bg-white text-purple-900 text-xs font-semibold hover:bg-purple-50 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Auto-Balance with AI</span>
              </button>

              <button
                disabled={!isBalanced}
                onClick={handleSaveAndApprove}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors ${
                  isBalanced
                    ? 'bg-purple-900 text-white hover:bg-purple-950'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                <Check className="h-4 w-4" />
                <span>{t('allocation.approveAllocation')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
