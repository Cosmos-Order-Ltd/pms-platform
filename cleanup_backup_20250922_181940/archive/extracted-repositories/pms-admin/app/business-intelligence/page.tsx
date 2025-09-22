'use client';

import React, { useEffect, useState } from 'react';

interface CompetitorData {
  name: string;
  occupancy: number;
  adr: number;
  revpar: number;
  rating: number;
  trend: 'up' | 'down' | 'stable';
}

interface MarketInsight {
  category: string;
  value: string;
  change: number;
  impact: 'high' | 'medium' | 'low';
}

interface RevenueOptimization {
  strategy: string;
  potential: number;
  timeline: string;
  confidence: number;
}

interface PredictiveAnalysis {
  metric: string;
  current: number;
  predicted: number;
  confidence: number;
  timeframe: string;
}

interface BusinessMetric {
  name: string;
  value: string;
  change: number;
  trend: 'positive' | 'negative' | 'neutral';
}

const BusinessIntelligencePage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30d');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Cyprus-specific competitor data
  const competitorData: CompetitorData[] = [
    { name: 'Atlantica Mare Village', occupancy: 78, adr: 185, revpar: 144, rating: 4.3, trend: 'up' },
    { name: 'Coral Beach Hotel', occupancy: 82, adr: 220, revpar: 180, rating: 4.5, trend: 'up' },
    { name: 'Four Seasons Cyprus', occupancy: 85, adr: 450, revpar: 383, rating: 4.8, trend: 'stable' },
    { name: 'Amara Hotel', occupancy: 75, adr: 280, revpar: 210, rating: 4.6, trend: 'down' },
    { name: 'Elysium Hotel', occupancy: 80, adr: 320, revpar: 256, rating: 4.4, trend: 'stable' },
  ];

  // Market insights for Cyprus tourism
  const marketInsights: MarketInsight[] = [
    { category: 'UK Market', value: '+12% bookings', change: 12, impact: 'high' },
    { category: 'Russian Market', value: '-8% bookings', change: -8, impact: 'medium' },
    { category: 'German Market', value: '+5% bookings', change: 5, impact: 'medium' },
    { category: 'Local Events', value: 'Wine Festival Sep', change: 15, impact: 'high' },
    { category: 'Weather Impact', value: 'Extended season', change: 8, impact: 'medium' },
    { category: 'Flight Capacity', value: '+20% seats', change: 20, impact: 'high' },
  ];

  // Revenue optimization strategies
  const revenueOptimizations: RevenueOptimization[] = [
    { strategy: 'Dynamic Pricing Implementation', potential: 8.5, timeline: '2 weeks', confidence: 92 },
    { strategy: 'Package Deal Restructuring', potential: 12.3, timeline: '1 month', confidence: 85 },
    { strategy: 'Length of Stay Incentives', potential: 6.7, timeline: '1 week', confidence: 88 },
    { strategy: 'Early Bird Promotions', potential: 15.2, timeline: '3 weeks', confidence: 79 },
    { strategy: 'Corporate Rate Optimization', potential: 4.8, timeline: '2 weeks', confidence: 94 },
  ];

  // Predictive analysis data
  const predictiveAnalyses: PredictiveAnalysis[] = [
    { metric: 'Occupancy Rate', current: 78, predicted: 83, confidence: 87, timeframe: '30 days' },
    { metric: 'ADR (€)', current: 185, predicted: 198, confidence: 82, timeframe: '30 days' },
    { metric: 'RevPAR (€)', current: 144, predicted: 164, confidence: 85, timeframe: '30 days' },
    { metric: 'Guest Satisfaction', current: 4.2, predicted: 4.4, confidence: 78, timeframe: '60 days' },
    { metric: 'Market Share (%)', current: 12.5, predicted: 14.2, confidence: 71, timeframe: '90 days' },
  ];

  // Business metrics with Cyprus-specific context
  const businessMetrics: BusinessMetric[] = [
    { name: 'Total Revenue', value: '€2.4M', change: 8.5, trend: 'positive' },
    { name: 'Guest Arrivals', value: '12,845', change: 12.3, trend: 'positive' },
    { name: 'Average Stay', value: '6.8 days', change: -2.1, trend: 'negative' },
    { name: 'Repeat Guests', value: '34%', change: 5.7, trend: 'positive' },
    { name: 'Online Rating', value: '4.3/5', change: 0.2, trend: 'positive' },
    { name: 'Market Position', value: '#3 Paphos', change: 1, trend: 'positive' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getImpactBadgeColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 px-2 py-1 rounded text-xs';
      case 'medium': return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs';
      case 'low': return 'bg-green-100 text-green-800 px-2 py-1 rounded text-xs';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Cyprus Market Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Intelligence</h1>
          <p className="text-gray-600 mt-1">Cyprus Tourism Market Analytics & Insights</p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d', '1y'].map((period) => (
            <button
              key={period}
              className={`px-4 py-2 rounded text-sm font-medium ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {businessMetrics.map((metric, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="text-gray-600">📊</div>
              <span className={`text-sm font-medium ${getChangeColor(metric.change)}`}>
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </span>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
              <p className="text-sm text-gray-600">{metric.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Competitors Analysis */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            🏨 Cyprus Hotel Competitive Analysis
          </h2>
          <p className="text-gray-600 mt-1">Performance comparison with key competitors in Paphos region</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {competitorData.map((competitor, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{competitor.name}</h4>
                    <span>{getTrendIcon(competitor.trend)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>⭐</span>
                    <span className="text-sm">{competitor.rating}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Occupancy</p>
                    <p className="font-semibold">{competitor.occupancy}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: `${competitor.occupancy}%`}}></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600">ADR</p>
                    <p className="font-semibold">€{competitor.adr}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">RevPAR</p>
                    <p className="font-semibold">€{competitor.revpar}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Insights & Revenue Optimization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Insights */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              🌍 Market Insights
            </h2>
            <p className="text-gray-600 mt-1">Current trends affecting Cyprus tourism market</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {marketInsights.map((insight, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h4 className="font-medium">{insight.category}</h4>
                    <p className="text-sm text-gray-600">{insight.value}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={getImpactBadgeColor(insight.impact)}>
                      {insight.impact}
                    </span>
                    <span className={`font-semibold ${getChangeColor(insight.change)}`}>
                      {insight.change > 0 ? '+' : ''}{insight.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Optimization */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              ⚡ Revenue Optimization
            </h2>
            <p className="text-gray-600 mt-1">AI-powered strategies to increase revenue performance</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {revenueOptimizations.slice(0, 3).map((optimization, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{optimization.strategy}</h4>
                      <p className="text-sm text-gray-600 mt-1">Timeline: {optimization.timeline}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-bold text-lg">+{optimization.potential}%</div>
                      <p className="text-sm text-gray-600">Revenue Impact</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Confidence:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: `${optimization.confidence}%`}}></div>
                    </div>
                    <span className="text-sm font-medium">{optimization.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Predictive Analytics */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            👁️ Predictive Analytics
          </h2>
          <p className="text-gray-600 mt-1">AI forecasts for key performance metrics</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {predictiveAnalyses.map((analysis, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{analysis.metric}</h4>
                  <span className="text-sm text-gray-600">{analysis.timeframe}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm text-gray-600">Current: </span>
                    <span className="font-semibold">{analysis.current}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Predicted: </span>
                    <span className="font-semibold text-blue-600">{analysis.predicted}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Confidence:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: `${analysis.confidence}%`}}></div>
                  </div>
                  <span className="text-sm">{analysis.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            🎯 Recommended Actions
          </h2>
          <p className="text-gray-600 mt-1">Priority actions based on current market analysis</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">High Priority</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Implement dynamic pricing for peak season</li>
                <li>• Launch early bird promotion campaign</li>
                <li>• Review competitor pricing strategies</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Medium Priority</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Optimize package deals structure</li>
                <li>• Enhance corporate rate strategy</li>
                <li>• Monitor UK market trends closely</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Monitor</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Track guest satisfaction scores</li>
                <li>• Monitor seasonal booking patterns</li>
                <li>• Assess new market opportunities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessIntelligencePage;