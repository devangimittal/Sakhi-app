import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Download,
  Printer,
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ScanLine,
  PackageCheck,
  Tag,
} from 'lucide-react';
import { OrderItem } from '../../types';
import { useApp } from '../../context/AppContext';

interface OrderQRModalProps {
  order: OrderItem;
  onClose: () => void;
}

export const OrderQRModal: React.FC<OrderQRModalProps> = ({ order, onClose }) => {
  const { openScanner, language } = useApp();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const isHindi = language === 'hi';

  // Construct structured payload for the QR code
  const qrPayload = JSON.stringify({
    app: 'SakhiSetu AI',
    type: 'ORDER_PASSPORT',
    orderId: order.id,
    orderNumber: order.orderNumber,
    buyer: order.buyerOrganization,
    product: order.productName,
    quantity: order.totalQuantity,
    status: order.status,
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    QRCode.toDataURL(qrPayload, {
      width: 320,
      margin: 2,
      color: {
        dark: '#2A0845', // Deep purple brand color
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR code:', err));
  }, [qrPayload]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR_Passport_${order.orderNumber}.png`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenInScanner = () => {
    onClose();
    openScanner(order.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-900">
              <QrCode className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-stone-900">
                {isHindi ? 'डिजिटल QR बैच पासपोर्ट' : 'Digital QR Batch Passport'}
              </h3>
              <p className="text-[11px] text-stone-400 font-mono">{order.orderNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Printable Physical Batch Tag Preview */}
        <div className="my-4 p-5 rounded-2xl border-2 border-dashed border-purple-200 bg-stone-50/70 text-center flex flex-col items-center">
          <div className="flex items-center gap-2 text-[11px] font-bold text-purple-900 uppercase tracking-wider mb-2">
            <Tag className="h-3.5 w-3.5 text-amber-500" />
            <span>Sakhi Mahila SHG · Wardha Craft Hub</span>
          </div>

          {/* Genuine Rendered QR Code */}
          <div className="p-3 bg-white rounded-xl shadow-xs border border-stone-200 inline-block my-2">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR code for ${order.orderNumber}`}
                className="w-48 h-48 rounded-lg object-contain"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-xs text-stone-400 font-mono">
                Generating QR...
              </div>
            )}
          </div>

          <div className="mt-2">
            <h4 className="font-bold text-sm text-stone-900">{order.productName}</h4>
            <div className="text-xs text-stone-600 mt-0.5">
              <span>{order.buyerOrganization}</span> · <span className="font-bold font-mono text-purple-900">{order.totalQuantity} pcs</span>
            </div>
          </div>

          {/* Current Status Pill */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold bg-purple-100 text-purple-900 border border-purple-200">
              Stage: {order.status}
            </span>
            <span className="text-[11px] text-stone-500 font-mono">
              {order.completedQuantity}/{order.totalQuantity} completed
            </span>
          </div>

          <p className="text-[10px] text-stone-400 mt-3 max-w-xs leading-relaxed">
            Scan this tag at cutting, stitching, inspection, or dispatch stations to update order telemetry instantly.
          </p>
        </div>

        {/* Action Controls */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <button
            onClick={handleOpenInScanner}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-900 text-white font-semibold text-xs hover:bg-purple-950 transition-colors shadow-xs"
          >
            <ScanLine className="h-4 w-4 text-amber-300" />
            <span>{isHindi ? 'त्वरित क्यूआर स्कैनर में खोलें' : 'Open in Quick QR Scanner'}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-stone-200 bg-white text-stone-700 font-medium text-xs hover:bg-stone-50"
            >
              <Download className="h-3.5 w-3.5 text-stone-500" />
              <span>Download PNG</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-stone-200 bg-white text-stone-700 font-medium text-xs hover:bg-stone-50"
            >
              <Printer className="h-3.5 w-3.5 text-stone-500" />
              <span>Print Batch Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
