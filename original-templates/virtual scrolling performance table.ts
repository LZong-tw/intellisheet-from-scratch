import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Database, Zap, Activity, ChevronDown, ChevronRight, Filter, Download, RefreshCw, Settings, BarChart3, Clock, Search } from 'lucide-react';

// Virtual Table Engine
class VirtualTableEngine {
  constructor(config = {}) {
    this.rowHeight = config.rowHeight || 40;
    this.headerHeight = config.headerHeight || 48;
    this.bufferSize = config.bufferSize || 10;
    this.viewportHeight = config.viewportHeight || 600;
    this.totalRows = config.totalRows || 0;
    this.columns = config.columns || [];
    
    // Cache
    this.cache = new Map();
    this.loadedRanges = [];
    
    // Performance metrics
    this.metrics = {
      renders: 0,
      cacheHits: 0,
      cacheMisses: 0,
      loadTime: 0,
      lastUpdate: Date.now()
    };
  }

  // Calculate visible range
  getVisibleRange(scrollTop) {
    const start = Math.max(0, Math.floor(scrollTop / this.rowHeight) - this.bufferSize);
    const visibleCount = Math.ceil(this.viewportHeight / this.rowHeight);
    const end = Math.min(this.totalRows, start + visibleCount + (this.bufferSize * 2));
    
    return { start, end, visibleCount };
  }

  // Check if data is in cache
  isRangeLoaded(start, end) {
    return this.loadedRanges.some(range => 
      range.start <= start && range.end >= end
    );
  }

  // Get data from cache
  getCachedData(start, end) {
    const data = [];
    for (let i = start; i < end; i++) {
      if (this.cache.has(i)) {
        data.push(this.cache.get(i));
        this.metrics.cacheHits++;
      } else {
        this.metrics.cacheMisses++;
      }
    }
    return data;
  }

  // Store data in cache
  cacheData(start, data) {
    data.forEach((row, index) => {
      this.cache.set(start + index, row);
    });
    
    // Update loaded ranges
    this.loadedRanges.push({ start, end: start + data.length });
    this.mergeRanges();
  }

  // Merge overlapping ranges
  mergeRanges() {
    if (this.loadedRanges.length <= 1) return;
    
    this.loadedRanges.sort((a, b) => a.start - b.start);
    
    const merged = [this.loadedRanges[0]];
    for (let i = 1; i < this.loadedRanges.length; i++) {
      const last = merged[merged.length - 1];
      const current = this.loadedRanges[i];
      
      if (current.start <= last.end) {
        last.end = Math.max(last.end, current.end);
      } else {
        merged.push(current);
      }
    }
    
    this.loadedRanges = merged;
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
    this.loadedRanges = [];
    this.metrics.cacheHits = 0;
    this.metrics.cacheMisses = 0;
  }

  // Get performance metrics
  getMetrics() {
    return {
      ...this.metrics,
      cacheSize: this.cache.size,
      hitRate: this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) || 0
    };
  }
}

