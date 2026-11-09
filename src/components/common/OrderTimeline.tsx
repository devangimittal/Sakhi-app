import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  Truck,
  Sparkles,
  Calendar,
  FileCheck2,
  ChevronRight,
  MessageSquare,
  Check,
  Send,
} from 'lucide-react';
import { OrderItem, OrderStatus, OrderTimelineEvent } from '../../types';
import { useApp } from '../../context/AppContext';

export interface OrderTimelineProps {
  order: OrderItem;
  interactive?: boolean;
  compact?: boolean;
  showEventHistory?: boolean;
  onStatusChange?: (newStatus: OrderStatus, notes?: string) => void;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({
  order,
  interactive = true,
  compact = false,
  showEventHistory = true,
  onStatusChange,
}) => {
  const { updateOrderStatus, role, language } = useApp();
  const isHindi = language === 'hi';

  const [transitionNote, setTransitionNote] = useState('');
  const [selectedNextStage, setSelectedNextStage] = useState<OrderStatus | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const stages: {
    key: OrderStatus;
    label: string;
    labelHindi: string;
    desc: string;
    descHindi: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      key: 'New',
      label: 'New Order',
      labelHindi: 'नया ऑर्डर',
      desc: 'Registered by buyer',
      descHindi: 'खरीदार द्वारा दर्ज',
      icon: Clock,
    },
    {
      key: 'Approved',
      label: 'Approved',
      labelHindi: 'स्वीकृत',
      desc: 'Costing & sample confirmed',
      descHindi: 'लागत व नमूना स्वीकृत',
      icon: FileCheck2,
    },
    {
      key: 'In Production',
      label: 'In Production',
      labelHindi: 'उत्पादन में',
      desc: 'Work allocated & sewing active',
      descHindi: 'सिलाई व निर्माण कार्य जारी',
      icon: Sparkles,
    },
    {
      key: 'Quality Inspection',
      label: 'Quality Inspection',
      labelHindi: 'गुणवत्ता जांच',
      desc: 'Physical 5-point QA audit',
      descHindi: 'मानक गुणवत्ता परीक्षण',
      icon: ShieldCheck,
    },
    {
      key: 'Completed',
      label: 'Completed',
      labelHindi: 'पूर्ण',
      desc: '100% units finished & packed',
      descHindi: '100% माल तैयार व पैक',
      icon: PackageCheck,
    },
    {
      key: 'Dispatched',
      label: 'Dispatched',
      labelHindi: 'प्रेषित (डिस्पैच)',
      desc: 'Shipped to buyer destination',
      descHindi: 'खरीदार को रवाना',
      icon: Truck,
    },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === order.status);
  const timelineEvents: OrderTimelineEvent[] = order.timeline || [
    {
      id: 'TL-init',
      status: order.status,
      timestamp: order.orderDate,
      actor: 'System',
      notes: 'Initial registration',
      completedSoFar: order.completedQuantity,
    },
  ];

  // Helper to find the recorded event for a specific stage
  const getEventForStage = (stageKey: OrderStatus) => {
    return timelineEvents.find((e) => e.status === stageKey);
  };

  const handleAdvanceStage = () => {
    if (currentStageIndex < stages.length - 1) {
      const nextStage = stages[currentStageIndex + 1].key;
      setSelectedNextStage(nextStage);
      setIsTransitioning(true);
    }
  };

  const confirmTransition = (targetStage: OrderStatus) => {
    if (onStatusChange) {
      onStatusChange(targetStage, transitionNote || undefined);
    } else {
      updateOrderStatus(order.id, targetStage);
    }
    setTransitionNote('');
    setIsTransitioning(false);
    setSelectedNextStage(null);
  };

  // Percent complete based on completedQuantity
  const completionPercent = order.totalQuantity > 0
    ? Math.round((order.completedQuantity / order.totalQuantity) * 100)
    : 0;

