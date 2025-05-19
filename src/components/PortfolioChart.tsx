import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Portfolio } from '../types/portfolio';
import { formatCurrency } from '../utils/portfolioUtils';

interface PortfolioChartProps {
  portfolio: Portfolio;
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ portfolio }) => {
  // Generate sample historical data (in a real app, this would come from your API)
  const data = portfolio.sectors.map(sector => ({
    name: sector.name,
    investment: sector.totalInvestment,
    value: sector.totalPresentValue,
  }));

  return (
    <div className="h-[500px] flex flex-col gap-10">
      <h3 className="text-lg font-semibold mb-4">Sector Performance</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#6b7280' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            tick={{ fill: '#6b7280' }}
            tickLine={{ stroke: '#e5e7eb' }}
            tickFormatter={(value) => formatCurrency(value).split('.')[0]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
            formatter={(value: number) => [formatCurrency(value), '']}
          />
          <Line
            type="monotone"
            dataKey="investment"
            stroke="#0047AB"
            strokeWidth={2}
            dot={{ fill: '#0047AB', strokeWidth: 2 }}
            name="Investment"
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#00A86B"
            strokeWidth={2}
            dot={{ fill: '#00A86B', strokeWidth: 2 }}
            name="Current Value"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};