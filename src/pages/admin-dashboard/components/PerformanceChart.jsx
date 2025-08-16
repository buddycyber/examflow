import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const PerformanceChart = ({ type = 'line', data, title, color = '#2563EB' }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-moderate">
          <p className="text-sm font-medium text-popover-foreground">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              {entry?.name}: <span className="font-medium" style={{ color: entry?.color }}>
                {entry?.value}{entry?.name?.includes('Score') || entry?.name?.includes('Rate') ? '%' : ''}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (type === 'bar') {
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: '#64748B' }}
            axisLine={{ stroke: '#E2E8F0' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#64748B' }}
            axisLine={{ stroke: '#E2E8F0' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      );
    }

    return (
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12, fill: '#64748B' }}
          axisLine={{ stroke: '#E2E8F0' }}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: '#64748B' }}
          axisLine={{ stroke: '#E2E8F0' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={2}
          dot={{ fill: color, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
        />
      </LineChart>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;