  return (
    <div className="space-y-5">
      {/* Visual Pipeline Horizontal Stepper Card */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-stone-900 tracking-tight">
                {isHindi ? 'ऑर्डर लाइफसाइकिल टाइमलाइन' : 'Order Lifecycle Pipeline'}
              </h4>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-mono">
                {order.status}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {isHindi
                ? `उत्पादन प्रगति: ${order.completedQuantity}/${order.totalQuantity} पीस पूर्ण (${completionPercent}%)`
                : `Production Progress: ${order.completedQuantity}/${order.totalQuantity} units finished (${completionPercent}%)`}
            </p>
          </div>

          {interactive && role === 'LEADER' && currentStageIndex < stages.length - 1 && (
            <button
              onClick={handleAdvanceStage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900 text-white text-xs font-semibold hover:bg-purple-950 transition-colors shadow-xs shrink-0"
            >
              <span>
                {isHindi ? 'अगले चरण पर जाएं:' : 'Advance to:'} &apos;{stages[currentStageIndex + 1].label}&apos;
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 rounded-full h-1.5 mb-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-700 to-emerald-600 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(5, (currentStageIndex / (stages.length - 1)) * 100))}%` }}
          />
        </div>

        {/* Stepper Grid */}
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 pt-1 pb-1">
          {/* Horizontal Connector Line for Desktop */}
          <div className="hidden md:block absolute left-6 right-6 top-6 h-0.5 bg-stone-200 -z-0" />
          <div
            className="hidden md:block absolute left-6 top-6 h-0.5 bg-emerald-600 transition-all duration-500 -z-0"
            style={{
              width: `${(Math.max(0, currentStageIndex) / (stages.length - 1)) * 90}%`,
            }}
          />

          {stages.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const isUpcoming = idx > currentStageIndex;
            const event = getEventForStage(stage.key);
            const Icon = stage.icon;

            return (
              <div
                key={stage.key}
                onClick={() => {
                  if (interactive && role === 'LEADER' && idx !== currentStageIndex) {
                    setSelectedNextStage(stage.key);
                    setIsTransitioning(true);
                  }
                }}
                className={`relative z-10 flex md:flex-col items-center gap-3 md:gap-2 text-left md:text-center w-full md:w-auto ${
                  interactive && role === 'LEADER' && idx !== currentStageIndex
                    ? 'cursor-pointer group'
                    : ''
                }`}
                title={
                  interactive && role === 'LEADER' && idx !== currentStageIndex
                    ? `Click to move status to '${stage.label}'`
                    : undefined
                }
              >
                {/* Step Circle */}
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                    isCompleted
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                      : isCurrent
                      ? 'bg-purple-900 text-white ring-4 ring-purple-100 shadow-md ring-offset-1'
                      : 'bg-white text-stone-400 border-2 border-stone-200 group-hover:border-purple-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>

                {/* Step Text Info */}
                <div className="min-w-0">
                  <div
                    className={`text-xs font-bold whitespace-nowrap ${
                      isCurrent
                        ? 'text-purple-950 font-extrabold'
                        : isCompleted
                        ? 'text-stone-900'
                        : 'text-stone-400 group-hover:text-stone-700'
                    }`}
                  >
                    {isHindi ? stage.labelHindi : stage.label}
                  </div>

                  {/* Timestamp or Status Badge */}
                  {event ? (
                    <div className="text-[10px] text-stone-500 font-mono mt-0.5 whitespace-nowrap">
                      {event.timestamp.slice(5)}
                    </div>
                  ) : isCurrent ? (
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block mt-0.5">
                      {isHindi ? 'वर्तमान' : 'Active'}
                    </span>
                  ) : (
                    <div className="text-[10px] text-stone-400 mt-0.5">
                      {isHindi ? 'लंबित' : 'Pending'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Transition Dialog / Action Drawer */}
        {isTransitioning && selectedNextStage && (
          <div className="mt-5 p-4 rounded-xl border border-purple-200 bg-purple-50/70 animate-in fade-in duration-150">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-purple-700" />
                <span>
                  {isHindi
                    ? `स्थिति को '${selectedNextStage}' में बदलें`
                    : `Transition Order to '${selectedNextStage}'`}
                </span>
              </span>
              <button
                onClick={() => {
                  setIsTransitioning(false);
                  setSelectedNextStage(null);
                }}
                className="text-stone-400 hover:text-stone-700 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <input
                type="text"
                placeholder={
                  isHindi
                    ? 'ऑप्शनल टिप्पणी लिखें (जैसे: सभी 100 पीस पैक होकर तैयार हैं)...'
                    : 'Optional transition note (e.g. All 100 units verified & packed)...'
                }
                value={transitionNote}
                onChange={(e) => setTransitionNote(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-purple-200 bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:border-purple-600"
              />
              <button
                onClick={() => confirmTransition(selectedNextStage)}
                className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg bg-purple-900 text-white text-xs font-semibold hover:bg-purple-950 transition-colors shadow-xs"
              >
                <Check className="h-3.5 w-3.5" />
                <span>{isHindi ? 'स्वीकृत करें' : 'Confirm Stage Change'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Chronological Transition Event Activity Stream */}
      {showEventHistory && (
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-800" />
              <h4 className="font-bold text-sm text-stone-900 tracking-tight">
                {isHindi
                  ? 'सत्यापित स्थिति परिवर्तन इतिहास एवं टाइमस्टैम्प'
                  : 'Verified Status Transition History & Timestamps'}
              </h4>
            </div>
            <span className="text-[11px] font-mono text-stone-500">
              {timelineEvents.length} {isHindi ? 'दर्ज माइलस्टोन' : 'Recorded Milestones'}
            </span>
          </div>

          <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200">
            {timelineEvents.map((event, index) => {
              const isLast = index === timelineEvents.length - 1;

              return (
                <div key={event.id || index} className="relative flex items-start gap-4 pl-8 group">
                  {/* Timeline node dot */}
                  <div
                    className={`absolute left-2 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white shadow-xs transition-all ${
                      isLast
                        ? 'bg-purple-900 ring-4 ring-purple-100'
                        : 'bg-emerald-600'
                    }`}
                  />

                  <div className="flex-1 p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-white hover:border-purple-200 transition-all text-xs space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-stone-900">
                          {isHindi ? 'चरण:' : 'Moved to'} &apos;{event.status}&apos;
                        </span>
                        <span className="text-stone-300">·</span>
                        <span className="text-[11px] text-purple-900 font-semibold bg-purple-100/80 px-2 py-0.2 rounded">
                          {event.actor}
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-stone-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-stone-400" />
                        <span>{event.timestamp}</span>
                      </div>
                    </div>

                    {event.notes && (
                      <p className="text-stone-600 leading-relaxed text-[11px] pt-1 border-t border-stone-100">
                        {event.notes}
                      </p>
                    )}

                    {typeof event.completedSoFar === 'number' && event.completedSoFar > 0 && (
                      <div className="text-[10px] font-mono text-emerald-700 font-semibold">
                        {isHindi
                          ? `इस चरण पर दर्ज उत्पादन: ${event.completedSoFar}/${order.totalQuantity} पीस`
                          : `Production progress at this step: ${event.completedSoFar}/${order.totalQuantity} units`}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
