import React, { useMemo } from 'react';
import { Stock } from '../types/portfolio';
import { 
  calculateInvestment, 
  calculatePresentValue, 
  calculateGainLoss, 
  calculateGainLossPercentage,
  formatCurrency, 
  formatPercentage 
} from '../utils/portfolioUtils';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface StockTableProps {
  stocks: Stock[];
  isLoading: boolean;
}

export const StockTable: React.FC<StockTableProps> = ({ stocks, isLoading }) => {
  const { portfolio, sortState, setSortState } = usePortfolio();
  
  // Handle sorting
  const handleSort = (column: keyof Stock) => {
    setSortState(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Get sort icon based on current sort state
  const getSortIcon = (column: keyof Stock) => {
    if (sortState.column !== column) {
      return <ArrowUpDown size={14} className="ml-1 opacity-50" />;
    }
    return sortState.direction === 'asc' 
      ? <ArrowUp size={14} className="ml-1" />
      : <ArrowDown size={14} className="ml-1" />;
  };
  
  // Sort stocks based on current sort state
  const sortedStocks = useMemo(() => {
    if (!sortState.column) return stocks;
    
    return [...stocks].sort((a, b) => {
      let valueA: any;
      let valueB: any;
      
      // Handle derived values that are not direct properties
      switch (sortState.column) {
        case 'purchasePrice':
        case 'quantity':
        case 'cmp':
        case 'peRatio':
        case 'latestEarnings':
          valueA = a[sortState.column] || 0;
          valueB = b[sortState.column] || 0;
          break;
        default:
          valueA = a[sortState.column as keyof Stock];
          valueB = b[sortState.column as keyof Stock];
      }
      
      // Special handling for strings
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortState.direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      // Default numeric comparison
      return sortState.direction === 'asc'
        ? (valueA || 0) - (valueB || 0)
        : (valueB || 0) - (valueA || 0);
    });
  }, [stocks, sortState]);

  // Calculate total portfolio value for percentage calculations
  const totalPortfolioValue = portfolio.totalPresentValue;
  
  return (
    <div className="table-container">
      <table className="portfolio-table">
        <thead className="table-header">
          <tr>
            <th className="cursor-pointer" onClick={() => handleSort('name')}>
              <div className="flex items-center">
                Stock {getSortIcon('name')}
              </div>
            </th>
            <th className="cursor-pointer" onClick={() => handleSort('exchange')}>
              <div className="flex items-center">
                Exchange {getSortIcon('exchange')}
              </div>
            </th>
            <th className="cursor-pointer" onClick={() => handleSort('purchasePrice')}>
              <div className="flex items-center">
                Buy Price {getSortIcon('purchasePrice')}
              </div>
            </th>
            <th className="cursor-pointer" onClick={() => handleSort('quantity')}>
              <div className="flex items-center">
                Qty {getSortIcon('quantity')}
              </div>
            </th>
            <th>Investment</th>
            <th>Portfolio %</th>
            <th className="cursor-pointer" onClick={() => handleSort('cmp')}>
              <div className="flex items-center">
                CMP {getSortIcon('cmp')}
              </div>
            </th>
            <th>Present Value</th>
            <th>Gain/Loss</th>
            <th className="cursor-pointer" onClick={() => handleSort('peRatio')}>
              <div className="flex items-center">
                P/E Ratio {getSortIcon('peRatio')}
              </div>
            </th>
            <th className="cursor-pointer" onClick={() => handleSort('latestEarnings')}>
              <div className="flex items-center">
                Earnings {getSortIcon('latestEarnings')}
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="table-body">
          {sortedStocks.map((stock) => {
            const investment = calculateInvestment(stock);
            const presentValue = calculatePresentValue(stock);
            const gainLoss = calculateGainLoss(stock);
            const gainLossPercentage = calculateGainLossPercentage(stock);
            const portfolioPercentage = (presentValue / totalPortfolioValue) * 100;
            const isPositive = gainLoss >= 0;
            
            return (
              <tr key={stock.id} className="table-row">
                <td className="table-cell font-medium">
                  {stock.name}
                  <div className="text-xs text-gray-500">{stock.ticker}</div>
                </td>
                <td className="table-cell">{stock.exchange}</td>
                <td className="table-cell">{formatCurrency(stock.purchasePrice)}</td>
                <td className="table-cell">{stock.quantity}</td>
                <td className="table-cell">{formatCurrency(investment)}</td>
                <td className="table-cell">{formatPercentage(portfolioPercentage)}</td>
                <td className="table-cell">
                  {isLoading ? (
                    <div className="skeleton h-5 w-20"></div>
                  ) : (
                    stock.cmp ? formatCurrency(stock.cmp) : 'N/A'
                  )}
                </td>
                <td className="table-cell">
                  {isLoading ? (
                    <div className="skeleton h-5 w-20"></div>
                  ) : (
                    formatCurrency(presentValue)
                  )}
                </td>
                <td className={`table-cell ${isPositive ? 'profit' : 'loss'}`}>
                  {isLoading ? (
                    <div className="skeleton h-5 w-20"></div>
                  ) : (
                    <>
                      {formatCurrency(gainLoss)}
                      <div className="text-xs">
                        ({formatPercentage(gainLossPercentage)})
                      </div>
                    </>
                  )}
                </td>
                <td className="table-cell">
                  {isLoading ? (
                    <div className="skeleton h-5 w-12"></div>
                  ) : (
                    stock.peRatio ? stock.peRatio.toFixed(2) : 'N/A'
                  )}
                </td>
                <td className="table-cell">
                  {isLoading ? (
                    <div className="skeleton h-5 w-16"></div>
                  ) : (
                    stock.latestEarnings ? formatCurrency(stock.latestEarnings) : 'N/A'
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};