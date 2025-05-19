import { Stock, Sector, Portfolio } from '../types/portfolio';
import { format } from 'date-fns';

// Calculate investment value for a stock
export const calculateInvestment = (stock: Stock): number => {
  return stock.purchasePrice * stock.quantity;
};

// Calculate present value for a stock
export const calculatePresentValue = (stock: Stock): number => {
  if (stock.cmp === null) {
    return calculateInvestment(stock);
  }
  return stock.cmp * stock.quantity;
};

// Calculate gain/loss for a stock
export const calculateGainLoss = (stock: Stock): number => {
  const investment = calculateInvestment(stock);
  const presentValue = calculatePresentValue(stock);
  return presentValue - investment;
};

// Calculate gain/loss percentage for a stock
export const calculateGainLossPercentage = (stock: Stock): number => {
  const investment = calculateInvestment(stock);
  const gainLoss = calculateGainLoss(stock);
  if (investment === 0) return 0;
  return (gainLoss / investment) * 100;
};

// Calculate portfolio percentage for a stock
export const calculatePortfolioPercentage = (stock: Stock, totalPortfolioValue: number): number => {
  const presentValue = calculatePresentValue(stock);
  if (totalPortfolioValue === 0) return 0;
  return (presentValue / totalPortfolioValue) * 100;
};

// Group stocks by sector and calculate sector summaries
export const groupStocksBySector = (stocks: Stock[]): Sector[] => {
  const sectors: { [key: string]: Stock[] } = {};
  
  // Group stocks by sector
  stocks.forEach(stock => {
    if (!sectors[stock.sector]) {
      sectors[stock.sector] = [];
    }
    sectors[stock.sector].push(stock);
  });
  
  // Calculate summary for each sector
  return Object.entries(sectors).map(([name, sectorStocks]) => {
    const totalInvestment = sectorStocks.reduce((sum, stock) => sum + calculateInvestment(stock), 0);
    const totalPresentValue = sectorStocks.reduce((sum, stock) => sum + calculatePresentValue(stock), 0);
    const gainLoss = totalPresentValue - totalInvestment;
    const gainLossPercentage = totalInvestment > 0 ? (gainLoss / totalInvestment) * 100 : 0;
    
    return {
      name,
      stocks: sectorStocks,
      totalInvestment,
      totalPresentValue,
      gainLoss,
      gainLossPercentage
    };
  }).sort((a, b) => b.totalPresentValue - a.totalPresentValue); // Sort sectors by present value
};

// Calculate portfolio summary
export const calculatePortfolioSummary = (stocks: Stock[]): Portfolio => {
  const sectors = groupStocksBySector(stocks);
  const totalInvestment = sectors.reduce((sum, sector) => sum + sector.totalInvestment, 0);
  const totalPresentValue = sectors.reduce((sum, sector) => sum + sector.totalPresentValue, 0);
  const totalGainLoss = totalPresentValue - totalInvestment;
  const gainLossPercentage = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;
  
  // Find the latest update timestamp
  const lastUpdated = stocks.length > 0 
    ? stocks.reduce((latest, stock) => {
        if (!stock.lastUpdated) return latest;
        if (!latest) return stock.lastUpdated;
        return new Date(stock.lastUpdated) > new Date(latest) ? stock.lastUpdated : latest;
      }, null as string | null)
    : null;
  
  return {
    sectors,
    totalInvestment,
    totalPresentValue,
    totalGainLoss,
    gainLossPercentage,
    lastUpdated
  };
};

// Format currency values
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(value);
};

// Format percentage values
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

// Format date/time
export const formatDateTime = (dateTimeStr: string | null): string => {
  if (!dateTimeStr) return 'N/A';
  try {
    return format(new Date(dateTimeStr), 'MMM d, yyyy HH:mm:ss');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};