import React, { useState, useEffect } from 'react';
import { AssetPair, OFFICIAL_LINKS } from '../types/trading';
import { soundEffects } from '../utils/audio';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Copy,
  Check,
  Flame,
  Download,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  pair: AssetPair;
}

export const MarketSentiment: React.FC<Props> = ({ pair }) => {
  const [bullsPercent, setBullsPercent] = useState(74);
  const [copied, setCopied] = useState(false);
  const [recentNotification, setRecentNotification] = useState<string>(
    'أحمد م. فتح صفقة شراء على EUR/USD بربح متوقع +$184'
  );

  // Fluctuating sentiment
  useEffect(() => {
    const timer = setInterval(() => {
      setBullsPercent((prev) => {
        const change = (Math.random() - 0.48) * 4;
        const next = Math.min(88, Math.max(35, prev + change));
        return Math.round(next);
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Rotating live community wins
  useEffect(() => {
    const activities = [
      'محمد خ. حقق ربح +$240 على إشارة شراء الذهب XAU/USD (بونص MXG1)',
      'سارة ع. دخلت صفقة بيع على GBP/USD بنجاح 98%',
      'عمر ك. حصل على بونص 100% بإيداع $150 في PulseTrade',
      'يوسف ت. حقق صفقة رابحة على BTC/USDT بربح +$320',
      'محمود ر. استفاد من إشارة 1XMEGA لشراء EUR/USD OTC',
    ];
    let idx = 0;
    const timer = setInterval(() => {
      idx = (idx + 1) % activities.length;
      setRecentNotification(activities[idx]);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const copyPromo = () => {
    navigator.clipboard.writeText(OFFICIAL_LINKS.promoCode);
    setCopied(true);
    soundEffects.playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Sentiment Box */}
      <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-4 md:p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-cyan-400" />
            <h3 className="font-bold text-white text-sm">مؤشر معنويات المتداولين (Sentiment)</h3>
          </div>
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
            <Users size={12} /> {Math.floor(Math.random() * 80) + 1420} متداول نشط
          </span>
        </div>

        {/* Sentiment Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-emerald-400 flex items-center gap-1">
              <TrendingUp size={14} /> صعود / شراء (أخضر 🟢): {bullsPercent}%
            </span>
            <span className="text-rose-400 flex items-center gap-1">
              هبوط / بيع (أحمر 🔴): {100 - bullsPercent}% <TrendingDown size={14} />
            </span>
          </div>

          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-l-full transition-all duration-700 shadow-sm"
              style={{ width: `${bullsPercent}%` }}
            />
            <div
              className="h-full bg-gradient-to-l from-rose-600 to-rose-400 rounded-r-full transition-all duration-700 shadow-sm"
              style={{ width: `${100 - bullsPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>التوصية العامة:</span>
            <span className="font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              {bullsPercent > 55 ? 'شراء قوي (Strong Buy)' : bullsPercent < 45 ? 'بيع قوي (Strong Sell)' : 'حيادي (Neutral)'}
            </span>
          </div>
        </div>

        {/* Live Community Activity Toast */}
        <div className="mt-4 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center gap-2 text-xs text-slate-300">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="truncate">{recentNotification}</span>
        </div>
      </div>

      {/* Official Promo & Bonus Card */}
      <div className="bg-gradient-to-br from-[#0c1427] to-[#080d1a] border border-amber-500/30 rounded-2xl p-4 md:p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 text-amber-400 font-black text-sm mb-2">
          <Flame size={18} /> عرض الإطلاق الرسمي الحصري
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-3">
          احصل على <b className="text-amber-300 font-bold">بونص 100%</b> على أول إيداع لمضاعفة رصيدك التداولي عند التسجيل في منصة PulseTrade باستخدام كود البرومو الخاص بالقناة:
        </p>

        {/* Promo code copy bar */}
        <div className="flex items-center justify-between bg-black/60 border border-amber-500/40 rounded-xl p-2.5 mb-3">
          <div>
            <span className="text-[10px] text-slate-400 block">كود البرومو:</span>
            <span className="text-xl font-black font-mono tracking-widest text-amber-400">
              {OFFICIAL_LINKS.promoCode}
            </span>
          </div>

          <button
            onClick={copyPromo}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-md"
          >
            {copied ? (
              <>
                <Check size={14} />
                <span>تم النسخ!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>نسخ الكود</span>
              </>
            )}
          </button>
        </div>

        <a
          href={OFFICIAL_LINKS.platformDownload}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 text-slate-950 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          <Download size={16} />
          <span>تحميل منصة PulseTrade والتسجيل</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};
