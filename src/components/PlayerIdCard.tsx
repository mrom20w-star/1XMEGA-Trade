import React, { useState } from 'react';
import { OFFICIAL_LINKS } from '../types/trading';
import { soundEffects } from '../utils/audio';
import {
  User,
  ShieldCheck,
  CheckCircle,
  Edit2,
  ExternalLink,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

interface Props {
  playerId: string;
  onSavePlayerId: (id: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const PlayerIdCard: React.FC<Props> = ({
  playerId,
  onSavePlayerId,
  inputRef,
}) => {
  const [tempId, setTempId] = useState(playerId);
  const [isEditing, setIsEditing] = useState(!playerId);
  const [error, setError] = useState('');
  const [copiedPromo, setCopiedPromo] = useState(false);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = tempId.trim();
    if (!trimmed) {
      setError('يرجى إدخال رقم المعرف (ID) الخاص بك في المنصة للمتابعة');
      return;
    }
    setError('');
    setIsEditing(false);
    onSavePlayerId(trimmed);
    soundEffects.playSuccess();
  };

  const copyPromo = () => {
    navigator.clipboard.writeText(OFFICIAL_LINKS.promoCode);
    setCopiedPromo(true);
    soundEffects.playSuccess();
    setTimeout(() => setCopiedPromo(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-[#0b1120] border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-xl">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* State 1: Active Verified Player ID */}
        {!isEditing && playerId ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20 shrink-0">
                <User size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-bold">معرف اللاعب النشط (Player ID):</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle size={10} /> تم التحقق
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono tracking-wider text-cyan-300">
                  #{playerId}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <span className="text-emerald-400 font-bold">✓ مفعل بنجاح</span>
                  <span>•</span>
                  <span>بونص 100% بكود <b className="text-amber-400 font-mono">MXG1</b></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  setTempId(playerId);
                  setIsEditing(true);
                  soundEffects.playTick();
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Edit2 size={13} />
                <span>تعديل الـ ID</span>
              </button>
            </div>
          </div>
        ) : (
          /* State 2: Input Field for Player ID */
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <User size={18} />
                </div>
                <span>تسجيل وتأكيد ID اللاعب في المنصة (إجباري)</span>
              </div>

              <span className="text-[11px] text-amber-400 font-bold bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                مطلوب قبل بدء التوقع
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              يرجى إدخال رقم المعرف الخاص بحسابك في منصة التداول <b className="text-white">PulseTrade</b> لربط توقعاتك واستلام التوصيات اللحظية.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={tempId}
                  onChange={(e) => {
                    setTempId(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="أدخل ID حسابك في المنصة (مثال: 7849120)..."
                  className="w-full py-3.5 px-4 pr-11 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl text-white font-mono text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all text-right"
                  dir="ltr"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs select-none">
                  ID#
                </span>
              </div>

              <button
                type="submit"
                className="py-3.5 px-6 rounded-xl font-black text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all shrink-0"
              >
                <Sparkles size={16} />
                <span>تأكيد وربط المعرف</span>
              </button>
            </div>

            {error && (
              <p className="text-xs text-rose-400 flex items-center gap-1 font-bold">
                <AlertCircle size={14} />
                <span>{error}</span>
              </p>
            )}

            {/* Quick Helper for registering on PulseTrade */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 border-t border-slate-800">
              <div className="flex items-center gap-1.5">
                <span>ليس لديك حساب أو ID بعد؟</span>
                <a
                  href={OFFICIAL_LINKS.platformDownload}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 font-bold underline flex items-center gap-0.5"
                >
                  <span>سجل في المنصة واحصل على ID</span>
                  <ExternalLink size={11} />
                </a>
              </div>

              <div className="flex items-center gap-1">
                <span>كود البونص:</span>
                <code className="bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
                  {OFFICIAL_LINKS.promoCode}
                </code>
                <button
                  type="button"
                  onClick={copyPromo}
                  className="text-slate-300 hover:text-white underline mr-1"
                >
                  {copiedPromo ? <Check size={12} className="text-emerald-400 inline" /> : 'نسخ'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
