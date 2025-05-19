import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Portfolio } from '../types/portfolio';
import { formatCurrency, formatPercentage } from '../utils/portfolioUtils';

interface SectorDistributionProps {
  portfolio: Portfolio;
}

const COLORS = [
  '#0047AB', // Primary blue
  '#00A86B', // Accent green
  '#FF7F50', // Warning orange
  '#4299E1', // Light blue
  '#48BB78', // Light green
  '#F6AD55', // Light orange
  '#667EEA', // Indigo
  '#9F7AEA', // Purple
  '#ED64A6', // Pink
  '#38B2AC', // Teal
  '#E53E3E', // Red
  '#D69E2E', // Gold
  '#B794F4', // Soft purple
  '#2B6CB0', // Dark blue
  '#C05621', // Burnt orange
  '#319795', // Deep teal
  '#4A5568', // Cool gray
  '#718096', // Gray-blue
  '#CBD5E0', // Light gray
  '#F56565', // Soft red
  '#ECC94B', // Yellow
  '#68D391', // Mint green
  '#63B3ED', // Sky blue
  '#FAF089', // Pale yellow
  '#81E6D9', // Aqua
];


export const SectorDistribution: React.FC<SectorDistributionProps> = ({ portfolio }) => {
  const data = portfolio.sectors.map(sector => ({
    name: sector.name,
    value: sector.totalPresentValue,
    percentage: (sector.totalPresentValue / portfolio.totalPresentValue) * 100,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-gray-600">{formatCurrency(data.value)}</p>
          <p className="text-gray-500 text-sm">{formatPercentage(data.percentage)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div  className={'h-[500px] flex flex-col gap-10'}>
    <h3 className="text-lg font-semibold mb-4">Sector Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart >
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={140}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            label={({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              index
            }) => {
              const RADIAN = Math.PI / 180;
              const radius = 25 + innerRadius + (outerRadius - innerRadius);
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);

              return (
                <text
                  x={x}
                  y={y}
                  fill="#374151"
                  textAnchor={x > cx ? 'start' : 'end'}
                  dominantBaseline="central"
                  className="text-xs"
                >
                  {formatPercentage(data[index].percentage)}
                </text>
              );
            }}
          >
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span className="text-sm text-gray-600">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      
    </div>
  );
};