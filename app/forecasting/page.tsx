'use client'

import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

interface ForecastModel {
  id: string
  name: string
  type: 'revenue' | 'occupancy' | 'demand' | 'pricing'
  algorithm: string
  accuracy: number
  lastTrained: string
  predictions: {
    period: string
    value: number
    confidence: number
  }[]
  isActive: boolean
}

interface ForecastPrediction {
  date: string
  revenue: number
  occupancy: number
  adr: number
  rooms: number
  confidence: number
  factors: string[]
}

interface ScenarioAnalysis {
  scenario: string
  description: string
  impact: {
    revenue: number
    occupancy: number
    adr: number
  }
  probability: number
  factors: string[]
}

interface SeasonalTrend {
  month: string
  historical: number
  predicted: number
  variance: number
  confidence: number
}

export default function ForecastingPage() {
  const [timeHorizon, setTimeHorizon] = useState('30d')
  const [forecastType, setForecastType] = useState('revenue')
  const [scenarioView, setScenarioView] = useState('base')

  const handleExcelForecast = async () => {
    const toastId = toast.loading('Generating Excel forecast report...')
    try {
      const response = await fetch('/api/forecasting/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exportType: 'excel',
          timeHorizon,
          format: 'excel'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast.success(data.message, { id: toastId })
      } else {
        toast.error('Failed to generate Excel forecast', { id: toastId })
      }
    } catch (error) {
      toast.error('Error generating Excel forecast', { id: toastId })
    }
  }

  const handleModelConfig = async () => {
    const toastId = toast.loading('Exporting model configuration...')
    try {
      const response = await fetch('/api/forecasting/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exportType: 'config',
          timeHorizon,
          format: 'json'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast.success(data.message, { id: toastId })
      } else {
        toast.error('Failed to export model configuration', { id: toastId })
      }
    } catch (error) {
      toast.error('Error exporting model configuration', { id: toastId })
    }
  }

  const handleScenarioReport = async () => {
    const toastId = toast.loading('Generating scenario analysis report...')
    try {
      const response = await fetch('/api/forecasting/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exportType: 'scenario',
          timeHorizon,
          format: 'pdf'
        })
      })

      const data = await response.json()
      if (data.success) {
        toast.success(data.message, { id: toastId })
      } else {
        toast.error('Failed to generate scenario report', { id: toastId })
      }
    } catch (error) {
      toast.error('Error generating scenario report', { id: toastId })
    }
  }

  const forecastModels: ForecastModel[] = [
    {
      id: 'rev-lstm',
      name: 'Revenue LSTM Model',
      type: 'revenue',
      algorithm: 'Long Short-Term Memory',
      accuracy: 94.2,
      lastTrained: '2024-12-28',
      predictions: [
        { period: 'Next 7 days', value: 58750, confidence: 94 },
        { period: 'Next 30 days', value: 247350, confidence: 89 },
        { period: 'Next 90 days', value: 695800, confidence: 82 }
      ],
      isActive: true
    },
    {
      id: 'occ-arima',
      name: 'Occupancy ARIMA Model',
      type: 'occupancy',
      algorithm: 'AutoRegressive Integrated Moving Average',
      accuracy: 91.8,
      lastTrained: '2024-12-27',
      predictions: [
        { period: 'Next 7 days', value: 79.5, confidence: 92 },
        { period: 'Next 30 days', value: 76.8, confidence: 87 },
        { period: 'Next 90 days', value: 81.2, confidence: 79 }
      ],
      isActive: true
    },
    {
      id: 'demand-rf',
      name: 'Demand Random Forest',
      type: 'demand',
      algorithm: 'Random Forest',
      accuracy: 88.5,
      lastTrained: '2024-12-29',
      predictions: [
        { period: 'Next 7 days', value: 412, confidence: 89 },
        { period: 'Next 30 days', value: 1847, confidence: 84 },
        { period: 'Next 90 days', value: 5234, confidence: 76 }
      ],
      isActive: true
    },
    {
      id: 'price-gbm',
      name: 'Dynamic Pricing Model',
      type: 'pricing',
      algorithm: 'Gradient Boosting',
      accuracy: 92.7,
      lastTrained: '2024-12-30',
      predictions: [
        { period: 'Next 7 days', value: 148.50, confidence: 93 },
        { period: 'Next 30 days', value: 142.75, confidence: 88 },
        { period: 'Next 90 days', value: 156.25, confidence: 81 }
      ],
      isActive: true
    }
  ]

  const forecastPredictions: ForecastPrediction[] = [
    {
      date: '2025-01-01',
      revenue: 8450,
      occupancy: 82.5,
      adr: 155.00,
      rooms: 67,
      confidence: 94,
      factors: ['New Year Holiday', 'High Demand', 'Premium Pricing']
    },
    {
      date: '2025-01-02',
      revenue: 7850,
      occupancy: 78.2,
      adr: 148.50,
      rooms: 63,
      confidence: 91,
      factors: ['Holiday Continuation', 'Check-out Peak']
    },
    {
      date: '2025-01-03',
      revenue: 6240,
      occupancy: 65.8,
      adr: 142.00,
      rooms: 53,
      confidence: 89,
      factors: ['Post-Holiday Decline', 'Weekday Pattern']
    },
    {
      date: '2025-01-04',
      revenue: 5890,
      occupancy: 68.5,
      adr: 138.75,
      rooms: 55,
      confidence: 92,
      factors: ['Weekend Effect', 'Local Events']
    },
    {
      date: '2025-01-05',
      revenue: 7120,
      occupancy: 73.4,
      adr: 145.25,
      rooms: 59,
      confidence: 88,
      factors: ['Weekend Premium', 'Business Travel']
    },
    {
      date: '2025-01-06',
      revenue: 6950,
      occupancy: 71.8,
      adr: 143.50,
      rooms: 58,
      confidence: 87,
      factors: ['Steady Demand', 'Corporate Bookings']
    },
    {
      date: '2025-01-07',
      revenue: 5650,
      occupancy: 62.4,
      adr: 135.25,
      rooms: 50,
      confidence: 85,
      factors: ['Weekday Low', 'School Returns']
    }
  ]

  const scenarioAnalyses: ScenarioAnalysis[] = [
    {
      scenario: 'Base Case',
      description: 'Current trends continue with normal seasonal variations',
      impact: {
        revenue: 247350,
        occupancy: 76.8,
        adr: 142.75
      },
      probability: 65,
      factors: ['Stable Economy', 'Normal Weather', 'Consistent Marketing']
    },
    {
      scenario: 'Optimistic',
      description: 'Strong economic recovery and increased tourism demand',
      impact: {
        revenue: 285420,
        occupancy: 84.2,
        adr: 156.50
      },
      probability: 20,
      factors: ['Economic Boom', 'Travel Surge', 'Premium Events']
    },
    {
      scenario: 'Pessimistic',
      description: 'Economic downturn or external disruptions affect travel',
      impact: {
        revenue: 198680,
        occupancy: 67.5,
        adr: 128.25
      },
      probability: 15,
      factors: ['Economic Recession', 'Travel Restrictions', 'Reduced Demand']
    }
  ]

  const seasonalTrends: SeasonalTrend[] = [
    { month: 'Jan', historical: 68.5, predicted: 71.2, variance: 4.0, confidence: 88 },
    { month: 'Feb', historical: 65.2, predicted: 67.8, variance: 4.0, confidence: 87 },
    { month: 'Mar', historical: 72.8, predicted: 75.5, variance: 3.7, confidence: 89 },
    { month: 'Apr', historical: 78.5, predicted: 81.2, variance: 3.4, confidence: 91 },
    { month: 'May', historical: 83.2, predicted: 85.8, variance: 3.1, confidence: 93 },
    { month: 'Jun', historical: 89.5, predicted: 92.1, variance: 2.9, confidence: 94 },
    { month: 'Jul', historical: 95.2, predicted: 97.8, variance: 2.7, confidence: 96 },
    { month: 'Aug', historical: 96.8, predicted: 98.9, variance: 2.2, confidence: 97 },
    { month: 'Sep', historical: 91.5, predicted: 93.8, variance: 2.5, confidence: 95 },
    { month: 'Oct', historical: 84.2, predicted: 86.5, variance: 2.7, confidence: 93 },
    { month: 'Nov', historical: 75.8, predicted: 78.2, variance: 3.2, confidence: 90 },
    { month: 'Dec', historical: 82.5, predicted: 85.1, variance: 3.1, confidence: 92 }
  ]

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 90) return 'text-green-600'
    if (confidence >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceBg = (confidence: number): string => {
    if (confidence >= 90) return 'bg-green-100'
    if (confidence >= 80) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getVarianceColor = (variance: number): string => {
    if (variance <= 3) return 'text-green-600'
    if (variance <= 5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getProbabilityColor = (probability: number): string => {
    if (probability >= 50) return 'text-blue-600'
    if (probability >= 30) return 'text-green-600'
    return 'text-orange-600'
  }

  const getModelTypeIcon = (type: string): string => {
    switch (type) {
      case 'revenue': return '💰'
      case 'occupancy': return '🏨'
      case 'demand': return '📊'
      case 'pricing': return '💲'
      default: return '📈'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Forecasting System</h1>
        <div className="flex gap-4">
          <select
            value={timeHorizon}
            onChange={(e) => setTimeHorizon(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Next 7 Days</option>
            <option value="30d">Next 30 Days</option>
            <option value="90d">Next 90 Days</option>
            <option value="1y">Next Year</option>
          </select>
          <select
            value={forecastType}
            onChange={(e) => setForecastType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="revenue">Revenue</option>
            <option value="occupancy">Occupancy</option>
            <option value="demand">Demand</option>
            <option value="pricing">Pricing</option>
          </select>
          <select
            value={scenarioView}
            onChange={(e) => setScenarioView(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="base">Base Case</option>
            <option value="optimistic">Optimistic</option>
            <option value="pessimistic">Pessimistic</option>
            <option value="all">All Scenarios</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {forecastModels.map((model) => (
          <div key={model.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getModelTypeIcon(model.type)}</span>
                <div>
                  <h3 className="font-semibold">{model.name}</h3>
                  <p className="text-sm text-gray-600">{model.algorithm}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs ${model.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {model.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Model Accuracy</span>
                <span className={`font-bold ${getConfidenceColor(model.accuracy)}`}>
                  {model.accuracy}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${model.accuracy >= 90 ? 'bg-green-500' : model.accuracy >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${model.accuracy}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              {model.predictions.map((prediction, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{prediction.period}</span>
                  <div className="text-right">
                    <div className="font-medium">
                      {model.type === 'revenue' && '€'}{prediction.value.toLocaleString()}
                      {model.type === 'occupancy' && '%'}
                      {model.type === 'pricing' && '€'}
                    </div>
                    <div className={`text-xs ${getConfidenceColor(prediction.confidence)}`}>
                      {prediction.confidence}% confidence
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                Last trained: {model.lastTrained}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">7-Day Forecast Details</h2>
          <div className="space-y-4">
            {forecastPredictions.map((forecast, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">
                    {new Date(forecast.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </h3>
                  <div className={`px-2 py-1 rounded-full text-xs ${getConfidenceBg(forecast.confidence)} ${getConfidenceColor(forecast.confidence)}`}>
                    {forecast.confidence}% confident
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3 mb-3 text-sm">
                  <div>
                    <span className="text-gray-500">Revenue</span>
                    <div className="font-bold text-green-600">€{forecast.revenue.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Occupancy</span>
                    <div className="font-bold text-blue-600">{forecast.occupancy}%</div>
                  </div>
                  <div>
                    <span className="text-gray-500">ADR</span>
                    <div className="font-bold text-purple-600">€{forecast.adr}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Rooms</span>
                    <div className="font-bold text-orange-600">{forecast.rooms}</div>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Key Factors:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {forecast.factors.map((factor, fidx) => (
                      <span key={fidx} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Scenario Analysis</h2>
          <div className="space-y-4">
            {scenarioAnalyses.map((scenario, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{scenario.scenario}</h3>
                    <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getProbabilityColor(scenario.probability)} bg-opacity-20`}
                       style={{ backgroundColor: `${getProbabilityColor(scenario.probability).replace('text-', '')}20` }}>
                    {scenario.probability}% likely
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                  <div>
                    <span className="text-gray-500">Revenue</span>
                    <div className="font-bold">€{scenario.impact.revenue.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Occupancy</span>
                    <div className="font-bold">{scenario.impact.occupancy}%</div>
                  </div>
                  <div>
                    <span className="text-gray-500">ADR</span>
                    <div className="font-bold">€{scenario.impact.adr}</div>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Driving Factors:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {scenario.factors.map((factor, fidx) => (
                      <span key={fidx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Seasonal Forecast Trends</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {seasonalTrends.map((trend, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-center mb-3">{trend.month} 2025</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Historical:</span>
                  <span className="font-medium">{trend.historical}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Predicted:</span>
                  <span className="font-bold text-blue-600">{trend.predicted}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Variance:</span>
                  <span className={getVarianceColor(trend.variance)}>
                    ±{trend.variance}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Confidence:</span>
                  <span className={getConfidenceColor(trend.confidence)}>
                    {trend.confidence}%
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${trend.predicted}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Forecast Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">€695,800</div>
            <div className="text-sm text-gray-600">90-Day Revenue Forecast</div>
            <div className="text-xs text-blue-500 mt-1">82% confidence interval</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">81.2%</div>
            <div className="text-sm text-gray-600">Avg Occupancy Forecast</div>
            <div className="text-xs text-green-500 mt-1">79% confidence interval</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">€156.25</div>
            <div className="text-sm text-gray-600">Forecasted ADR</div>
            <div className="text-xs text-purple-500 mt-1">81% confidence interval</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-3xl font-bold text-orange-600 mb-2">92.1%</div>
            <div className="text-sm text-gray-600">Model Accuracy</div>
            <div className="text-xs text-orange-500 mt-1">Across all models</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Export forecasting data:</span>
          <div className="flex gap-2">
            <button onClick={handleExcelForecast} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
              📊 Excel Forecast
            </button>
            <button onClick={handleModelConfig} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
              📈 Model Config
            </button>
            <button onClick={handleScenarioReport} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm">
              🎯 Scenario Report
            </button>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}