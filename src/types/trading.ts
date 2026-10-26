export type SignalType = 'BUY' | 'SELL';

export interface AssetPair {
  id: string;
  name: string;
  category: 'Forex' | 'Crypto' | 'Commodities' | 'OTC';
  basePrice: number;
  decimals: number;
  payoutPercent: number; // e.g. 92%
  volatility: 'منخفضة' | 'متوسطة' | 'عالية';
  icon: string;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TradingSignal {
  id: string;
  pairId: string;
  pairName: string;
  type: SignalType;
  entryPrice: number;
  timeframe: string; // '1 دقيقة' | '5 دقائق'
  accuracy: number; // e.g. 95.8%
  timestamp: number;
  indicators: {
    rsi: number;
    macd: 'تقاطع إيجابي (صعود)' | 'تقاطع سلبي (هبوط)';
    bollinger: 'اختراق الحد السفلي' | 'اختراق الحد العلوي' | 'استقرار ضمن النطاق';
    trend: 'صاعد قوي' | 'هابط قوي' | 'تصحيحي';
  };
  status: 'ACTIVE' | 'EXPIRED' | 'WIN';
}

export interface UserStats {
  totalWins: number;
  totalSignals: number;
  winRate: number;
  profitEstimated: number;
}

export const ASSET_PAIRS: AssetPair[] = [
  {
    id: 'EURUSD',
    name: 'EUR / USD',
    category: 'Forex',
    basePrice: 1.08420,
    decimals: 5,
    payoutPercent: 92,
    volatility: 'متوسطة',
    icon: '💶',
  },
  {
    id: 'BTCUSDT',
    name: 'BTC / USDT',
    category: 'Crypto',
    basePrice: 67450.0,
    decimals: 2,
    payoutPercent: 88,
    volatility: 'عالية',
    icon: '₿',
  },
  {
    id: 'XAUUSD',
    name: 'الذهب XAU / USD',
    category: 'Commodities',
    basePrice: 2734.50,
    decimals: 2,
    payoutPercent: 95,
    volatility: 'عالية',
    icon: '🥇',
  },
  {
    id: 'GBPUSD',
    name: 'GBP / USD',
    category: 'Forex',
    basePrice: 1.29850,
    decimals: 5,
    payoutPercent: 90,
    volatility: 'متوسطة',
    icon: '💷',
  },
  {
    id: 'USDJPY',
    name: 'USD / JPY',
    category: 'Forex',
    basePrice: 152.340,
    decimals: 3,
    payoutPercent: 89,
    volatility: 'منخفضة',
    icon: '💴',
  },
  {
    id: 'ETHUSDT',
    name: 'ETH / USDT',
    category: 'Crypto',
    basePrice: 2540.20,
    decimals: 2,
    payoutPercent: 87,
    volatility: 'عالية',
    icon: '♦️',
  },
  {
    id: 'EURUSD_OTC',
    name: 'EUR / USD (OTC VIP)',
    category: 'OTC',
    basePrice: 1.08510,
    decimals: 5,
    payoutPercent: 98,
    volatility: 'عالية',
    icon: '⚡',
  },
];

export const OFFICIAL_LINKS = {
  youtube: 'https://youtube.com/@1xmegatrading',
  telegram: 'https://t.me/onexmega_Trading',
  platformDownload: 'https://pulsetrade.live/#/EGEB9F68',
  promoCode: 'MXG1',
  bonusText: 'بونص 100% على أول إيداع',
  launchTime: 'اليوم الساعة 4:00 مساءً بتوقيت القاهرة',
};
