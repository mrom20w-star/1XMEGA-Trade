import React, { useState, useEffect, useRef } from 'react';
import { OFFICIAL_LINKS } from './types/trading';
import { Header } from './components/Header';
import { OnboardingModal } from './components/OnboardingModal';
import { PlayerIdCard } from './components/PlayerIdCard';
import { PurePredictor } from './components/PurePredictor';
import {
  Send,
  Youtube,
  ShieldAlert,
  Flame,
  Award,
  Download,
  ExternalLink,
} from 'lucide-react';

export default function App() {
  const [playerId, setPlayerId] = useState<string>('');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const playerIdInputRef = useRef<HTMLInputElement | null>(null);

  // Load saved player ID and onboarding state from localStorage
  useEffect(() => {
    try {
      const savedOnboarding = localStorage.getItem('1xmega_onboarding_completed');
      if (savedOnboarding === 'true') {
        setShowOnboarding(false);
      }

      const savedId = localStorage.getItem('1xmega_player_id');
      if (savedId) {
        setPlayerId(savedId);
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  const handleSavePlayerId = (newId: string) => {
    setPlayerId(newId);
    try {
      localStorage.setItem('1xmega_player_id', newId);
    } catch {
      // LocalStorage fallback
    }
  };

  const handleRequestPlayerIdFocus = () => {
    if (playerIdInputRef.current) {
      playerIdInputRef.current.focus();
      playerIdInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCompleteOnboarding = () => {
    try {
      localStorage.setItem('1xmega_onboarding_completed', 'true');
    } catch {
      // LocalStorage fallback
    }
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-['Cairo',sans-serif] selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Onboarding Gate Modal (Telegram + Promo conditions) */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleCompleteOnboarding}
      />

      {/* Main Header */}
      <Header onReopenOnboarding={() => setShowOnboarding(true)} />

      {/* Announcement Alert Banner */}
      <div className="bg-gradient-to-r from-[#0d162d] via-[#091124] to-[#070b14] border-b border-slate-800/80 px-4 py-2.5">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="font-bold text-white text-xs sm:text-sm">
              نظام توقعات 1XMEGA الرسمي (صعود / هبوط)
            </span>
            <span className="text-slate-400 hidden sm:inline">
              | خادم الذكاء الاصطناعي متصل
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-amber-400 font-bold bg-amber-400/10 px-2.5 py-0.5 rounded-lg border border-amber-400/20 flex items-center gap-1 text-[11px]">
              <Award size={13} /> برومو: {OFFICIAL_LINKS.promoCode} (بونص 100%)
            </span>
            <a
              href={OFFICIAL_LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-bold text-[11px]"
            >
              <Send size={12} />
              <span>التليجرام</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Clean Center Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6 flex flex-col justify-center">
        {/* Required Player ID Card right on the outside interface */}
        <PlayerIdCard
          playerId={playerId}
          onSavePlayerId={handleSavePlayerId}
          inputRef={playerIdInputRef}
        />

        {/* Pure Predictor Component (Start -> 10s wait -> UP/DOWN) */}
        <PurePredictor
          playerId={playerId}
          onUpdatePlayerId={handleSavePlayerId}
          onRequestPlayerIdFocus={handleRequestPlayerIdFocus}
        />
      </main>

      {/* Official Footer */}
      <footer className="mt-auto bg-[#05080f] border-t border-slate-800/80 py-6 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
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
              <span>اليوتيوب</span>
            </a>

            <a
              href={OFFICIAL_LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-bold"
            >
              <Send size={15} />
              <span>التليجرام</span>
            </a>

            <a
              href={OFFICIAL_LINKS.platformDownload}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold"
            >
              <Download size={15} />
              <span>تحميل PulseTrade</span>
            </a>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <ShieldAlert size={14} className="text-amber-500/70" />
            <span>تداول بمسؤولية وفقاً لإدارة رأس المال</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
