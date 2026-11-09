import { Language } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  shgName: string;
  nav: {
    overview: string;
    orders: string;
    workAllocation: string;
    pricingCalculator: string;
    qualityManagement: string;
    payments: string;
    sakhiAI: string;
    members: string;
    reports: string;
    settings: string;
  };
  roles: {
    leader: string;
    leaderDesc: string;
    member: string;
    memberDesc: string;
    buyer: string;
    buyerDesc: string;
    switchRole: string;
  };
  overview: {
    title: string;
    subtitle: string;
    totalMembers: string;
    activeOrders: string;
    productionCompleted: string;
    pendingProduction: string;
    groupRevenue: string;
    pendingPayments: string;
    upcomingDeadlines: string;
    recentActivities: string;
    aiAlerts: string;
    firstPassRate: string;
    viewAll: string;
  };
  orders: {
    title: string;
    subtitle: string;
    createNew: string;
    orderId: string;
    buyer: string;
    product: string;
    quantity: string;
    deadline: string;
    status: string;
    risk: string;
    progress: string;
    actions: string;
    viewQr: string;
    filterAll: string;
    searchPlaceholder: string;
  };
  allocation: {
    title: string;
    subtitle: string;
    fairDistributionEngine: string;
    availableCapacity: string;
    currentWorkload: string;
    suggestedAllocation: string;
    assignedQuantity: string;
    completedQuantity: string;
    approveAllocation: string;
    rejectAllocation: string;
    modifyAllocation: string;
    allocationGuarantee: string;
    aiExplanation: string;
  };
  pricing: {
    title: string;
    subtitle: string;
    rawMaterial: string;
    labourCost: string;
    packagingCost: string;
    transportCost: string;
    otherExpenses: string;
    desiredMargin: string;
    totalCost: string;
    costPerUnit: string;
    suggestedSellingPrice: string;
    expectedProfit: string;
    formulaExplanation: string;
  };
  quality: {
    title: string;
    subtitle: string;
    inspectionDashboard: string;
    assignedArtisan: string;
    completedQty: string;
    approvedQty: string;
    rejectedQty: string;
    inspectionDate: string;
    inspectionChecklist: string;
    remarks: string;
    approveBatch: string;
    requestCorrection: string;
    rejectBatch: string;
    doNotAutoApproveNotice: string;
  };
  payments: {
    title: string;
    subtitle: string;
    memberLedger: string;
    member: string;
    qualityApprovedQty: string;
    ratePerUnit: string;
    totalEarnings: string;
    amountPaid: string;
    pendingBalance: string;
    simulatePayment: string;
    formulaNotice: string;
    disclaimer: string;
  };
  sakhiAI: {
    title: string;
    subtitle: string;
    agents: string;
    orderAgent: string;
    allocationAgent: string;
    costAgent: string;
    qualityAgent: string;
    paymentAgent: string;
    askPlaceholder: string;
    sendPrompt: string;
    recommendedPrompts: string;
    approvalRequired: string;
    reviewAction: string;
    approveAction: string;
    rejectAction: string;
    traceTitle: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appName: 'SakhiSetu AI',
    tagline: 'Empowering Women Through Technology, Transparency and Trust',
    shgName: 'Sakhi Mahila SHG',
    nav: {
      overview: 'Overview',
      orders: 'Orders',
      workAllocation: 'Work Allocation',
      pricingCalculator: 'Pricing Calculator',
      qualityManagement: 'Quality Management',
      payments: 'Payments',
      sakhiAI: 'Sakhi AI',
      members: 'Members',
      reports: 'Reports',
      settings: 'Settings',
    },
    roles: {
      leader: 'SHG Leader',
      leaderDesc: 'Smt. Sunita Devi (President)',
      member: 'SHG Member',
      memberDesc: 'Meena Sharma (Artisan)',
      buyer: 'Buyer Portal',
      buyerDesc: 'Ramesh Chandra (FabCraft)',
      switchRole: 'Switch Role',
    },
    overview: {
      title: 'Operations Intelligence Dashboard',
      subtitle: 'Real-time production, capacity, quality & financial tracking',
      totalMembers: 'Total SHG Members',
      activeOrders: 'Active Bulk Orders',
      productionCompleted: 'Production Completed',
      pendingProduction: 'Pending Production',
      groupRevenue: 'Total Group Revenue',
      pendingPayments: 'Pending Member Payments',
      upcomingDeadlines: 'Upcoming Deadlines',
      recentActivities: 'Recent Operations Log',
      aiAlerts: 'Sakhi AI Live Alerts',
      firstPassRate: 'Quality Approval Rate',
      viewAll: 'View Details',
    },
    orders: {
      title: 'Bulk Order Management',
      subtitle: 'Track production lifecycles, milestones and buyer commitments',
      createNew: 'Create Bulk Order',
      orderId: 'Order ID',
      buyer: 'Buyer / Client',
      product: 'Product Name',
      quantity: 'Total Units',
      deadline: 'Deadline',
      status: 'Status',
      risk: 'Delivery Risk',
      progress: 'Progress',
      actions: 'Actions',
      viewQr: 'QR Passport',
      filterAll: 'All Orders',
      searchPlaceholder: 'Search orders, buyers or products...',
    },
    allocation: {
      title: 'AI-Powered Fair Work Allocation',
      subtitle: 'Equitable task distribution balancing capacity, skills and deadlines',
      fairDistributionEngine: 'Fair Allocation Engine',
      availableCapacity: 'Available Capacity',
      currentWorkload: 'Current Workload',
      suggestedAllocation: 'AI Suggested Units',
      assignedQuantity: 'Assigned Units',
      completedQuantity: 'Completed',
      approveAllocation: 'Approve Proposed Allocation',
      rejectAllocation: 'Reject & Modify',
      modifyAllocation: 'Adjust Quantities',
      allocationGuarantee: 'Allocation Balance: Total assigned units must match order requirement.',
      aiExplanation: 'Why Sakhi AI recommended this allocation',
    },
    pricing: {
      title: 'Intelligent Pricing & Cost Calculator',
      subtitle: 'Accurate cost breakdown ensuring fair wages and healthy SHG margins',
      rawMaterial: 'Raw Material Cost (₹)',
      labourCost: 'Artisan Labour Cost (₹)',
      packagingCost: 'Packaging & Eco-Tags (₹)',
      transportCost: 'Transportation & Logistics (₹)',
      otherExpenses: 'Other Operating Expenses (₹)',
      desiredMargin: 'Target Profit Margin (%)',
      totalCost: 'Total Production Cost',
      costPerUnit: 'Cost Per Product',
      suggestedSellingPrice: 'Suggested Selling Price',
      expectedProfit: 'Expected Net Profit',
      formulaExplanation: 'Formula: Selling Price = Total Cost / (1 - Profit Margin)',
    },
    quality: {
      title: 'Quality Management & Inspection',
      subtitle: 'Rigorous multi-point inspection ensuring zero defective dispatches',
      inspectionDashboard: 'Product Inspection Ledger',
      assignedArtisan: 'Assigned Artisan',
      completedQty: 'Completed Units',
      approvedQty: 'Approved Units',
      rejectedQty: 'Rejected Units',
      inspectionDate: 'Inspection Date',
      inspectionChecklist: 'Standard Quality Checklist',
      remarks: 'Inspector Remarks',
      approveBatch: 'Approve & Release to Ledger',
      requestCorrection: 'Request Artisan Correction',
      rejectBatch: 'Reject Defective Batch',
      doNotAutoApproveNotice: 'Quality Guard: Completed units are NEVER auto-approved without physical inspection.',
    },
    payments: {
      title: 'Transparent Member Payment Ledger',
      subtitle: 'Verifiable earnings calculated solely from quality-approved production',
      memberLedger: 'Artisan Financial Ledger',
      member: 'SHG Member',
      qualityApprovedQty: 'Approved Units',
      ratePerUnit: 'Agreed Piece Rate',
      totalEarnings: 'Total Earned',
      amountPaid: 'Disbursed',
      pendingBalance: 'Pending Balance',
      simulatePayment: 'Record Simulated Disbursement',
      formulaNotice: 'Formula: Pending Payment = Total Earned - Amount Paid',
      disclaimer: 'Notice: This module simulates disbursements for digital auditing. No real banking transfers occur.',
    },
    sakhiAI: {
      title: 'Sakhi AI Central Intelligence',
      subtitle: 'Agentic operational orchestrator with human-in-the-loop governance',
      agents: 'Specialized Agent Swarm',
      orderAgent: 'Order Intelligence Agent',
      allocationAgent: 'Work Allocation Agent',
      costAgent: 'Cost Intelligence Agent',
      qualityAgent: 'Quality Intelligence Agent',
      paymentAgent: 'Payment Transparency Agent',
      askPlaceholder: 'Ask Sakhi AI about production risks, fair allocations, pricing or ledger...',
      sendPrompt: 'Ask Agent',
      recommendedPrompts: 'Suggested Operational Inquiries',
      approvalRequired: 'Leader Authorization Required for Action',
      reviewAction: 'Review Proposal',
      approveAction: 'Approve & Execute Action',
      rejectAction: 'Dismiss Proposal',
      traceTitle: 'Agentic Execution Trace',
    },
  },
  hi: {
    appName: 'सखीसेतु AI',
    tagline: 'प्रौद्योगिकी, पारदर्शिता और विश्वास के साथ महिला सशक्तीकरण',
    shgName: 'सखी महिला स्वयं सहायता समूह',
    nav: {
      overview: 'अवलोकन (डैशबोर्ड)',
      orders: 'ऑर्डर प्रबंधन',
      workAllocation: 'कार्य आवंटन',
      pricingCalculator: 'मूल्य निर्धारण',
      qualityManagement: 'गुणवत्ता प्रबंधन',
      payments: 'भुगतान लेजर',
      sakhiAI: 'सखी AI',
      members: 'सदस्य दीदियां',
      reports: 'रिपोर्ट्स',
      settings: 'सेटिंग्स',
    },
    roles: {
      leader: 'समूह अध्यक्ष (लीडर)',
      leaderDesc: 'श्रीमती सुनीता देवी (अध्यक्ष)',
      member: 'समूह सदस्य (कारीगर)',
      memberDesc: 'मीना शर्मा (कारीगर दीदी)',
      buyer: 'खरीदार पोर्टल',
      buyerDesc: 'रमेश चंद्र (फैबक्राफ्ट)',
      switchRole: 'भूमिका बदलें',
    },
    overview: {
      title: 'परिचालन इंटेलिजेंस डैशबोर्ड',
      subtitle: 'उत्पादन, क्षमता, गुणवत्ता और पारदर्शी वित्तीय स्थिति',
      totalMembers: 'कुल सदस्य दीदियां',
      activeOrders: 'सक्रिय बल्क ऑर्डर्स',
      productionCompleted: 'पूर्ण उत्पादन',
      pendingProduction: 'लंबित उत्पादन',
      groupRevenue: 'समूह का कुल राजस्व',
      pendingPayments: 'लंबित भुगतान',
      upcomingDeadlines: 'आगामी समयसीमा',
      recentActivities: 'हाल की गतिविधियां',
      aiAlerts: 'सखी AI त्वरित अलर्ट',
      firstPassRate: 'गुणवत्ता स्वीकृति दर',
      viewAll: 'विवरण देखें',
    },
    orders: {
      title: 'बल्क ऑर्डर प्रबंधन',
      subtitle: 'ऑर्डर की प्रगति, समयसीमा और खरीदार विवरण की निगरानी',
      createNew: 'नया बल्क ऑर्डर बनाएं',
      orderId: 'ऑर्डर संख्या',
      buyer: 'खरीदार / कंपनी',
      product: 'उत्पाद का नाम',
      quantity: 'कुल मात्रा (पीस)',
      deadline: 'अंतिम तिथि',
      status: 'स्थिति',
      risk: 'वितरण जोखिम',
      progress: 'प्रगति',
      actions: 'कार्रवाई',
      viewQr: 'QR पासपोर्ट',
      filterAll: 'सभी ऑर्डर्स',
      searchPlaceholder: 'ऑर्डर, खरीदार या उत्पाद खोजें...',
    },
    allocation: {
      title: 'सखी AI निष्पक्ष कार्य आवंटन',
      subtitle: 'क्षमता, दक्षता और समयसीमा के आधार पर समान कार्य वितरण',
      fairDistributionEngine: 'निष्पक्ष कार्य वितरण इंजन',
      availableCapacity: 'उपलब्ध दैनिक क्षमता',
      currentWorkload: 'वर्तमान कार्यभार',
      suggestedAllocation: 'सखी AI अनुशंसित पीस',
      assignedQuantity: 'आवंटित मात्रा',
      completedQuantity: 'पूर्ण कार्य',
      approveAllocation: 'प्रस्तावित आवंटन स्वीकृत करें',
      rejectAllocation: 'अस्वीकार व संशोधन करें',
      modifyAllocation: 'मात्रा समायोजित करें',
      allocationGuarantee: 'आवंटन संतुलन: कुल आवंटित मात्रा ऑर्डर की मात्रा के बराबर होनी चाहिए।',
      aiExplanation: 'सखी AI ने यह वितरण क्यों प्रस्तावित किया',
    },
    pricing: {
      title: 'बुद्धिमान लागत और मूल्य कैलकुलेटर',
      subtitle: 'उचित मजदूरी और समूह का लाभ सुनिश्चित करने वाला वास्तविक गणित',
      rawMaterial: 'कच्चा माल लागत (₹)',
      labourCost: 'दीदियों का पारिश्रमिक (₹)',
      packagingCost: 'पैकिंग व टैग्स (₹)',
      transportCost: 'परिवहन व ढुलाई (₹)',
      otherExpenses: 'अन्य परिचालन व्यय (₹)',
      desiredMargin: 'लक्ष्य लाभ मार्जिन (%)',
      totalCost: 'कुल उत्पादन लागत',
      costPerUnit: 'प्रति उत्पाद लागत',
      suggestedSellingPrice: 'अनुशंसित विक्रय मूल्य',
      expectedProfit: 'अपेक्षित शुद्ध लाभ',
      formulaExplanation: 'सूत्र: विक्रय मूल्य = कुल लागत / (1 - लाभ मार्जिन)',
    },
    quality: {
      title: 'गुणवत्ता प्रबंधन और निरीक्षण',
      subtitle: 'कड़े निरीक्षण के बाद ही उत्पादों की डिलीवरी और भुगतान स्वीकृति',
      inspectionDashboard: 'उत्पाद निरीक्षण लेजर',
      assignedArtisan: 'कारीगर दीदी',
      completedQty: 'पूर्ण उत्पाद',
      approvedQty: 'स्वीकृत उत्पाद',
      rejectedQty: 'अस्वीकृत उत्पाद',
      inspectionDate: 'निरीक्षण तिथि',
      inspectionChecklist: 'मानक गुणवत्ता चेकलिस्ट',
      remarks: 'निरीक्षक टिप्पणी',
      approveBatch: 'स्वीकृत करें व लेजर में जोड़ें',
      requestCorrection: 'कारीगर से सुधार का अनुरोध करें',
      rejectBatch: 'खराब बैच अस्वीकार करें',
      doNotAutoApproveNotice: 'गुणवत्ता नियम: बिना भौतिक निरीक्षण के पूर्ण उत्पाद कभी स्वतः स्वीकृत नहीं होते।',
    },
    payments: {
      title: 'पारदर्शी सदस्य भुगतान लेजर',
      subtitle: 'केवल गुणवत्ता-स्वीकृत कार्य पर आधारित पारदर्शी आय और बकाया',
      memberLedger: 'सदस्य वित्तीय लेजर',
      member: 'सदस्य दीदी',
      qualityApprovedQty: 'स्वीकृत पीस',
      ratePerUnit: 'तय दर (प्रति पीस)',
      totalEarnings: 'कुल अर्जित राशि',
      amountPaid: 'भुगतान की गई राशि',
      pendingBalance: 'लंबित बकाया राशि',
      simulatePayment: 'सिम्युलेटेड भुगतान दर्ज करें',
      formulaNotice: 'सूत्र: लंबित भुगतान = कुल अर्जित राशि - दी गई राशि',
      disclaimer: 'सूचना: यह मॉड्यूल डिजिटल ऑडिट हेतु भुगतान का सिमुलेशन करता है। यह कोई प्रत्यक्ष बैंक ट्रांसफर नहीं है।',
    },
    sakhiAI: {
      title: 'सखी AI केंद्रीय परिचालन इंटेलिजेंस',
      subtitle: 'मानव स्वीकृति आधारित 5 विशिष्ट एजेंटों की प्रणाली',
      agents: 'विशिष्ट एजेंट समूह',
      orderAgent: 'ऑर्डर इंटेलिजेंस एजेंट',
      allocationAgent: 'कार्य आवंटन एजेंट',
      costAgent: 'लागत इंटेलिजेंस एजेंट',
      qualityAgent: 'गुणवत्ता इंटेलिजेंस एजेंट',
      paymentAgent: 'भुगतान पारदर्शिता एजेंट',
      askPlaceholder: 'सखी AI से जोखिम, निष्पक्ष आवंटन, लागत या भुगतान के बारे में पूछें...',
      sendPrompt: 'पूछें',
      recommendedPrompts: 'सुझाए गए परिचालन प्रश्न',
      approvalRequired: 'कार्रवाई हेतु अध्यक्ष दीदी की स्वीकृति आवश्यक है',
      reviewAction: 'प्रस्ताव की समीक्षा करें',
      approveAction: 'स्वीकृत करें और लागू करें',
      rejectAction: 'अस्वीकार करें',
      traceTitle: 'एजेंटिक निष्पादन विश्लेषण',
    },
  },
};
