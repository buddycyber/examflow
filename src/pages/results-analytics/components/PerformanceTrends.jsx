import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const PerformanceTrends = ({ userRole, trendData }) => {
  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Performance Over Time */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Performance Over Time</h3>
          <div className="flex items-center space-x-2">
            <select className="px-3 py-1 bg-input border border-border rounded text-sm">
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData?.performanceOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="date" 
                stroke="#64748B"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748B"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#2563EB" 
                strokeWidth={2}
                dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#2563EB', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Subject Performance</h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData?.subjectPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="subject" 
                  stroke="#64748B"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748B"
                  fontSize={12}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="averageScore" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Difficulty Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Performance by Difficulty</h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trendData?.difficultyDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trendData?.difficultyDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2">
            {trendData?.difficultyDistribution?.map((item, index) => (
              <div key={item?.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
                  ></div>
                  <span className="text-sm text-foreground">{item?.name}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{item?.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Achievement Milestones */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Achievement Milestones</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendData?.achievements?.map((achievement, index) => (
            <div key={index} className="text-center p-4 border border-border rounded-lg">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                achievement?.achieved ? 'bg-success/10' : 'bg-muted'
              }`}>
                <Icon 
                  name={achievement?.icon} 
                  size={20} 
                  className={achievement?.achieved ? 'text-success' : 'text-muted-foreground'} 
                />
              </div>
              <h4 className="font-medium text-foreground mb-1">{achievement?.title}</h4>
              <p className="text-xs text-muted-foreground mb-2">{achievement?.description}</p>
              <div className={`text-xs px-2 py-1 rounded ${
                achievement?.achieved ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
              }`}>
                {achievement?.achieved ? 'Achieved' : 'In Progress'}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Study Time Analysis */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Study Time Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <Icon name="Clock" size={24} className="text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">2h 45m</div>
            <div className="text-sm text-muted-foreground">Average per exam</div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <Icon name="Target" size={24} className="text-success mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">85%</div>
            <div className="text-sm text-muted-foreground">Time efficiency</div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <Icon name="TrendingUp" size={24} className="text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">+12%</div>
            <div className="text-sm text-muted-foreground">Improvement rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTrends;