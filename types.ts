export interface PropFirmRule {
  name: string;
  limit: number;
  current: number;
  breached: boolean;
}

export interface PnLData {
  name: string;
  pnl: number;
}

export interface Account {
  id: string;
  platform: 'ProjectX' | 'Tradovate';
  firm: string;
  balance: number;
  cushion: number;
  pnlHistory: PnLData[];
  rules: PropFirmRule[];
}

export interface MarketQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export enum AiCoachTab {
  PERFORMANCE_REVIEW = 'Performance Review',
  PRE_MARKET_PLAN = 'Pre-Market Plan',
  MARKET_BRIEFING = 'Market Briefing',
  JOURNAL_ANALYSIS = 'Journal Analysis',
  CHART_REVIEW = 'Chart Review',
}

export interface GroundingSource {
    web?: {
      uri: string;
      title: string;
    }
}
