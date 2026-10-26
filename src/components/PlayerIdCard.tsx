import React, { useState } from 'react';
import { OFFICIAL_LINKS } from '../types/trading';
import { soundEffects } from '../utils/audio';
import {
  User,
  Gift,
  CheckCircle,
  Edit2,
  ExternalLink,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  Lock,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  playerId: string;
  promoCode: string;
  onSaveCredentials: (id: string, promo: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  promoInputRef: React.RefObject<HTMLInputElement | null>;
}

export const PlayerIdCard: React.FC<Props> = ({
  playerId,
  promoCode,
  onSaveCredentials,
  inputRef,
  promoInputRef,
}) => {
  const isInitiallyVerified = Boolean(playerId.trim() && promoCode.trim().toUpperCase() === 'MXG1');

  const [tempId, setTempId] = useState(playerId);
  const [tempPromo, setTempPromo] = useState(promoCode);
  const [isEditing, setIsEditing] = useState(!isInitiallyVerified);
  const [error, setError] = useState('');
  const [copiedPromo, setCopiedPromo] = useState(false);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanId = tempId.trim();
    const cleanPromo = tempPromo.trim().toUpperCase();

    // Strict validation: Both must be filled!
    if (!cleanId && !cleanPromo) {
      setError('يجب إدخال Trader ID وكود البرومو معاً، كلاهما إجباري للدخول!');
      soundEffects.playSellSignal();
      return;
    }

    if (!cleanId) {
      setError('يرجى إدخال Trader ID الخاص بك في المنصة (إجباري)');
      soundEffects.playSellSignal();
      inputRef.current?.focus();
      return;
    }

    if (!cleanPromo) {
      setError('يرجى إدخال كود البرومو MXG1 (إجباري تحت الـ ID)');
      soundEffects.playSellSignal();
      promoInputRef.current?.focus();
      return;
    }

    // Check promo code validity
    if (cleanPromo !== OFFICIAL_LINKS.promoCode) {
      setError(`كود البرومو غير صحيح! يرجى إدخال كود البرومو المعتمد للمنصة: ${OFFICIAL_LINKS.promoCode}`);
      soundEffects.playSellSignal();
      promoInputRef.current?.focus();
      return;
    }

    setError('');
    setIsEditing(false);
    onSaveCredentials(cleanId, cleanPromo);
    soundEffects.playSuccess();
  };

  const fillOfficialPromo = () => {
    setTempPromo(OFFICIAL_LINKS.promoCode);
    if (error) setError('');
    soundEffects.playTick();
  };

  const copyPromo = () => {
    navigator.clipboard.writeText(OFFICIAL_LINKS.promoCode);
    setCopiedPromo(true);
    soundEffects.playSuccess();
    setTimeout(() => setCopiedPromo(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-[#0b1120] border-2 border-cyan-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Glow ambient accent */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* State 1: Active Verified State (Both ID and Promo verified) */}
        {!isEditing && isInitiallyVerified ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/30 shrink-0">
                <ShieldCheck size={30} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-bold">الحساب مفعل ومربوط:</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle size={12} /> معتمد 100%
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-lg sm:text-xl font-black font-mono text-cyan-300">
                    <span className="text-xs text-slate-500 ml-1">ID:</span>
                    #{playerId}
                  </div>
                  <span className="text-slate-600">•</span>
                  <div className="text-sm font-black font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 flex items-center gap-1">
                    <Gift size={13} />
                    <span>كود: {promoCode}</span>
                  </div>
                </div>

                <p className="text-[11px] text-emerald-400 font-medium">
                  ✓ تم تأكيد Trader ID وكود البرومو بنجاح • نظام التوقعات متاح الآن
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setTempId(playerId);
                setTempPromo(promoCode);
                setIsEditing(true);
                soundEffects.playTick();
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shrink-0"
            >
              <Edit2 size={13} />
              <span>تعديل البيانات</span>
            </button>
          </div>
        ) : (
          /* State 2: Input Form for BOTH Trader ID and Promo Code */
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5 text-white font-black text-base sm:text-lg">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Lock size={18} />
                </div>
                <span>بيانات الدخول الإجبارية (Trader ID + كود البرومو)</span>
              </div>

              <span className="text-[11px] text-rose-400 font-bold bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 flex items-center gap-1">
                <AlertCircle size={12} /> كلاهما إجباري
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              لفتح نظام التوقعات، يجب إدخال معرفك <b className="text-cyan-400 font-mono">Trader ID</b> في الخانة الأولى، وتحته مباشرة إدخال كود البرومو <b className="text-amber-400 font-mono">MXG1</b> الإجباري للاستفادة من البونص.
            </p>

            {/* Field 1: Trader ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User size={14} className="text-cyan-400" />
                  <span>1. Trader ID (إجباري):</span>
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">معرف حسابك في PulseTrade</span>
              </label>

              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={tempId}
                  onChange={(e) => {
                    setTempId(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="أدخل Trader ID الخاص بك (مثال: 7849120)..."
                  className="w-full py-3.5 px-4 pr-11 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl text-white font-mono text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all text-right"
                  dir="ltr"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs select-none">
                  ID#
                </span>
              </div>
            </div>

            {/* Field 2: Promo Code (Directly underneath) */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Gift size={14} className="text-amber-400" />
                  <span>2. كود البرومو (إجباري تحت الـ ID):</span>
                </span>

                <button
                  type="button"
                  onClick={fillOfficialPromo}
                  className="text-[11px] text-amber-400 hover:text-amber-300 underline font-bold"
                >
                  استخدم كود MXG1
                </button>
              </label>

              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <input
                    ref={promoInputRef}
                    type="text"
                    value={tempPromo}
                    onChange={(e) => {
                      setTempPromo(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="أدخل كود البرومو الإجباري (MXG1)..."
                    className="w-full py-3.5 px-4 pr-11 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl text-amber-400 font-mono font-bold text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-right uppercase"
                    dir="ltr"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-amber-400 font-bold text-xs select-none">
                    🎁
                  </span>
                </div>

                <button
                  type="button"
                  onClick={copyPromo}
                  className="px-3.5 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors shrink-0"
                  title="نسخ كود MXG1"
                >
                  {copiedPromo ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>نسخ MXG1</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Confirmation Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl font-black text-sm sm:text-base bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:brightness-110 text-slate-950 flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <Sparkles size={18} />
              <span>تأكيد Trader ID والبرومو كود معاً (دخول التوقعات)</span>
            </button>

            {/* Helper links */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 border-t border-slate-800">
              <div className="flex items-center gap-1.5">
                <span>ليس لديك حساب على المنصة؟</span>
                <a
                  href={OFFICIAL_LINKS.platformDownload}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 font-bold underline flex items-center gap-0.5"
                >
                  <span>سجل في PulseTrade بكود MXG1 للحصول على ID</span>
                  <ExternalLink size={11} />
                </a>
              </div>

              <span className="text-amber-400 font-bold">بونص 100% على الإيداع الأول</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
