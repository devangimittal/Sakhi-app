import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserRole,
  Language,
  OrderItem,
  Member,
  AllocationProposal,
  QualityCheckRecord,
  PaymentRecord,
  AuditLogItem,
  OrderStatus,
  AgentCapability,
  AgentChatMessage,
  AppNotification,
} from '../types';
import {
  INITIAL_MEMBERS,
  INITIAL_ORDERS,
  INITIAL_ALLOCATIONS,
  INITIAL_QUALITY_CHECKS,
  INITIAL_PAYMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';
import { TRANSLATIONS } from '../translations';

const STORAGE_KEY = 'sakhisetu_shg_data_v1';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  orders: OrderItem[];
  members: Member[];
  allocations: AllocationProposal[];
  qualityChecks: QualityCheckRecord[];
  payments: PaymentRecord[];
  auditLogs: AuditLogItem[];
  activeMemberId: string;
  setActiveMemberId: (id: string) => void;
  chatMessages: AgentChatMessage[];
  isAgentLoading: boolean;
  pendingAction: any | null;
  hasApiKey: boolean;

  // Actions
  createOrder: (order: Partial<OrderItem>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateAllocations: (orderId: string, newProposals: AllocationProposal[]) => void;
  approveAllocation: (orderId: string) => void;
  addQualityCheck: (check: Omit<QualityCheckRecord, 'id'>) => void;
  approveQualityItem: (checkId: string) => void;
  recordSimulatedPayment: (paymentId: string, amount: number, method?: 'Simulated UPI' | 'Simulated Bank Payout' | 'Direct SHG Cash') => void;
  sendAgentMessage: (text: string, agentType?: AgentCapability) => Promise<void>;
  approveAction: (messageId: string, action: any) => void;
  rejectAction: (messageId: string) => void;
  resetToDefaultData: () => void;
  isScannerOpen: boolean;
  openScanner: (targetOrderId?: string) => void;
  closeScanner: () => void;
  scannedOrderId: string | null;
  setScannedOrderId: (id: string | null) => void;
  quickUpdateOrderProgress: (
    orderId: string,
    status: OrderStatus,
    completedIncrement?: number,
    notes?: string
  ) => void;
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  simulateLiveAlert: (type: 'DEADLINE' | 'PAYMENT' | 'QUALITY') => void;
  t: (keyPath: string) => any;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('LEADER');
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [activeMemberId, setActiveMemberId] = useState<string>('m1');
  const [isAgentLoading, setIsAgentLoading] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<any | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedOrderId, setScannedOrderId] = useState<string | null>(null);

  // Core state with localStorage persistence
  const [orders, setOrders] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_orders`);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_members`);
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [allocations, setAllocations] = useState<AllocationProposal[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_allocations`);
    return saved ? JSON.parse(saved) : INITIAL_ALLOCATIONS;
  });

  const [qualityChecks, setQualityChecks] = useState<QualityCheckRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_quality`);
    if (saved) {
      try {
        const parsed: QualityCheckRecord[] = JSON.parse(saved);
        const seen = new Set<string>();
        return parsed.map((item, idx) => {
          if (!item.id || seen.has(item.id)) {
            const uniqueId = `QC-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`;
            seen.add(uniqueId);
            return { ...item, id: uniqueId };
          }
          seen.add(item.id);
          return item;
        });
      } catch {
        return INITIAL_QUALITY_CHECKS;
      }
    }
    return INITIAL_QUALITY_CHECKS;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_payments`);
    if (saved) {
      try {
        const parsed: PaymentRecord[] = JSON.parse(saved);
        const seen = new Set<string>();
        return parsed.map((item, idx) => {
          if (!item.id || seen.has(item.id)) {
            const uniqueId = `PAY-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`;
            seen.add(uniqueId);
            return { ...item, id: uniqueId };
          }
          seen.add(item.id);
          return item;
        });
      } catch {
        return INITIAL_PAYMENTS;
      }
    }
    return INITIAL_PAYMENTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
    if (saved) {
      try {
        const parsed: AuditLogItem[] = JSON.parse(saved);
        const seen = new Set<string>();
        return parsed.map((item, idx) => {
          if (!item.id || seen.has(item.id)) {
            const uniqueId = `LOG-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`;
            seen.add(uniqueId);
            return { ...item, id: uniqueId };
          }
          seen.add(item.id);
          return item;
        });
      } catch {
        return INITIAL_AUDIT_LOGS;
      }
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
    if (saved) {
      try {
        const parsed: AppNotification[] = JSON.parse(saved);
        const seen = new Set<string>();
        return parsed.map((item, idx) => {
          if (!item.id || seen.has(item.id)) {
            const uniqueId = `NOTIF-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`;
            seen.add(uniqueId);
            return { ...item, id: uniqueId };
          }
          seen.add(item.id);
          return item;
        });
      } catch {
        return INITIAL_NOTIFICATIONS;
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [chatMessages, setChatMessages] = useState<AgentChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'sakhi_ai',
      agentType: 'CENTRAL_ORCHESTRATOR',
      text: `### 🌸 Welcome to SakhiSetu AI
