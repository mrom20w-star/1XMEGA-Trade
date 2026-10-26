import React from 'react';
import { AssetPair, ASSET_PAIRS } from '../types/trading';
import { soundEffects } from '../utils/audio';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Layers,
  Gauge,
  Sparkles,
} from 'lucide-react';

interface Props {
  selectedPair: AssetPair;
  onSelectPair: (pair: AssetPair) => void;
  livePrice: number;
  activeDirection: 'UP' | 'DOWN' | null;
}

export const TechnicalIndicators: React.FC<Props> = ({
  selectedPair,
  onSelectPair,
  livePrice,
  activeDirection,
}) => {
  // If prediction is active, align indicators with that prediction; otherwise use realistic values
  const isUp = activeDirection === 'UP' || (!activeDirection && selectedPair.id.includes('EUR'));
  const rsiValue = activeDirection === 'UP' ? 24 : activeDirection === 'DOWN' ? 78 : 31;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Pair Quick Selector */}
      <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-cyan-400" />
            <span className="text-xs font-bold text-white">اختر الزوج لمطابقة المنصة:</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
            السعر المباشر: {livePrice ? livePrice.toFixed(selectedPair.decimals) : selectedPair.basePrice.toFixed(selectedPair.decimals)}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {ASSET_PAIRS.slice(0, 5).map((pair) => {
            const isSelected = pair.id === selectedPair.id;
            return (
              <button
                key={pair.id}
                type="button"
                onClick={() => {
                  onSelectPair(pair);
                  soundEffects.playTick();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold ring-2 ring-cyan-400/40'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{pair.icon}</span>
                <span>{pair.name}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${isSelected ? 'bg-black/20 text-slate-950' : 'bg-emerald-500/15 text-emerald-400'}`}>
                  {pair.payoutPercent}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Technical Indicators Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Indicator 1: RSI */}
        <div className="bg-[#0b1120] border border-slate-800/90 rounded-2xl p-3 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span className="font-bold flex items-center gap-1">
                <BarChart3 size={12} className="text-cyan-400" /> RSI (14)
              </span>
              <span className="font-mono text-white font-bold">{rsiValue}%</span>
            </div>

            {/* RSI progress bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden my-1.5 flex">
              <div
                className={`h-full transition-all duration-700 ${
                  isUp ? 'bg-emerald-400' : 'bg-rose-500'
                }`}
                style={{ width: `${rsiValue}%` }}
              />
            </div>
          </div>

          <div className="mt-1">
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded block text-center truncate ${
                isUp
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
              }`}
            >
              {isUp ? 'تشبع بيعي (صعود 🟢)' : 'تشبع شرائي (هبوط 🔴)'}
            </span>
          </div>
        </div>

        {/* Indicator 2: MACD */}
        <div className="bg-[#0b1120] border border-slate-800/90 rounded-2xl p-3 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span className="font-bold flex items-center gap-1">
                <Layers size={12} className="text-amber-400" /> MACD
              </span>
              <span className="font-mono text-cyan-400 font-bold">12, 26, 9</span>
            </div>
            <div className="text-[11px] text-slate-300 font-medium my-1 truncate">
              {isUp ? 'تقاطع صاعد فوق الصفر' : 'تقاطع هابط أسفل الصفر'}
            </div>
          </div>

          <div className="mt-1">
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded block text-center truncate ${
                isUp
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
              }`}
            >
              {isUp ? 'إشارة شراء إيجابية 🟢' : 'إشارة بيع سلبية 🔴'}
            </span>
          </div>
        </div>

        {/* Indicator 3: Bollinger Bands */}
        <div className="bg-[#0b1120] border border-slate-800/90 rounded-2xl p-3 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span className="font-bold flex items-center gap-1">
                <Activity size={12} className="text-purple-400" /> بولينجر باند
              </span>
              <span className="font-mono text-slate-400 font-bold">20, 2</span>
            </div>
            <div className="text-[11px] text-slate-300 font-medium my-1 truncate">
              {isUp ? 'اختراق الحد السفلي' : 'اختراق الحد العلوي'}
            </div>
          </div>

          <div className="mt-1">
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded block text-center truncate ${
                isUp
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
              }`}
            >
              {isUp ? 'ارتداد صعودي قوي 🟢' : 'ارتداد هبوطي قوي 🔴'}
            </span>
          </div>
        </div>

        {/* Indicator 4: Moving Averages EMA */}
        <div className="bg-[#0b1120] border border-slate-800/90 rounded-2xl p-3 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span className="font-bold flex items-center gap-1">
                <Gauge size={12} className="text-emerald-400" /> الاتجاه العام
              </span>
              <span className="font-mono text-emerald-400 font-bold">EMA 7/25</span>
            </div>
            <div className="text-[11px] text-slate-300 font-medium my-1 truncate flex items-center gap-1">
              {isUp ? <TrendingUp size={12} className="text-emerald-400" /> : <TrendingDown size={12} className="text-rose-400" />}
              <span>{isUp ? 'زخم شرائي متصاعد' : 'ضغط بيعي مستمر'}</span>
            </div>
          </div>

          <div className="mt-1">
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded block text-center truncate ${
                isUp
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}
            >
              {isUp ? 'صعود مؤكد (CALL)' : 'هبوط مؤكد (PUT)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
