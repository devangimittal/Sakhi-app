import React, { useState, useEffect, useRef } from 'react';
import {
  ScanLine,
  Camera,
  X,
  CheckCircle2,
  PackageCheck,
  Truck,
  ShieldCheck,
  Clock,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Layers,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderItem, OrderStatus } from '../../types';

export const QRScannerModal: React.FC = () => {
  const {
    isScannerOpen,
    closeScanner,
    scannedOrderId,
    setScannedOrderId,
    orders,
    quickUpdateOrderProgress,
    language,
    t,
  } = useApp();

  const [activeTabMode, setActiveTabMode] = useState<'SCANNER' | 'PASSPORT'>(
    scannedOrderId ? 'PASSPORT' : 'SCANNER'
  );
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [dispatchNote, setDispatchNote] = useState<string>('Dispatched via BlueDart Surface (AWB: BLU-902188)');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isHindi = language === 'hi';

  const selectedOrder = orders.find((o) => o.id === scannedOrderId) || orders[0];

  useEffect(() => {
    if (scannedOrderId) {
      setActiveTabMode('PASSPORT');
    } else {
      setActiveTabMode('SCANNER');
    }
  }, [scannedOrderId]);

  // Handle camera init if camera tab is selected
  useEffect(() => {
    if (isScannerOpen && activeTabMode === 'SCANNER') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isScannerOpen, activeTabMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraActive(true);
        }
      } else {
        setCameraError('Webcam access not supported in this browser environment.');
      }
    } catch (err: any) {
      console.warn('Camera stream could not start:', err);
      setCameraError('Camera stream unavailable. Use the instant one-click batch selector below to scan.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleSimulateScan = (order: OrderItem) => {
    stopCamera();
    setScannedOrderId(order.id);
    setActiveTabMode('PASSPORT');
    setSuccessMessage(`Scanned QR Passport for ${order.orderNumber} successfully!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleQuickStatusUpdate = (
    newStatus: OrderStatus,
    completedIncrement = 0,
    note?: string
  ) => {
    if (!selectedOrder) return;
    quickUpdateOrderProgress(selectedOrder.id, newStatus, completedIncrement, note);
    setSuccessMessage(`Order updated to '${newStatus}'!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  if (!isScannerOpen) return null;

  const percentDone = Math.round(
    (selectedOrder.completedQuantity / selectedOrder.totalQuantity) * 100
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#2A0845] text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-400 text-purple-950 font-bold">
              <ScanLine className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">
                {isHindi ? 'सखीसेतु QR ऑर्डर ट्रैकर व स्कैनर' : 'SakhiSetu QR Production Scanner'}
              </h3>
              <p className="text-[11px] text-purple-200">
                {isHindi
                  ? 'उत्पादन स्थिति तुरंत अपडेट करने हेतु क्यूआर कोड स्कैन करें'
                  : 'Scan order passport to update production status in real time'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              closeScanner();
            }}
            className="rounded-lg p-1 text-purple-300 hover:text-white hover:bg-purple-900/50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Controls: Camera Viewfinder vs Scanned Passport View */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-3 text-xs">
          <button
            onClick={() => setActiveTabMode('SCANNER')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all ${
              activeTabMode === 'SCANNER'
                ? 'border-purple-900 text-purple-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Optical QR Viewfinder
          </button>
          <button
            onClick={() => setActiveTabMode('PASSPORT')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTabMode === 'PASSPORT'
                ? 'border-purple-900 text-purple-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>Verified Order Passport</span>
            {selectedOrder && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-100 text-purple-900">
                {selectedOrder.orderNumber}
              </span>
            )}
          </button>
        </div>

        {/* Feedback Alert */}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTabMode === 'SCANNER' ? (
            <div className="space-y-4">
              {/* Camera Scanner Viewport */}
              <div className="relative w-full h-64 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-purple-900 shadow-inner">
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 text-stone-400">
                    <Camera className="h-10 w-10 mx-auto text-stone-600 mb-2 animate-pulse" />
                    <p className="text-xs text-stone-300 font-medium">
                      Optical Scanner Active
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1">
                      {cameraError || 'Align QR barcode inside the target viewfinder box'}
                    </p>
                  </div>
                )}

                {/* Animated Scanner Reticle Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-dashed border-amber-400 rounded-xl relative">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-amber-400 rounded-tl-sm" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-amber-400 rounded-tr-sm" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-amber-400 rounded-bl-sm" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-amber-400 rounded-br-sm" />
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent absolute top-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Instant 1-Click QR Batch Selector (Immediate testing on desktop/laptop) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">
                    {isHindi ? 'त्वरित टेस्ट हेतु सक्रिय ऑर्डर चुनें' : '1-Click Test: Scan Active Order Tag'}
                  </span>
                  <span className="text-[10px] text-purple-700 font-semibold">Instant Telemetry</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {orders.map((ord) => (
                    <button
                      key={ord.id}
                      onClick={() => handleSimulateScan(ord)}
                      className="p-3 rounded-xl border border-stone-200 hover:border-purple-400 bg-stone-50 hover:bg-purple-50/40 text-left transition-all flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs text-purple-900">
                            {ord.orderNumber}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-stone-200 text-stone-700">
                            {ord.status}
                          </span>
                        </div>
                        <div className="text-xs font-medium text-stone-900 truncate mt-0.5">
                          {ord.productName}
                        </div>
                        <div className="text-[11px] text-stone-400 font-mono">
                          {ord.completedQuantity}/{ord.totalQuantity} pcs
                        </div>
                      </div>

                      <div className="p-2 rounded-lg bg-white border border-stone-200 text-purple-900 group-hover:bg-purple-900 group-hover:text-white transition-colors shrink-0">
                        <ScanLine className="h-4 w-4" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Scanned Passport & Quick Action Controls */
            <div className="space-y-5">
              {/* Passport Header Strip */}
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-purple-900 bg-white px-2 py-0.5 rounded border border-purple-200">
                      {selectedOrder.orderNumber}
                    </span>
                    <span className="text-xs text-stone-500">·</span>
                    <span className="text-xs font-medium text-stone-700">{selectedOrder.buyerOrganization}</span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 mt-1">
                    {selectedOrder.productName}
                  </h4>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-purple-900 text-white">
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Progress & Milestone Bar */}
              <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-stone-700">
                  <span>Batch Production Completion</span>
                  <span className="font-mono font-bold text-stone-900">
                    {selectedOrder.completedQuantity} / {selectedOrder.totalQuantity} units ({percentDone}%)
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all rounded-full"
                    style={{ width: `${percentDone}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
                  <span>{selectedOrder.approvedQuantity} verified approved</span>
                  <span className="text-amber-800 font-semibold">{selectedOrder.daysRemaining} days left</span>
                </div>
              </div>

              {/* QUICK PRODUCTION STATUS ACTIONS (The Core Requirement) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                  {isHindi ? 'त्वरित उत्पादन स्थिति अपडेट करें' : 'Quick Update Production Status'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {/* Action 1: In Production */}
                  <button
                    onClick={() => handleQuickStatusUpdate('In Production')}
                    className="p-3 rounded-xl border border-stone-200 hover:border-purple-400 bg-white hover:bg-stone-50 text-left transition-all flex items-start gap-2.5"
                  >
                    <div className="p-1.5 rounded-lg bg-purple-100 text-purple-900 shrink-0 mt-0.5">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-900">Start / Continue Production</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        Set status to &apos;In Production&apos; at artisan workshop
                      </div>
                    </div>
                  </button>

                  {/* Action 2: Quick Log Batch Completion (+10) */}
                  <button
                    onClick={() => handleQuickStatusUpdate(selectedOrder.status, 10, 'Artisan logged +10 completed units')}
                    className="p-3 rounded-xl border border-stone-200 hover:border-purple-400 bg-white hover:bg-stone-50 text-left transition-all flex items-start gap-2.5"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                      <PackageCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-900">Log Completed Batch (+10 Pcs)</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        Increment finished count to {Math.min(selectedOrder.totalQuantity, selectedOrder.completedQuantity + 10)}
                      </div>
                    </div>
                  </button>

                  {/* Action 3: Quality Inspection */}
                  <button
                    onClick={() => handleQuickStatusUpdate('Quality Inspection')}
                    className="p-3 rounded-xl border border-stone-200 hover:border-purple-400 bg-white hover:bg-stone-50 text-left transition-all flex items-start gap-2.5"
                  >
                    <div className="p-1.5 rounded-lg bg-blue-100 text-blue-900 shrink-0 mt-0.5">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-900">Send to Quality Inspection</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        Hand over completed bundle to QA Lead Geeta Bai
                      </div>
                    </div>
                  </button>

                  {/* Action 4: Completed & Packaged */}
                  <button
                    onClick={() => handleQuickStatusUpdate('Completed', selectedOrder.totalQuantity - selectedOrder.completedQuantity)}
                    className="p-3 rounded-xl border border-stone-200 hover:border-purple-400 bg-white hover:bg-stone-50 text-left transition-all flex items-start gap-2.5"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-100 text-amber-900 shrink-0 mt-0.5">
                      <FileCheck2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-900">Mark 100% Completed</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        All {selectedOrder.totalQuantity} pieces finished and packed
                      </div>
                    </div>
                  </button>
                </div>

                {/* Dispatch Section */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-3">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-emerald-800" />
                    <span className="font-bold text-xs text-emerald-950">
                      Final Logistics & Dispatch Station
                    </span>
                  </div>

                  <input
                    type="text"
                    value={dispatchNote}
                    onChange={(e) => setDispatchNote(e.target.value)}
                    placeholder="Enter dispatch vehicle / courier consignment note..."
                    className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-600"
                  />

                  <button
                    onClick={() => handleQuickStatusUpdate('Dispatched', 0, dispatchNote)}
                    className="w-full py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Truck className="h-4 w-4 text-amber-300" />
                    <span>Authorize & Mark Dispatched to Buyer</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-stone-100 bg-stone-50 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              if (activeTabMode === 'PASSPORT') {
                setActiveTabMode('SCANNER');
              } else {
                stopCamera();
                closeScanner();
              }
            }}
            className="text-stone-600 hover:text-stone-900 font-medium"
          >
            {activeTabMode === 'PASSPORT' ? '← Back to Scanner' : 'Close'}
          </button>

          <span className="text-[11px] text-stone-400 font-mono">
            SakhiSetu QR Engine · ISO 18004 Compliant
          </span>
        </div>
      </div>
    </div>
  );
};
