import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ComparativeAnalytics = ({ userRole, comparativeData }) => {
  return (
    <div className="space-y-6">
      {/* Class Performance Overview (Admin Only) */}
      {userRole === 'admin' && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Class Performance Distribution</h3>
            <div className="flex items-center space-x-2">
              <select className="px-3 py-1 bg-input border border-border rounded text-sm">
                <option>All Classes</option>
                <option>Class A</option>
                <option>Class B</option>
                <option>Class C</option>
              </select>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparativeData?.classDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="scoreRange" 
                  stroke="#64748B"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748B"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="students" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      {/* Performance Comparison */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {userRole === 'admin' ? 'Top Performers' : 'Benchmark Comparison'}
        </h3>
        
        {userRole === 'admin' ? (
          <div className="space-y-4">
            {comparativeData?.topPerformers?.map((student, index) => (
              <div key={student?.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    index === 0 ? 'bg-yellow-100 text-yellow-600' :
                    index === 1 ? 'bg-gray-100 text-gray-600' :
                    index === 2 ? 'bg-orange-100 text-orange-600': 'bg-muted text-muted-foreground'
                  }`}>
                    {index < 3 ? <Icon name="Medal" size={16} /> : <span className="text-sm font-medium">{index + 1}</span>}
                  </div>
                  
                  <div>
                    <div className="font-medium text-foreground">{student?.name}</div>
                    <div className="text-sm text-muted-foreground">{student?.class}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-foreground">{student?.averageScore}%</div>
                    <div className="text-xs text-muted-foreground">Average</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold text-foreground">{student?.examsCompleted}</div>
                    <div className="text-xs text-muted-foreground">Exams</div>
                  </div>
                  
                  <Button variant="outline" size="sm" iconName="Eye" iconPosition="left" iconSize={14}>
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Your Performance vs Class Average</h4>
              
              {comparativeData?.benchmarkComparison?.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{subject?.name}</span>
                    <span className="text-muted-foreground">
                      You: {subject?.yourScore}% | Avg: {subject?.classAverage}%
                    </span>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-muted-foreground h-2 rounded-full"
                        style={{ width: `${subject?.classAverage}%` }}
                      ></div>
                    </div>
                    <div 
                      className="absolute top-0 bg-primary h-2 rounded-full"
                      style={{ width: `${subject?.yourScore}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-4">Skill Radar</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={comparativeData?.skillRadar}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fill: '#64748B' }} />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fontSize: 10, fill: '#64748B' }}
                    />
                    <Radar
                      name="Your Score"
                      dataKey="yourScore"
                      stroke="#2563EB"
                      fill="#2563EB"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Class Average"
                      dataKey="classAverage"
                      stroke="#64748B"
                      fill="#64748B"
                      fillOpacity={0.05}
                      strokeWidth={1}
                      strokeDasharray="5 5"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Question Difficulty Analysis */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Question Difficulty Analysis</h3>
        
        <div className="space-y-4">
          {comparativeData?.questionAnalysis?.map((question, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-foreground">Question {index + 1}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      question?.difficulty === 'Easy' ? 'bg-success/10 text-success' :
                      question?.difficulty === 'Medium'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                    }`}>
                      {question?.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{question?.topic}</p>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold text-foreground">{question?.correctRate}%</div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Average Time: </span>
                  <span className="text-foreground">{question?.averageTime}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Attempts: </span>
                  <span className="text-foreground">{question?.totalAttempts}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Skip Rate: </span>
                  <span className="text-foreground">{question?.skipRate}%</span>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      question?.correctRate >= 80 ? 'bg-success' :
                      question?.correctRate >= 60 ? 'bg-warning': 'bg-error'
                    }`}
                    style={{ width: `${question?.correctRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Performance Insights */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Performance Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-foreground flex items-center">
              <Icon name="TrendingUp" size={16} className="text-success mr-2" />
              Strengths
            </h4>
            {comparativeData?.insights?.strengths?.map((strength, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-success/5 rounded-lg">
                <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-foreground">{strength?.title}</div>
                  <div className="text-xs text-muted-foreground">{strength?.description}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-foreground flex items-center">
              <Icon name="Target" size={16} className="text-warning mr-2" />
              Areas for Improvement
            </h4>
            {comparativeData?.insights?.improvements?.map((improvement, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-warning/5 rounded-lg">
                <Icon name="AlertCircle" size={16} className="text-warning mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-foreground">{improvement?.title}</div>
                  <div className="text-xs text-muted-foreground">{improvement?.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparativeAnalytics;