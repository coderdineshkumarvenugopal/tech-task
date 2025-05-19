import React from 'react';
import { Sector, Stock } from '../types/portfolio';
import { formatCurrency, formatPercentage } from '../utils/portfolioUtils';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { StockTable } from './StockTable';
import { motion } from 'framer-motion';

interface SectorCardProps {
  sector: Sector;
  isExpanded: boolean;
  onToggle: () => void;
  isLoading: boolean;
}

export const SectorCard: React.FC<SectorCardProps> = ({ 
  sector, 
  isExpanded, 
  onToggle,
  isLoading
}) => {
  const isPositive = sector.gainLoss >= 0;
  const gainLossClass = isPositive ? 'bg-accent-50 text-accent-600' : 'bg-danger-50 text-danger-500';

  return (
    <motion.div 
      className="sector-card mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="sector-header" onClick={onToggle}>
        <h3 className="text-xl font-semibold flex items-center cursor-pointer">
          {sector.name}
          <span className="ml-3 text-sm text-gray-500">
            {sector.stocks.length} {sector.stocks.length === 1 ? 'stock' : 'stocks'}
          </span>
        </h3>
        <button 
          className="text-gray-500 hover:text-gray-700 transition-colors p-1"
          aria-label={isExpanded ? "Collapse section" : "Expand section"}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      
      <div className="sector-summary">
        <div className="summary-item bg-gray-50">
          <span className="text-gray-500 text-xs">Investment</span>
          <span className="font-semibold">
            {isLoading ? (
              <div className="skeleton h-5 w-24"></div>
            ) : (
              formatCurrency(sector.totalInvestment)
            )}
          </span>
        </div>
        
        <div className="summary-item bg-gray-50">
          <span className="text-gray-500 text-xs">Present Value</span>
          <span className="font-semibold">
            {isLoading ? (
              <div className="skeleton h-5 w-24"></div>
            ) : (
              formatCurrency(sector.totalPresentValue)
            )}
          </span>
        </div>
        
        <div className={`summary-item ${gainLossClass}`}>
          <span className="text-xs opacity-80">Gain/Loss</span>
          <span className="font-semibold">
            {isLoading ? (
              <div className="skeleton h-5 w-24"></div>
            ) : (
              <>
                {formatCurrency(sector.gainLoss)}
                <span className="text-xs ml-1">
                  ({formatPercentage(sector.gainLossPercentage)})
                </span>
              </>
            )}
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          <StockTable stocks={sector.stocks} isLoading={isLoading} />
        </motion.div>
      )}
    </motion.div>
  );
};