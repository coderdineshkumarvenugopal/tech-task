import axios from 'axios';
import { StockPriceData } from '../types/portfolio';
import { sampleStocks } from '../data/mockData';

// In a real implementation, these would be API calls to a backend service
// that handles the scraping or API calls to Yahoo/Google Finance

// Simulate API call to get stock prices
export const fetchStockPrices = async (tickers: string[]): Promise<StockPriceData[]> => {
  console.log('Fetching prices for:', tickers);
  
  // This is a mock implementation
  // In a real app, this would make an API call to your backend
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate random price fluctuations for demo
    return tickers.map(ticker => {
      const stock = sampleStocks.find(s => s.ticker === ticker);
      if (!stock) {
        throw new Error(`Stock with ticker ${ticker} not found`);
      }

      // Generate random fluctuation between -3% and +3%
      const fluctuation = (Math.random() * 0.06) - 0.03;
      const basePrice = stock.cmp || stock.purchasePrice;
      const newPrice = basePrice * (1 + fluctuation);
      
      // Also create some random fluctuation for PE and earnings
      const peFluct = (Math.random() * 0.04) - 0.02;
      const earnFluct = (Math.random() * 0.05) - 0.025;
      
      return {
        ticker,
        price: parseFloat(newPrice.toFixed(2)),
        peRatio: parseFloat(((stock.peRatio || 20) * (1 + peFluct)).toFixed(2)),
        earnings: parseFloat(((stock.latestEarnings || 10) * (1 + earnFluct)).toFixed(2))
      };
    });
  } catch (error) {
    console.error('Error fetching stock prices:', error);
    throw error;
  }
};

// In a real implementation, we would have separate functions for Yahoo and Google Finance data
export const fetchYahooFinanceData = async (tickers: string[]): Promise<Partial<StockPriceData>[]> => {
  // This would make a call to your backend which handles Yahoo Finance scraping
  // For demo, we'll just use the mock data
  try {
    await new Promise(resolve => setTimeout(resolve, 600));
    return tickers.map(ticker => {
      const stock = sampleStocks.find(s => s.ticker === ticker);
      const fluctuation = (Math.random() * 0.05) - 0.025;
      const basePrice = stock?.cmp || 100;
      
      return {
        ticker,
        price: parseFloat((basePrice * (1 + fluctuation)).toFixed(2))
      };
    });
  } catch (error) {
    console.error('Error fetching Yahoo Finance data:', error);
    throw error;
  }
};

export const fetchGoogleFinanceData = async (tickers: string[]): Promise<Partial<StockPriceData>[]> => {
  // This would make a call to your backend which handles Google Finance scraping
  // For demo, we'll just use the mock data
  try {
    await new Promise(resolve => setTimeout(resolve, 700));
    return tickers.map(ticker => {
      const stock = sampleStocks.find(s => s.ticker === ticker);
      const peFluct = (Math.random() * 0.03) - 0.015;
      const earnFluct = (Math.random() * 0.04) - 0.02;
      
      return {
        ticker,
        peRatio: parseFloat(((stock?.peRatio || 15) * (1 + peFluct)).toFixed(2)),
        earnings: parseFloat(((stock?.latestEarnings || 5) * (1 + earnFluct)).toFixed(2))
      };
    });
  } catch (error) {
    console.error('Error fetching Google Finance data:', error);
    throw error;
  }
};