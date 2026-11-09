export type UserRole = 'LEADER' | 'MEMBER' | 'BUYER';
export type Language = 'en' | 'hi';

export type OrderStatus =
  | 'New'
  | 'Approved'
  | 'In Production'
  | 'Quality Inspection'
  | 'Completed'
  | 'Dispatched';

export interface OrderTimelineEvent {
  id: string;
  status: OrderStatus;
  timestamp: string; // ISO or formatted date-time string
  actor: string;
  notes?: string;
  completedSoFar?: number;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  buyerName: string;
  buyerOrganization: string;
  buyerContact: string;
  productName: string;
  productCategory: string;
  description: string;
  totalQuantity: number;
  completedQuantity: number;
  approvedQuantity: number;
  rejectedQuantity: number;
  pendingCorrectionQuantity: number;
  unitCost: number;
  totalCost: number;
  targetSellingPrice: number;
  unitSellingPrice: number;
  profitMarginPercent: number;
  orderDate: string;
  deadlineDate: string;
  daysRemaining: number;
  status: OrderStatus;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskReason?: string;
  imageUrl?: string;
  timeline?: OrderTimelineEvent[];
}

export interface Member {
  id: string;
  name: string;
  nameHindi: string;
  role: 'Leader' | 'Artisan' | 'Quality Lead';
  skills: string[];
  skillsHindi: string[];
  dailyCapacity: number; // units per day
  currentWorkload: number; // units currently in queue
  availableCapacity: number; // dailyCapacity - currentDailyCommitment
  phone: string;
  bankAccountAlias: string;
  agreedPieceRate: number; // in INR
  totalEarned: number;
  totalPaid: number;
  pendingBalance: number;
  avatarUrl?: string;
  attendanceRate: number;
}

export interface AllocationProposal {
  orderId: string;
  memberId: string;
  memberName: string;
  dailyCapacity: number;
  currentWorkload: number;
  availableCapacity: number;
  suggestedQuantity: number;
  assignedQuantity: number;
  completedQuantity: number;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  rationale: string;
}

export interface QualityCheckRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  productName: string;
  memberId: string;
  memberName: string;
  completedQuantity: number;
  approvedQuantity: number;
  rejectedQuantity: number;
  pendingCorrectionQuantity: number;
  inspectionDate: string;
  inspectorName: string;
  remarks: string;
  checklist: {
    item: string;
    passed: boolean;
  }[];
  productImageUrl?: string;
  status: 'APPROVED' | 'PARTIALLY_APPROVED' | 'CORRECTION_REQUIRED';
}

export interface PaymentRecord {
  id: string;
  memberId: string;
  memberName: string;
  orderId: string;
  orderNumber: string;
  approvedQuantity: number;
  agreedRate: number;
  grossAmount: number;
  amountPaid: number;
  pendingBalance: number;
  lastPaymentDate?: string;
  status: 'PENDING' | 'PARTIAL' | 'SETTLED';
  disbursementHistory: {
    transactionId: string;
    amount: number;
    date: string;
    method: 'Simulated UPI' | 'Simulated Bank Payout' | 'Direct SHG Cash';
    recordedBy: string;
    status: 'COMPLETED';
  }[];
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  category: 'ORDER' | 'ALLOCATION' | 'QUALITY' | 'PAYMENT' | 'AI_AGENT';
}

export type AgentCapability =
  | 'ORDER_INTELLIGENCE_AGENT'
  | 'WORK_ALLOCATION_AGENT'
  | 'COST_INTELLIGENCE_AGENT'
  | 'QUALITY_INTELLIGENCE_AGENT'
  | 'PAYMENT_TRANSPARENCY_AGENT'
  | 'CENTRAL_ORCHESTRATOR';

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'sakhi_ai';
  agentType?: AgentCapability;
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: string;
    title: string;
    description: string;
    targetOrderId?: string;
    changes?: any;
    totalAmount?: number;
    memberCount?: number;
    targetPrice?: number;
  } | null;
  trace?: {
    dataRetrieved: string;
    analysisCompleted: string;
    riskLevel: string;
    recommendationGenerated: boolean;
    requiresLeaderApproval: boolean;
  };
  approvalStatus?: 'IDLE' | 'APPROVED' | 'REJECTED' | 'EXECUTED';
}

export type NotificationCategory = 'DEADLINE' | 'PAYMENT' | 'QUALITY' | 'ORDER';
export type NotificationUrgency = 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  urgency: NotificationUrgency;
  title: string;
  titleHi: string;
  message: string;
  messageHi: string;
  timestamp: string;
  read: boolean;
  targetTab?: string;
  targetId?: string;
  actionLabel?: string;
  actionLabelHi?: string;
}
