import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts';
import api from '../api';

const PIE_COLORS = ['#4f46e5','#7c3aed','#10b981','#f59e0b','#ef4444','#6b7280'];

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

function fmtMinutes(mins) {
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export default function Analytics({ tasks }) {
  const [stats, setStats] = useState(null);
  const [chartMode, setChartMode] = useState('weekly');

  useEffect(() => {
    api.get('/stats/').then(r => setStats(r.data)).catch(() => {});
  }, [tasks]);

  const exportCSV = () => {
    const headers = ['id','title','category','priority','completed','due_date','created_at','timer_seconds'];
    const rows = tasks.map(t => headers.map(h => JSON.stringify(t[h] ?? '')).join(','));
    const blob = new Blob([headers.join(',') + '\n' + rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'tasks.csv'; a.click();
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'tasks.json'; a.click();
  };

  if (!stats) return <div className="analytics-loading">Loading analytics...</div>;

  const chartData = chartMode === 'weekly' ? stats.weekly : stats.monthly;
  const xKey = chartMode === 'weekly' ? 'day' : 'week';

  return (
    <div className="analytics">
      {/* Summary Cards */}
      <div className="stat-cards">
        <StatCard icon="✅" label="Completion Rate" value={`${stats.completion_rate}%`}
          sub={`${stats.completed} of ${stats.total} tasks`} />
        <StatCard icon="⏱️" label="Avg Completion Time" value={fmtMinutes(stats.avg_completion_minutes)}
          sub="from created to done" />
        <StatCard icon="📅" label="Most Productive Day" value={stats.productive_day} />
        <StatCard icon="🏷️" label="Top Category" value={stats.top_category} />
      </div>

      {/* Progress Bar */}
      <div className="analytics-card">
        <div className="analytics-card-title">Overall Progress</div>
        <div className="big-progress-bar">
          <div className="big-progress-fill" style={{ width: `${stats.completion_rate}%` }}>
            {stats.completion_rate > 8 && `${stats.completion_rate}%`}
          </div>
        </div>
        <div className="progress-legend">
          <span>🟢 Completed: {stats.completed}</span>
          <span>🔴 Pending: {stats.total - stats.completed}</span>
        </div>
      </div>

      {/* Weekly / Monthly Bar Chart */}
      <div className="analytics-card">
        <div className="analytics-card-header">
          <div className="analytics-card-title">Tasks Overview</div>
          <div className="chart-toggle">
            <button className={chartMode === 'weekly' ? 'active' : ''} onClick={() => setChartMode('weekly')}>Weekly</button>
            <button className={chartMode === 'monthly' ? 'active' : ''} onClick={() => setChartMode('monthly')}>Monthly</button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="created" name="Created" fill="#4f46e5" radius={[4,4,0,0]} />
            <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Pie + Line Chart side by side */}
      <div className="analytics-row">
        <div className="analytics-card half">
          <div className="analytics-card-title">Category Breakdown</div>
          {stats.category_data.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={stats.category_data} dataKey="count" nameKey="name"
                  cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`}>
                  {stats.category_data.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="no-data">No category data yet</p>}
        </div>

        <div className="analytics-card half">
          <div className="analytics-card-title">Completion Trend (7 days)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.weekly} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="created" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export */}
      <div className="analytics-card export-card">
        <div className="analytics-card-title">Export Data</div>
        <div className="export-btns">
          <button className="export-btn csv" onClick={exportCSV}>⬇️ Export CSV</button>
          <button className="export-btn json" onClick={exportJSON}>⬇️ Export JSON</button>
        </div>
      </div>
    </div>
  );
}
