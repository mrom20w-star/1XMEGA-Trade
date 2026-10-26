import React from 'react';
import { AssetPair, ASSET_PAIRS } from '../types/trading';
import { soundEffects } from '../utils/audio';

interface Props {
  selectedPair: AssetPair;
  onSelectPair: (pair: AssetPair) => void;
  livePrices: Record<string, number>;
}

export const AssetSelector: React.FC<Props> = ({
  selectedPair,
  onSelectPair,
  livePrices,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-slate-400">اختر زوج التداول للتحليل:</h3>
        <span className="text-[11px] text-cyan-400 font-medium">سوق VIP مباشر</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {ASSET_PAIRS.map((pair) => {
          const isSelected = selectedPair.id === pair.id;
          const currentPrice = livePrices[pair.id] || pair.basePrice;

          return (
            <button
              key={pair.id}
              onClick={() => {
                soundEffects.playTick();
                onSelectPair(pair);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-right whitespace-nowrap transition-all shrink-0 ${
                isSelected
                  ? 'bg-cyan-950/60 border-cyan-500/80 shadow-lg shadow-cyan-500/10 text-white ring-1 ring-cyan-500/30'
                  : 'bg-[#0b1120] border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <span className="text-xl">{pair.icon}</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs">{pair.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-500/15 text-emerald-400">
                    {pair.payoutPercent}%
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  {currentPrice.toFixed(pair.decimals)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
