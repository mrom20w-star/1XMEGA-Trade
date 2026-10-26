import React, { useState } from 'react';
import { OFFICIAL_LINKS } from '../types/trading';
import { soundEffects } from '../utils/audio';
import {
  Send,
  Youtube,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Flame,
  ShieldCheck,
  ExternalLink,
  Gift,
} from 'lucide-react';

interface Props {
  onReopenOnboarding: () => void;
}

export const Header: React.FC<Props> = ({ onReopenOnboarding }) => {
  const [soundOn, setSoundOn] = useState(true);
  const [copied, setCopied] = useState(false);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundEffects.enabled = next;
    if (next) soundEffects.playTick();
  };

  const copyPromo = () => {
    navigator.clipboard.writeText(OFFICIAL_LINKS.promoCode);
    setCopied(true);
    soundEffects.playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070b14]/95 backdrop-blur-md border-b border-slate-800">
      {/* Top breaking news / launch bar */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-rose-950 border-b border-cyan-500/20 px-3 py-1.5 text-xs text-center text-slate-200 flex items-center justify-center gap-2 overflow-hidden">
        <span className="flex items-center gap-1 font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-full text-[11px] animate-pulse">
          <Flame size={12} /> انطلاق رسمي!
        </span>
        <span className="truncate">
          موعدنا اليوم الساعة 4:00 مساءً بتوقيت القاهرة مع أول فيديو تداول على قناة 1XMEGA Trade! 🎬
        </span>
        <a
          href={OFFICIAL_LINKS.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 font-bold underline hidden sm:inline"
        >
          اشترك في اليوتيوب
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 via-emerald-500 to-blue-600 flex items-center justify-center font-black text-xl text-slate-950 shadow-lg shadow-cyan-500/20">
            1X
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg sm:text-xl text-white tracking-wider">
                1XMEGA <span className="text-cyan-400">TRADE</span>
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> مباشر
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              المنصة الرسمية لإشارات التداول الذكية
            </p>
          </div>
        </div>

        {/* Promo Code Quick Copy Box */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-900/90 border border-amber-500/30 px-3 py-1.5 rounded-xl shadow-sm">
          <Gift size={16} className="text-amber-400" />
          <div className="text-right">
            <div className="text-[10px] text-slate-400">كود بونص 100%:</div>
            <div className="font-mono font-black text-sm text-amber-300 tracking-wider">
              {OFFICIAL_LINKS.promoCode}
            </div>
          </div>
          <button
            onClick={copyPromo}
            title="نسخ كود البرومو"
            className="p-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg transition-colors mr-1"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2">
          {/* Telegram Channel Button */}
          <a
            href={OFFICIAL_LINKS.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm"
          >
            <Send size={15} />
            <span className="hidden sm:inline">قناة التليجرام</span>
          </a>

          {/* YouTube Channel Button */}
          <a
            href={OFFICIAL_LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm"
          >
            <Youtube size={15} />
            <span className="hidden md:inline">يوتيوب</span>
          </a>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundOn ? 'كتم الصوت' : 'تشغيل الصوت'}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            {soundOn ? <Volume2 size={18} className="text-cyan-400" /> : <VolumeX size={18} />}
          </button>

          {/* Platform Access CTA */}
          <a
            href={OFFICIAL_LINKS.platformDownload}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 sm:px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20"
          >
            <span>المنصة</span>
            <ExternalLink size={14} />
          </a>

          {/* Re-view terms */}
          <button
            onClick={onReopenOnboarding}
            className="text-[11px] text-slate-400 hover:text-cyan-400 underline p-1 hidden lg:block"
          >
            الشروط
          </button>
        </div>
      </div>
    </header>
  );
};
