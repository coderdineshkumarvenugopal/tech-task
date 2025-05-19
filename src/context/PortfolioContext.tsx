import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { Stock, Portfolio, StockPriceData, SortState } from '../types/portfolio';
import { fetchStockPrices } from '../services/apiService';
import { calculatePortfolioSummary } from '../utils/portfolioUtils';
import { sampleStocks } from '../data/mockData';

interface PortfolioContextType {
  stocks: Stock[];
  portfolio: Portfolio;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  lastUpdated: string | null;
  sortState: SortState;
  setSortState: React.Dispatch<React.SetStateAction<SortState>>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio>({
    sectors: [],
    totalInvestment: 0,
    totalPresentValue: 0,
    totalGainLoss: 0,
    gainLossPercentage: 0,
    lastUpdated: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: 'desc'
  });

  // Initialize with sample data
  useEffect(() => {
    setStocks(sampleStocks);
    setIsLoading(false);
  }, []);

  // Calculate portfolio summary whenever stocks change
  useEffect(() => {
    if (stocks.length > 0) {
      const portfolioSummary = calculatePortfolioSummary(stocks);
      setPortfolio(portfolioSummary);
      setLastUpdated(portfolioSummary.lastUpdated);
    }
  }, [stocks]);

  // Function to refresh stock data
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get all unique tickers
      const tickers = [...new Set(stocks.map(stock => stock.ticker))];
      
      if (tickers.length === 0) {
        setIsLoading(false);
        return;
      }
      
      // Fetch updated prices
      const priceData = await fetchStockPrices(tickers);
      
      // Update stocks with new data
      const now = new Date().toISOString();
      const updatedStocks = stocks.map(stock => {
        const data = priceData.find(d => d.ticker === stock.ticker);
        if (data) {
          return {
            ...stock,
            cmp: data.price,
            peRatio: data.peRatio,
            latestEarnings: data.earnings,
            lastUpdated: now
          };
        }
        return stock;
      });
      
      setStocks(updatedStocks);
      setLastUpdated(now);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error refreshing data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [stocks]);

  // Set up automatic refresh every 15 seconds
  useEffect(() => {
    if (stocks.length > 0) {
      const intervalId = setInterval(() => {
        refreshData();
      }, 15000); // 15 seconds
      
      return () => clearInterval(intervalId);
    }
  }, [refreshData, stocks.length]);

  return (
    <PortfolioContext.Provider value={{
      stocks,
      portfolio,
      isLoading,
      error,
      refreshData,
      lastUpdated,
      sortState,
      setSortState
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};