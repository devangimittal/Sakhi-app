import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Camera,
  Check,
  X,
  RotateCw,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QualityCheckRecord } from '../../types';

export const QualityModule: React.FC = () => {
  const {
    qualityChecks,
    members,
    orders,
    addQualityCheck,
    approveQualityItem,
    language,
    t,
    role,
  } = useApp();

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<QualityCheckRecord | null>(null);

  const isHindi = language === 'hi';

  // New check state
  const [newCheck, setNewCheck] = useState({
    orderId: 'ORD-2026-001',
    memberId: 'm5',
    completedQuantity: 5,
    approvedQuantity: 5,
    rejectedQuantity: 0,
    pendingCorrectionQuantity: 0,
    remarks: 'All seams verified and thread trimmed neatly.',
    checklist: [
      { item: 'Fabric dimensions & shape symmetry', passed: true },
      { item: 'Handle box-X reinforcement stitch strength', passed: true },
      { item: 'Hemming and thread trimming', passed: true },
      { item: 'Print cleanliness & alignment', passed: true },
      { item: 'Internal seam neatness', passed: true },
    ],
  });

  const totalInspected = qualityChecks.reduce((acc, q) => acc + q.completedQuantity, 0);
  const totalApproved = qualityChecks.reduce((acc, q) => acc + q.approvedQuantity, 0);
  const totalCorrection = qualityChecks.reduce((acc, q) => acc + q.pendingCorrectionQuantity, 0);
  const passRate = totalInspected > 0 ? ((totalApproved / totalInspected) * 100).toFixed(1) : '100';

  const handleToggleChecklistItem = (index: number) => {
    setNewCheck((prev) => {
      const updated = [...prev.checklist];
      updated[index].passed = !updated[index].passed;
      return { ...prev, checklist: updated };
    });
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const order = orders.find((o) => o.id === newCheck.orderId) || orders[0];
    const member = members.find((m) => m.id === newCheck.memberId) || members[1];

    addQualityCheck({
      orderId: newCheck.orderId,
      orderNumber: order.orderNumber,
      productName: order.productName,
      memberId: newCheck.memberId,
      memberName: member.name,
      completedQuantity: newCheck.completedQuantity,
      approvedQuantity: newCheck.approvedQuantity,
      rejectedQuantity: newCheck.rejectedQuantity,
      pendingCorrectionQuantity: newCheck.pendingCorrectionQuantity,
      inspectionDate: new Date().toISOString().split('T')[0],
      inspectorName: 'Geeta Bai & Sunita Devi',
      remarks: newCheck.remarks,
      checklist: newCheck.checklist,
      status:
        newCheck.pendingCorrectionQuantity > 0
          ? 'PARTIALLY_APPROVED'
          : newCheck.rejectedQuantity > 0
          ? 'CORRECTION_REQUIRED'
          : 'APPROVED',
    });

    setIsLogModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">{t('quality.title')}</h2>
          <p className="text-xs text-stone-500 mt-0.5">{t('quality.subtitle')}</p>
        </div>

        {role === 'LEADER' && (
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-900 text-white text-xs font-semibold hover:bg-purple-950 transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Log Physical Inspection</span>
          </button>
        )}
      </div>

      {/* Strict Quality Policy Guard Notice */}
      <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-4 text-xs text-purple-950 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-purple-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-purple-900">
            {isHindi ? 'सखी गुणवत्ता नीति' : 'Zero-Defect Quality Discipline'}
          </span>
          <p className="mt-0.5 text-purple-800 leading-relaxed">
            {t('quality.doNotAutoApproveNotice')}
          </p>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs">
          <div className="text-xs text-stone-500">Total Units Inspected</div>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-1">{totalInspected}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Physical audit logs</div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs">
          <div className="text-xs text-stone-500">Quality Approved</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">{totalApproved}</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">Cleared for payment</div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs">
          <div className="text-xs text-amber-800">Pending Correction</div>
          <div className="text-2xl font-bold font-mono text-amber-900 mt-1">{totalCorrection}</div>
          <div className="text-[11px] text-amber-700 mt-0.5">Awaiting artisan re-trim</div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs">
          <div className="text-xs text-stone-500">Pass Rate</div>
          <div className="text-2xl font-bold font-mono text-purple-900 mt-1">{passRate}%</div>
          <div className="text-[11px] text-stone-400 mt-0.5">First-pass compliance</div>
        </div>
      </div>

      {/* Inspection Ledger Table */}
      <div className="rounded-xl border border-stone-200 bg-white overflow-hidden shadow-xs">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-stone-900">
            {t('quality.inspectionDashboard')}
          </h3>
          <span className="text-xs text-stone-500">Batch Inspection Audit</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Log ID / Date</th>
                <th className="px-5 py-3.5">Artisan Member</th>
                <th className="px-5 py-3.5">Product & Order</th>
                <th className="px-5 py-3.5 text-center">Completed</th>
                <th className="px-5 py-3.5 text-center">Approved</th>
                <th className="px-5 py-3.5 text-center">Corrections</th>
                <th className="px-5 py-3.5">Remarks & Checklist</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {qualityChecks.map((qc) => {
                const passedChecks = qc.checklist.filter((c) => c.passed).length;
                const totalChecks = qc.checklist.length;

                return (
                  <tr key={qc.id} className="hover:bg-purple-50/20 transition-colors">
                    {/* Log ID & Date */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-stone-900">{qc.id}</div>
                      <div className="text-[11px] text-stone-400">{qc.inspectionDate}</div>
                    </td>

                    {/* Member */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-semibold text-stone-900">{qc.memberName}</div>
                      <div className="text-[11px] text-stone-400">Inspector: {qc.inspectorName}</div>
                    </td>

                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="font-medium text-stone-900">{qc.productName}</div>
                      <div className="font-mono text-[11px] text-purple-700">{qc.orderNumber}</div>
                    </td>

                    {/* Completed */}
                    <td className="px-5 py-4 text-center font-mono font-bold text-stone-900">
                      {qc.completedQuantity}
                    </td>

                    {/* Approved */}
                    <td className="px-5 py-4 text-center font-mono font-bold text-emerald-700">
                      {qc.approvedQuantity}
                    </td>

                    {/* Correction */}
                    <td className="px-5 py-4 text-center font-mono font-semibold">
                      {qc.pendingCorrectionQuantity > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                          {qc.pendingCorrectionQuantity}
                        </span>
                      ) : (
                        <span className="text-stone-300">0</span>
                      )}
                    </td>

                    {/* Remarks & Checklist */}
                    <td className="px-5 py-4 max-w-xs">
                      <div className="text-[11px] text-stone-700">{qc.remarks}</div>
                      <div className="text-[10px] text-stone-400 mt-1 flex items-center gap-1 font-mono">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        <span>{passedChecks}/{totalChecks} checks verified</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      {qc.pendingCorrectionQuantity > 0 && role === 'LEADER' ? (
                        <button
                          onClick={() => approveQualityItem(qc.id)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-2xs"
                        >
                          Approve Fixes
                        </button>
                      ) : (
                        <span className="text-xs text-stone-400 flex items-center justify-end gap-1">
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Cleared</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* LOG INSPECTION MODAL */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                Log Physical Inspection Audit
              </h3>
              <button onClick={() => setIsLogModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleLogSubmit} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Target Order</label>
                  <select
                    value={newCheck.orderId}
                    onChange={(e) => setNewCheck({ ...newCheck, orderId: e.target.value })}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs bg-white focus:outline-hidden focus:border-purple-600"
                  >
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.orderNumber} – {o.productName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Artisan Member</label>
                  <select
                    value={newCheck.memberId}
                    onChange={(e) => setNewCheck({ ...newCheck, memberId: e.target.value })}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs bg-white focus:outline-hidden focus:border-purple-600"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Completed Units</label>
                  <input
                    type="number"
                    min="1"
                    value={newCheck.completedQuantity}
                    onChange={(e) => {
                      const completed = parseInt(e.target.value) || 0;
                      setNewCheck({
                        ...newCheck,
                        completedQuantity: completed,
                        approvedQuantity: completed,
                        pendingCorrectionQuantity: 0,
                      });
                    }}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Approved Units</label>
                  <input
                    type="number"
                    min="0"
                    max={newCheck.completedQuantity}
                    value={newCheck.approvedQuantity}
                    onChange={(e) => {
                      const app = parseInt(e.target.value) || 0;
                      setNewCheck({
                        ...newCheck,
                        approvedQuantity: app,
                        pendingCorrectionQuantity: Math.max(0, newCheck.completedQuantity - app),
                      });
                    }}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs font-mono font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Correction Needed</label>
                  <input
                    type="number"
                    min="0"
                    readOnly
                    value={newCheck.pendingCorrectionQuantity}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs font-mono font-bold text-amber-800 bg-stone-50"
                  />
                </div>
              </div>

              {/* Checklist items */}
              <div>
                <label className="block font-semibold text-stone-700 mb-2">5-Point Inspection Checklist</label>
                <div className="space-y-1.5 bg-stone-50 p-3 rounded-lg border border-stone-200">
                  {newCheck.checklist.map((item, index) => (
                    <label key={item.item} className="flex items-center gap-2 cursor-pointer text-stone-800">
                      <input
                        type="checkbox"
                        checked={item.passed}
                        onChange={() => handleToggleChecklistItem(index)}
                        className="rounded border-stone-300 text-purple-900 focus:ring-purple-900"
                      />
                      <span>{item.item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Inspector Remarks</label>
                <textarea
                  rows={2}
                  value={newCheck.remarks}
                  onChange={(e) => setNewCheck({ ...newCheck, remarks: e.target.value })}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs focus:outline-hidden focus:border-purple-600"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-900 text-white font-semibold hover:bg-purple-950 shadow-xs"
                >
                  Save Inspection to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
