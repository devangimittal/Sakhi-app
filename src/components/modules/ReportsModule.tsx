import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Calendar,
  IndianRupee,
  Package,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportsModule: React.FC = () => {
  const { orders, members, payments, qualityChecks, auditLogs, language, t } = useApp();
  const [selectedReportType, setSelectedReportType] = useState<'INVOICE' | 'PAYMENT_LEDGER' | 'AUDIT_TRAIL'>('INVOICE');

  const isHindi = language === 'hi';
  const primaryOrder = orders[0];

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      shg: 'Sakhi Mahila SHG',
      cluster: 'Wardha Craft Hub',
      orders,
      members,
      payments,
      qualityChecks,
      auditLogs,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SakhiSetu_SHG_Audit_Report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            {isHindi ? 'परिचालन एवं वित्तीय रिपोर्ट्स' : 'Operations & Audit Reports'}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {isHindi
              ? 'प्रमाणित ऑडिट लेजर, इनवॉइस एवं उत्पादन गुणवत्ता रिपोर्ट'
              : 'Verifiable production audit, commercial invoice, and payment settlement ledgers'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-200 bg-white text-stone-700 text-xs font-semibold hover:bg-stone-50 shadow-2xs"
          >
            <Download className="h-4 w-4 text-stone-500" />
            <span>Export JSON Audit</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-900 text-white text-xs font-semibold hover:bg-purple-950 shadow-xs"
          >
            <Printer className="h-4 w-4 text-amber-300" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="flex gap-2 p-1 bg-stone-100 rounded-lg border border-stone-200 w-fit">
        <button
          onClick={() => setSelectedReportType('INVOICE')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            selectedReportType === 'INVOICE'
              ? 'bg-white text-stone-900 shadow-xs font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Commercial Invoice & Spec (ORD-2026-001)
        </button>
        <button
          onClick={() => setSelectedReportType('PAYMENT_LEDGER')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            selectedReportType === 'PAYMENT_LEDGER'
              ? 'bg-white text-stone-900 shadow-xs font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Artisan Payment Ledger Audit
        </button>
        <button
          onClick={() => setSelectedReportType('AUDIT_TRAIL')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            selectedReportType === 'AUDIT_TRAIL'
              ? 'bg-white text-stone-900 shadow-xs font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Full Operations Activity Log
        </button>
      </div>

      {/* Printable Sheet Frame */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs max-w-4xl mx-auto text-xs text-stone-700 leading-relaxed">
        {selectedReportType === 'INVOICE' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start pb-6 border-b border-stone-200">
              <div>
                <span className="text-sm font-bold text-purple-900 uppercase tracking-wider">
                  Sakhi Mahila Self-Help Group
                </span>
                <h3 className="text-xl font-bold text-stone-900 mt-1">COMMERCIAL TAX INVOICE</h3>
                <p className="text-stone-500 mt-1">
                  Wardha Craft Cluster, Maharashtra, India<br />
                  Registration: SHG-WRD-2021-094
                </p>
              </div>

              <div className="text-right">
                <div className="font-mono font-bold text-stone-900 text-sm">INV-2026-001</div>
                <div className="text-stone-500 mt-1">Date: {primaryOrder.orderDate}</div>
                <div className="text-amber-800 font-semibold mt-1">Due: {primaryOrder.deadlineDate}</div>
              </div>
            </div>

            {/* Buyer Details */}
            <div className="grid grid-cols-2 gap-6 p-4 rounded-lg bg-stone-50 border border-stone-100">
              <div>
                <div className="font-semibold text-stone-500 text-[11px] uppercase">BILLED TO:</div>
                <div className="font-bold text-stone-900 text-sm mt-1">{primaryOrder.buyerOrganization}</div>
                <div className="text-stone-600">Attn: {primaryOrder.buyerName}</div>
                <div className="font-mono text-stone-500">{primaryOrder.buyerContact}</div>
              </div>
              <div>
                <div className="font-semibold text-stone-500 text-[11px] uppercase">ORDER REFERENCE:</div>
                <div className="font-mono font-bold text-purple-900 mt-1">{primaryOrder.orderNumber}</div>
                <div>Status: Verified Production In-Progress</div>
                <div className="text-emerald-700 font-semibold">Fair Trade Artisan Certified</div>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 text-[11px] uppercase font-semibold">
                  <th className="py-2.5">Item Description</th>
                  <th className="py-2.5 text-center">Batch Qty</th>
                  <th className="py-2.5 text-right">Unit Price</th>
                  <th className="py-2.5 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono">
                <tr>
                  <td className="py-3 font-sans">
                    <div className="font-bold text-stone-900">{primaryOrder.productName}</div>
                    <div className="text-stone-500 text-[11px]">{primaryOrder.description}</div>
                  </td>
                  <td className="py-3 text-center font-bold text-stone-900">{primaryOrder.totalQuantity} pcs</td>
                  <td className="py-3 text-right">₹{primaryOrder.unitSellingPrice.toFixed(2)}</td>
                  <td className="py-3 text-right font-bold text-stone-900">
                    ₹{primaryOrder.targetSellingPrice.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Calculation Totals */}
            <div className="flex justify-end pt-4 border-t border-stone-200">
              <div className="w-64 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span>₹{primaryOrder.targetSellingPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>GST (Exempted - Rural SHG)</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between text-base font-bold text-purple-950 pt-2 border-t border-stone-200">
                  <span>Grand Total</span>
                  <span>₹{primaryOrder.targetSellingPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-8 border-t border-stone-200 flex justify-between items-end text-stone-500 text-[11px]">
              <div>
                <p>Payment via Direct Bank Account / PFMS</p>
                <p className="font-mono text-stone-700">A/C: State Bank of India ··4821 (Sakhi Mahila SHG)</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-stone-900">Smt. Sunita Devi</div>
                <div>Authorized Signatory / President</div>
              </div>
            </div>
          </div>
        )}

        {selectedReportType === 'PAYMENT_LEDGER' && (
          <div className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <h3 className="text-lg font-bold text-stone-900">
                Artisan Quality-Approved Payment Ledger Summary
              </h3>
              <p className="text-stone-500 text-xs">
                Audit certified by SakhiSetu AI Transparency Engine · Order ORD-2026-001
              </p>
            </div>

            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 uppercase text-[11px] font-semibold">
                  <th className="py-2">Artisan</th>
                  <th className="py-2 text-center">Approved Pieces</th>
                  <th className="py-2 text-right">Rate</th>
                  <th className="py-2 text-right">Earned</th>
                  <th className="py-2 text-right">Disbursed</th>
                  <th className="py-2 text-right">Pending</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2.5 font-sans font-semibold text-stone-900">{p.memberName}</td>
                    <td className="py-2.5 text-center text-emerald-700 font-bold">{p.approvedQuantity}</td>
                    <td className="py-2.5 text-right">₹{p.agreedRate}</td>
                    <td className="py-2.5 text-right font-bold text-stone-900">₹{p.grossAmount}</td>
                    <td className="py-2.5 text-right text-purple-900">₹{p.amountPaid}</td>
                    <td className="py-2.5 text-right text-amber-900 font-bold">₹{p.pendingBalance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedReportType === 'AUDIT_TRAIL' && (
          <div className="space-y-4">
            <div className="border-b border-stone-200 pb-3">
              <h3 className="text-lg font-bold text-stone-900">
                Immutable Operations Audit Log
              </h3>
              <p className="text-stone-500 text-xs">
                Cryptographic sequence of all leader authorizations and AI agent suggestions
              </p>
            </div>

            <div className="space-y-3 font-mono text-[11px]">
              {auditLogs.map((log, idx) => (
                <div key={`${log.id || 'log'}-${idx}`} className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex justify-between gap-4">
                  <div>
                    <div className="font-bold text-purple-950 font-sans">{log.action}</div>
                    <div className="text-stone-600 font-sans mt-0.5">{log.details}</div>
                    <div className="text-stone-400 text-[10px] mt-1">Actor: {log.actor}</div>
                  </div>
                  <span className="text-stone-400 shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
