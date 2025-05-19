import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Percent, DollarSign, BarChart } from 'lucide-react';
import { Portfolio } from '../types/portfolio';
import { formatCurrency, formatPercentage } from '../utils/portfolioUtils';

interface PerformanceMetricsProps {
  portfolio: Portfolio;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ portfolio }) => {
  const metrics = [
    {
      title: 'Best Performing Sector',
      value: portfolio.sectors.reduce((best, sector) => 
        sector.gainLossPercentage > (best?.gainLossPercentage || -Infinity) ? sector : best
      , portfolio.sectors[0])?.name || 'N/A',
      icon: TrendingUp,
      color: 'text-accent-600',
      bgColor: 'bg-accent-50',
    },
    {
      title: 'Largest Sector',
      value: portfolio.sectors.reduce((largest, sector) =>
        sector.totalPresentValue > (largest?.totalPresentValue || -Infinity) ? sector : largest
      , portfolio.sectors[0])?.name || 'N/A',
      icon: BarChart,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      title: 'Total Return',
      value: formatPercentage(portfolio.gainLossPercentage),
      icon: Percent,
      color: portfolio.gainLossPercentage >= 0 ? 'text-accent-600' : 'text-danger-500',
      bgColor: portfolio.gainLossPercentage >= 0 ? 'bg-accent-50' : 'bg-danger-50',
    },
    {
      title: 'Total Gain/Loss',
      value: formatCurrency(portfolio.totalGainLoss),
      icon: DollarSign,
      color: portfolio.totalGainLoss >= 0 ? 'text-accent-600' : 'text-danger-500',
      bgColor: portfolio.totalGainLoss >= 0 ? 'bg-accent-50' : 'bg-danger-50',
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Key Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${metric.bgColor} rounded-lg p-4`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">{metric.title}</p>
                <p className={`text-lg font-semibold mt-1 ${metric.color}`}>
                  {metric.value}
                </p>
              </div>
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};