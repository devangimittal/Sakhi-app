import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AgentCapability } from '../../types';

export const SakhiAIModule: React.FC = () => {
  const {
    chatMessages,
    isAgentLoading,
    sendAgentMessage,
    approveAction,
    rejectAction,
    language,
    t,
    role,
    hasApiKey,
  } = useApp();

  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<AgentCapability>('CENTRAL_ORCHESTRATOR');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isHindi = language === 'hi';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isAgentLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isAgentLoading) return;
    const promptToSend = inputPrompt;
    setInputPrompt('');
    sendAgentMessage(promptToSend, selectedAgent);
  };

  const recommendedPrompts = [
    {
      label: isHindi ? 'क्या हम समय पर ऑर्डर पूरा कर पाएंगे?' : 'Can we complete this order before deadline?',
      agent: 'ORDER_INTELLIGENCE_AGENT' as AgentCapability,
      prompt: isHindi
        ? 'क्या हम ऑर्डर ORD-2026-001 (100 कॉटन बैग्स) 2 दिन की समयसीमा से पहले पूरा कर सकते हैं?'
        : 'Can we complete order ORD-2026-001 (100 cotton bags) before the 2-day deadline? Identify bottlenecks and run-rate.',
    },
    {
      label: isHindi ? 'किन दीदियों के पास अतिरिक्त क्षमता है?' : 'Which members currently have spare capacity?',
      agent: 'WORK_ALLOCATION_AGENT' as AgentCapability,
      prompt: isHindi
        ? 'समूह की किन-किन कारीगर दीदियों के पास अभी अतिरिक्त दैनिक उत्पादन क्षमता उपलब्ध है?'
        : 'Which SHG members currently have spare daily capacity to absorb remaining order workload?',
    },
    {
      label: isHindi ? 'शेष कार्य का निष्पक्ष वितरण करें' : 'Distribute the remaining work fairly',
      agent: 'WORK_ALLOCATION_AGENT' as AgentCapability,
      prompt: isHindi
        ? 'ऑर्डर ORD-2026-001 के शेष 40 बैग्स का उपलब्ध दीदियों में निष्पक्ष और न्यायसंगत वितरण करें।'
        : 'Generate a fair work allocation proposal for the remaining 40 bags across high-capacity members.',
    },
    {
      label: isHindi ? 'ऑर्डर का सही विक्रय मूल्य निकालें' : 'Calculate the selling price of this order',
      agent: 'COST_INTELLIGENCE_AGENT' as AgentCapability,
      prompt: isHindi
        ? 'कच्चा माल ₹4500 और श्रम ₹3500 पर 20% मार्जिन के साथ अनुशंसित विक्रय मूल्य की गणना करें।'
        : 'Calculate the sustainable selling price and profit margin for 100 cotton bags with ₹9,000 production cost.',
    },
    {
      label: isHindi ? 'किन दीदियों का भुगतान बकाया है?' : 'Identify members with pending payments',
      agent: 'PAYMENT_TRANSPARENCY_AGENT' as AgentCapability,
      prompt: isHindi
        ? 'गुणवत्ता स्वीकृत कार्य के आधार पर किन दीदियों का कितना भुगतान लंबित है? ऑडिट रिपोर्ट दें।'
        : 'Reconcile the payment ledger for approved production and identify members with outstanding payments.',
    },
    {
      label: isHindi ? 'यह ऑर्डर उच्च जोखिम में क्यों है?' : 'Why was this order marked as high risk?',
      agent: 'ORDER_INTELLIGENCE_AGENT' as AgentCapability,
      prompt: isHindi
        ? 'ऑर्डर ORD-2026-001 को उच्च जोखिम (High Risk) के रूप में क्यों चिह्नित किया गया था?'
        : 'Explain the mathematical and capacity factors why order ORD-2026-001 was flagged as high delivery risk.',
    },
    {
      label: isHindi ? 'गुणवत्ता अस्वीकृति दर व कारण क्या हैं?' : 'Which products have highest rejection patterns?',
      agent: 'QUALITY_INTELLIGENCE_AGENT' as AgentCapability,
      prompt: isHindi
        ? 'हाल के गुणवत्ता निरीक्षण में कौन-से दोष पाए गए और उनके सुधारात्मक उपाय क्या हैं?'
        : 'Analyze quality inspection records, root causes of pending corrections, and suggest defect mitigation.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Engine Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">{t('sakhiAI.title')}</h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-mono">
              v1.0 Agent Swarm
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">{t('sakhiAI.subtitle')}</p>
        </div>

        {/* Engine status pill */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg border border-purple-200 bg-purple-50 text-purple-900 font-medium">
            <Cpu className="h-3.5 w-3.5 text-purple-700" />
            <span>{hasApiKey ? 'Gemini 3.8 Flash + Tools' : 'Deterministic Applied AI Engine'}</span>
          </span>
        </div>
      </div>

      {/* 5 Specialized Agent Capability Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedAgent('CENTRAL_ORCHESTRATOR')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
            selectedAgent === 'CENTRAL_ORCHESTRATOR'
              ? 'bg-purple-950 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Bot className="h-3.5 w-3.5" />
          <span>Central Orchestrator</span>
        </button>

        <button
          onClick={() => setSelectedAgent('ORDER_INTELLIGENCE_AGENT')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
            selectedAgent === 'ORDER_INTELLIGENCE_AGENT'
              ? 'bg-purple-950 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <span>Order Intelligence</span>
        </button>

        <button
          onClick={() => setSelectedAgent('WORK_ALLOCATION_AGENT')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
            selectedAgent === 'WORK_ALLOCATION_AGENT'
              ? 'bg-purple-950 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <span>Work Allocation</span>
        </button>

        <button
          onClick={() => setSelectedAgent('COST_INTELLIGENCE_AGENT')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
            selectedAgent === 'COST_INTELLIGENCE_AGENT'
              ? 'bg-purple-950 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <span>Cost & Pricing</span>
        </button>

        <button
          onClick={() => setSelectedAgent('QUALITY_INTELLIGENCE_AGENT')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
            selectedAgent === 'QUALITY_INTELLIGENCE_AGENT'
              ? 'bg-purple-950 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <span>Quality Intelligence</span>
        </button>

        <button
          onClick={() => setSelectedAgent('PAYMENT_TRANSPARENCY_AGENT')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
            selectedAgent === 'PAYMENT_TRANSPARENCY_AGENT'
              ? 'bg-purple-950 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <span>Payment Transparency</span>
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div>
        <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
          {t('sakhiAI.recommendedPrompts')}
        </div>
        <div className="flex flex-wrap gap-2">
          {recommendedPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedAgent(item.agent);
                sendAgentMessage(item.prompt, item.agent);
              }}
              className="text-xs px-3 py-1.5 rounded-lg border border-purple-200 bg-white text-purple-950 hover:bg-purple-50 hover:border-purple-300 font-medium transition-all shadow-2xs text-left"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="rounded-xl border border-stone-200 bg-white p-4 sm:p-6 shadow-xs flex flex-col min-h-[480px] max-h-[640px] overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="h-8 w-8 rounded-lg bg-purple-900 text-amber-300 flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                    isUser
                      ? 'bg-purple-900 text-white rounded-tr-xs'
                      : 'bg-stone-50 text-stone-800 border border-stone-200 rounded-tl-xs'
                  }`}
                >
                  {/* Sender & Agent capability tag */}
                  <div className="flex items-center justify-between text-[10px] pb-1 border-b border-black/10">
                    <span className="font-semibold uppercase tracking-wider">
                      {isUser ? 'You' : msg.agentType || 'Sakhi AI Central Orchestrator'}
                    </span>
                    <span className="opacity-70 font-mono">{msg.timestamp}</span>
                  </div>

                  {/* Message body (rendered with clean paragraphs and bolding) */}
                  <div className="whitespace-pre-line space-y-2">
                    {msg.text}
                  </div>

                  {/* VISIBLE AGENTIC EXECUTION TRACE PANEL */}
                  {msg.trace && (
                    <div className="mt-3 p-3 rounded-xl bg-purple-900/5 border border-purple-200 text-[11px] text-stone-700 space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-purple-950">
                        <span className="flex items-center gap-1.5">
                          <Cpu className="h-3.5 w-3.5 text-purple-700" />
                          <span>{t('sakhiAI.traceTitle')}</span>
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold">
                          VERIFIED
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-stone-600">
                        <div>
                          <strong className="text-stone-800">1. Data Retrieved:</strong> {msg.trace.dataRetrieved}
                        </div>
                        <div>
                          <strong className="text-stone-800">2. Analysis:</strong> {msg.trace.analysisCompleted}
                        </div>
                        <div>
                          <strong className="text-stone-800">3. Risk Level:</strong>{' '}
                          <span
                            className={`font-semibold ${
                              msg.trace.riskLevel === 'HIGH' ? 'text-amber-800' : 'text-emerald-700'
                            }`}
                          >
                            {msg.trace.riskLevel}
                          </span>
                        </div>
                        <div>
                          <strong className="text-stone-800">4. Human Approval:</strong> Required before execution
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ACTIONABLE HUMAN-IN-THE-LOOP APPROVAL BANNER */}
                  {msg.suggestedAction && (
                    <div className="mt-3 p-4 rounded-xl bg-white border border-purple-300 shadow-sm space-y-3 text-stone-900">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded bg-amber-100 text-amber-800">
                            <ShieldCheck className="h-4 w-4" />
                          </span>
                          <span className="font-bold text-xs text-purple-950">
                            {msg.suggestedAction.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                          {t('sakhiAI.approvalRequired')}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600">
                        {msg.suggestedAction.description}
                      </p>

                      {/* Approval buttons */}
                      {msg.approvalStatus === 'IDLE' ? (
                        <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2">
                          <button
                            onClick={() => rejectAction(msg.id)}
                            className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 font-medium hover:bg-stone-50 text-xs"
                          >
                            {t('sakhiAI.rejectAction')}
                          </button>
                          <button
                            onClick={() => approveAction(msg.id, msg.suggestedAction)}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-purple-900 text-white font-semibold hover:bg-purple-950 text-xs shadow-xs"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>{t('sakhiAI.approveAction')}</span>
                          </button>
                        </div>
                      ) : msg.approvalStatus === 'APPROVED' ? (
                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>Leader Authorized · Action Executed & Recorded to Audit Log!</span>
                        </div>
                      ) : (
                        <div className="p-2 rounded-lg bg-stone-100 text-stone-600 text-xs font-medium flex items-center gap-2">
                          <X className="h-4 w-4" />
                          <span>Proposal dismissed by SHG Leader.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="h-8 w-8 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isAgentLoading && (
            <div className="flex gap-3 items-center text-xs text-stone-500">
              <div className="h-8 w-8 rounded-lg bg-purple-900 text-amber-300 flex items-center justify-center shrink-0 animate-pulse">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-700 animate-bounce" />
                <div className="h-2 w-2 rounded-full bg-purple-700 animate-bounce [animation-delay:0.2s]" />
                <div className="h-2 w-2 rounded-full bg-purple-700 animate-bounce [animation-delay:0.4s]" />
                <span>Sakhi AI Agent evaluating constraints and querying ledger...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-stone-100 flex gap-2">
          <input
            type="text"
            placeholder={t('sakhiAI.askPlaceholder')}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={isAgentLoading}
            className="flex-1 rounded-xl border border-stone-300 px-4 py-2.5 text-xs focus:outline-hidden focus:border-purple-700 bg-stone-50/50"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isAgentLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-900 text-white text-xs font-semibold hover:bg-purple-950 transition-colors shadow-xs disabled:opacity-40"
          >
            <span>{t('sakhiAI.sendPrompt')}</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
