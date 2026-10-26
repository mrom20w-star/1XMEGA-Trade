import React, { useState, useEffect } from 'react';
import { AssetPair, ASSET_PAIRS, TradingSignal, OFFICIAL_LINKS } from './types/trading';
import { Header } from './components/Header';
import { OnboardingModal } from './components/OnboardingModal';
import { AssetSelector } from './components/AssetSelector';
import { LiveTradingChart } from './components/LiveTradingChart';
import { SignalGenerator } from './components/SignalGenerator';
import { SignalHistory } from './components/SignalHistory';
import { MarketSentiment } from './components/MarketSentiment';
import {
  Send,
  Youtube,
  ShieldAlert,
  Flame,
  Award,
  TrendingUp,
  Download,
  ExternalLink,
} from 'lucide-react';

export default function App() {
  const [selectedPair, setSelectedPair] = useState<AssetPair>(ASSET_PAIRS[0]);
  const [timeframe, setTimeframe] = useState<string>('1M');
  const [activeSignal, setActiveSignal] = useState<TradingSignal | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const [signalHistory, setSignalHistory] = useState<TradingSignal[]>([]);

  // Check persistent onboarding status on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('1xmega_onboarding_completed');
      if (stored === 'true') {
        setShowOnboarding(false);
      }
    } catch {
      // LocalStorage error fallback
    }

    // Seed realistic past signals
    const now = Date.now();
    const seededHistory: TradingSignal[] = [
      {
        id: 'SIG-1',
        pairId: 'EURUSD',
        pairName: 'EUR / USD',
        type: 'BUY',
        entryPrice: 1.08412,
        timeframe: '1 دقيقة',
        accuracy: 96.2,
        timestamp: now - 3 * 60 * 1000,
        indicators: {
          rsi: 28,
          macd: 'تقاطع إيجابي (صعود)',
          bollinger: 'اختراق الحد السفلي',
          trend: 'صاعد قوي',
        },
        status: 'WIN',
      },
      {
        id: 'SIG-2',
        pairId: 'XAUUSD',
        pairName: 'الذهب XAU / USD',
        type: 'SELL',
        entryPrice: 2735.8,
        timeframe: '5 دقائق',
        accuracy: 94.8,
        timestamp: now - 8 * 60 * 1000,
        indicators: {
          rsi: 78,
          macd: 'تقاطع سلبي (هبوط)',
          bollinger: 'اختراق الحد العلوي',
          trend: 'هابط قوي',
        },
        status: 'WIN',
      },
      {
        id: 'SIG-3',
        pairId: 'BTCUSDT',
        pairName: 'BTC / USDT',
        type: 'BUY',
        entryPrice: 67390.0,
        timeframe: '1 دقيقة',
        accuracy: 97.5,
        timestamp: now - 14 * 60 * 1000,
        indicators: {
          rsi: 31,
          macd: 'تقاطع إيجابي (صعود)',
          bollinger: 'استقرار ضمن النطاق',
          trend: 'صاعد قوي',
        },
        status: 'WIN',
      },
    ];
    setSignalHistory(seededHistory);
  }, []);

  // Initialize live prices
  useEffect(() => {
    const initial: Record<string, number> = {};
    ASSET_PAIRS.forEach((p) => {
      initial[p.id] = p.basePrice;
    });
    setLivePrices(initial);
  }, []);

  // Natural price ticker interval
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrices((prev) => {
        const next = { ...prev };
        ASSET_PAIRS.forEach((p) => {
          const current = next[p.id] || p.basePrice;
          const volMultiplier = p.volatility === 'عالية' ? 0.0006 : 0.0002;
          const delta = (Math.random() - 0.49) * p.basePrice * volMultiplier;
          next[p.id] = Number((current + delta).toFixed(p.decimals));
        });
        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const handleCompleteOnboarding = () => {
    try {
      localStorage.setItem('1xmega_onboarding_completed', 'true');
    } catch {
      // LocalStorage error fallback
    }
    setShowOnboarding(false);
  };

  const handleSignalGenerated = (newSignal: TradingSignal) => {
    setSignalHistory((prev) => [newSignal, ...prev]);
  };

  const currentPrice = livePrices[selectedPair.id] || selectedPair.basePrice;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-['Cairo',sans-serif] selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Onboarding Gate Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleCompleteOnboarding}
      />

      {/* Main Header */}
      <Header onReopenOnboarding={() => setShowOnboarding(true)} />

      {/* Hero Quick Banner */}
      <div className="bg-gradient-to-r from-[#0d162d] via-[#091124] to-[#070b14] border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-white text-sm">
              إشارات تداول الذكاء الاصطناعي 1XMEGA VIP
            </span>
            <span className="text-slate-400 hidden md:inline">
              | تحليل لحظي لخوارزميات السوق ونقاط الدخول الدقيقة
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-bold bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20 flex items-center gap-1">
              <Award size={14} /> كود البرومو: {OFFICIAL_LINKS.promoCode} (بونص 100%)
            </span>
            <a
              href={OFFICIAL_LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-bold"
            >
              <Send size={13} />
              <span>قناة التليجرام</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 space-y-5">
        {/* Asset Selector */}
        <AssetSelector
          selectedPair={selectedPair}
          onSelectPair={(p) => setSelectedPair(p)}
          livePrices={livePrices}
        />

        {/* 2-Column Core Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column (Chart & Market Sentiment) - 7 cols on LG */}
          <div className="lg:col-span-7 space-y-5">
            <LiveTradingChart
              pair={selectedPair}
              activeSignal={activeSignal}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              currentLivePrice={currentPrice}
            />

            <MarketSentiment pair={selectedPair} />
          </div>

          {/* Right Column (Signal Generator & History) - 5 cols on LG */}
          <div className="lg:col-span-5 space-y-5">
            <SignalGenerator
              pair={selectedPair}
              currentLivePrice={currentPrice}
              timeframe={timeframe}
              activeSignal={activeSignal}
              setActiveSignal={setActiveSignal}
              onSignalGenerated={handleSignalGenerated}
            />

            <SignalHistory history={signalHistory} />
          </div>
        </div>
      </main>

      {/* Official Footer */}
      <footer className="mt-12 bg-[#05080f] border-t border-slate-850 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center font-black text-slate-950">
              1X
            </div>
            <div>
              <div className="font-bold text-white text-sm">قناة 1XMEGA Trade الرسمية</div>
              <p className="text-[11px] text-slate-500">
                فيديو التداول الأول اليوم الساعة 4:00 مساءً بتوقيت القاهرة
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={OFFICIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-bold"
            >
              <Youtube size={15} />
              <span>اليوتيوب: @1xmegatrading</span>
            </a>

            <a
              href={OFFICIAL_LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-bold"
            >
              <Send size={15} />
              <span>التليجرام: @onexmega_Trading</span>
            </a>

            <a
              href={OFFICIAL_LINKS.platformDownload}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold"
            >
              <Download size={15} />
              <span>تحميل المنصة (PulseTrade)</span>
            </a>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-[11px] text-center md:text-left">
            <ShieldAlert size={14} className="shrink-0 text-amber-500/70" />
            <span>التداول ينطوي على مخاطر مالية. استخدم الإدارة المالية وإشارات 1XMEGA بمسؤولية.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
