import { useState, useEffect } from 'react';
import { Account, MarketQuote, PnLData, PropFirmRule } from '../types';

const FIRMS_PROJECTX = ['TopstepX', 'TradeDay', 'ApexTrader'];
const FIRMS_TRADOVATE = ['Apex', 'Bulenox', 'TickTick Trader'];

const generatePnlHistory = (): PnLData[] => {
  const data: PnLData[] = [];
  let pnl = 0;
  for (let i = 0; i < 30; i++) {
    const dailyPnl = (Math.random() - 0.45) * 500;
    pnl += dailyPnl;
    data.push({ name: `Day ${i + 1}`, pnl: Math.round(pnl) });
  }
  return data;
};

const generateRules = (balance: number): PropFirmRule[] => {
  const dailyLossLimit = Math.round(balance * 0.02);
  const maxDrawdown = Math.round(balance * 0.05);
  return [
    {
      name: 'Daily Loss Limit',
      limit: dailyLossLimit,
      current: Math.round(Math.random() * (dailyLossLimit*0.8)),
      breached: false,
    },
    {
      name: 'Max Drawdown',
      limit: maxDrawdown,
      current: Math.round(Math.random() * (maxDrawdown*0.7)),
      breached: false,
    },
  ];
};


const generateMockAccounts = (count: number): Account[] => {
  const accounts: Account[] = [];
  for (let i = 0; i < count; i++) {
    const isProjectX = Math.random() > 0.5;
    const balance = Math.floor(Math.random() * 100000) + 50000;
    accounts.push({
      id: `acc_${i + 1}`,
      platform: isProjectX ? 'ProjectX' : 'Tradovate',
      firm: isProjectX
        ? FIRMS_PROJECTX[i % FIRMS_PROJECTX.length]
        : FIRMS_TRADOVATE[i % FIRMS_TRADOVATE.length],
      balance: balance,
      cushion: Math.round((Math.random() - 0.2) * 5000),
      pnlHistory: generatePnlHistory(),
      rules: generateRules(balance),
    });
  }
  return accounts;
};

const initialMarketData: MarketQuote[] = [
    { symbol: 'ES', price: 5320.50, change: 12.25, changePercent: 0.23 },
    { symbol: 'NQ', price: 18750.75, change: -45.50, changePercent: -0.24 },
    { symbol: 'CL', price: 78.50, change: 1.20, changePercent: 1.55 },
    { symbol: 'GC', price: 2350.00, change: 25.30, changePercent: 1.09 },
];


export const useMockData = () => {
  const [accounts, setAccounts] = useState<Account[]>(generateMockAccounts(5));
  const [marketData, setMarketData] = useState<MarketQuote[]>(initialMarketData);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData((prevData) =>
        prevData.map((quote) => {
          const tick = (Math.random() - 0.5) * (quote.price * 0.0001);
          const newPrice = parseFloat((quote.price + tick).toFixed(2));
          const newChange = parseFloat((newPrice - (quote.price - quote.change)).toFixed(2));
          const newChangePercent = parseFloat(((newChange / (quote.price - quote.change)) * 100).toFixed(2));
          return {
            ...quote,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
          };
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return { accounts, setAccounts, marketData };
};
