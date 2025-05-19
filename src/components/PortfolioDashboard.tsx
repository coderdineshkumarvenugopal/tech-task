import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { SectorCard } from './SectorCard';
import { AlertCircle, PieChart, BarChart as BarChartIcon, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioChart } from './PortfolioChart';
import { SectorDistribution } from './SectorDistribution';
import { PerformanceMetrics } from './PerformanceMetrics';

export const PortfolioDashboard: React.FC = () => {
  const { portfolio, isLoading, error } = usePortfolio();
  const [expandedSectors, setExpandedSectors] = useState<Record<string, boolean>>({});
  const [activeChart, setActiveChart] = useState<'distribution' | 'performance'>('distribution');

  const toggleSector = (sectorName: string) => {
    setExpandedSectors(prev => ({
      ...prev,
      [sectorName]: !prev[sectorName]
    }));
  };

  if (isLoading && portfolio.sectors.length === 0) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="sector-card animated-bg">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="sector-summary">
                  <div className="h-16 bg-gray-200 rounded"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4"
      >
        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-6 py-4 rounded-lg flex items-start">
          <AlertCircle className="w-6 h-6 mr-3 mt-0.5" />
          <div>
            <p className="font-semibold text-lg">Error fetching portfolio data</p>
            <p className="text-sm mt-1">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-3 text-sm font-medium bg-danger-100 hover:bg-danger-200 text-danger-800 px-4 py-2 rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="portfolio-dashboard space-y-8"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-semibold mb-4 md:mb-0">Portfolio Overview</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveChart('distribution')}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              activeChart === 'distribution'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <PieChart className="w-4 h-4 mr-2" />
            Distribution
          </button>
          <button
            onClick={() => setActiveChart('performance')}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              activeChart === 'performance'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Performance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="wait">
          {activeChart === 'distribution' ? (
            <motion.div
              key="distribution"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <SectorDistribution portfolio={portfolio} />
            </motion.div>
          ) : (
            <motion.div
              key="performance"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <PortfolioChart portfolio={portfolio} />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          variants={item}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <PerformanceMetrics portfolio={portfolio} />
        </motion.div>
      </div>

      <motion.div variants={item}>
        <h2 className="text-2xl font-semibold mb-6">Portfolio by Sector</h2>
        {portfolio.sectors.map((sector) => (
          <motion.div 
            key={sector.name} 
            variants={item}
            layout
          >
            <SectorCard 
              sector={sector} 
              isExpanded={!!expandedSectors[sector.name]} 
              onToggle={() => toggleSector(sector.name)}
              isLoading={isLoading}
            />
          </motion.div>
        ))}
      </motion.div>
      
      {portfolio.sectors.length === 0 && !isLoading && (
        <motion.div 
          variants={item}
          className="text-center py-10"
        >
          <BarChartIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No portfolio data available.</p>
          <p className="text-gray-400 text-sm mt-2">Add some stocks to get started.</p>
        </motion.div>
      )}
    </motion.div>
  );
};