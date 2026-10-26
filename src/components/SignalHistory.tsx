import React from 'react';
import { TradingSignal } from '../types/trading';
import { ArrowUpRight, ArrowDownRight, Award, CheckCircle, Clock } from 'lucide-react';

interface Props {
  history: TradingSignal[];
}

export const SignalHistory: React.FC<Props> = ({ history }) => {
  return (
    <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-4 md:p-5 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-amber-400" />
          <h3 className="font-bold text-white text-sm sm:text-base">سجل إشارات 1XMEGA الأخيرة</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/50 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
          <CheckCircle size={13} />
          <span>نسبة النجاح: 95.4%</span>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500">
          لم يتم توليد إشارات بعد. اضغط على "توقع جديد" لتوليد أول إشارة!
        </div>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {history.map((sig) => {
            const isBuy = sig.type === 'BUY';
            const date = new Date(sig.timestamp);
            const timeStr = date.toLocaleTimeString('ar-EG', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });

            return (
              <div
                key={sig.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                      isBuy
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {isBuy ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  </div>

                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{sig.pairName}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                          isBuy ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {isBuy ? 'صعود (شراء 🟢)' : 'هبوط (بيع 🔴)'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                      <span>الدخول: {sig.entryPrice.toFixed(4)}</span>
                      <span>•</span>
                      <span className="text-cyan-400">{sig.timeframe}</span>
                    </div>
                  </div>
                </div>

                <div className="text-left">
                  <div className="font-mono font-bold text-emerald-400 text-xs">
                    ربح مؤكد ✓
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono flex items-center justify-end gap-1">
                    <Clock size={10} />
                    <span>{timeStr}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
