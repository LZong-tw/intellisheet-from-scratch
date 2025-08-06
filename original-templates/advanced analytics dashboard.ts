import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, LineChart, PieChart, TrendingUp, TrendingDown, Activity, Calendar, Download, Filter, RefreshCw, Settings, Users, DollarSign, Package, Clock, Target, Globe, Layers, ChevronDown, ChevronUp, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

const AnalyticsDashboard = () => {
  // State
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState('product');

  // Sample data generation
  const generateChartData = (points = 30) => {
    return Array.from({ length: points }, (_, i) => ({
      date: new Date(Date.now() - (points - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      value: Math.floor(Math.random() * 1000) + 500,
      previousValue: Math.floor(Math.random() * 1000) + 400
    }));
  };

  const [chartData, setChartData] = useState(generateChartData());

  // KPI Metrics
  const kpiMetrics = [
    {
      id: 'revenue',
      name: 'Total Revenue',
      value: '$1,245,890',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'green',
      sparkline: generateChartData(7)
    },
    {
      id: 'users',
      name: 'Active Users',
      value: '8,492',
      change: '+23.1%',
      trend: 'up',
      icon: Users,
      color: 'blue',
      sparkline: generateChartData(7)
    },
    {
      id: 'orders',
      name: 'Total Orders',
      value: '3,621',
      change: '-5.4%',
      trend: 'down',
      icon: Package,
      color: 'purple',
      sparkline: generateChartData(7)
    },
    {
      id: 'conversion',
      name: 'Conversion Rate',
      value: '3.24%',
      change: '+0.8%',
      trend: 'up',
      icon: Target,
      color: 'orange',
      sparkline: generateChartData(7)
    }
  ];

  // Dimension data
  const dimensionData = {
    product: [
      { name: 'IntelliSheet Pro', value: 4523, percentage: 35 },
      { name: 'DataFlow Enterprise', value: 3421, percentage: 28 },
      { name: 'Analytics Suite', value: 2156, percentage: 18 },
      { name: 'Report Builder', value: 1523, percentage: 12 },
      { name: 'Dashboard Plus', value: 892, percentage: 7 }
    ],
    region: [
      { name: 'North America', value: 5234, percentage: 42 },
      { name: 'Europe', value: 3892, percentage: 31 },
      { name: 'Asia Pacific', value: 2134, percentage: 17 },
      { name: 'Latin America', value: 892, percentage: 7 },
      { name: 'Middle East', value: 363, percentage: 3 }
    ],
    customer: [
      { name: 'Enterprise', value: 6234, percentage: 50 },
      { name: 'Mid-Market', value: 3756, percentage: 30 },
      { name: 'Small Business', value: 1876, percentage: 15 },
      { name: 'Startup', value: 649, percentage: 5 }
    ]
  };

  // Funnel data
  const funnelData = [
    { stage: 'Visitors', value: 10000, conversion: 100 },
    { stage: 'Signups', value: 3500, conversion: 35 },
    { stage: 'Trial Users', value: 1200, conversion: 34.3 },
    { stage: 'Paid Customers', value: 324, conversion: 27 },
    { stage: 'Active Users', value: 289, conversion: 89.2 }
  ];

  // Cohort data
  const cohortData = [
    { month: 'Jan 2024', m0: 100, m1: 82, m2: 75, m3: 68, m4: 62, m5: 58 },
    { month: 'Feb 2024', m0: 100, m1: 85, m2: 78, m3: 72, m4: 67 },
    { month: 'Mar 2024', m0: 100, m1: 88, m2: 81, m3: 76 },
    { month: 'Apr 2024', m0: 100, m1: 90, m2: 84 },
    { month: 'May 2024', m0: 100, m1: 92 },
    { month: 'Jun 2024', m0: 100 }
  ];

  // Chart Component
  const SimpleLineChart = ({ data, height = 200 }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const points = data.map((d, i) => ({
      x: (i / (data.length - 1)) * 100,
      y: 100 - (d.value / maxValue) * 100
    }));

    const pathData = points.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      return `${acc} L ${point.x} ${point.y}`;
    }, '');

    return (
      <svg viewBox="0 0 100 100" className="w-full" style={{ height }}>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <path
          d={`${pathData} L 100 100 L 0 100 Z`}
          fill="url(#gradient)"
        />
        <path
          d={pathData}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
        />
        {points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="1.5"
            fill="#3B82F6"
          />
        ))}
      </svg>
    );
  };

  // Mini Sparkline Component
  const Sparkline = ({ data, color = 'blue' }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const points = data.map((d, i) => ({
      x: (i / (data.length - 1)) * 100,
      y: 100 - (d.value / maxValue) * 100
    }));

    const pathData = points.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      return `${acc} L ${point.x} ${point.y}`;
    }, '');

    const colorMap = {
      green: '#10B981',
      blue: '#3B82F6',
      purple: '#8B5CF6',
      orange: '#F59E0B'
    };

    return (
      <svg viewBox="0 0 100 100" className="w-full h-8">
        <path
          d={pathData}
          fill="none"
          stroke={colorMap[color]}
          strokeWidth="2"
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
              <p className="text-slate-600">Real-time insights and performance metrics</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
            
            {/* Compare Toggle */}
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-4 py-2 border rounded-lg text-sm flex items-center gap-2 ${
                compareMode ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-slate-200 text-slate-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              Compare
            </button>
            
            {/* Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm flex items-center gap-2 hover:bg-slate-50"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            
            {/* Refresh */}
            <button
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1000);
              }}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            
            {/* Export */}
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {kpiMetrics.map(metric => {
          const Icon = metric.icon;
          return (
            <div key={metric.id} className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${metric.color}-100`}>
                  <Icon className={`w-5 h-5 text-${metric.color}-600`} />
                </div>
                <span className={`flex items-center gap-1 text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                  {metric.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                </span>
              </div>
              <div className="mb-3">
                <p className="text-sm text-slate-600 mb-1">{metric.name}</p>
                <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
              </div>
              <Sparkline data={metric.sparkline} color={metric.color} />
            </div>
          );
        })}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Revenue Trend</h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg">Revenue</button>
              <button className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Orders</button>
              <button className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Users</button>
            </div>
          </div>
          <SimpleLineChart data={chartData} />
          {compareMode && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span className="text-slate-600">Current Period</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                  <span className="text-slate-600">Previous Period</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dimension Breakdown */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Breakdown</h3>
            <select
              value={selectedDimension}
              onChange={(e) => setSelectedDimension(e.target.value)}
              className="text-sm border border-slate-200 rounded px-2 py-1"
            >
              <option value="product">By Product</option>
              <option value="region">By Region</option>
              <option value="customer">By Customer</option>
            </select>
          </div>
          <div className="space-y-3">
            {dimensionData[selectedDimension].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-700">{item.name}</span>
                  <span className="text-sm font-medium text-slate-900">{item.value.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Conversion Funnel</h3>
          <div className="space-y-4">
            {funnelData.map((stage, index) => (
              <div key={index} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-900">{stage.stage}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600">{stage.value.toLocaleString()}</span>
                    {index > 0 && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        {stage.conversion}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded h-8">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-8 rounded flex items-center justify-end pr-3"
                    style={{ width: `${(stage.value / funnelData[0].value) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">
                      {((stage.value / funnelData[0].value) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cohort Analysis */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Cohort Retention</h3>
            <button className="text-slate-400 hover:text-slate-600">
              <Info className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 text-slate-600">Cohort</th>
                  <th className="text-center py-2 text-slate-600">M0</th>
                  <th className="text-center py-2 text-slate-600">M1</th>
                  <th className="text-center py-2 text-slate-600">M2</th>
                  <th className="text-center py-2 text-slate-600">M3</th>
                  <th className="text-center py-2 text-slate-600">M4</th>
                  <th className="text-center py-2 text-slate-600">M5</th>
                </tr>
              </thead>
              <tbody>
                {cohortData.map((cohort, index) => (
                  <tr key={index} className="border-b border-slate-100">
                    <td className="py-2 font-medium text-slate-900">{cohort.month}</td>
                    {['m0', 'm1', 'm2', 'm3', 'm4', 'm5'].map(month => (
                      <td key={month} className="text-center py-2">
                        {cohort[month] !== undefined ? (
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            cohort[month] >= 80 ? 'bg-green-100 text-green-700' :
                            cohort[month] >= 60 ? 'bg-yellow-100 text-yellow-700' :
                            cohort[month] !== undefined ? 'bg-red-100 text-red-700' : ''
                          }`}>
                            {cohort[month]}%
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div className="mt-6 bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Real-time Activity</h3>
          <Activity className="w-5 h-5 text-green-500 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 mb-1">152</div>
            <p className="text-sm text-slate-600">Active Now</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 mb-1">$3,420</div>
            <p className="text-sm text-slate-600">Last Hour Revenue</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 mb-1">89</div>
            <p className="text-sm text-slate-600">Transactions/min</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 mb-1">1.2s</div>
            <p className="text-sm text-slate-600">Avg. Response Time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;