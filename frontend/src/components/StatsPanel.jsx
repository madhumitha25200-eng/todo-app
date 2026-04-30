import React from 'react';

export default function StatsPanel({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const overdue = tasks.filter(t => {
    if (!t.due_date || t.completed) return false;
    return new Date(t.due_date) < today;
  }).length;
  const dueToday = tasks.filter(t => {
    if (!t.due_date || t.completed) return false;
    const d = new Date(t.due_date); d.setHours(0,0,0,0);
    return d.getTime() === today.getTime();
  }).length;

  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-panel">
      <div className="stat-card total"><span className="stat-num">{total}</span><span className="stat-label">Total</span></div>
      <div className="stat-card done"><span className="stat-num">{completed}</span><span className="stat-label">Done</span></div>
      <div className="stat-card pending"><span className="stat-num">{pending}</span><span className="stat-label">Pending</span></div>
      <div className="stat-card overdue-stat"><span className="stat-num">{overdue}</span><span className="stat-label">Overdue</span></div>
      <div className="stat-card today-stat"><span className="stat-num">{dueToday}</span><span className="stat-label">Due Today</span></div>
      <div className="stat-progress">
        <div className="progress-label">Progress: {pct}%</div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
      </div>
    </div>
  );
}