I am your Central Operational Intelligence layer. I monitor your group's orders, balance artisan workload, analyze costs, track quality inspections, and safeguard member payments.

**Critical Live Status**:
- **Order ORD-2026-001** (100 Bags for FabCraft) has **40 units remaining** with **2 days to deadline**.
- We have identified that 4 members have unutilized daily capacity to absorb this workload.
- Would you like me to distribute the remaining 40 units fairly?`,
      timestamp: 'Just now',
      suggestedAction: {
        type: 'PROPOSE_REDISTRIBUTION',
        title: 'Redistribute Remaining 40 Cotton Bags',
        description: 'Allocate remaining units to 4 high-capacity members (Meena: 12, Radha: 10, Rekha: 10, Anita: 8) to secure delivery in 48 hours.',
        targetOrderId: 'ORD-2026-001',
      },
      trace: {
        dataRetrieved: 'Orders, Member Capacity, Quality Ledger',
        analysisCompleted: 'Order Intelligence Agent detected run-rate shortfall',
        riskLevel: 'HIGH',
        recommendationGenerated: true,
        requiresLeaderApproval: true,
      },
      approvalStatus: 'IDLE',
    },
  ]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_members`, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_allocations`, JSON.stringify(allocations));
  }, [allocations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_quality`, JSON.stringify(qualityChecks));
  }, [qualityChecks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_payments`, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (notifData: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notifData,
      id: `NOTIF-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const simulateLiveAlert = (type: 'DEADLINE' | 'PAYMENT' | 'QUALITY') => {
    if (type === 'DEADLINE') {
      addNotification({
        category: 'DEADLINE',
        urgency: 'CRITICAL',
        title: 'Live Alert: Urgent Dispatch Window Approaching',
        titleHi: 'लाइव अलर्ट: डिस्पैच की समयसीमा निकट',
        message: 'Order ORD-2026-001 has only 36 hours remaining until client shipping cutoff!',
        messageHi: 'ऑर्डर ORD-2026-001 के शिपिंग कटऑफ में मात्र 36 घंटे शेष हैं!',
        targetTab: 'orders',
        targetId: 'ORD-2026-001',
        actionLabel: 'View Order',
        actionLabelHi: 'ऑर्डर देखें',
      });
    } else if (type === 'PAYMENT') {
      addNotification({
        category: 'PAYMENT',
        urgency: 'SUCCESS',
        title: 'Live Alert: ₹750 Payout Completed',
        titleHi: 'लाइव अलर्ट: ₹750 का भुगतान संपन्न',
        message: 'Simulated UPI transfer to Radha Patel confirmed and updated in the immutable ledger.',
        messageHi: 'राधा पटेल को सिम्युलेटेड यूपीआई भुगतान सफलतापूर्वक लेजर में दर्ज हुआ।',
        targetTab: 'payments',
        actionLabel: 'Check Ledger',
        actionLabelHi: 'लेजर देखें',
      });
    } else {
      addNotification({
        category: 'QUALITY',
        urgency: 'WARNING',
        title: 'Live Alert: Quality Correction Requested',
        titleHi: 'लाइव अलर्ट: गुणवत्ता सुधार का अनुरोध',
        message: 'Artisan Anita Verma requested to adjust hem tension on 2 units before final sign-off.',
        messageHi: 'कारीगर अनीता वर्मा के 2 पीस में अंतिम स्वीकृति से पहले सिलाई सुधार आवश्यक।',
        targetTab: 'quality',
        actionLabel: 'Inspect Now',
        actionLabelHi: 'अभी निरीक्षण करें',
      });
    }
  };

  // Check backend health
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHasApiKey(Boolean(data.hasApiKey));
      })
      .catch(() => {
        setHasApiKey(false);
      });
  }, []);

  const addAuditLog = (action: string, details: string, category: AuditLogItem['category']) => {
    const newLog: AuditLogItem = {
      id: `LOG-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      action,
      actor: role === 'LEADER' ? 'Sunita Devi (Leader)' : role === 'MEMBER' ? 'Member Artisan' : 'Buyer',
      details,
      category,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const createOrder = (orderData: Partial<OrderItem>) => {
    const newOrderId = `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`;
    const totalQty = orderData.totalQuantity || 100;
    const unitCost = orderData.unitCost || 90;
    const totalCost = totalQty * unitCost;
    const margin = orderData.profitMarginPercent || 20;
    const targetSellingPrice = Math.round(totalCost / (1 - margin / 100));
    const unitSellingPrice = Number((targetSellingPrice / totalQty).toFixed(2));

    const newOrder: OrderItem = {
      id: newOrderId,
      orderNumber: newOrderId,
      buyerName: orderData.buyerName || 'New Client',
      buyerOrganization: orderData.buyerOrganization || 'Handloom Retail Co.',
      buyerContact: orderData.buyerContact || '+91 98000 00000',
      productName: orderData.productName || 'Handcrafted Artisan Goods',
      productCategory: orderData.productCategory || 'Textiles',
      description: orderData.description || 'Artisanal bulk order registered on SakhiSetu.',
      totalQuantity: totalQty,
      completedQuantity: 0,
      approvedQuantity: 0,
      rejectedQuantity: 0,
      pendingCorrectionQuantity: 0,
      unitCost,
      totalCost,
      targetSellingPrice,
      unitSellingPrice,
      profitMarginPercent: margin,
      orderDate: new Date().toISOString().split('T')[0],
      deadlineDate: orderData.deadlineDate || '2026-11-30',
      daysRemaining: 15,
      status: 'New',
      riskLevel: 'LOW',
      riskReason: 'Newly created order. Work allocation pending.',
      imageUrl: orderData.imageUrl || '/src/assets/images/shg_cotton_tote_bags_1794231130100.jpg',
      timeline: [
        {
          id: `TL-${Date.now()}`,
          status: 'New',
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          actor: role === 'LEADER' ? 'Sunita Devi (Leader)' : 'Client',
          notes: 'Order registered in SakhiSetu.',
          completedSoFar: 0,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    addAuditLog('New Order Created', `Created ${newOrderId}: ${totalQty} units of ${newOrder.productName} for ${newOrder.buyerOrganization}`, 'ORDER');

    addNotification({
      category: 'ORDER',
      urgency: 'INFO',
      title: `New Order Created: ${newOrderId}`,
      titleHi: `नया बल्क ऑर्डर दर्ज: ${newOrderId}`,
      message: `${newOrder.productName} (${newOrder.totalQuantity} units) for ${newOrder.buyerName}. Deadline: ${newOrder.deadlineDate}`,
      messageHi: `${newOrder.buyerName} से ${newOrder.productName} (${newOrder.totalQuantity} पीस)। समयसीमा: ${newOrder.deadlineDate}`,
      targetTab: 'orders',
      targetId: newOrderId,
      actionLabel: 'Allocate Work',
      actionLabelHi: 'काम आवंटित करें',
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const nowTime = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const actor = role === 'LEADER' ? 'Sunita Devi (Leader)' : role === 'MEMBER' ? 'Member Artisan' : 'Buyer';

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const newEvent = {
            id: `TL-${Date.now()}`,
            status,
            timestamp: nowTime,
            actor,
            notes: `Status transitioned to '${status}'`,
            completedSoFar: ord.completedQuantity,
          };
          return {
            ...ord,
            status,
            timeline: [...(ord.timeline || []), newEvent],
          };
        }
        return ord;
      })
    );
    addAuditLog('Order Status Updated', `Order ${orderId} moved to state '${status}'`, 'ORDER');

    addNotification({
      category: 'DEADLINE',
      urgency: status === 'Completed' || status === 'Dispatched' ? 'SUCCESS' : 'INFO',
      title: `Order Status: ${orderId} is now ${status}`,
      titleHi: `ऑर्डर स्थिति: ${orderId} अब ${status} है`,
      message: `Production pipeline updated to stage "${status}".`,
      messageHi: `उत्पादन पाइपलाइन चरण "${status}" पर अद्यतन की गई।`,
      targetTab: 'orders',
      targetId: orderId,
      actionLabel: 'View Timeline',
      actionLabelHi: 'समयरेखा देखें',
    });
  };

  const openScanner = (targetOrderId?: string) => {
    if (targetOrderId) {
      setScannedOrderId(targetOrderId);
    }
    setIsScannerOpen(true);
  };

  const closeScanner = () => {
    setIsScannerOpen(false);
  };

  const quickUpdateOrderProgress = (
    orderId: string,
    status: OrderStatus,
    completedIncrement = 0,
    notes?: string
  ) => {
    const nowTime = new Date().toISOString().replace('T', ' ').slice(0, 16);

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const newCompleted = Math.min(
            ord.totalQuantity,
            ord.completedQuantity + completedIncrement
          );
          const finalCompleted =
            status === 'Completed' || status === 'Dispatched' ? ord.totalQuantity : newCompleted;
          const newRisk =
            status === 'Dispatched' || status === 'Completed' ? 'LOW' : ord.riskLevel;
          const newRiskReason =
            status === 'Dispatched'
              ? 'Order successfully dispatched to buyer.'
              : status === 'Completed'
              ? 'Production completed. 100% units ready.'
              : ord.riskReason;

          const newEvent = {
            id: `TL-${Date.now()}`,
            status,
            timestamp: nowTime,
            actor: 'QR Scanner Station',
            notes: notes || `Status updated to '${status}' via QR Scan`,
            completedSoFar: finalCompleted,
          };

          return {
            ...ord,
            status,
            completedQuantity: finalCompleted,
            riskLevel: newRisk as any,
            riskReason: newRiskReason,
            timeline: [...(ord.timeline || []), newEvent],
          };
        }
        return ord;
      })
    );

    addAuditLog(
      'QR Batch Status Update',
      `Order ${orderId} updated to '${status}' via Scannable QR Passport${
        completedIncrement > 0 ? ` (+${completedIncrement} units logged)` : ''
      }${notes ? `. Notes: ${notes}` : ''}`,
      'ORDER'
    );

    addNotification({
      category: 'ORDER',
      urgency: 'INFO',
      title: `QR Progress Scanned: ${orderId}`,
      titleHi: `QR प्रगति स्कैन हुई: ${orderId}`,
      message: `Status updated to "${status}" via quick scanner.${completedIncrement > 0 ? ` +${completedIncrement} units logged.` : ''}`,
      messageHi: `क्विक स्कैनर द्वारा ऑर्डर स्थिति "${status}" पर सेट की गई।`,
      targetTab: 'orders',
      targetId: orderId,
      actionLabel: 'View Order',
      actionLabelHi: 'ऑर्डर देखें',
    });

    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const updateAllocations = (orderId: string, newProposals: AllocationProposal[]) => {
    setAllocations((prev) => [
      ...prev.filter((a) => a.orderId !== orderId),
      ...newProposals,
    ]);
    addAuditLog('Work Allocation Updated', `Adjusted allocation quotas for ${orderId}`, 'ALLOCATION');
  };

  const approveAllocation = (orderId: string) => {
    const nowTime = new Date().toISOString().replace('T', ' ').slice(0, 16);

    setAllocations((prev) =>
      prev.map((a) => (a.orderId === orderId ? { ...a, status: 'APPROVED' } : a))
    );
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const newEvent = {
            id: `TL-${Date.now()}`,
            status: 'In Production' as OrderStatus,
            timestamp: nowTime,
            actor: 'Sunita Devi (Leader)',
            notes: 'Work allocation approved and materials released to artisans.',
            completedSoFar: o.completedQuantity,
          };
          return {
            ...o,
            status: 'In Production',
            timeline: [...(o.timeline || []), newEvent],
          };
        }
        return o;
      })
    );
    addAuditLog('Allocation Approved', `Leader authorized fair work distribution for ${orderId}`, 'ALLOCATION');

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const addQualityCheck = (checkData: Omit<QualityCheckRecord, 'id'>) => {
    const newId = `QC-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newRecord: QualityCheckRecord = {
      ...checkData,
      id: newId,
    };

    setQualityChecks((prev) => [newRecord, ...prev]);

    // Update order stats
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === checkData.orderId) {
          const newCompleted = ord.completedQuantity + checkData.completedQuantity;
          const newApproved = ord.approvedQuantity + checkData.approvedQuantity;
          const newCorrection = ord.pendingCorrectionQuantity + checkData.pendingCorrectionQuantity;
          const newRejected = ord.rejectedQuantity + checkData.rejectedQuantity;
          return {
            ...ord,
            completedQuantity: newCompleted,
            approvedQuantity: newApproved,
            pendingCorrectionQuantity: newCorrection,
            rejectedQuantity: newRejected,
          };
        }
        return ord;
      })
    );

    // Update payment ledger for approved units
    if (checkData.approvedQuantity > 0) {
      setPayments((prev) => {
        const existing = prev.find(
          (p) => p.memberId === checkData.memberId && p.orderId === checkData.orderId
        );
        if (existing) {
          const newApproved = existing.approvedQuantity + checkData.approvedQuantity;
          const newGross = newApproved * existing.agreedRate;
          const newPending = newGross - existing.amountPaid;
          return prev.map((p) =>
            p.id === existing.id
              ? {
                  ...p,
                  approvedQuantity: newApproved,
                  grossAmount: newGross,
                  pendingBalance: newPending,
                  status: newPending === 0 ? 'SETTLED' : 'PARTIAL',
                }
              : p
          );
        } else {
          const newPayment: PaymentRecord = {
            id: `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            memberId: checkData.memberId,
            memberName: checkData.memberName,
            orderId: checkData.orderId,
            orderNumber: checkData.orderNumber,
            approvedQuantity: checkData.approvedQuantity,
            agreedRate: 70,
            grossAmount: checkData.approvedQuantity * 70,
            amountPaid: 0,
            pendingBalance: checkData.approvedQuantity * 70,
            status: 'PENDING',
            disbursementHistory: [],
          };
          return [newPayment, ...prev];
        }
      });
    }

    addAuditLog(
      'Quality Inspection Logged',
      `Inspected batch for ${checkData.memberName}: ${checkData.approvedQuantity} approved, ${checkData.pendingCorrectionQuantity} correction needed`,
      'QUALITY'
    );

    addNotification({
      category: 'QUALITY',
      urgency: checkData.pendingCorrectionQuantity > 0 ? 'WARNING' : 'SUCCESS',
      title: checkData.pendingCorrectionQuantity > 0 ? `Quality Notice: ${checkData.pendingCorrectionQuantity} Unit(s) Need Correction` : `Quality Passed: ${checkData.approvedQuantity} Approved`,
      titleHi: checkData.pendingCorrectionQuantity > 0 ? `गुणवत्ता सूचना: ${checkData.pendingCorrectionQuantity} पीस में सुधार आवश्यक` : `गुणवत्ता पास: ${checkData.approvedQuantity} पीस स्वीकृत`,
      message: `${checkData.memberName} · Order ${checkData.orderNumber} (${checkData.approvedQuantity} approved, ${checkData.pendingCorrectionQuantity} rework, ${checkData.rejectedQuantity} rejected).`,
      messageHi: `${checkData.memberName} · ऑर्डर ${checkData.orderNumber} (${checkData.approvedQuantity} स्वीकृत, ${checkData.pendingCorrectionQuantity} सुधार, ${checkData.rejectedQuantity} अस्वीकृत)।`,
      targetTab: 'quality',
      targetId: newId,
      actionLabel: 'Open Quality',
      actionLabelHi: 'गुणवत्ता देखें',
    });
  };

  const approveQualityItem = (checkId: string) => {
    const targetCheck = qualityChecks.find((q) => q.id === checkId);
    if (!targetCheck) return;

    const newlyApproved = targetCheck.pendingCorrectionQuantity;
    if (newlyApproved <= 0) return;

    setQualityChecks((prev) =>
      prev.map((q) =>
        q.id === checkId
          ? {
              ...q,
              approvedQuantity: q.approvedQuantity + newlyApproved,
              pendingCorrectionQuantity: 0,
              status: 'APPROVED',
              remarks: `${q.remarks} · [Resolved & Approved by Leader]`,
            }
          : q
      )
    );

    // Update order
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === targetCheck.orderId
          ? {
              ...ord,
              approvedQuantity: ord.approvedQuantity + newlyApproved,
              pendingCorrectionQuantity: Math.max(0, ord.pendingCorrectionQuantity - newlyApproved),
            }
          : ord
      )
    );

    // Update payment record
    setPayments((prev) =>
      prev.map((p) => {
        if (p.memberId === targetCheck.memberId && p.orderId === targetCheck.orderId) {
          const updatedApproved = p.approvedQuantity + newlyApproved;
          const updatedGross = updatedApproved * p.agreedRate;
          return {
            ...p,
            approvedQuantity: updatedApproved,
            grossAmount: updatedGross,
            pendingBalance: updatedGross - p.amountPaid,
          };
        }
        return p;
      })
    );

    addAuditLog(
      'Rectified Products Approved',
      `Leader approved ${newlyApproved} corrected units for ${targetCheck.memberName}`,
      'QUALITY'
    );

    addNotification({
      category: 'QUALITY',
      urgency: 'SUCCESS',
      title: `Corrected Units Approved (${newlyApproved} pcs)`,
      titleHi: `सुधारे गए पीस स्वीकृत (${newlyApproved} पीस)`,
      message: `Leader verified corrections for ${targetCheck.memberName}. Units released to payment ledger.`,
      messageHi: `सुनीता देवी द्वारा ${targetCheck.memberName} के सुधारे गए पीस सत्यापित और भुगतान लेजर में जारी।`,
      targetTab: 'payments',
      targetId: targetCheck.id,
      actionLabel: 'View Ledger',
      actionLabelHi: 'लेजर देखें',
    });

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  const recordSimulatedPayment = (
    paymentId: string,
    amount: number,
    method: 'Simulated UPI' | 'Simulated Bank Payout' | 'Direct SHG Cash' = 'Simulated UPI'
  ) => {
    const target = payments.find((p) => p.id === paymentId);
    if (!target) return;

    const actualAmount = Math.min(amount, target.pendingBalance);
    const txnId = `SIM-TXN-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newPaid = target.amountPaid + actualAmount;
    const newPending = target.grossAmount - newPaid;

    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              amountPaid: newPaid,
              pendingBalance: newPending,
              lastPaymentDate: new Date().toISOString().split('T')[0],
              status: newPending === 0 ? 'SETTLED' : 'PARTIAL',
              disbursementHistory: [
                {
                  transactionId: txnId,
                  amount: actualAmount,
                  date: new Date().toISOString().split('T')[0],
                  method,
                  recordedBy: 'Sunita Devi (Leader)',
                  status: 'COMPLETED',
                },
                ...p.disbursementHistory,
              ],
            }
          : p
      )
    );

    // Update member's cumulative ledger
    setMembers((prev) =>
      prev.map((m) =>
        m.id === target.memberId
          ? {
              ...m,
              totalPaid: m.totalPaid + actualAmount,
              pendingBalance: Math.max(0, m.pendingBalance - actualAmount),
            }
          : m
      )
    );

    addAuditLog(
      'Simulated Payment Recorded',
      `Disbursed ₹${actualAmount.toLocaleString('en-IN')} to ${target.memberName} (${method} Ref: ${txnId})`,
      'PAYMENT'
    );

    addNotification({
      category: 'PAYMENT',
      urgency: 'SUCCESS',
      title: `Payment Disbursed: ₹${actualAmount.toLocaleString('en-IN')}`,
      titleHi: `भुगतान हस्तांतरित: ₹${actualAmount.toLocaleString('en-IN')}`,
      message: `Paid to ${target.memberName} via ${method}. Outstanding balance: ₹${newPending.toLocaleString('en-IN')}.`,
      messageHi: `${target.memberName} को ${method} द्वारा भुगतान किया गया। शेष बकाया: ₹${newPending.toLocaleString('en-IN')}।`,
      targetTab: 'payments',
      targetId: paymentId,
      actionLabel: 'View Receipt',
      actionLabelHi: 'रसीद देखें',
    });

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const sendAgentMessage = async (text: string, agentType: AgentCapability = 'CENTRAL_ORCHESTRATOR') => {
    setIsAgentLoading(true);

    const userMsg: AgentChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setChatMessages((prev) => [...prev, userMsg]);

    const contextData = {
      orders,
      members: members.map((m) => ({
        id: m.id,
        name: m.name,
        dailyCapacity: m.dailyCapacity,
        currentWorkload: m.currentWorkload,
        availableCapacity: m.availableCapacity,
        pendingBalance: m.pendingBalance,
      })),
      allocations,
      qualitySummary: {
        totalInspected: qualityChecks.reduce((acc, q) => acc + q.completedQuantity, 0),
        approved: qualityChecks.reduce((acc, q) => acc + q.approvedQuantity, 0),
        correctionRequired: qualityChecks.reduce((acc, q) => acc + q.pendingCorrectionQuantity, 0),
      },
      paymentSummary: {
        grossEarned: payments.reduce((acc, p) => acc + p.grossAmount, 0),
        disbursed: payments.reduce((acc, p) => acc + p.amountPaid, 0),
        pending: payments.reduce((acc, p) => acc + p.pendingBalance, 0),
      },
    };

    try {
      const response = await fetch('/api/gemini/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType,
          query: text,
          contextData,
          language,
        }),
      });

      const data = await response.json();

      const aiMsg: AgentChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'sakhi_ai',
        agentType: data.agentType || agentType,
        text: data.message,
        timestamp: 'Just now',
        suggestedAction: data.suggestedAction || null,
        trace: data.trace,
        approvalStatus: data.suggestedAction ? 'IDLE' : undefined,
      };

      setChatMessages((prev) => [...prev, aiMsg]);
      if (data.suggestedAction) {
        setPendingAction({ messageId: aiMsg.id, ...data.suggestedAction });
      }
    } catch {
      // Offline / fallback handling
      const fallbackMsg: AgentChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'sakhi_ai',
        agentType,
        text: language === 'hi'
          ? `### 🌸 सखी AI विश्लेषण रिपोर्ट
ऑर्डर ORD-2026-001 में 40 बैग 2 दिन में पूर्ण करने हैं। मीना, राधा, रेखा और अनीता के पास अतिरिक्त दैनिक क्षमता उपलब्ध है। कार्य का पुनर्वितरण करने की सिफारिश की जाती है।`
          : `### 🌸 Sakhi AI Operational Intelligence
Order ORD-2026-001 has 40 units remaining over 2 days. 4 artisans have available capacity. We recommend approving the work redistribution to safeguard on-time delivery.`,
        timestamp: 'Just now',
        trace: {
          dataRetrieved: 'Local SHG database',
          analysisCompleted: 'Deterministic rules evaluated constraints',
          riskLevel: 'HIGH',
          recommendationGenerated: true,
          requiresLeaderApproval: true,
        },
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsAgentLoading(false);
    }
  };

  const approveAction = (messageId: string, action: any) => {
    if (!action) return;

    if (action.type === 'PROPOSE_REDISTRIBUTION') {
      // Execute work redistribution
      setAllocations((prev) => {
        return prev.map((alloc) => {
          if (alloc.memberId === 'm1') return { ...alloc, assignedQuantity: alloc.assignedQuantity + 12, rationale: 'Sakhi AI reallocated +12 units based on spare capacity' };
          if (alloc.memberId === 'm2') return { ...alloc, assignedQuantity: alloc.assignedQuantity + 10, rationale: 'Sakhi AI reallocated +10 units based on spare capacity' };
          if (alloc.memberId === 'm5') return { ...alloc, assignedQuantity: alloc.assignedQuantity + 10, rationale: 'Sakhi AI reallocated +10 units based on spare capacity' };
          if (alloc.memberId === 'm4') return { ...alloc, assignedQuantity: alloc.assignedQuantity + 8, rationale: 'Sakhi AI reallocated +8 units based on spare capacity' };
          if (alloc.memberId === 'm6') return { ...alloc, assignedQuantity: 0, rationale: 'Work relieved due to family emergency & zero progress' };
          return alloc;
        });
      });

      // Update order risk status
      setOrders((prev) =>
        prev.map((o) =>
          o.id === 'ORD-2026-001'
            ? {
                ...o,
                riskLevel: 'LOW',
                riskReason: 'Work successfully redistributed across 4 active artisans. On track for delivery.',
              }
            : o
        )
      );

      addAuditLog(
        'Agentic Redistribution Executed',
        'Leader approved Sakhi AI reallocation of remaining 40 bags across Meena, Radha, Rekha and Anita.',
        'AI_AGENT'
      );
    } else if (action.type === 'DISBURSE_BATCH_PAYMENT') {
      // Settle all pending approved payments
      setPayments((prev) =>
        prev.map((p) => {
          if (p.pendingBalance > 0) {
            return {
              ...p,
              amountPaid: p.grossAmount,
              pendingBalance: 0,
              status: 'SETTLED',
              disbursementHistory: [
                {
                  transactionId: `SIM-TXN-BATCH-${Date.now().toString().slice(-5)}`,
                  amount: p.pendingBalance,
                  date: new Date().toISOString().split('T')[0],
                  method: 'Simulated UPI',
                  recordedBy: 'Sunita Devi (Authorized)',
                  status: 'COMPLETED',
                },
                ...p.disbursementHistory,
              ],
            };
          }
          return p;
        })
      );

      setMembers((prev) =>
        prev.map((m) => ({
          ...m,
          totalPaid: m.totalEarned,
          pendingBalance: 0,
        }))
      );

      addAuditLog('Batch Disbursement Executed', 'Leader approved full payout of ₹2,350 for all quality-approved batches', 'PAYMENT');
    }

    setChatMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, approvalStatus: 'APPROVED' } : msg
      )
    );
    setPendingAction(null);

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  const rejectAction = (messageId: string) => {
    setChatMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, approvalStatus: 'REJECTED' } : msg
      )
    );
    setPendingAction(null);
    addAuditLog('Agent Proposal Dismissed', 'Leader rejected suggested operational action', 'AI_AGENT');
  };

  const resetToDefaultData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_orders`);
    localStorage.removeItem(`${STORAGE_KEY}_members`);
    localStorage.removeItem(`${STORAGE_KEY}_allocations`);
    localStorage.removeItem(`${STORAGE_KEY}_quality`);
    localStorage.removeItem(`${STORAGE_KEY}_payments`);
    localStorage.removeItem(`${STORAGE_KEY}_audit`);
    localStorage.removeItem(`${STORAGE_KEY}_notifications`);

    setOrders(INITIAL_ORDERS);
    setMembers(INITIAL_MEMBERS);
    setAllocations(INITIAL_ALLOCATIONS);
    setQualityChecks(INITIAL_QUALITY_CHECKS);
    setPayments(INITIAL_PAYMENTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setPendingAction(null);

    addAuditLog('System Reset', 'Restored pristine demonstration dataset for Sakhi Mahila SHG', 'AI_AGENT');
  };

  const t = (path: string): any => {
    const keys = path.split('.');
    let current: any = TRANSLATIONS[language];
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return path;
      }
    }
    return current;
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        activeTab,
        setActiveTab,
        orders,
        members,
        allocations,
        qualityChecks,
        payments,
        auditLogs,
        activeMemberId,
        setActiveMemberId,
        chatMessages,
        isAgentLoading,
        pendingAction,
        hasApiKey,
        createOrder,
        updateOrderStatus,
        updateAllocations,
        approveAllocation,
        addQualityCheck,
        approveQualityItem,
        recordSimulatedPayment,
        sendAgentMessage,
        approveAction,
        rejectAction,
        resetToDefaultData,
        isScannerOpen,
        openScanner,
        closeScanner,
        scannedOrderId,
        setScannedOrderId,
        quickUpdateOrderProgress,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotification,
        clearAllNotifications,
        addNotification,
        simulateLiveAlert,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
