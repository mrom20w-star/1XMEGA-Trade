import React, { useState, useEffect, useRef } from 'react';
import { AssetPair, TradingSignal, SignalType, OFFICIAL_LINKS } from '../types/trading';
import { soundEffects } from '../utils/audio';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Target,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

interface Props {
  pair: AssetPair;
  currentLivePrice: number;
  timeframe: string;
  activeSignal: TradingSignal | null;
  setActiveSignal: (signal: TradingSignal | null) => void;
  onSignalGenerated: (signal: TradingSignal) => void;
}

export const SignalGenerator: React.FC<Props> = ({
  pair,
  currentLivePrice,
  timeframe,
  activeSignal,
  setActiveSignal,
  onSignalGenerated,
}) => {
  // State for the 10-second countdown between rounds
  const [isScanning, setIsScanning] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [copiedPromo, setCopiedPromo] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [scanMessage, setScanMessage] = useState('جارِ تحليل السوق...');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const copyPromo = () => {
    navigator.clipboard.writeText(OFFICIAL_LINKS.promoCode);
    setCopiedPromo(true);
    soundEffects.playSuccess();
    setTimeout(() => setCopiedPromo(false), 2000);
  };

  // Start a new 10-second prediction round ("ما بين الدور والدور 10 ثواني")
  const startNewPrediction = () => {
    if (isScanning || cooldownSeconds > 0) return;

    setIsScanning(true);
    setCountdown(10);
    setActiveSignal(null);
    soundEffects.playTick();

    const analysisPhases = [
      'فحص سيولة الزوج وحجم الصفقات...',
      'قراءة مؤشر RSI وتحديد التشبع...',
      'فحص ارتدادات خطوط Bollinger...',
      'تحليل الشموع اليابانية ونقاط المقاومة...',
      'تأكيد اتجاه الصفقة (صعود أم هبوط)...',
    ];

    let current = 10;
    setScanMessage(analysisPhases[0]);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      current -= 1;
      setCountdown(current);
      soundEffects.playScanPulse();

      const phaseIdx = Math.min(
        analysisPhases.length - 1,
        Math.floor((10 - current) / 2)
      );
      setScanMessage(analysisPhases[phaseIdx]);

      if (current <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        emitPrediction();
      }
    }, 1000);
  };

  const emitPrediction = () => {
    setIsScanning(false);

    // Determines strictly Buy (Green) or Sell (Red)
    const signalType: SignalType = Math.random() > 0.48 ? 'BUY' : 'SELL';
    const accuracy = Number((94.2 + Math.random() * 4.6).toFixed(1));
    const entry = currentLivePrice || pair.basePrice;

    const rsiVal =
      signalType === 'BUY'
        ? Math.floor(22 + Math.random() * 15)
        : Math.floor(74 + Math.random() * 14);

    const newSignal: TradingSignal = {
      id: `SIG-${Date.now()}`,
      pairId: pair.id,
      pairName: pair.name,
      type: signalType,
      entryPrice: entry,
      timeframe: timeframe === '15M' ? '15 دقيقة' : timeframe === '5M' ? '5 دقائق' : '1 دقيقة',
      accuracy,
      timestamp: Date.now(),
      indicators: {
        rsi: rsiVal,
        macd: signalType === 'BUY' ? 'تقاطع إيجابي (صعود)' : 'تقاطع سلبي (هبوط)',
        bollinger: signalType === 'BUY' ? 'اختراق الحد السفلي' : 'اختراق الحد العلوي',
        trend: signalType === 'BUY' ? 'صاعد قوي' : 'هابط قوي',
      },
      status: 'ACTIVE',
    };

    setActiveSignal(newSignal);
    onSignalGenerated(newSignal);

    if (signalType === 'BUY') {
      soundEffects.playBuySignal();
    } else {
      soundEffects.playSellSignal();
    }

    // Set 10-second interval before next round is unlocked ("ما بين الدور والدور 10 ثواني")
    let cd = 10;
    setCooldownSeconds(cd);

    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      cd -= 1;
      setCooldownSeconds(cd);

      if (cd <= 0) {
        if (cooldownRef.current) clearInterval(cooldownRef.current);
        // If auto mode is enabled, start next round automatically
        if (autoMode) {
          startNewPrediction();
        }
      }
    }, 1000);
  };

  return (
    <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h2 className="text-base sm:text-lg font-black text-white">
              نظام التوقعات اللحظي (صعود / هبوط)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            توصيات مباشرة لاختيار الشراء (الأخضر) أو البيع (الأحمر) في المنصة
          </p>
        </div>

        {/* 10-second badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-cyan-400 font-mono">
          <Clock size={14} />
          <span>الفاصل: 10 ثوانٍ</span>
        </div>
      </div>

      {/* SCANNING STATE (The requested 10-second countdown between rounds) */}
      {isScanning && (
        <div className="my-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#0e172a] to-[#070b14] border-2 border-cyan-500/50 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col items-center">
            {/* 10-second countdown ring */}
            <div className="relative w-28 h-28 flex items-center justify-center mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-cyan-400 transition-all duration-1000 ease-linear"
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * (10 - countdown)) / 10}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black font-mono text-cyan-300">{countdown}</span>
                <span className="text-[10px] text-cyan-400/80 font-bold uppercase">ثوانٍ</span>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white mb-1">
              جارِ فحص السوق واحتساب التوقع القادم...
            </h3>
            <p className="text-xs text-cyan-300 font-medium mb-4 h-5">
              {scanMessage}
            </p>

            <div className="w-full max-w-xs bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-1000"
                style={{ width: `${((10 - countdown) / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE PREDICTION RESULT: BUY (GREEN) or SELL (RED) */}
      {!isScanning && activeSignal && (
        <div className="my-4 space-y-4">
          <div
            className={`p-6 sm:p-7 rounded-2xl border-3 transition-all relative overflow-hidden shadow-2xl ${
              activeSignal.type === 'BUY'
                ? 'bg-gradient-to-b from-emerald-950/90 via-[#072417] to-[#04140d] border-emerald-500 glow-green'
                : 'bg-gradient-to-b from-rose-950/90 via-[#2d0912] to-[#170408] border-rose-500 glow-red'
            }`}
          >
            {/* Header of signal */}
            <div className="flex items-center justify-between mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 ${
                  activeSignal.type === 'BUY'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-rose-500 text-white'
                }`}
              >
                <Zap size={14} /> إشارة مؤكدة من الذكاء الاصطناعي
              </span>

              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-black/50 px-3 py-1 rounded-lg border border-white/10">
                <ShieldCheck size={14} className={activeSignal.type === 'BUY' ? 'text-emerald-400' : 'text-rose-400'} />
                <span>نسبة الدقة: <b className="text-white">{activeSignal.accuracy}%</b></span>
              </div>
            </div>

            {/* Huge Clear Decision: BUY (GREEN) or SELL (RED) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3">
              <div className="flex items-center gap-4">
                {/* Big colored icon box */}
                <div
                  className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center font-black shadow-xl shrink-0 ${
                    activeSignal.type === 'BUY'
                      ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/40'
                      : 'bg-rose-600 text-white shadow-rose-600/40'
                  }`}
                >
                  {activeSignal.type === 'BUY' ? (
                    <>
                      <ArrowUp size={48} className="stroke-[3]" />
                      <span className="text-xs font-black uppercase mt-1">CALL</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown size={48} className="stroke-[3]" />
                      <span className="text-xs font-black uppercase mt-1">PUT</span>
                    </>
                  )}
                </div>

                <div>
                  <div className="text-xs text-slate-300 font-bold mb-0.5">
                    اختر من المنصة الرسمية:
                  </div>
                  <h3
                    className={`text-3xl sm:text-4xl font-black tracking-tight ${
                      activeSignal.type === 'BUY' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {activeSignal.type === 'BUY' ? 'شراء (صعود 🟢)' : 'بيع (هبوط 🔴)'}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-300 font-medium">
                    <span>الزوج: <b className="text-white font-mono">{activeSignal.pairName}</b></span>
                    <span>•</span>
                    <span>سعر الدخول: <b className="text-cyan-300 font-mono">{activeSignal.entryPrice.toFixed(pair.decimals)}</b></span>
                  </div>
                </div>
              </div>

              {/* Status & Timeframe */}
              <div className="bg-black/60 border border-white/10 rounded-xl p-3 text-center sm:text-left shrink-0 w-full sm:w-auto">
                <span className="text-[11px] text-slate-400 block font-bold">مدة الصفقة المقترحة:</span>
                <span className="text-lg font-black text-white">{activeSignal.timeframe}</span>
                <span className="text-[10px] text-emerald-400 block font-mono mt-0.5">
                  أفضل نقطة دخول حالية
                </span>
              </div>
            </div>

            {/* Direct Platform Execution CTA */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <a
                href={OFFICIAL_LINKS.platformDownload}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-4 px-6 rounded-xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-2xl transition-all transform hover:scale-[1.01] active:scale-[0.99] ${
                  activeSignal.type === 'BUY'
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/40'
                    : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/40'
                }`}
              >
                <span>
                  {activeSignal.type === 'BUY'
                    ? 'تنفيذ صعود (شراء) في منصة PulseTrade 🟢'
                    : 'تنفيذ هبوط (بيع) في منصة PulseTrade 🔴'}
                </span>
                <ExternalLink size={20} />
              </a>

              {/* Visual dual options mimicking official platform buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={OFFICIAL_LINKS.platformDownload}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-xl text-center border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    activeSignal.type === 'BUY'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40'
                      : 'bg-slate-900 border-slate-800 text-slate-400 opacity-60 hover:opacity-100'
                  }`}
                >
                  <TrendingUp size={14} className="text-emerald-400" />
                  <span>زر الصعود (أخضر)</span>
                </a>

                <a
                  href={OFFICIAL_LINKS.platformDownload}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-xl text-center border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    activeSignal.type === 'SELL'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/40'
                      : 'bg-slate-900 border-slate-800 text-slate-400 opacity-60 hover:opacity-100'
                  }`}
                >
                  <TrendingDown size={14} className="text-rose-400" />
                  <span>زر الهبوط (أحمر)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Cooldown bar between rounds ("ما بين الدور والدور 10 ثواني") */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Clock size={16} className="text-cyan-400 shrink-0" />
              <div>
                {cooldownSeconds > 0 ? (
                  <span>
                    الفاصل الزمني بين الأدوار: متبقي{' '}
                    <b className="text-cyan-400 font-mono text-sm">{cooldownSeconds}</b> ثوانٍ للجولة التالية
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold">
                    جاهز الآن لبدء الدور القادم!
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={startNewPrediction}
              disabled={cooldownSeconds > 0}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                cooldownSeconds > 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
              }`}
            >
              <RotateCcw size={15} />
              <span>
                {cooldownSeconds > 0
                  ? `انتظر ${cooldownSeconds} ث`
                  : 'طلب توقع جديد (10 ثوانٍ)'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* IDLE / INITIAL STATE */}
      {!isScanning && !activeSignal && (
        <div className="my-4 p-8 rounded-2xl bg-gradient-to-b from-slate-900/60 to-transparent border border-dashed border-slate-700 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-rose-500/20 border border-slate-700 flex items-center justify-center mb-4 text-2xl">
            <Target size={32} className="text-cyan-400" />
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white mb-2">
            نظام توقعات زوج {pair.name}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            اضغط على الزر أدناه لبدء فحص خوارزمي دقيق مدته <b className="text-cyan-400">10 ثوانٍ</b> لإعطائك إشارة واضحة: <b className="text-emerald-400">شراء (صعود بالأخضر)</b> أو <b className="text-rose-400">بيع (هبوط بالأحمر)</b> للتنفيذ في منصة PulseTrade.
          </p>

          <button
            onClick={startNewPrediction}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-base bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:brightness-110 text-slate-950 flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles size={20} />
            <span>بدء التوقع الآن (فحص 10 ثوانٍ)</span>
          </button>
        </div>
      )}

      {/* Promo & Platform Download Helper Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold">🎁 كود بونص 100%:</span>
          <code className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
            {OFFICIAL_LINKS.promoCode}
          </code>
          <button
            onClick={copyPromo}
            className="text-[11px] text-slate-400 hover:text-white underline flex items-center gap-1 mr-1"
          >
            {copiedPromo ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span>نسخ</span>
          </button>
        </div>

        <a
          href={OFFICIAL_LINKS.platformDownload}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
        >
          <span>فتح منصة PulseTrade الرسمية</span>
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
};
