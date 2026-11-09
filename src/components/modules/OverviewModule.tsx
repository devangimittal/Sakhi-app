import React from 'react';
import {
  Users,
  ShoppingBag,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  PackageCheck,
  ChevronRight,
  IndianRupee,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RiskBanner } from '../common/RiskBanner';
import { OrderTimeline } from '../common/OrderTimeline';

export const OverviewModule: React.FC = () => {
  const {
    role,
    orders,
    members,
    payments,
    auditLogs,
    qualityChecks,
    setActiveTab,
    activeMemberId,
    t,
    language,
    sendAgentMessage,
  } = useApp();

  const isHindi = language === 'hi';

  // Calculate high-level metrics
  const activeOrdersCount = orders.filter((o) => o.status !== 'Completed' && o.status !== 'Dispatched').length;
  const primaryOrder = orders[0]; // ORD-2026-001
  const totalCompletedUnits = orders.reduce((sum, o) => sum + o.completedQuantity, 0);
  const totalRequiredUnits = orders.reduce((sum, o) => sum + o.totalQuantity, 0);
  const totalApprovedUnits = orders.reduce((sum, o) => sum + o.approvedQuantity, 0);
  const pendingMemberPayments = payments.reduce((sum, p) => sum + p.pendingBalance, 0);
  const totalGroupRevenue = orders.reduce((sum, o) => sum + o.targetSellingPrice, 0);

  // Active member details for Member role
  const currentMember = members.find((m) => m.id === activeMemberId) || members[1];
  const memberPayment = payments.find((p) => p.memberId === currentMember.id);

  // BUYER VIEW
  if (role === 'BUYER') {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-950 p-6 sm:p-8 text-white shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
                {isHindi ? 'सत्यापित खरीदार पोर्टल' : 'Verified Buyer Transparency Portal'}
              </span>
              <h2 className="text-2xl font-bold tracking-tight mt-1">
                FabCraft Handlooms & Exports
              </h2>
              <p className="text-xs text-purple-200 mt-1">
                {isHindi
                  ? 'सखी महिला स्वयं सहायता समूह द्वारा तैयार किए जा रहे बल्क ऑर्डर की वास्तविक ट्रैकिंग'
                  : 'Live verified production telemetry for Order ORD-2026-001'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>{isHindi ? 'प्रमाणित कारीगर उत्पादन' : 'Certified Fair Trade Artisan Batch'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Primary Order Progress Card */}
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-semibold">
                  {primaryOrder.orderNumber}
                </span>
                <span className="text-xs text-stone-500">·</span>
                <span className="text-xs text-stone-500">{primaryOrder.orderDate}</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mt-1">
                {primaryOrder.productName}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">{primaryOrder.description}</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-stone-500 uppercase tracking-wide">
                {isHindi ? 'अनुबंधित मूल्य' : 'Contract Value'}
              </div>
              <div className="text-xl font-bold text-purple-950 font-mono">
                ₹{primaryOrder.targetSellingPrice.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-stone-400 font-mono">
                ₹{primaryOrder.unitSellingPrice.toFixed(2)} / unit
              </div>
            </div>
          </div>

          {/* Progress Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-stone-50 border border-stone-100">
              <div className="text-xs text-stone-500">{isHindi ? 'कुल ऑर्डर' : 'Total Ordered'}</div>
              <div className="text-2xl font-bold text-stone-900 mt-1 font-mono">
                {primaryOrder.totalQuantity} <span className="text-xs font-normal text-stone-500">units</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
              <div className="text-xs text-purple-700">{isHindi ? 'सिलाई पूर्ण' : 'Stitched & Finished'}</div>
              <div className="text-2xl font-bold text-purple-900 mt-1 font-mono">
                {primaryOrder.completedQuantity} <span className="text-xs font-normal text-purple-600">units (60%)</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
              <div className="text-xs text-emerald-700">{isHindi ? 'गुणवत्ता स्वीकृत' : 'Quality Approved'}</div>
              <div className="text-2xl font-bold text-emerald-900 mt-1 font-mono">
                {primaryOrder.approvedQuantity} <span className="text-xs font-normal text-emerald-600">units (55%)</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
              <div className="text-xs text-amber-700">{isHindi ? 'अंतिम सुधार कार्य' : 'Under Final Touchup'}</div>
              <div className="text-2xl font-bold text-amber-900 mt-1 font-mono">
                {primaryOrder.pendingCorrectionQuantity} <span className="text-xs font-normal text-amber-600">units</span>
              </div>
            </div>
          </div>

          {/* Timeline Visualizer */}
          <div className="mt-6 pt-6 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs font-medium text-stone-700 mb-2">
              <span>{isHindi ? 'उत्पादन पूर्ति प्रगति' : 'Production Fulfillment'}</span>
              <span className="font-mono">{primaryOrder.approvedQuantity}% Verified</span>
            </div>
            <div className="h-3 w-full rounded-full bg-stone-100 overflow-hidden flex">
              <div
                className="bg-emerald-600 h-full transition-all"
                style={{ width: `${primaryOrder.approvedQuantity}%` }}
                title="Quality Approved"
              />
              <div
                className="bg-purple-500 h-full transition-all"
                style={{ width: `${primaryOrder.completedQuantity - primaryOrder.approvedQuantity}%` }}
                title="In Finishing Inspection"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2">
              <span>{isHindi ? 'आरंभ: 01 नवंबर' : 'Started: Nov 01, 2026'}</span>
              <span className="font-semibold text-amber-800">
                {isHindi ? 'लक्ष्य डिलीवरी: 11 नवंबर (2 दिन शेष)' : 'Target Delivery: Nov 11, 2026 (2 days)'}
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Visual Lifecycle Stepper & Timestamped Milestones */}
        <OrderTimeline order={primaryOrder} interactive={false} />

        {/* Quality Certificate & Inspection Audit for Buyer */}
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-purple-700" />
              <h3 className="font-semibold text-stone-900 text-sm">
                {isHindi ? 'पारदर्शी गुणवत्ता ऑडिट प्रमाणन' : 'Transparent Quality Audit Report'}
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('reports')}
              className="text-xs text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1"
            >
              <span>{isHindi ? 'डिजिटल प्रमाण पत्र डाउनलोड करें' : 'Download Audit Pass'}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-lg border border-stone-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-stone-700">Primary Quality Inspector:</span>
              <span>Geeta Bai (Quality Lead, Sakhi Mahila SHG)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-stone-700">Inspection Standard:</span>
              <span>5-Point Artisan Textile Check (Reinforcement, Seams, Sizing, Print, Trim)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-stone-700">Pass Rate:</span>
              <span className="font-semibold text-emerald-700 font-mono">91.7% First-Pass Approved</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MEMBER VIEW (Meena Sharma)
  if (role === 'MEMBER') {
    return (
      <div className="space-y-6">
        {/* Member Profile Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-purple-900 to-purple-800 p-6 sm:p-8 text-white shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-amber-400 text-purple-950 font-bold text-xl flex items-center justify-center shadow-md">
                {currentMember.name[0]}
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
                  {isHindi ? 'कारीगर दीदी डैशबोर्ड' : 'Artisan Member Portal'}
                </span>
                <h2 className="text-2xl font-bold tracking-tight">
                  {isHindi ? currentMember.nameHindi : currentMember.name}
                </h2>
                <p className="text-xs text-purple-200 mt-0.5">
                  {isHindi ? currentMember.skillsHindi.join(' · ') : currentMember.skills.join(' · ')}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs text-purple-200">{isHindi ? 'अनुबंधित पारिश्रमिक दर' : 'Agreed Piece Rate'}</div>
              <div className="text-2xl font-bold text-amber-300 font-mono">
                ₹{currentMember.agreedPieceRate} <span className="text-xs font-normal text-white">/ piece</span>
              </div>
            </div>
          </div>
        </div>

        {/* Member Earnings & Workload Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 text-xs">
              <span>{isHindi ? 'आवंटित कार्य' : 'Assigned Units'}</span>
              <ShoppingBag className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-stone-900 mt-2 font-mono">
              25 <span className="text-xs font-normal text-stone-500">bags</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Order: ORD-2026-001</p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 text-xs">
              <span>{isHindi ? 'स्वीकृत कार्य' : 'Quality Approved'}</span>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-700 mt-2 font-mono">
              17 <span className="text-xs font-normal text-emerald-600">units</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">1 bag in touchup correction</p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 text-xs">
              <span>{isHindi ? 'प्राप्त अग्रिम' : 'Disbursed Advance'}</span>
              <CheckCircle2 className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-900 mt-2 font-mono">
              ₹500
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Simulated UPI transfer</p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-5 shadow-xs">
            <div className="flex items-center justify-between text-amber-800 text-xs">
              <span>{isHindi ? 'लंबित शेष पारिश्रमिक' : 'Pending Payment'}</span>
              <IndianRupee className="h-4 w-4 text-amber-700" />
            </div>
            <div className="text-2xl font-bold text-amber-900 mt-2 font-mono">
              ₹690
            </div>
            <p className="text-[11px] text-amber-800 mt-1">Earned ₹1,190 - Paid ₹500</p>
          </div>
        </div>

        {/* Member Action Guide */}
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs">
          <h3 className="text-base font-bold text-stone-900 mb-3">
            {isHindi ? 'आपकी वर्तमान कार्य सूची' : 'My Current Work Assignment'}
          </h3>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-purple-50/70 border border-purple-100 flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm text-purple-950">
                  {isHindi ? '100 कॉटन बैग्स (फैबक्राफ्ट)' : 'Handmade Organic Cotton Bags (FabCraft)'}
                </span>
                <p className="text-xs text-purple-800 mt-0.5">
                  {isHindi
                    ? '18 पूर्ण | 17 स्वीकृत | 1 सुधार हेतु | 7 शेष'
                    : '18 finished | 17 approved | 1 minor trim needed | 7 remaining to stitch'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('quality')}
                className="px-3 py-1.5 rounded-lg bg-purple-900 text-white text-xs font-semibold hover:bg-purple-950 transition-colors"
              >
                {isHindi ? 'निरीक्षण देखें' : 'View Inspection'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LEADER DASHBOARD (Comprehensive)
  return (
    <div className="space-y-6">
      {/* Risk Alert Banner */}
      <RiskBanner />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Members */}
        <div className="rounded-xl border border-stone-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-medium">{t('overview.totalMembers')}</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-bold text-stone-900 font-mono">10</span>
            <span className="text-xs font-semibold text-emerald-600">100% active</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1 truncate">
            {isHindi ? '10 पंजीकृत कारीगर दीदियां' : '10 registered artisan women'}
          </p>
        </div>

        {/* Active Bulk Orders */}
        <div className="rounded-xl border border-stone-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-medium">{t('overview.activeOrders')}</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-bold text-stone-900 font-mono">{activeOrdersCount}</span>
            <span className="text-xs font-semibold text-amber-700">1 high risk</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1 truncate">
            {isHindi ? '350 कुल अनुबंधित पीस' : '350 total contracted units'}
          </p>
        </div>

        {/* Production Completed */}
        <div className="rounded-xl border border-stone-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-medium">{t('overview.productionCompleted')}</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <PackageCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-bold text-emerald-700 font-mono">{totalCompletedUnits}</span>
            <span className="text-xs text-stone-500">/ {totalRequiredUnits} units</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full"
              style={{ width: `${Math.round((totalCompletedUnits / totalRequiredUnits) * 100)}%` }}
            />
          </div>
        </div>

        {/* Pending Member Payments */}
        <div className="rounded-xl border border-stone-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-medium">{t('overview.pendingPayments')}</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-bold text-amber-800 font-mono">
              ₹{pendingMemberPayments.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1 truncate">
            {isHindi ? '55 स्वीकृत पीस पर देय' : 'Payable on 55 approved bags'}
          </p>
        </div>
      </div>

      {/* Main Grid: Orders & Sakhi AI Intelligence Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Orders Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 tracking-tight">
                  {isHindi ? 'सक्रिय बल्क ऑर्डर्स स्थिति' : 'Active Bulk Orders Progress'}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {isHindi ? 'उत्पादन पूर्ति, गुणवत्ता सत्यापन एवं समयसीमा' : 'Production fulfillment, QA verification & delivery deadlines'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1"
              >
                <span>{t('overview.viewAll')}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {orders.slice(0, 2).map((order) => {
                const percentDone = Math.round((order.completedQuantity / order.totalQuantity) * 100);
                const percentApproved = Math.round((order.approvedQuantity / order.totalQuantity) * 100);

                return (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl border border-stone-200 hover:border-purple-300 transition-colors bg-stone-50/50"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        {order.imageUrl && (
                          <img
                            src={order.imageUrl}
                            alt={order.productName}
                            referrerPolicy="no-referrer"
                            className="h-12 w-12 rounded-lg object-cover border border-stone-200"
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-mono text-purple-900">
                              {order.orderNumber}
                            </span>
                            <span className="text-stone-300">·</span>
                            <span className="text-xs text-stone-600 font-medium">{order.buyerOrganization}</span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                order.riskLevel === 'HIGH'
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-emerald-100 text-emerald-900'
                              }`}
                            >
                              {order.riskLevel} RISK
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-stone-900 mt-0.5">
                            {order.productName}
                          </h4>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-sm font-bold text-stone-900 font-mono">
                          {order.completedQuantity} / {order.totalQuantity}
                        </span>
                        <div className="text-xs text-amber-800 font-medium">
                          {order.daysRemaining} days left ({order.deadlineDate})
                        </div>
                      </div>
                    </div>

                    {/* Multi-segment progress bar */}
                    <div className="mt-3">
                      <div className="h-2 w-full rounded-full bg-stone-200 overflow-hidden flex">
                        <div
                          className="bg-emerald-600 h-full"
                          style={{ width: `${percentApproved}%` }}
                          title={`Approved: ${order.approvedQuantity}`}
                        />
                        <div
                          className="bg-purple-500 h-full"
                          style={{ width: `${percentDone - percentApproved}%` }}
                          title={`Awaiting QA: ${order.completedQuantity - order.approvedQuantity}`}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1.5">
                        <span className="text-emerald-700 font-medium">
                          {order.approvedQuantity} approved ({percentApproved}%)
                        </span>
                        <span className="text-amber-800 font-medium">
                          {order.totalQuantity - order.completedQuantity} remaining
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Operations Activity Log */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs">
            <h3 className="text-base font-bold text-stone-900 mb-3 tracking-tight">
              {t('overview.recentActivities')}
            </h3>
            <div className="divide-y divide-stone-100 text-xs">
              {auditLogs.slice(0, 4).map((log, idx) => (
                <div key={`${log.id || 'log'}-${idx}`} className="py-2.5 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900">{log.action}</span>
                      <span className="text-stone-400">·</span>
                      <span className="text-stone-500">{log.actor}</span>
                    </div>
                    <p className="text-stone-600 mt-0.5">{log.details}</p>
                  </div>
                  <span className="text-stone-400 shrink-0 font-mono text-[11px]">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Sakhi AI Operational Companion */}
        <div className="space-y-6">
          <div className="rounded-xl border border-purple-200 bg-gradient-to-b from-purple-50/80 to-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-900 text-amber-300">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-purple-950">Sakhi AI Copilot</h3>
                  <p className="text-[11px] text-purple-700">Autonomous Operational Intelligence</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800">
                ACTIVE
              </span>
            </div>

            <div className="mt-4 text-xs text-stone-700 leading-relaxed bg-white/90 p-4 rounded-lg border border-purple-100 shadow-2xs">
              <p className="font-semibold text-purple-950 mb-1">
                {isHindi ? 'ऑपरेशनल अंतर्दृष्टि' : 'Key Operational Insight'}:
              </p>
              <p>
                {isHindi
                  ? 'ऑर्डर ORD-2026-001 में 40 बैग्स 48 घंटों में तैयार करने हैं। 4 दीदियों (मीना, राधा, रेखा, अनीता) के पास 23 पीस/दिन की क्षमता उपलब्ध है। तुरंत पुनर्वितरण सुरक्षित है।'
                  : 'Order ORD-2026-001 faces a run-rate deficit (20 units/day required vs 12 current). 4 artisans have unutilized spare capacity. One-click redistribution will de-risk delivery.'}
              </p>
            </div>

            {/* Quick Agent Actions */}
            <div className="mt-4 space-y-2">
              <button
                onClick={() => {
                  setActiveTab('allocation');
                  sendAgentMessage('Distribute remaining work fairly among available members.', 'WORK_ALLOCATION_AGENT');
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-purple-900 text-white text-xs font-semibold hover:bg-purple-950 transition-colors"
              >
                <span>{isHindi ? 'कार्य का निष्पक्ष पुनर्वितरण करें' : 'Redistribute Remaining Work'}</span>
                <ChevronRight className="h-4 w-4 text-amber-300" />
              </button>

              <button
                onClick={() => {
                  setActiveTab('pricing');
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-xs font-medium transition-colors"
              >
                <span>{isHindi ? 'लागत व मूल्य कैलकुलेटर' : 'Recalculate Batch Costing'}</span>
                <ChevronRight className="h-4 w-4 text-stone-400" />
              </button>

              <button
                onClick={() => {
                  setActiveTab('payments');
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-xs font-medium transition-colors"
              >
                <span>{isHindi ? 'स्वीकृत भुगतान जारी करें' : 'Review Approved Payments'}</span>
                <ChevronRight className="h-4 w-4 text-stone-400" />
              </button>
            </div>
          </div>

          {/* Quick SHG Profile Card */}
          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
            <h4 className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-3">
              {isHindi ? 'समूह विवरण' : 'SHG Organization Profile'}
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">{isHindi ? 'समूह का नाम' : 'Group Name'}</span>
                <span className="font-semibold text-stone-900">Sakhi Mahila SHG</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">{isHindi ? 'अध्यक्ष' : 'President'}</span>
                <span className="font-semibold text-stone-900">Smt. Sunita Devi</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">{isHindi ? 'पंजीकरण' : 'Cluster'}</span>
                <span className="font-semibold text-stone-900">Wardha Craft Hub</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-500">{isHindi ? 'कुल कारीगर' : 'Active Artisans'}</span>
                <span className="font-semibold text-emerald-700 font-mono">10 Empowered Women</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
