import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  QrCode,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
  ExternalLink,
  X,
  ScanLine,
  History,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderItem, OrderStatus } from '../../types';
import { OrderQRModal } from '../common/OrderQRModal';
import { OrderTimeline } from '../common/OrderTimeline';

export const OrdersModule: React.FC = () => {
  const { orders, createOrder, updateOrderStatus, language, t, role, setActiveTab, sendAgentMessage, openScanner } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOrderForQr, setSelectedOrderForQr] = useState<OrderItem | null>(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<OrderItem | null>(null);
  const [detailTab, setDetailTab] = useState<'DETAILS' | 'TIMELINE'>('TIMELINE');

  const isHindi = language === 'hi';

  // New order form state
  const [newOrder, setNewOrder] = useState({
    buyerName: '',
    buyerOrganization: '',
    buyerContact: '',
    productName: '',
    productCategory: 'Textiles',
    description: '',
    totalQuantity: 100,
    unitCost: 90,
    profitMarginPercent: 20,
    deadlineDate: '2026-11-28',
  });

  const statuses: OrderStatus[] = [
    'New',
    'Approved',
    'In Production',
    'Quality Inspection',
    'Completed',
    'Dispatched',
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyerOrganization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.productName || !newOrder.buyerOrganization) return;
    createOrder(newOrder);
    setIsCreateModalOpen(false);
    setNewOrder({
      buyerName: '',
      buyerOrganization: '',
      buyerContact: '',
      productName: '',
      productCategory: 'Textiles',
      description: '',
      totalQuantity: 100,
      unitCost: 90,
      profitMarginPercent: 20,
      deadlineDate: '2026-11-28',
    });
  };

  return (
    <div className="space-y-6">
      {/* Module Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">{t('orders.title')}</h2>
          <p className="text-xs text-stone-500 mt-0.5">{t('orders.subtitle')}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openScanner()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-950 text-xs font-semibold transition-colors shadow-2xs"
            title="Open Optical QR Scanner to quickly update production statuses"
          >
            <ScanLine className="h-4 w-4 text-purple-700" />
            <span>Scan Batch QR</span>
          </button>

          {role === 'LEADER' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-900 text-white text-xs font-semibold hover:bg-purple-950 transition-colors shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>{t('orders.createNew')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-xl border border-stone-200">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder={t('orders.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-stone-200 focus:outline-hidden focus:border-purple-600 bg-stone-50/50"
          />
        </div>

        {/* Status segmented controls */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {t('orders.filterAll')} ({orders.length})
          </button>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-stone-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">{t('orders.orderId')}</th>
                <th className="px-5 py-3.5">{t('orders.buyer')}</th>
                <th className="px-5 py-3.5">{t('orders.product')}</th>
                <th className="px-5 py-3.5 text-right">{t('orders.quantity')}</th>
                <th className="px-5 py-3.5">{t('orders.progress')}</th>
                <th className="px-5 py-3.5">{t('orders.deadline')}</th>
                <th className="px-5 py-3.5">{t('orders.status')}</th>
                <th className="px-5 py-3.5 text-right">{t('orders.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-stone-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const percentDone = Math.round((order.completedQuantity / order.totalQuantity) * 100);

                  return (
                    <tr key={order.id} className="hover:bg-purple-50/20 transition-colors">
                      {/* Order ID & Risk */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-stone-900">{order.orderNumber}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                              order.riskLevel === 'HIGH'
                                ? 'bg-amber-100 text-amber-900'
                                : order.riskLevel === 'MEDIUM'
                                ? 'bg-yellow-100 text-yellow-900'
                                : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            {order.riskLevel} RISK
                          </span>
                        </div>
                      </td>

                      {/* Buyer */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-stone-900">{order.buyerOrganization}</div>
                        <div className="text-[11px] text-stone-400">{order.buyerName}</div>
                      </td>

                      {/* Product */}
                      <td className="px-5 py-4">
                        <div className="font-medium text-stone-900">{order.productName}</div>
                        <div className="text-[11px] text-stone-400">{order.productCategory}</div>
                      </td>

                      {/* Qty & Price */}
                      <td className="px-5 py-4 text-right whitespace-nowrap font-mono">
                        <div className="font-bold text-stone-900">{order.totalQuantity} pcs</div>
                        <div className="text-[11px] text-stone-500">₹{order.targetSellingPrice.toLocaleString('en-IN')}</div>
                      </td>

                      {/* Progress */}
                      <td className="px-5 py-4 min-w-[140px]">
                        <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                          <span className="text-emerald-700 font-semibold">{order.approvedQuantity} QA</span>
                          <span className="text-stone-500">{percentDone}% done</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
                          <div
                            className="h-full bg-purple-700 rounded-full"
                            style={{ width: `${percentDone}%` }}
                          />
                        </div>
                      </td>

                      {/* Deadline */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-mono text-stone-900">{order.deadlineDate}</div>
                        <div className={`text-[11px] font-semibold ${order.daysRemaining <= 3 ? 'text-amber-800' : 'text-stone-500'}`}>
                          {order.daysRemaining} days left
                        </div>
                      </td>

                      {/* Status Selector */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {role === 'LEADER' ? (
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="text-xs font-semibold rounded-md border border-stone-300 bg-white py-1 px-2 text-stone-800 focus:outline-hidden focus:border-purple-600"
                          >
                            {statuses.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-stone-100 text-stone-800">
                            {order.status}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrderForQr(order)}
                            className="p-1.5 rounded-lg text-stone-600 hover:text-purple-900 hover:bg-stone-100"
                            title="View QR Digital Passport"
                          >
                            <QrCode className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedOrderDetail(order);
                              setDetailTab('TIMELINE');
                            }}
                            className="p-1.5 rounded-lg text-purple-700 hover:text-purple-900 hover:bg-purple-50"
                            title="View Order Timeline & Status Changes"
                          >
                            <History className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedOrderDetail(order);
                              setDetailTab('DETAILS');
                            }}
                            className="p-1.5 rounded-lg text-stone-600 hover:text-purple-900 hover:bg-stone-100"
                            title="View Full Breakdown"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE ORDER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                {isHindi ? 'नया बल्क ऑर्डर पंजीकृत करें' : 'Register New Bulk Order'}
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Buyer Organization</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FabCraft Exports"
                    value={newOrder.buyerOrganization}
                    onChange={(e) => setNewOrder({ ...newOrder, buyerOrganization: e.target.value })}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs focus:outline-hidden focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Buyer Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Chandra"
                    value={newOrder.buyerName}
                    onChange={(e) => setNewOrder({ ...newOrder, buyerName: e.target.value })}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs focus:outline-hidden focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Handloom Canvas Shopping Bags"
                    value={newOrder.productName}
                    onChange={(e) => setNewOrder({ ...newOrder, productName: e.target.value })}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs focus:outline-hidden focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Category</label>
                  <select
                    value={newOrder.productCategory}
                    onChange={(e) => setNewOrder({ ...newOrder, productCategory: e.target.value })}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs focus:outline-hidden focus:border-purple-600 bg-white"
                  >
                    <option value="Eco Bags">Eco Bags & Totes</option>
                    <option value="Festive Packaging">Festive Pouches & Packaging</option>
                    <option value="Apparel & Aprons">Apparel & Aprons</option>
                    <option value="Handicrafts">Handicrafts & Decor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Order Quantity (Pcs)</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={newOrder.totalQuantity}
                    onChange={(e) => setNewOrder({ ...newOrder, totalQuantity: Number(e.target.value) })}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs font-mono focus:outline-hidden focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Estimated Unit Cost (₹)</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={newOrder.unitCost}
                    onChange={(e) => setNewOrder({ ...newOrder, unitCost: Number(e.target.value) })}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs font-mono focus:outline-hidden focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Target Margin (%)</label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    required
                    value={newOrder.profitMarginPercent}
                    onChange={(e) => setNewOrder({ ...newOrder, profitMarginPercent: Number(e.target.value) })}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs font-mono focus:outline-hidden focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Delivery Deadline</label>
                <input
                  type="date"
                  required
                  value={newOrder.deadlineDate}
                  onChange={(e) => setNewOrder({ ...newOrder, deadlineDate: e.target.value })}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs font-mono focus:outline-hidden focus:border-purple-600"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-900 text-white font-semibold hover:bg-purple-950 shadow-xs"
                >
                  Create & Launch Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GENUINE SCANNABLE QR PASSPORT MODAL */}
      {selectedOrderForQr && (
        <OrderQRModal
          order={selectedOrderForQr}
          onClose={() => setSelectedOrderForQr(null)}
        />
      )}

      {/* ORDER DETAILS & VISUAL TIMELINE MODAL */}
      {selectedOrderDetail && (() => {
        const currentLiveOrder = orders.find((o) => o.id === selectedOrderDetail.id) || selectedOrderDetail;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="flex items-start justify-between px-6 py-4 border-b border-stone-100 bg-stone-50">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded font-bold">
                      {currentLiveOrder.orderNumber}
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="text-xs text-stone-600 font-medium">
                      {currentLiveOrder.buyerOrganization}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        currentLiveOrder.riskLevel === 'HIGH'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {currentLiveOrder.riskLevel} RISK
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-mono">
                      {currentLiveOrder.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 mt-1">
                    {currentLiveOrder.productName}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedOrderForQr(currentLiveOrder)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border border-purple-200 bg-white text-purple-900 hover:bg-purple-50 transition-colors shadow-2xs"
                    title="View QR Digital Passport"
                  >
                    <QrCode className="h-3.5 w-3.5 text-purple-700" />
                    <span className="hidden sm:inline">QR Passport</span>
                  </button>

                  <button
                    onClick={() => setSelectedOrderDetail(null)}
                    className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Tab navigation: Visual Timeline vs Details Breakdown */}
              <div className="flex border-b border-stone-200 bg-white px-6 pt-2 text-xs">
                <button
                  onClick={() => setDetailTab('TIMELINE')}
                  className={`pb-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                    detailTab === 'TIMELINE'
                      ? 'border-purple-900 text-purple-950 font-bold'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <History className="h-3.5 w-3.5" />
                  <span>{isHindi ? 'लाइफसाइकिल टाइमलाइन एवं टाइमस्टैम्प' : 'Visual Order Timeline & Date Stamps'}</span>
                </button>

                <button
                  onClick={() => setDetailTab('DETAILS')}
                  className={`pb-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                    detailTab === 'DETAILS'
                      ? 'border-purple-900 text-purple-950 font-bold'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>{isHindi ? 'व्यावसायिक एवं वित्तीय विवरण' : 'Commercial & Financial Specs'}</span>
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {detailTab === 'TIMELINE' ? (
                  <OrderTimeline
                    order={currentLiveOrder}
                    interactive={role === 'LEADER'}
                    showEventHistory={true}
                  />
                ) : (
                  <div className="space-y-5 text-xs">
                    {/* Compact timeline stepper above specs */}
                    <OrderTimeline
                      order={currentLiveOrder}
                      interactive={false}
                      showEventHistory={false}
                      compact={true}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                        <div className="font-bold text-stone-900 uppercase text-[11px] text-purple-950">
                          Buyer & Contract Info
                        </div>
                        <div className="flex justify-between py-1 border-b border-stone-200">
                          <span className="text-stone-500">Buyer Entity</span>
                          <span className="font-semibold text-stone-900">{currentLiveOrder.buyerOrganization}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-stone-200">
                          <span className="text-stone-500">Contact Person</span>
                          <span className="text-stone-800">{currentLiveOrder.buyerName}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-stone-500">Contact</span>
                          <span className="font-mono text-stone-700">{currentLiveOrder.buyerContact}</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                        <div className="font-bold text-stone-900 uppercase text-[11px] text-purple-950">
                          Financial & Costing
                        </div>
                        <div className="flex justify-between py-1 border-b border-stone-200">
                          <span className="text-stone-500">Batch Quantity</span>
                          <span className="font-bold font-mono text-stone-900">{currentLiveOrder.totalQuantity} pcs</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-stone-200">
                          <span className="text-stone-500">Production Cost</span>
                          <span className="font-mono text-stone-900">₹{currentLiveOrder.totalCost.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-stone-200">
                          <span className="text-stone-500">Selling Price</span>
                          <span className="font-bold font-mono text-purple-900">₹{currentLiveOrder.targetSellingPrice.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-stone-500">Profit Margin</span>
                          <span className="font-bold font-mono text-emerald-700">{currentLiveOrder.profitMarginPercent}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-stone-200 bg-white">
                      <div className="font-semibold text-stone-800 mb-1">Product Description</div>
                      <p className="text-stone-600 leading-relaxed text-[11px]">
                        {currentLiveOrder.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3.5 border-t border-stone-100 bg-stone-50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedOrderDetail(null);
                      setActiveTab('allocation');
                    }}
                    className="text-xs font-semibold text-purple-900 hover:underline flex items-center gap-1"
                  >
                    <span>{isHindi ? 'कारीगर कार्य आवंटन देखें' : 'View Work Allocations'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedOrderDetail(null);
                      setActiveTab('quality');
                    }}
                    className="text-xs font-semibold text-purple-900 hover:underline flex items-center gap-1"
                  >
                    <span>{isHindi ? 'गुणवत्ता जांच देखें' : 'Quality Management'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => setSelectedOrderDetail(null)}
                  className="px-4 py-1.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
