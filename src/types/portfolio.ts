export interface Stock {
  id: string;
  name: string;
  ticker: string;
  exchange: 'NSE' | 'BSE';
  sector: string;
  purchasePrice: number;
  quantity: number;
  cmp: number | null;
  peRatio: number | null;
  latestEarnings: number | null;
  lastUpdated: string | null;
}

export interface Sector {
  name: string;
  stocks: Stock[];
  totalInvestment: number;
  totalPresentValue: number;
  gainLoss: number;
  gainLossPercentage: number;
}

export interface Portfolio {
  sectors: Sector[];
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  gainLossPercentage: number;
  lastUpdated: string | null;
}

export interface StockPriceData {
  ticker: string;
  price: number;
  peRatio: number;
  earnings: number;
}

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  column: keyof Stock | null;
  direction: SortDirection;
}