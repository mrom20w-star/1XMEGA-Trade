import React, { useEffect, useRef, useState, useMemo } from 'react';
import { AssetPair, Candle, TradingSignal } from '../types/trading';
import { TrendingUp, TrendingDown, Maximize2, Activity } from 'lucide-react';

interface Props {
  pair: AssetPair;
  activeSignal: TradingSignal | null;
  timeframe: string;
  onTimeframeChange: (tf: string) => void;
  currentLivePrice: number;
}

export const LiveTradingChart: React.FC<Props> = ({
  pair,
  activeSignal,
  timeframe,
  onTimeframeChange,
  currentLivePrice,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);

  // Initialize candles for the pair
  useEffect(() => {
    const initialCandles: Candle[] = [];
    let price = pair.basePrice;
    const now = Date.now();
    const step = 60 * 1000;
    const count = 45;

    for (let i = count; i >= 0; i--) {
      const time = now - i * step;
      const volatility = pair.basePrice * (pair.volatility === 'عالية' ? 0.0018 : 0.0008);
      const delta = (Math.random() - 0.49) * volatility;
      const open = price;
      const close = price + delta;
      const high = Math.max(open, close) + Math.random() * volatility * 0.6;
      const low = Math.min(open, close) - Math.random() * volatility * 0.6;
      const volume = Math.floor(Math.random() * 500) + 100;

      initialCandles.push({
        time,
        open,
        high,
        low,
        close,
        volume,
      });

      price = close;
    }
    setCandles(initialCandles);
  }, [pair.id]);

  // Update latest candle with live price
  useEffect(() => {
    if (candles.length === 0 || !currentLivePrice) return;

    setCandles((prev) => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      const lastIdx = next.length - 1;
      const last = next[lastIdx];

      next[lastIdx] = {
        ...last,
        close: currentLivePrice,
        high: Math.max(last.high, currentLivePrice),
        low: Math.min(last.low, currentLivePrice),
      };
      return next;
    });
  }, [currentLivePrice]);

  // Calculate 24h change & stats
  const priceChange = useMemo(() => {
    if (candles.length < 2) return { diff: 0, percent: 0, isPositive: true };
    const first = candles[0].open;
    const current = currentLivePrice || candles[candles.length - 1].close;
    const diff = current - first;
    const percent = (diff / first) * 100;
    return {
      diff,
      percent,
      isPositive: diff >= 0,
    };
  }, [candles, currentLivePrice]);

  // Render on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina support
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear
    ctx.fillStyle = '#080d1a';
    ctx.fillRect(0, 0, width, height);

    // Calculate Min & Max Price with padding
    const prices = candles.flatMap((c) => [c.high, c.low]);
    if (activeSignal) {
      prices.push(activeSignal.entryPrice);
    }
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;
    const paddingY = height * 0.12;
    const chartHeight = height - paddingY * 2;

    const getY = (val: number) => {
      return height - paddingY - ((val - minPrice) / priceRange) * chartHeight;
    };

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = paddingY + (chartHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width - 70, y);
      ctx.stroke();

      const priceAtY = maxPrice - (i / gridLines) * priceRange;
      ctx.fillStyle = '#64748b';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(priceAtY.toFixed(pair.decimals), width - 8, y + 3);
    }

    // Candle metrics
    const candleWidth = Math.max(4, Math.floor((width - 90) / candles.length) - 2);
    const candleSpacing = 2;

    // Draw Candles & Moving Average line
    const maPoints: { x: number; y: number }[] = [];
    const period = 7;

    candles.forEach((candle, index) => {
      const x = 20 + index * (candleWidth + candleSpacing);
      const isBullish = candle.close >= candle.open;

      // Color
      const candleColor = isBullish ? '#10b981' : '#ef4444';
      ctx.strokeStyle = candleColor;
      ctx.fillStyle = candleColor;

      // Wick
      const highY = getY(candle.high);
      const lowY = getY(candle.low);
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, highY);
      ctx.lineTo(x + candleWidth / 2, lowY);
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Body
      const openY = getY(candle.open);
      const closeY = getY(candle.close);
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.max(2, Math.abs(closeY - openY));

      ctx.fillRect(x, bodyTop, candleWidth, bodyHeight);

      // MA Calculation
      if (index >= period - 1) {
        let sum = 0;
        for (let k = 0; k < period; k++) {
          sum += candles[index - k].close;
        }
        const maVal = sum / period;
        maPoints.push({ x: x + candleWidth / 2, y: getY(maVal) });
      }
    });

    // Draw Moving Average Line (EMA 7)
    if (maPoints.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.8;
      ctx.moveTo(maPoints[0].x, maPoints[0].y);
      for (let i = 1; i < maPoints.length; i++) {
        ctx.lineTo(maPoints[i].x, maPoints[i].y);
      }
      ctx.stroke();
    }

    // Active Signal Indicator Line
    if (activeSignal) {
      const sigY = getY(activeSignal.entryPrice);
      const isBuy = activeSignal.type === 'BUY';
      const sigColor = isBuy ? '#10b981' : '#ef4444';

      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = sigColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, sigY);
      ctx.lineTo(width - 75, sigY);
      ctx.stroke();
      ctx.restore();

      // Signal Label
      ctx.fillStyle = sigColor;
      ctx.fillRect(width - 98, sigY - 11, 93, 22);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Cairo, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(isBuy ? '▲ صعود (شراء)' : '▼ هبوط (بيع)', width - 51, sigY + 4);
    }

    // Current Live Price line and pulsing dot
    const latestClose = currentLivePrice || candles[candles.length - 1].close;
    const currentY = getY(latestClose);

    ctx.save();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, currentY);
    ctx.lineTo(width - 70, currentY);
    ctx.stroke();
    ctx.restore();

    // Live Badge at right axis
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.roundRect(width - 68, currentY - 11, 65, 22, 4);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(latestClose.toFixed(pair.decimals), width - 35, currentY + 4);

    // Glowing dot at current candle
    const lastX = 20 + (candles.length - 1) * (candleWidth + candleSpacing) + candleWidth / 2;
    ctx.beginPath();
    ctx.arc(lastX, currentY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lastX, currentY, 8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.fill();

  }, [candles, currentLivePrice, activeSignal, pair]);

  return (
    <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-4 md:p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-2xl shadow-inner">
            {pair.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg md:text-xl font-black text-white tracking-wide">{pair.name}</h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                عائد {pair.payoutPercent}%
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
              <span className="text-white text-sm font-bold tracking-tight">
                {currentLivePrice ? currentLivePrice.toFixed(pair.decimals) : pair.basePrice.toFixed(pair.decimals)}
              </span>
              <span className={`flex items-center gap-0.5 font-bold ${priceChange.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {priceChange.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {priceChange.percent >= 0 ? '+' : ''}{priceChange.percent.toFixed(2)}%
              </span>
              <span className="text-slate-500 hidden sm:inline">| خادم الأسعار: مباشر VIP</span>
            </div>
          </div>
        </div>

        {/* Timeframe & Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
            {['1M', '5M', '15M'].map((tf) => (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  timeframe === tf
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium">
            <Activity size={14} className="text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">مؤشر EMA 7</span>
            <div className="w-2.5 h-0.5 bg-amber-400 rounded-full" />
          </div>
        </div>
      </div>

      {/* Canvas Chart Area */}
      <div className="relative w-full h-[260px] sm:h-[320px] md:h-[360px] rounded-xl overflow-hidden border border-slate-800/80 bg-[#080d1a]">
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-crosshair"
        />

        {/* Floating Indicator stats overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 pointer-events-none">
          <div className="bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1.5 shadow-lg">
            <span className="text-slate-400 font-sans">التقلب:</span>
            <span className="text-amber-400 font-bold">{pair.volatility}</span>
          </div>
          <div className="bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1.5 shadow-lg">
            <span className="text-slate-400 font-sans">السيولة:</span>
            <span className="text-cyan-400 font-bold font-mono">98.4%</span>
          </div>
        </div>

        {/* Watermark Logo */}
        <div className="absolute bottom-4 left-6 pointer-events-none select-none opacity-15 text-3xl md:text-5xl font-black text-slate-500 tracking-wider">
          1XMEGA TRADE
        </div>
      </div>
    </div>
  );
};
