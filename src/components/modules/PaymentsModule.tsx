import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  FileText,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Send,
  X,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentRecord } from '../../types';

export const PaymentsModule: React.FC = () => {
  const {
    payments,
    recordSimulatedPayment,
    language,
    t,
    role,
    activeMemberId,
    sendAgentMessage,
  } = useApp();

  const [selectedPaymentForPayout, setSelectedPaymentForPayout] = useState<PaymentRecord | null>(null);
  const [payoutAmount, setPayoutAmount] = useState<number>(0);
  const [payoutMethod, setPayoutMethod] = useState<'Simulated UPI' | 'Simulated Bank Payout' | 'Direct SHG Cash'>('Simulated UPI');
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  const isHindi = language === 'hi';

  const totalGrossEarned = payments.reduce((acc, p) => acc + p.grossAmount, 0);
  const totalPaid = payments.reduce((acc, p) => acc + p.amountPaid, 0);
  const totalPending = payments.reduce((acc, p) => acc + p.pendingBalance, 0);

  // If Member role, show personalized view or allow filtering
  const displayedPayments =
    role === 'MEMBER'
      ? payments.filter((p) => p.memberId === activeMemberId)
      : payments;

  const handleOpenPayout = (payment: PaymentRecord) => {
    setSelectedPaymentForPayout(payment);
    setPayoutAmount(payment.pendingBalance);
  };

  const handleExecutePayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaymentForPayout || payoutAmount <= 0) return;

    recordSimulatedPayment(selectedPaymentForPayout.id, payoutAmount, payoutMethod);
    setSelectedPaymentForPayout(null);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">{t('payments.title')}</h2>
          <p className="text-xs text-stone-500 mt-0.5">{t('payments.subtitle')}</p>
        </div>

        {role === 'LEADER' && totalPending > 0 && (
          <button
            onClick={() => {
              sendAgentMessage(
                isHindi
                  ? 'स्वीकृत बैचों के लिए ₹' + totalPending + ' का कुल पारदर्शी भुगतान ऑडिट तैयार करें।'
                  : 'Reconcile approved production and prepare simulated disbursement for ₹' + totalPending + ' total pending balance.',
                'PAYMENT_TRANSPARENCY_AGENT'
              );
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-900 text-white text-xs font-semibold hover:bg-purple-950 transition-colors shadow-xs"
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>{isHindi ? 'सखी AI भुगतान सुलह चलाएं' : 'Run Payment Reconciliation'}</span>
          </button>
        )}
      </div>

      {/* Required Hackathon Disclaimer Card */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-950 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-900">
            {isHindi ? 'कानूनी एवं डिजिटल ऑडिट सूचना' : 'Simulation Notice & Digital Audit Guarantee'}
          </span>
          <p className="mt-0.5 text-amber-900 leading-relaxed">
            {t('payments.disclaimer')}
          </p>
        </div>
      </div>

      {/* Ledger Formula Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
          <div className="text-xs text-stone-500">{t('payments.totalEarnings')}</div>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-2">
            ₹{totalGrossEarned.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Calculated solely from 55 quality-approved pieces</p>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
          <div className="text-xs text-stone-500">{t('payments.amountPaid')}</div>
          <div className="text-2xl font-bold font-mono text-purple-900 mt-2">
            ₹{totalPaid.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Simulated disbursements completed</p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5 shadow-xs">
          <div className="text-xs text-amber-800">{t('payments.pendingBalance')}</div>
          <div className="text-2xl font-bold font-mono text-amber-900 mt-2">
            ₹{totalPending.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-amber-800 mt-1 font-mono">{t('payments.formulaNotice')}</p>
        </div>
      </div>

      {/* Payments Ledger Table */}
      <div className="rounded-xl border border-stone-200 bg-white overflow-hidden shadow-xs">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-stone-900">
            {t('payments.memberLedger')}
          </h3>
          <span className="text-xs text-stone-400 font-mono">Agreed Rate: ₹70.00 / approved bag</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Ledger ID</th>
                <th className="px-5 py-3.5">Artisan Member</th>
                <th className="px-5 py-3.5 text-center">Approved Units</th>
                <th className="px-5 py-3.5 text-right">Agreed Rate</th>
                <th className="px-5 py-3.5 text-right">Total Earned</th>
                <th className="px-5 py-3.5 text-right">Amount Paid</th>
                <th className="px-5 py-3.5 text-right">Pending Balance</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {displayedPayments.map((p) => {
                return (
                  <tr key={p.id} className="hover:bg-purple-50/20 transition-colors">
                    {/* Ledger ID */}
                    <td className="px-5 py-4 font-mono font-bold text-stone-900 whitespace-nowrap">
                      {p.id}
                    </td>

                    {/* Member */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-bold text-stone-900">{p.memberName}</div>
                      <div className="text-[11px] text-stone-400 font-mono">{p.orderNumber}</div>
                    </td>

                    {/* Approved Units */}
                    <td className="px-5 py-4 text-center font-mono font-bold text-emerald-700">
                      {p.approvedQuantity} pcs
                    </td>

                    {/* Rate */}
                    <td className="px-5 py-4 text-right font-mono text-stone-700">
                      ₹{p.agreedRate}
                    </td>

                    {/* Total Earned */}
                    <td className="px-5 py-4 text-right font-mono font-bold text-stone-900">
                      ₹{p.grossAmount.toLocaleString('en-IN')}
                    </td>

                    {/* Amount Paid */}
                    <td className="px-5 py-4 text-right font-mono text-purple-900 font-semibold">
                      ₹{p.amountPaid.toLocaleString('en-IN')}
                    </td>

                    {/* Pending Balance */}
                    <td className="px-5 py-4 text-right font-mono font-bold text-amber-900">
                      ₹{p.pendingBalance.toLocaleString('en-IN')}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                          p.status === 'SETTLED'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {p.pendingBalance > 0 && role === 'LEADER' && (
                          <button
                            onClick={() => handleOpenPayout(p)}
                            className="px-2.5 py-1 text-xs font-semibold rounded-md bg-purple-900 text-white hover:bg-purple-950 transition-colors shadow-2xs"
                          >
                            Simulate Payout
                          </button>
                        )}

                        {p.disbursementHistory.length > 0 && (
                          <button
                            onClick={() => setSelectedReceipt(p.disbursementHistory[0])}
                            className="p-1 rounded text-stone-400 hover:text-stone-700"
                            title="View Transaction Receipt"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SIMULATED DISBURSEMENT MODAL */}
      {selectedPaymentForPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-sm text-stone-900">
                Record Simulated Artisan Payout
              </h3>
              <button
                onClick={() => setSelectedPaymentForPayout(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleExecutePayout} className="space-y-4 mt-4 text-xs">
              <div className="p-3 rounded-lg bg-purple-50 text-purple-950 space-y-1">
                <div><strong>Artisan:</strong> {selectedPaymentForPayout.memberName}</div>
                <div><strong>Approved Work:</strong> {selectedPaymentForPayout.approvedQuantity} bags (@ ₹70/pc)</div>
                <div><strong>Current Pending Balance:</strong> ₹{selectedPaymentForPayout.pendingBalance}</div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Disbursement Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  max={selectedPaymentForPayout.pendingBalance}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(Math.min(selectedPaymentForPayout.pendingBalance, parseInt(e.target.value) || 0))}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm font-mono font-bold text-stone-900 focus:outline-hidden focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Payment Method (Simulated)</label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value as any)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs bg-white focus:outline-hidden focus:border-purple-600"
                >
                  <option value="Simulated UPI">Simulated UPI Transfer</option>
                  <option value="Simulated Bank Payout">Simulated Bank Account Payout</option>
                  <option value="Direct SHG Cash">Direct SHG Cash Voucher</option>
                </select>
              </div>

              <div className="text-[11px] text-stone-500 italic">
                * Generates an immutable simulated audit transaction voucher stored in the SHG ledger.
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPaymentForPayout(null)}
                  className="px-4 py-2 rounded-lg border border-stone-200 text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-900 text-white font-semibold hover:bg-purple-950"
                >
                  Authorize & Record Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TRANSACTION VOUCHER MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-stone-200">
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <span className="text-xs font-bold text-purple-900 uppercase">Simulated Payment Receipt</span>
              <button onClick={() => setSelectedReceipt(null)} className="text-stone-400 hover:text-stone-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="py-4 space-y-2 text-xs font-mono">
              <div className="text-center p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="text-stone-500 text-[10px]">TRANSACTION AMOUNT</div>
                <div className="text-2xl font-bold text-stone-900 mt-1">₹{selectedReceipt.amount}</div>
                <div className="text-emerald-700 text-[11px] font-semibold mt-0.5">COMPLETED · VERIFIED</div>
              </div>

              <div className="pt-2 text-[11px] space-y-1 text-stone-600">
                <div><strong>Ref ID:</strong> {selectedReceipt.transactionId}</div>
                <div><strong>Date:</strong> {selectedReceipt.date}</div>
                <div><strong>Channel:</strong> {selectedReceipt.method}</div>
                <div><strong>Recorded By:</strong> {selectedReceipt.recordedBy}</div>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-2 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-black"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