// Generate large dataset
const generateLargeDataset = (count) => {
  const products = ['IntelliSheet Pro', 'DataFlow Enterprise', 'Analytics Suite', 'Report Builder', 'Dashboard Plus'];
  const statuses = ['active', 'pending', 'processing', 'completed', 'cancelled'];
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'];
  const categories = ['Software', 'Services', 'Hardware', 'Consulting', 'Support'];
  
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      id: i + 1,
      product: products[Math.floor(Math.random() * products.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      price: Math.floor(Math.random() * 900) + 100,
      quantity: Math.floor(Math.random() * 100) + 1,
      revenue: 0, // Will be calculated
      status: statuses[Math.floor(Math.random() * statuses.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      customer: `Customer ${Math.floor(Math.random() * 1000) + 1}`,
      priority: Math.floor(Math.random() * 5) + 1
    });
    data[i].revenue = data[i].price * data[i].quantity;
  }
  return data;
};

const VirtualScrollTable = () => {
  // Configuration
  const TOTAL_ROWS = 100000; // 100K rows
  const ROW_HEIGHT = 40;
  const HEADER_HEIGHT = 48;
  const BATCH_SIZE = 100;
  
  // State
  const [data, setData] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });
  const [filterConfig, setFilterConfig] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [metrics, setMetrics] = useState({});
  const [showMetrics, setShowMetrics] = useState(true);
  
  // Refs
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const engineRef = useRef(null);
  const loadingRef = useRef(false);
  const rafRef = useRef(null);
  
  // Initialize virtual table engine
  useEffect(() => {
    const engine = new VirtualTableEngine({
      rowHeight: ROW_HEIGHT,
      headerHeight: HEADER_HEIGHT,
      bufferSize: 20,
      viewportHeight: 600,
      totalRows: TOTAL_ROWS,
      columns: [
        { id: 'id', name: 'ID', width: 80 },
        { id: 'product', name: 'Product', width: 200 },
        { id: 'category', name: 'Category', width: 150 },
        { id: 'price', name: 'Price', width: 100 },
        { id: 'quantity', name: 'Quantity', width: 100 },
        { id: 'revenue', name: 'Revenue', width: 120 },
        { id: 'status', name: 'Status', width: 120 },
        { id: 'region', name: 'Region', width: 150 },
        { id: 'date', name: 'Date', width: 120 },
        { id: 'customer', name: 'Customer', width: 150 },
        { id: 'priority', name: 'Priority', width: 100 }
      ]
    });
    
    engineRef.current = engine;
    
    // Generate initial dataset
    const fullData = generateLargeDataset(TOTAL_ROWS);
    setData(fullData);
    
    // Load initial visible data
    loadVisibleData(0, fullData);
    
    // Update metrics periodically
    const metricsInterval = setInterval(() => {
      setMetrics(engine.getMetrics());
    }, 1000);
    
    return () => {
      clearInterval(metricsInterval);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Load visible data based on scroll position
  const loadVisibleData = useCallback(async (scrollPosition, dataset = data) => {
    if (loadingRef.current || !engineRef.current) return;
    
    const engine = engineRef.current;
    const { start, end } = engine.getVisibleRange(scrollPosition);
    
    // Check if data is already cached
    if (engine.isRangeLoaded(start, end)) {
      const cachedData = engine.getCachedData(start, end);
      setVisibleData(cachedData);
      engine.metrics.renders++;
      return;
    }
    
    // Load new data
    loadingRef.current = true;
    setLoading(true);
    
    const startTime = performance.now();
    
    // Simulate async data loading
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Get data slice
    const newData = dataset.slice(start, Math.min(start + BATCH_SIZE, dataset.length));
    
    // Cache the data
    engine.cacheData(start, newData);
    
    // Update visible data
    const visibleSlice = engine.getCachedData(start, end);
    setVisibleData(visibleSlice);
    
    engine.metrics.loadTime = performance.now() - startTime;
    engine.metrics.renders++;
    
    loadingRef.current = false;
    setLoading(false);
  }, [data]);

  // Optimized scroll handler with RAF
  const handleScroll = useCallback((e) => {
    const newScrollTop = e.target.scrollTop;
    
    // Cancel previous RAF if exists
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    // Use RAF for smooth scrolling
    rafRef.current = requestAnimationFrame(() => {
      setScrollTop(newScrollTop);
      loadVisibleData(newScrollTop);
    });
  }, [loadVisibleData]);

  // Sort data
  const handleSort = useCallback((field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    
    // Clear cache when sorting changes
    if (engineRef.current) {
      engineRef.current.clearCache();
    }
    
    // Sort data
    const sortedData = [...data].sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });
    
    setData(sortedData);
    loadVisibleData(scrollTop, sortedData);
  }, [data, sortConfig, scrollTop, loadVisibleData]);

  // Calculate visible range info
  const visibleRange = useMemo(() => {
    if (!engineRef.current) return { start: 0, end: 0 };
    return engineRef.current.getVisibleRange(scrollTop);
  }, [scrollTop]);

  // Export data
  const exportData = useCallback(() => {
    const csv = [
      Object.keys(data[0]).join(','),
      ...visibleData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'intellisheet-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [visibleData, data]);

  // Refresh cache
  const refreshCache = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.clearCache();
      loadVisibleData(scrollTop);
    }
  }, [scrollTop, loadVisibleData]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Database className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">Virtual Scrolling Table</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {TOTAL_ROWS.toLocaleString()} rows
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            
            {/* Actions */}
            <button
              onClick={refreshCache}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm"
              title="Clear cache and reload"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            
            <button
              onClick={exportData}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
            >
              <BarChart3 className="w-4 h-4" />
              Metrics
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Table */}
        <div className={showMetrics ? 'lg:col-span-3' : 'lg:col-span-4'}>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            {/* Loading indicator */}
            {loading && (
              <div className="absolute top-2 right-2 z-10 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm flex items-center gap-2">
                <Activity className="w-3 h-3 animate-pulse" />
                Loading...
              </div>
            )}
            
            {/* Scroll info */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div className="text-sm text-slate-600">
                Showing rows {visibleRange.start + 1} - {Math.min(visibleRange.end, TOTAL_ROWS)} of {TOTAL_ROWS.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600">
                Rendered: {visibleData.length} rows
              </div>
            </div>
            
            {/* Virtual scrolling container */}
            <div 
              ref={containerRef}
              className="relative"
              style={{ height: '600px' }}
            >
              {/* Scrollable area */}
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="overflow-auto absolute inset-0"
                style={{ height: '600px' }}
              >
                {/* Virtual height spacer */}
                <div style={{ height: `${TOTAL_ROWS * ROW_HEIGHT + HEADER_HEIGHT}px`, position: 'relative' }}>
                  {/* Table Header */}
                  <div 
                    className="sticky top-0 z-20 bg-white border-b border-slate-300"
                    style={{ height: `${HEADER_HEIGHT}px` }}
                  >
                    <div className="flex">
                      {engineRef.current?.columns.map(column => (
                        <div
                          key={column.id}
                          className="px-4 py-3 font-semibold text-sm text-slate-900 border-r border-slate-200 cursor-pointer hover:bg-slate-50 flex items-center justify-between"
                          style={{ width: `${column.width}px`, minWidth: `${column.width}px` }}
                          onClick={() => handleSort(column.id)}
                        >
                          {column.name}
                          {sortConfig.field === column.id && (
                            <span className="text-blue-600">
                              {sortConfig.direction === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Virtual rows */}
                  <div
                    style={{
                      transform: `translateY(${visibleRange.start * ROW_HEIGHT + HEADER_HEIGHT}px)`,
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0
                    }}
                  >
                    {visibleData.map((row, index) => (
                      <div
                        key={row.id}
                        className="flex hover:bg-slate-50 border-b border-slate-100"
                        style={{ height: `${ROW_HEIGHT}px` }}
                      >
                        <div className="px-4 py-2 text-sm text-slate-600 border-r border-slate-100" style={{ width: '80px', minWidth: '80px' }}>
                          {row.id}
                        </div>
                        <div className="px-4 py-2 text-sm text-slate-900 border-r border-slate-100" style={{ width: '200px', minWidth: '200px' }}>
                          {row.product}
                        </div>
                        <div className="px-4 py-2 text-sm text-slate-600 border-r border-slate-100" style={{ width: '150px', minWidth: '150px' }}>
                          {row.category}
                        </div>
                        <div className="px-4 py-2 text-sm text-slate-900 border-r border-slate-100" style={{ width: '100px', minWidth: '100px' }}>
                          ${row.price}
                        </div>
                        <div className="px-4 py-2 text-sm text-slate-900 border-r border-slate-100" style={{ width: '100px', minWidth: '100px' }}>
                          {row.quantity}
                        </div>
                        <div className="px-4 py-2 text-sm font-medium text-slate-900 border-r border-slate-100" style={{ width: '120px', minWidth: '120px' }}>
                          ${row.revenue.toLocaleString()}
                        </div>
                        <div className="px-4 py-2 text-sm border-r border-slate-100" style={{ width: '120px', minWidth: '120px' }}>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            row.status === 'active' ? 'bg-green-100 text-green-700' :
                            row.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                            row.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            row.status === 'processing' ? 'bg-purple-100 text-purple-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {row.status}
                          </span>
                        </div>
                        <div className="px-4 py-2 text-sm text-slate-600 border-r border-slate-100" style={{ width: '150px', minWidth: '150px' }}>
                          {row.region}
                        </div>
                        <div className="px-4 py-2 text-sm text-slate-600 border-r border-slate-100" style={{ width: '120px', minWidth: '120px' }}>
                          {row.date}
                        </div>
                        <div className="px-4 py-2 text-sm text-slate-600 border-r border-slate-100" style={{ width: '150px', minWidth: '150px' }}>
                          {row.customer}
                        </div>
                        <div className="px-4 py-2 text-sm text-slate-900" style={{ width: '100px', minWidth: '100px' }}>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < row.priority ? 'bg-amber-400' : 'bg-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Performance Optimizations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
              <div className="space-y-2">
                <p>⚡ <strong>Virtual Scrolling:</strong> Only renders visible rows (currently {visibleData.length} of {TOTAL_ROWS.toLocaleString()})</p>
                <p>💾 <strong>Smart Caching:</strong> Caches loaded data for instant access</p>
                <p>🔄 <strong>Lazy Loading:</strong> Loads data on-demand as you scroll</p>
              </div>
              <div className="space-y-2">
                <p>🎯 <strong>RAF Optimization:</strong> Uses requestAnimationFrame for smooth scrolling</p>
                <p>📊 <strong>Buffer Strategy:</strong> Pre-loads rows above and below viewport</p>
                <p>🚀 <strong>Memory Efficient:</strong> Handles 100K+ rows with minimal memory usage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        {showMetrics && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sticky top-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Performance Metrics
              </h3>
              
              <div className="space-y-4">
                {/* Cache Stats */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">Cache Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Cache Size</span>
                      <span className="font-medium text-blue-900">{metrics.cacheSize || 0} rows</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Hit Rate</span>
                      <span className="font-medium text-blue-900">
                        {((metrics.hitRate || 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Hits / Misses</span>
                      <span className="font-medium text-blue-900">
                        {metrics.cacheHits || 0} / {metrics.cacheMisses || 0}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Render Stats */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-green-900 mb-2">Render Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Total Renders</span>
                      <span className="font-medium text-green-900">{metrics.renders || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Load Time</span>
                      <span className="font-medium text-green-900">
                        {(metrics.loadTime || 0).toFixed(2)}ms
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Visible Rows</span>
                      <span className="font-medium text-green-900">{visibleData.length}</span>
                    </div>
                  </div>
                </div>
                
                {/* Memory Stats */}
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-purple-900 mb-2">Memory Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-700">DOM Nodes</span>
                      <span className="font-medium text-purple-900">~{visibleData.length * 12}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-700">Row Height</span>
                      <span className="font-medium text-purple-900">{ROW_HEIGHT}px</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-700">Buffer Size</span>
                      <span className="font-medium text-purple-900">20 rows</span>
                    </div>
                  </div>
                </div>
                
                {/* Scroll Position */}
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-amber-900 mb-2">Scroll Position</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700">Scroll Top</span>
                      <span className="font-medium text-amber-900">{scrollTop.toFixed(0)}px</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700">Current Row</span>
                      <span className="font-medium text-amber-900">
                        {Math.floor(scrollTop / ROW_HEIGHT) + 1}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-700">Progress</span>
                      <span className="font-medium text-amber-900">
                        {((scrollTop / (TOTAL_ROWS * ROW_HEIGHT)) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-2">Scroll Progress</div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-150"
                      style={{ width: `${(scrollTop / (TOTAL_ROWS * ROW_HEIGHT)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualScrollTable;