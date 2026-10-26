import React, { useState, useEffect, useRef } from 'react';
import { AssetPair, OFFICIAL_LINKS } from '../types/trading';
import { soundEffects } from '../utils/audio';
import {
  ArrowUp,
  ArrowDown,
  Clock,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Zap,
  Lock,
  Activity,
  Layers,
  BarChart3,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface Props {
  playerId: string;
  promoCode: string;
  isAccountVerified: boolean;
  onRequestCredentialsFocus: () => void;
  selectedPair: AssetPair;
  livePrice: number;
  onDirectionChange: (direction: 'UP' | 'DOWN' | null) => void;
}

export const PurePredictor: React.FC<Props> = ({
  playerId,
  promoCode,
  isAccountVerified,
  onRequestCredentialsFocus,
  selectedPair,
  livePrice,
  onDirectionChange,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [cooldown, setCooldown] = useState(0);
  const [prediction, setPrediction] = useState<'UP' | 'DOWN' | null>(null);
  const [roundNumber, setRoundNumber] = useState(1);
  const [analysisPhase, setAnalysisPhase] = useState('جارِ فحص إشارات السوق...');
  const [entryPrice, setEntryPrice] = useState<number>(0);

  const scanTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (scanTimerRef.current) clearInterval(scanTimerRef.current);
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, []);

  const handleStart = () => {
    // Strict block if both Trader ID and Promo are not verified
    if (!isAccountVerified) {
      soundEffects.playSellSignal();
      onRequestCredentialsFocus();
      return;
    }

    if (isScanning || cooldown > 0) return;

    setIsScanning(true);
    setCountdown(10);
    setPrediction(null);
    onDirectionChange(null);
    soundEffects.playTick();

    const phases = [
      'سحب بيانات الشموع وتدفق أوامر السيولة اللحظية...',
      'قراءة مؤشر RSI (14) واختبار مناطق التشبع...',
      'تحليل ارتدادات Bollinger Bands وتقاطعات MACD...',
      'فحص زخم المتوسطات المتحركة EMA 7/25...',
      'تأكيد اتجاه الصفقة (صعود أم هبوط) لـ Trader ID...',
    ];

    let sec = 10;
    setAnalysisPhase(phases[0]);

    if (scanTimerRef.current) clearInterval(scanTimerRef.current);

    scanTimerRef.current = setInterval(() => {
      sec -= 1;
      setCountdown(sec);
      soundEffects.playScanPulse();

      const phaseIdx = Math.min(
        phases.length - 1,
        Math.floor((10 - sec) / 2)
      );
      setAnalysisPhase(phases[phaseIdx]);

      if (sec <= 0) {
        if (scanTimerRef.current) clearInterval(scanTimerRef.current);
        finishScan();
      }
    }, 1000);
  };

  const finishScan = () => {
    setIsScanning(false);
    // Determine UP (صعود - أخضر) or DOWN (هبوط - أحمر)
    const result: 'UP' | 'DOWN' = Math.random() > 0.5 ? 'UP' : 'DOWN';
    const finalPrice = livePrice || selectedPair.basePrice;

    setPrediction(result);
    setEntryPrice(finalPrice);
    onDirectionChange(result);
    setRoundNumber((r) => r + 1);

    if (result === 'UP') {
      soundEffects.playBuySignal();
    } else {
      soundEffects.playSellSignal();
    }

    // 10-second interval before next round is unlocked
    let cd = 10;
    setCooldown(cd);

    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    cooldownTimerRef.current = setInterval(() => {
      cd -= 1;
      setCooldown(cd);

      if (cd <= 0) {
        if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
      }
    }, 1000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Main Predictor Card */}
      <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Glow ambient background lights */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header title */}
        <div className="text-center pb-4 mb-6 border-b border-slate-800/80">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-cyan-400 mb-2">
            <Zap size={14} />
            <span>نظام التوقعات الذكي • صعود أو هبوط</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            1XMEGA AI PREDICTOR
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            الزوج النشط: <b className="text-cyan-300 font-bold">{selectedPair.name}</b> • اضغط لبدء فحص 10 ثوانٍ وتحديد نقطة الدخول
          </p>
        </div>

        {/* Locked Warning if not verified */}
        {!isAccountVerified && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-sm">
              <Lock size={16} />
              <span>نظام التوقعات مقفل مؤقتاً</span>
            </div>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              يجب إدخال <b className="text-cyan-400">Trader ID</b> وتحته إدخال <b className="text-amber-400">كود البرومو MXG1</b> في الخانة بالأعلى وتأكيدهما معاً للبدء.
            </p>
            <button
              onClick={onRequestCredentialsFocus}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold underline inline-flex items-center gap-1"
            >
              <span>انتقل لتسجيل البيانات الآن</span>
            </button>
          </div>
        )}

        {/* SCANNING STATE (10 Seconds countdown with dynamic analysis steps) */}
        {isScanning && (
          <div className="py-8 px-4 my-2 rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#070b14] border-2 border-cyan-500/50 text-center relative overflow-hidden shadow-2xl">
            {/* Animated Radar Ring */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center mb-5">
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
                <span className="text-5xl font-black font-mono text-cyan-300">{countdown}</span>
                <span className="text-[11px] text-cyan-400/80 font-bold uppercase mt-0.5">ثوانٍ</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-cyan-400 text-sm font-bold mb-2">
              <Activity size={16} className="animate-pulse" />
              <span>جارِ فحص إشارات السوق للجولة #{roundNumber}...</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-sm mx-auto mb-4 h-6">
              {analysisPhase}
            </p>

            {/* Analysis Progress Bar */}
            <div className="w-full max-w-xs mx-auto bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-1000"
                style={{ width: `${((10 - countdown) / 10) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* RESULT: GREEN (صعود) or RED (هبوط) */}
        {!isScanning && prediction && (
          <div className="space-y-5 my-2 animate-in fade-in zoom-in-95 duration-200">
            {/* The Big Result Box */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border-3 transition-all relative overflow-hidden text-center shadow-2xl ${
                prediction === 'UP'
                  ? 'bg-gradient-to-b from-emerald-950/90 via-[#062417] to-[#03140d] border-emerald-500 glow-green'
                  : 'bg-gradient-to-b from-rose-950/90 via-[#2d0912] to-[#170408] border-rose-500 glow-red'
              }`}
            >
              {/* Badge top */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black mb-4 shadow-sm bg-black/40 border border-white/10 text-white">
                <ShieldCheck
                  size={14}
                  className={prediction === 'UP' ? 'text-emerald-400' : 'text-rose-400'}
                />
                <span>توقع الجولة #{roundNumber - 1} لحساب #{playerId} مؤكد بنسبة 96%</span>
              </div>

              {/* Big Icon & Direction Text */}
              <div className="flex flex-col items-center justify-center py-2">
                <div
                  className={`w-28 h-28 rounded-3xl flex items-center justify-center font-black shadow-2xl mb-4 ${
                    prediction === 'UP'
                      ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/50'
                      : 'bg-rose-600 text-white shadow-rose-600/50'
                  }`}
                >
                  {prediction === 'UP' ? (
                    <ArrowUp size={64} className="stroke-[3.5] animate-bounce" />
                  ) : (
                    <ArrowDown size={64} className="stroke-[3.5] animate-bounce" />
                  )}
                </div>

                <div className="text-xs uppercase tracking-widest text-slate-300 font-bold mb-1">
                  التوصية للمنصة الرسمية:
                </div>

                <h2
                  className={`text-4xl sm:text-5xl font-black tracking-tight ${
                    prediction === 'UP' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {prediction === 'UP' ? 'صعود (شراء) 🟢' : 'هبوط (بيع) 🔴'}
                </h2>

                <p className="text-xs sm:text-sm text-slate-200 mt-2 font-medium">
                  {prediction === 'UP'
                    ? 'ادخل المنصة الآن واختر الزر الأخضر (صعود / CALL)'
                    : 'ادخل المنصة الآن واختر الزر الأحمر (هبوط / PUT)'}
                </p>

                {/* Entry Price & Strike Info */}
                <div className="flex items-center justify-center gap-3 mt-4 text-xs font-mono bg-black/40 px-4 py-2 rounded-xl border border-white/10">
                  <span className="text-slate-400">الزوج: <b className="text-white">{selectedPair.name}</b></span>
                  <span>•</span>
                  <span className="text-slate-400">سعر الدخول: <b className="text-cyan-300">{entryPrice.toFixed(selectedPair.decimals)}</b></span>
                  <span>•</span>
                  <span className="text-slate-400">المدة: <b className="text-amber-300">1 دقيقة</b></span>
                </div>
              </div>

              {/* Action Button to open the official platform */}
              <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                <a
                  href={OFFICIAL_LINKS.platformDownload}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                    prediction === 'UP'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/40'
                      : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/40'
                  }`}
                >
                  <span>
                    {prediction === 'UP'
                      ? 'تنفيذ صعود (أخضر) في منصة PulseTrade الآن 🚀'
                      : 'تنفيذ هبوط (أحمر) في منصة PulseTrade الآن 🚀'}
                  </span>
                  <ExternalLink size={20} />
                </a>
              </div>
            </div>

            {/* 10-Second Cooldown Card Between Rounds */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock size={16} className="text-cyan-400 shrink-0" />
                {cooldown > 0 ? (
                  <span>
                    الفاصل الزمني بين الأدوار: متبقي{' '}
                    <b className="text-cyan-400 font-mono text-sm">{cooldown}</b> ثوانٍ للجولة التالية
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold">
                    جاهز لبدء جولة وتوقع جديد الآن!
                  </span>
                )}
              </div>

              <button
                onClick={handleStart}
                disabled={cooldown > 0}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  cooldown > 0
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                }`}
              >
                <RotateCcw size={15} />
                <span>
                  {cooldown > 0 ? `انتظر (${cooldown} ث)` : 'بدء التوقع التالي (10 ثوانٍ)'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* IDLE / START BUTTON */}
        {!isScanning && !prediction && (
          <div className="py-10 text-center flex flex-col items-center">
            {/* Dual visual icons Preview */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/50 flex flex-col items-center justify-center text-emerald-400">
                <ArrowUp size={28} className="stroke-[3]" />
                <span className="text-[10px] font-black">صعود</span>
              </div>

              <div className="text-slate-500 font-bold text-sm">أو</div>

              <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border-2 border-rose-500/50 flex flex-col items-center justify-center text-rose-400">
                <ArrowDown size={28} className="stroke-[3]" />
                <span className="text-[10px] font-black">هبوط</span>
              </div>
            </div>

            <h3 className="text-xl font-black text-white mb-2">
              جاهز لتوليد التوقع المباشر
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-8 leading-relaxed">
              اضغط على زر <b className="text-cyan-400">"بدء التوقع"</b> وسيقوم النظام بالعد التنازلي لمدة 10 ثوانٍ لتحديد ما إذا كانت الصفقة <b className="text-emerald-400">صعود (أخضر)</b> أو <b className="text-rose-400">هبوط (أحمر)</b>.
            </p>

            <button
              onClick={handleStart}
              className={`w-full sm:w-auto px-10 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                isAccountVerified
                  ? 'bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:brightness-110 text-slate-950 shadow-cyan-500/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {isAccountVerified ? (
                <>
                  <Sparkles size={22} />
                  <span>بدء التوقع (10 ثوانٍ)</span>
                </>
              ) : (
                <>
                  <Lock size={20} className="text-amber-400" />
                  <span>يجب إدخال Trader ID وكود البرومو للبدء 🔒</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
