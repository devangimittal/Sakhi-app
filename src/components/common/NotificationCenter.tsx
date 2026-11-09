import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  Calendar,
  IndianRupee,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  Volume2,
  VolumeX,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppNotification, NotificationCategory } from '../../types';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotification,
    clearAllNotifications,
    simulateLiveAlert,
    setActiveTab,
    language,
    orders,
    payments,
    qualityChecks,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | NotificationCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Play subtle web audio chime on new alerts
  const playChime = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // AudioContext policy fallback - ignore silent failures
    }
  };

  // Close on outside click or escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Dynamic counts per category
  const counts = useMemo(() => {
    return {
      ALL: notifications.length,
      DEADLINE: notifications.filter((n) => n.category === 'DEADLINE').length,
      PAYMENT: notifications.filter((n) => n.category === 'PAYMENT').length,
      QUALITY: notifications.filter((n) => n.category === 'QUALITY').length,
      ORDER: notifications.filter((n) => n.category === 'ORDER').length,
    };
  }, [notifications]);

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((n) => {
        if (activeFilter === 'ALL') return true;
        return n.category === activeFilter;
      })
      .filter((n) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const title = (language === 'hi' && n.titleHi ? n.titleHi : n.title).toLowerCase();
        const msg = (language === 'hi' && n.messageHi ? n.messageHi : n.message).toLowerCase();
        return title.includes(q) || msg.includes(q) || n.category.toLowerCase().includes(q);
      });
  }, [notifications, activeFilter, searchQuery, language]);

  const handleActionClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.targetTab) {
      setActiveTab(notif.targetTab);
      setIsOpen(false);
    }
  };

  const handleSimulate = (type: 'DEADLINE' | 'PAYMENT' | 'QUALITY') => {
    simulateLiveAlert(type);
    playChime();
  };

  // Category Icon & Label mapping
  const getCategoryMeta = (cat: NotificationCategory) => {
    switch (cat) {
      case 'DEADLINE':
        return {
          icon: <Calendar className="h-3.5 w-3.5 text-rose-600" />,
          labelEn: 'Deadline',
          labelHi: 'समयसीमा',
          badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        };
      case 'PAYMENT':
        return {
          icon: <IndianRupee className="h-3.5 w-3.5 text-emerald-600" />,
          labelEn: 'Payment',
          labelHi: 'भुगतान',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'QUALITY':
        return {
          icon: <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />,
          labelEn: 'Quality',
          labelHi: 'गुणवत्ता',
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'ORDER':
      default:
        return {
          icon: <ShoppingBag className="h-3.5 w-3.5 text-purple-600" />,
          labelEn: 'Order',
          labelHi: 'ऑर्डर',
          badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
        };
    }
  };

  // Urgency visual styling
  const getUrgencyStyles = (urgency: AppNotification['urgency']) => {
    switch (urgency) {
      case 'CRITICAL':
        return {
          border: 'border-l-4 border-l-rose-500 bg-rose-50/30 hover:bg-rose-50/50',
          icon: <AlertOctagon className="h-4 w-4 text-rose-600 shrink-0" />,
          badge: 'bg-rose-100 text-rose-800',
        };
      case 'WARNING':
        return {
          border: 'border-l-4 border-l-amber-500 bg-amber-50/30 hover:bg-amber-50/50',
          icon: <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />,
          badge: 'bg-amber-100 text-amber-800',
        };
      case 'SUCCESS':
        return {
          border: 'border-l-4 border-l-emerald-500 bg-emerald-50/30 hover:bg-emerald-50/50',
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />,
          badge: 'bg-emerald-100 text-emerald-800',
        };
      case 'INFO':
      default:
        return {
          border: 'border-l-4 border-l-purple-500 bg-purple-50/20 hover:bg-purple-50/40',
          icon: <Info className="h-4 w-4 text-purple-600 shrink-0" />,
          badge: 'bg-purple-100 text-purple-800',
        };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Header Bell Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center justify-center p-2 rounded-lg border transition-all ${
          isOpen
            ? 'bg-purple-100/70 border-purple-300 text-purple-950 shadow-xs'
            : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:text-stone-900 hover:border-purple-300'
        }`}
        title={
          language === 'hi'
            ? `सूचना केंद्र (${unreadNotificationCount} नए अलर्ट)`
            : `Notification Center (${unreadNotificationCount} unread alerts)`
        }
        aria-label="Toggle notifications center"
        aria-expanded={isOpen}
      >
        <Bell className="h-4 w-4 text-stone-700" />

        {/* Unread Badge Counter */}
        {unreadNotificationCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white shadow-2xs tabular-nums animate-pulse">
            {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
          </span>
        )}
      </button>

      {/* Flyout Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[340px] sm:w-[420px] md:w-[460px] rounded-2xl border border-stone-200 bg-white shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-stone-900 px-4 py-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/20 text-amber-300">
                <Bell className="h-3.5 w-3.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                  <span>{language === 'hi' ? 'परिचालन सूचना केंद्र' : 'Live Operational Alerts'}</span>
                  {unreadNotificationCount > 0 && (
                    <span className="text-[10px] font-semibold bg-rose-500 text-white px-1.5 py-0.2 rounded-full">
                      {unreadNotificationCount} {language === 'hi' ? 'नए' : 'new'}
                    </span>
                  )}
                </h3>
                <p className="text-[10px] text-purple-200">
                  {language === 'hi'
                    ? 'डेडलाइन, भुगतान एवं गुणवत्ता परिणाम'
                    : 'Deadlines, payment payouts & quality inspections'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1 rounded-md text-purple-200 hover:text-white hover:bg-purple-800/60 transition-colors"
                title={soundEnabled ? 'Mute alert chime' : 'Enable alert chime'}
              >
                {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5 opacity-60" />}
              </button>

              <button
                onClick={() => markAllNotificationsAsRead()}
                disabled={unreadNotificationCount === 0}
                className="p-1 rounded-md text-purple-200 hover:text-white hover:bg-purple-800/60 transition-colors disabled:opacity-40"
                title={language === 'hi' ? 'सभी को पढ़ा हुआ चिह्नित करें' : 'Mark all as read'}
              >
                <CheckCheck className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-purple-200 hover:text-white hover:bg-purple-800/60 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Filter Categories Bar */}
          <div className="flex items-center border-b border-stone-200 bg-stone-50 px-2 py-1.5 overflow-x-auto text-xs gap-1">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all whitespace-nowrap text-[11px] ${
                activeFilter === 'ALL'
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-200/60'
              }`}
            >
              {language === 'hi' ? 'सभी' : 'All'} ({counts.ALL})
            </button>

            <button
              onClick={() => setActiveFilter('DEADLINE')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all whitespace-nowrap text-[11px] ${
                activeFilter === 'DEADLINE'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-rose-50 hover:text-rose-700'
              }`}
            >
              <Calendar className="h-3 w-3" />
              <span>{language === 'hi' ? 'समयसीमा' : 'Deadlines'}</span>
              <span className="opacity-80">({counts.DEADLINE})</span>
            </button>

            <button
              onClick={() => setActiveFilter('PAYMENT')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all whitespace-nowrap text-[11px] ${
                activeFilter === 'PAYMENT'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <IndianRupee className="h-3 w-3" />
              <span>{language === 'hi' ? 'भुगतान' : 'Payments'}</span>
              <span className="opacity-80">({counts.PAYMENT})</span>
            </button>

            <button
              onClick={() => setActiveFilter('QUALITY')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all whitespace-nowrap text-[11px] ${
                activeFilter === 'QUALITY'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-amber-50 hover:text-amber-700'
              }`}
            >
              <ShieldCheck className="h-3 w-3" />
              <span>{language === 'hi' ? 'गुणवत्ता' : 'Quality'}</span>
              <span className="opacity-80">({counts.QUALITY})</span>
            </button>
          </div>

          {/* Quick Search Input */}
          <div className="p-2 border-b border-stone-100 bg-white">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
              <input
                type="text"
                placeholder={
                  language === 'hi'
                    ? 'अलर्ट, ऑर्डर या कारीगर खोजें...'
                    : 'Filter alerts, orders or artisans...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Notification List Scroll Area */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-stone-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-400 mb-2">
                  <Bell className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold text-stone-700">
                  {language === 'hi' ? 'कोई सूचना नहीं मिली' : 'No notifications match this view'}
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  {language === 'hi'
                    ? 'सभी परिचालन मानक सामान्य हैं'
                    : 'All operational parameters are currently operating normally.'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif, idx) => {
                const categoryMeta = getCategoryMeta(notif.category);
                const urgencyStyle = getUrgencyStyles(notif.urgency);
                const displayTitle = language === 'hi' && notif.titleHi ? notif.titleHi : notif.title;
                const displayMessage = language === 'hi' && notif.messageHi ? notif.messageHi : notif.message;
                const displayAction = language === 'hi' && notif.actionLabelHi ? notif.actionLabelHi : notif.actionLabel;

                return (
                  <div
                    key={`${notif.id || 'notif'}-${idx}`}
                    className={`p-3 transition-colors ${
                      notif.read ? 'bg-white opacity-80 hover:opacity-100' : 'bg-stone-50/60 font-medium'
                    } ${urgencyStyle.border}`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">{urgencyStyle.icon}</div>
                        <div>
                          {/* Category Tag & Timestamp */}
                          <div className="flex items-center gap-1.5 text-[10px] mb-1">
                            <span
                              className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded border font-semibold ${categoryMeta.badgeClass}`}
                            >
                              {categoryMeta.icon}
                              <span>{language === 'hi' ? categoryMeta.labelHi : categoryMeta.labelEn}</span>
                            </span>
                            <span className="text-stone-400">·</span>
                            <span className="text-stone-400 font-mono">{notif.timestamp}</span>
                            {!notif.read && (
                              <span className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-pulse" />
                            )}
                          </div>

                          {/* Title & Description */}
                          <h4 className="text-xs font-bold text-stone-900 leading-snug">
                            {displayTitle}
                          </h4>
                          <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                            {displayMessage}
                          </p>

                          {/* Quick Action Link / Button */}
                          {displayAction && (
                            <div className="mt-2 flex items-center gap-2">
                              <button
                                onClick={() => handleActionClick(notif)}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-900 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded-md border border-purple-200 transition-colors"
                              >
                                <span>{displayAction}</span>
                                <ExternalLink className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Dismiss Button */}
                      <button
                        onClick={() => clearNotification(notif.id)}
                        className="text-stone-300 hover:text-stone-600 p-1 rounded-md transition-colors shrink-0"
                        title={language === 'hi' ? 'अलर्ट हटाएं' : 'Dismiss alert'}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Controls & Live Simulator */}
          <div className="border-t border-stone-200 bg-stone-50 px-3 py-2.5 text-xs flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-stone-500 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>{language === 'hi' ? 'रीयल-टाइम मॉनिटर सक्रिय' : 'Real-time Event Stream Active'}</span>
              </span>

              {notifications.length > 0 && (
                <button
                  onClick={() => clearAllNotifications()}
                  className="text-[10px] font-semibold text-stone-500 hover:text-rose-700 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>{language === 'hi' ? 'सभी हटाएं' : 'Clear all'}</span>
                </button>
              )}
            </div>

            {/* Live Demonstration Test Trigger Strip */}
            <div className="pt-2 border-t border-stone-200/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-purple-950 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  <span>{language === 'hi' ? 'लाइव अलर्ट सिमुलेटर' : 'Live Alert Simulator'}</span>
                </span>
                <span className="text-[9px] text-stone-400">
                  {language === 'hi' ? 'डेमो हेतु क्लिक करें' : 'Click to test real-time alerts'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleSimulate('DEADLINE')}
                  className="px-2 py-1 rounded bg-white border border-rose-200 text-rose-800 text-[10px] font-semibold hover:bg-rose-50 transition-colors text-center"
                >
                  + {language === 'hi' ? 'डेडलाइन' : 'Deadline'}
                </button>
                <button
                  onClick={() => handleSimulate('PAYMENT')}
                  className="px-2 py-1 rounded bg-white border border-emerald-200 text-emerald-800 text-[10px] font-semibold hover:bg-emerald-50 transition-colors text-center"
                >
                  + {language === 'hi' ? 'भुगतान' : 'Payment'}
                </button>
                <button
                  onClick={() => handleSimulate('QUALITY')}
                  className="px-2 py-1 rounded bg-white border border-amber-200 text-amber-800 text-[10px] font-semibold hover:bg-amber-50 transition-colors text-center"
                >
                  + {language === 'hi' ? 'गुणवत्ता' : 'Quality'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
