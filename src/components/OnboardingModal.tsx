import React, { useState } from 'react';
import { OFFICIAL_LINKS } from '../types/trading';
import { soundEffects } from '../utils/audio';
import {
  Send,
  Youtube,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
  Lock,
  ExternalLink,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<Props> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [hasVisitedTelegram, setHasVisitedTelegram] = useState(false);
  const [hasVisitedYoutube, setHasVisitedYoutube] = useState(false);
  const [hasVisitedPlatform, setHasVisitedPlatform] = useState(false);
  const [copiedPromo, setCopiedPromo] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [checkingTelegram, setCheckingTelegram] = useState(false);
  const [telegramVerified, setTelegramVerified] = useState(false);

  if (!isOpen) return null;

  const handleCopyPromo = () => {
    navigator.clipboard.writeText(OFFICIAL_LINKS.promoCode);
    setCopiedPromo(true);
    soundEffects.playSuccess();
    setTimeout(() => setCopiedPromo(false), 2500);
  };

  const handleVerifyTelegram = () => {
    setCheckingTelegram(true);
    soundEffects.playScanPulse();
    setTimeout(() => {
      setCheckingTelegram(false);
      setTelegramVerified(true);
      soundEffects.playSuccess();
      setStep(2);
    }, 1200);
  };

  const handleFinalSubmit = () => {
    if (!agreedTerms) return;

    soundEffects.playSuccess();
    // Confetti removed as requested
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#0f172a] to-[#070b14] border border-cyan-500/30 rounded-3xl p-5 sm:p-8 shadow-2xl text-white overflow-hidden">
        {/* Glow ambient background lights */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center font-black text-xl shadow-lg shadow-cyan-500/20">
              1X
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-lg sm:text-xl text-white tracking-wide">
                  1XMEGA VIP TRADE
                </h2>
                <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                  <Flame size={12} /> انطلاق رسمي
                </span>
              </div>
              <p className="text-xs text-slate-400">تفعيل الدخول المجاني لغرفة الإشارات الذكية</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 rounded-full border border-slate-800 text-xs text-amber-400 font-bold">
            <Sparkles size={14} /> بونص 100%
          </div>
        </div>

        {/* Step Progress Pills */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div
            className={`p-2.5 rounded-xl border text-center transition-all ${
              step === 1
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                : step > 1
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-900/40 border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold">
              {step > 1 ? <Check size={14} /> : <span>1.</span>}
              <span>اشتراك التليجرام</span>
            </div>
          </div>

          <div
            className={`p-2.5 rounded-xl border text-center transition-all ${
              step === 2
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                : step > 2
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-900/40 border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold">
              {step > 2 ? <Check size={14} /> : <span>2.</span>}
              <span>كود البرومو والبونص</span>
            </div>
          </div>

          <div
            className={`p-2.5 rounded-xl border text-center transition-all ${
              step === 3
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900/40 border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold">
              <span>3.</span>
              <span>الموافقة والدخول</span>
            </div>
          </div>
        </div>

        {/* STEP 1: Mandatory Telegram Subscription */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-1">
                <Lock size={16} /> الخطوة الأولى: اشتراك إجباري في قنوات 1XMEGA
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                للحفاظ على جودة ودقة إشارات التداول الخوارزمية، يجب الاشتراك في قناة التليجرام الرسمية لتأكيد عضويتك وتلقي إشعارات الفرص الفورية أولاً بأول.
              </p>
            </div>

            {/* Telegram Channel CTA */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/50 to-blue-950/30 border border-sky-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center text-xl shrink-0">
                  <Send size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">قناة التداول على تليجرام</h4>
                  <p className="text-xs text-sky-300 font-mono">@onexmega_Trading</p>
                </div>
              </div>

              <a
                href={OFFICIAL_LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setHasVisitedTelegram(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/20"
              >
                <span>انضم الآن للتليجرام</span>
                <ExternalLink size={16} />
              </a>
            </div>

            {/* YouTube Channel Option */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <Youtube size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">قناة اليوتيوب الرسمية (فيديوهات التداول)</h4>
                  <p className="text-[11px] text-slate-400">فيديو التداول الأول اليوم الساعة 4:00 م بتوقيت القاهرة</p>
                </div>
              </div>

              <a
                href={OFFICIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setHasVisitedYoutube(true)}
                className="px-3.5 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all"
              >
                <span>اشتراك</span>
                <ExternalLink size={14} />
              </a>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyTelegram}
              disabled={checkingTelegram}
              className={`w-full py-3.5 px-4 rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl transition-all ${
                hasVisitedTelegram
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:brightness-110 shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {checkingTelegram ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>جارِ التحقق وتأكيد الاشتراك...</span>
                </>
              ) : (
                <>
                  <span>تأكيد الاشتراك والانتقال للخطوة التالية</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 2: Platform Registration & Promo Code Terms */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1">
                <Award size={16} /> الخطوة الثانية: التسجيل بالبرومو والحصول على بونص 100%
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                للاستفادة من الإشارات بدقة مطابقة لمنصة التداول PulseTrade، سجّل حسابك عبر رابط المنصة واستخدم كود البرومو للحصول على مضاعفة الإيداع الأول بنسبة 100%.
              </p>
            </div>

            {/* Promo Code Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 to-yellow-950/20 border border-amber-500/40 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles size={14} /> كود البرومو الحصري للبونص:
                </span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  🎁 بونص 100% فعال
                </span>
              </div>

              <div className="flex items-center justify-between bg-black/60 border border-amber-500/30 rounded-xl p-3">
                <span className="text-2xl font-black font-mono tracking-widest text-amber-400">
                  {OFFICIAL_LINKS.promoCode}
                </span>

                <button
                  onClick={handleCopyPromo}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-lg flex items-center gap-1.5 transition-all shadow-md"
                >
                  {copiedPromo ? (
                    <>
                      <Check size={16} className="text-emerald-950" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>نسخ الكود</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Platform Download Link */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl shrink-0">
                  <Download size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">رابط منصة التداول (PulseTrade)</h4>
                  <p className="text-xs text-slate-400">حمّل التطبيق أو سجّل مباشرة لبدء التداول</p>
                </div>
              </div>

              <a
                href={OFFICIAL_LINKS.platformDownload}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setHasVisitedPlatform(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
              >
                <span>فتح المنصة للتسجيل</span>
                <ExternalLink size={16} />
              </a>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                السابق
              </button>
              <button
                onClick={() => {
                  soundEffects.playTick();
                  setStep(3);
                }}
                className="flex-1 py-3 px-4 rounded-xl font-black text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
              >
                <span>متابعة للشروط والموافقة</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Terms & Agreement */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                <ShieldCheck size={18} /> شروط الاستخدام وقواعد بونص 100%
              </div>
              <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold mt-0.5">•</span>
                  <span>الاستفادة من بونص 100% على أول إيداع يتطلب إدخال كود البرومو <b className="text-amber-400 font-mono">MXG1</b> أثناء التسجيل أو عند شحن الحساب.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold mt-0.5">•</span>
                  <span>الإشارات المقدمة على هذا الموقع مخصصة لأعضاء قناة 1XMEGA Trade ومبنية على فحص مؤشرات RSI و Moving Averages وتحليل الشموع.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold mt-0.5">•</span>
                  <span>بعد طلب أي توقع أو إشارة جديدة، يقوم النظام بفحص خوارزمي دقيق يستغرق <b className="text-cyan-400">10 ثوانٍ</b> لتأكيد نقطة الدخول المناسبة (شراء أو بيع).</span>
                </li>
              </ul>
            </div>

            {/* Agreement Checkbox */}
            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => {
                  setAgreedTerms(e.target.checked);
                  soundEffects.playTick();
                }}
                className="w-5 h-5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/20 bg-slate-800"
              />
              <span className="text-xs sm:text-sm font-bold text-white select-none">
                أوافق على جميع الشروط وأؤكد أنني أتممت الاشتراك وسجلت بكود <span className="text-amber-400 font-mono">MXG1</span>
              </span>
            </label>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                className="py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                السابق
              </button>

              <button
                onClick={handleFinalSubmit}
                disabled={!agreedTerms}
                className={`flex-1 py-3.5 px-6 rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl transition-all ${
                  agreedTerms
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:brightness-110 shadow-emerald-500/30 ring-2 ring-emerald-400/50'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>أوافق على الشروط ودخول المنصة</span>
                <Sparkles size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
          منصة 1XMEGA Trade الرسمية • الموعد الرسمي للفيديو الأول اليوم الساعة 4:00 مساءً بتوقيت القاهرة
        </div>
      </div>
    </div>
  );
};
