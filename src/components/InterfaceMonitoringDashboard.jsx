import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Search, Filter, Calendar, Clock, AlertCircle, CheckCircle, XCircle, Activity, TrendingUp, Database, Users, Zap } from 'lucide-react';

// CSS Styles
const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    background-color: #f8fafc;
    color: #1e293b;
    line-height: 1.6;
  }

  .dashboard {
    min-height: 100vh;
    background-color: #f8fafc;
  }

  /* Header Styles */
  .header {
    background: white;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid #e2e8f0;
  }

  .header-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .header-icon {
    padding: 0.5rem;
    background: #2563eb;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .header-icon svg {
    width: 1.5rem;
    height: 1.5rem;
    color: white;
  }

  .header-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #1e293b;
    margin: 0;
  }

  .header-subtitle {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
  }

  .time-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .time-selector svg {
    width: 1rem;
    height: 1rem;
    color: #64748b;
  }

  .select {
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
  }

  .select:focus {
    outline: none;
    ring: 2px solid #2563eb;
    border-color: transparent;
  }

  .custom-date-inputs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: 1rem;
  }

  .date-input {
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }

  /* Container */
  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  /* Metrics Grid */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .metric-card {
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    border: 1px solid #e2e8f0;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .metric-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .metric-text h3 {
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
    margin-bottom: 0.25rem;
  }

  .metric-text p {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
  }

  .metric-icon {
    width: 2rem;
    height: 2rem;
  }

  .metric-icon.blue { color: #2563eb; }
  .metric-icon.green { color: #059669; }
  .metric-icon.red { color: #dc2626; }
  .metric-icon.yellow { color: #d97706; }

  .metric-value.green { color: #059669; }
  .metric-value.red { color: #dc2626; }
  .metric-value.yellow { color: #d97706; }

  /* Charts Grid */
  .charts-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .chart-card {
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    border: 1px solid #e2e8f0;
  }

  .chart-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 1rem;
  }

  /* Filters */
  .filters-card {
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    border: 1px solid #e2e8f0;
    margin-bottom: 1.5rem;
  }

  .filters-main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .filters-row {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
  }

  .search-container {
    position: relative;
    flex: 1;
    max-width: 400px;
  }

  .search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    width: 1rem;
    height: 1rem;
  }

  .search-input {
    width: 100%;
    padding: 0.5rem 0.5rem 0.5rem 2.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    transition: all 0.2s;
  }

  .search-input:focus {
    outline: none;
    ring: 2px solid #2563eb;
    border-color: transparent;
  }

  .advanced-filters-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.2s;
  }

  .advanced-filters-btn:hover {
    background: #1d4ed8;
  }

  .advanced-filters-btn svg {
    width: 1rem;
    height: 1rem;
  }

  .advanced-filters {
    margin-top: 1rem;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 0.5rem;
  }

  .advanced-filters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .filter-group label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.25rem;
  }

  .filter-inputs {
    display: flex;
    gap: 0.5rem;
  }

  .filter-input {
    width: 100%;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  /* Table */
  .table-card {
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
    overflow: hidden;
  }

  .table-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .table-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }

  .table-subtitle {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
  }

  .table-container {
    overflow-x: auto;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
  }

  .table thead {
    background: #f8fafc;
  }

  .table th {
    padding: 0.75rem 1.5rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 500;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .table tbody tr {
    border-bottom: 1px solid #e2e8f0;
    transition: background-color 0.2s;
  }

  .table tbody tr:hover {
    background: #f8fafc;
  }

  .table td {
    padding: 1rem 1.5rem;
    vertical-align: middle;
  }

  .status-cell {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .status-icon {
    width: 1rem;
    height: 1rem;
  }

  .status-icon.success { color: #059669; }
  .status-icon.failed { color: #dc2626; }
  .status-icon.warning { color: #d97706; }
  .status-icon.pending { color: #64748b; }

  .status-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .status-badge.success {
    background: #dcfce7;
    color: #166534;
  }

  .status-badge.failed {
    background: #fee2e2;
    color: #991b1b;
  }

  .status-badge.warning {
    background: #fef3c7;
    color: #92400e;
  }

  .status-badge.pending {
    background: #f3f4f6;
    color: #374151;
  }

  .interface-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1e293b;
  }

  .integration-key {
    font-size: 0.875rem;
    font-family: 'Courier New', monospace;
    color: #4b5563;
    background: #f3f4f6;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    display: inline-block;
  }

  .message-cell {
    font-size: 0.875rem;
    color: #1e293b;
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .timestamp-cell,
  .duration-cell {
    font-size: 0.875rem;
    color: #64748b;
    white-space: nowrap;
  }

  /* Pagination */
  .pagination {
    padding: 1rem 1.5rem;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pagination-info {
    font-size: 0.875rem;
    color: #64748b;
  }

  .pagination-controls {
    display: flex;
    gap: 0.5rem;
  }

  .pagination-btn {
    padding: 0.25rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    background: white;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .pagination-btn:hover:not(:disabled) {
    background: #f3f4f6;
  }

  .pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Responsive Design */
  @media (min-width: 640px) {
    .filters-row {
      flex-direction: row;
      align-items: center;
    }

    .filters-main {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

  @media (min-width: 1024px) {
    .metrics-grid {
      grid-template-columns: repeat(5, 1fr);
    }
  }

  @media (max-width: 1023px) {
    .charts-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 639px) {
    .header-content {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .time-selector {
      justify-content: center;
    }

    .custom-date-inputs {
      margin-left: 0;
      justify-content: center;
    }

    .container {
      padding: 1rem;
    }

    .table-container {
      font-size: 0.75rem;
    }

    .table th,
    .table td {
      padding: 0.5rem;
    }
  }
`;

// Mock data generator for 500,000+ records
const generateMockData = () => {
  const interfaces = [
    'SAP-SuccessFactors-ECP', 'SF-Payroll-Integration', 'Employee-Directory-Sync',
    'Benefits-Enrollment-API', 'Time-Attendance-Connector', 'Performance-Review-Bridge',
    'Compensation-Data-Pipeline', 'Learning-Management-Sync', 'Onboarding-Workflow-API',
    'Offboarding-Process-Connector'
  ];
  
  const statuses = ['SUCCESS', 'FAILED', 'WARNING', 'PENDING'];
  const messages = [
    'Data synchronization completed successfully',
    'Connection timeout - retrying',
    'Authentication failed - check credentials',
    'Partial data sync - 45/50 records processed',
    'Rate limit exceeded - scheduled for retry',
    'Invalid data format detected',
    'Sync completed with warnings',
    'Network connectivity issues',
    'Database connection established',
    'Processing batch 1/5'
  ];

  const data = [];
  const now = new Date();
  
  for (let i = 0; i < 100000; i++) { // Reduced for demo performance
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);
    
    const timestamp = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000) - (hoursAgo * 60 * 60 * 1000) - (minutesAgo * 60 * 1000));
    
    data.push({
      id: i + 1,
      interfaceName: interfaces[Math.floor(Math.random() * interfaces.length)],
      integrationKey: `INT-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      timestamp: timestamp,
      duration: Math.floor(Math.random() * 5000) + 100, // ms
      recordsProcessed: Math.floor(Math.random() * 1000)
    });
  }
  
  return data.sort((a, b) => b.timestamp - a.timestamp);
};

const InterfaceMonitoringDashboard = () => {
  const [data] = useState(() => generateMockData());
  const [filteredData, setFilteredData] = useState([]);
  const [timeRange, setTimeRange] = useState('24h');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [interfaceFilter, setInterfaceFilter] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 50;

  // Filter data based on time range and other filters
  useEffect(() => {
    let filtered = [...data];
    const now = new Date();
    
    // Time range filtering
    if (timeRange !== 'custom') {
      const timeRanges = {
        '1h': 1 * 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000
      };
      
      const cutoff = new Date(now.getTime() - timeRanges[timeRange]);
      filtered = filtered.filter(item => item.timestamp >= cutoff);
    } else if (customDateRange.start && customDateRange.end) {
      const start = new Date(customDateRange.start);
      const end = new Date(customDateRange.end);
      filtered = filtered.filter(item => item.timestamp >= start && item.timestamp <= end);
    }
    
    // Search filtering
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.interfaceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.integrationKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filtering
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    // Interface filtering
    if (interfaceFilter !== 'all') {
      filtered = filtered.filter(item => item.interfaceName === interfaceFilter);
    }
    
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [data, timeRange, searchTerm, statusFilter, interfaceFilter, customDateRange]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = filteredData.length;
    const success = filteredData.filter(item => item.status === 'SUCCESS').length;
    const failed = filteredData.filter(item => item.status === 'FAILED').length;
    const warning = filteredData.filter(item => item.status === 'WARNING').length;
    const pending = filteredData.filter(item => item.status === 'PENDING').length;
    
    const successRate = total > 0 ? ((success / total) * 100).toFixed(1) : 0;
    
    return { total, success, failed, warning, pending, successRate };
  }, [filteredData]);

  // Chart data preparation
  const chartData = useMemo(() => {
    const groupedData = {};
    
    filteredData.forEach(item => {
      const date = item.timestamp.toISOString().split('T')[0];
      if (!groupedData[date]) {
        groupedData[date] = { date, SUCCESS: 0, FAILED: 0, WARNING: 0, PENDING: 0 };
      }
      groupedData[date][item.status]++;
    });
    
    return Object.values(groupedData).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filteredData]);

  const pieData = [
    { name: 'Success', value: metrics.success, color: '#059669' },
    { name: 'Failed', value: metrics.failed, color: '#dc2626' },
    { name: 'Warning', value: metrics.warning, color: '#d97706' },
    { name: 'Pending', value: metrics.pending, color: '#64748b' }
  ];

  const getStatusIcon = (status) => {
    const className = `status-icon ${status.toLowerCase()}`;
    switch (status) {
      case 'SUCCESS': return <CheckCircle className={className} />;
      case 'FAILED': return <XCircle className={className} />;
      case 'WARNING': return <AlertCircle className={className} />;
      case 'PENDING': return <Clock className={className} />;
      default: return null;
    }
  };

  const getStatusBadge = (status) => {
    return `status-badge ${status.toLowerCase()}`;
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const uniqueInterfaces = [...new Set(data.map(item => item.interfaceName))];

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard">
        {/* Header */}
        <header className="header">
          <div className="header-container">
            <div className="header-content">
              <div className="header-left">
                <div className="header-icon">
                  <Activity />
                </div>
                <div>
                  <h1 className="header-title">Interface Monitor</h1>
                  <p className="header-subtitle">HR Integration Dashboard</p>
                </div>
              </div>
              
              {/* Time Range Selector */}
              <div className="time-selector">
                <Calendar />
                <select
                  className="select"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="1h">Last Hour</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last Week</option>
                  <option value="30d">Last Month</option>
                  <option value="custom">Custom Range</option>
                </select>
                
                {timeRange === 'custom' && (
                  <div className="custom-date-inputs">
                    <input
                      type="date"
                      className="date-input"
                      value={customDateRange.start}
                      onChange={(e) => setCustomDateRange({...customDateRange, start: e.target.value})}
                    />
                    <span>to</span>
                    <input
                      type="date"
                      className="date-input"
                      value={customDateRange.end}
                      onChange={(e) => setCustomDateRange({...customDateRange, end: e.target.value})}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="container">
          {/* Metrics Cards */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-content">
                <div className="metric-text">
                  <h3>Total Executions</h3>
                  <p>{metrics.total.toLocaleString()}</p>
                </div>
                <Database className="metric-icon blue" />
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-content">
                <div className="metric-text">
                  <h3>Success Rate</h3>
                  <p className="metric-value green">{metrics.successRate}%</p>
                </div>
                <TrendingUp className="metric-icon green" />
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-content">
                <div className="metric-text">
                  <h3>Successful</h3>
                  <p className="metric-value green">{metrics.success.toLocaleString()}</p>
                </div>
                <CheckCircle className="metric-icon green" />
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-content">
                <div className="metric-text">
                  <h3>Failed</h3>
                  <p className="metric-value red">{metrics.failed.toLocaleString()}</p>
                </div>
                <XCircle className="metric-icon red" />
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-content">
                <div className="metric-text">
                  <h3>Warnings</h3>
                  <p className="metric-value yellow">{metrics.warning.toLocaleString()}</p>
                </div>
                <AlertCircle className="metric-icon yellow" />
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="charts-grid">
            <div className="chart-card">
              <h3 className="chart-title">Execution Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="SUCCESS" stroke="#059669" strokeWidth={2} />
                  <Line type="monotone" dataKey="FAILED" stroke="#dc2626" strokeWidth={2} />
                  <Line type="monotone" dataKey="WARNING" stroke="#d97706" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="chart-card">
              <h3 className="chart-title">Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="filters-card">
            <div className="filters-main">
              <div className="filters-row">
                <div className="search-container">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search interfaces, keys, or messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  className="select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="SUCCESS">Success</option>
                  <option value="FAILED">Failed</option>
                  <option value="WARNING">Warning</option>
                  <option value="PENDING">Pending</option>
                </select>
                
                <select
                  className="select"
                  value={interfaceFilter}
                  onChange={(e) => setInterfaceFilter(e.target.value)}
                >
                  <option value="all">All Interfaces</option>
                  {uniqueInterfaces.map(interfaceName => (
                    <option key={interfaceName} value={interfaceName}>{interfaceName}</option>
                  ))}
                </select>
              </div>
              
              <button
                className="advanced-filters-btn"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter />
                <span>Advanced Filters</span>
              </button>
            </div>
            
            {showAdvancedFilters && (
              <div className="advanced-filters">
                <div className="advanced-filters-grid">
                  <div className="filter-group">
                    <label>Duration Range (ms)</label>
                    <div className="filter-inputs">
                      <input type="number" className="filter-input" placeholder="Min" />
                      <input type="number" className="filter-input" placeholder="Max" />
                    </div>
                  </div>
                  <div className="filter-group">
                    <label>Records Processed</label>
                    <div className="filter-inputs">
                      <input type="number" className="filter-input" placeholder="Min" />
                      <input type="number" className="filter-input" placeholder="Max" />
                    </div>
                  </div>
                  <div className="filter-group">
                    <label>Integration Key Pattern</label>
                    <input type="text" className="filter-input" placeholder="e.g., INT-*" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interface Logs Table */}
          <div className="table-card">
            <div className="table-header">
              <h3 className="table-title">Live Interface Logs</h3>
              <p className="table-subtitle">Showing {paginatedData.length} of {filteredData.length.toLocaleString()} executions</p>
            </div>
            
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Interface Name</th>
                    <th>Integration Key</th>
                    <th>Message</th>
                    <th>Timestamp</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="status-cell">
                          {getStatusIcon(item.status)}
                          <span className={getStatusBadge(item.status)}>
                            {item.status}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="interface-name">{item.interfaceName}</div>
                      </td>
                      <td>
                        <div className="integration-key">
                          {item.integrationKey}
                        </div>
                      </td>
                      <td>
                        <div className="message-cell" title={item.message}>
                          {item.message}
                        </div>
                      </td>
                      <td className="timestamp-cell">
                        {item.timestamp.toLocaleString()}
                      </td>
                      <td className="duration-cell">
                        {item.duration}ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <div className="pagination-info">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="pagination-controls">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default InterfaceMonitoringDashboard;