import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { formatCurrency, formatPercentage, formatDateTime } from '../utils/portfolioUtils';
import { RefreshCw, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const { portfolio, isLoading, refreshData, lastUpdated } = usePortfolio();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle manual refresh with animation
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 1000); // Keep the animation a bit longer
  };

  // Calculate gain/loss icon and color
  const isPositive = portfolio.totalGainLoss >= 0;
  const gainLossIcon = isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />;
  const gainLossClass = isPositive ? 'text-accent-600' : 'text-danger-500';

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <BarChart3 className="h-8 w-8 text-primary-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Portfolio Dashboard</h1>
          </div>
          
          <div className="flex items-center">
            {lastUpdated && (
              <span className="text-xs text-gray-500 mr-3">
                Last updated: {formatDateTime(lastUpdated)}
              </span>
            )}
            <motion.button
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              className="flex items-center justify-center rounded-full w-8 h-8 bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
              animate={isRefreshing ? { rotate: 360 } : {}}
              transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
            >
              <RefreshCw className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-primary-50 p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Total Investment</div>
            <div className="text-xl font-semibold">
              {isLoading ? (
                <div className="skeleton h-7 w-28"></div>
              ) : (
                formatCurrency(portfolio.totalInvestment)
              )}
            </div>
          </div>
          
          <div className="bg-primary-50 p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Current Value</div>
            <div className="text-xl font-semibold">
              {isLoading ? (
                <div className="skeleton h-7 w-28"></div>
              ) : (
                formatCurrency(portfolio.totalPresentValue)
              )}
            </div>
          </div>
          
          <div className="bg-primary-50 p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Total Gain/Loss</div>
            <div className={`text-xl font-semibold flex items-center ${gainLossClass}`}>
              {isLoading ? (
                <div className="skeleton h-7 w-28"></div>
              ) : (
                <>
                  {gainLossIcon}
                  <span className="ml-1">
                    {formatCurrency(portfolio.totalGainLoss)} ({formatPercentage(portfolio.gainLossPercentage)})
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;