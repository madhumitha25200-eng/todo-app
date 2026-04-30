import React, { useState, useEffect } from 'react';

function fmt(secs) {
  const h = Math.floor(secs / 3600).toString().padStart(2, '0');
  const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function dueDateStatus(due_date) {
  if (!due_date) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  const due = new Date(due_date);
  const diff = Math.ceil((due - today) / 86400000);
  if (diff < 0) return { label: 'Overdue', cls: 'overdue' };
  if (diff === 0) return { label: 'Due Today', cls: 'due-today' };
  if (diff <= 2) return { label: `Due in ${diff}d`, cls: 'due-soon' };
  return { label: `Due ${due_date}`, cls: 'due-ok' };
}

export default function TaskCard({ task, onDelete, onToggle, onEdit, onTimer }) {
  const [elapsed, setElapsed] = useState(task.elapsed_seconds);

  useEffect(() => {
    setElapsed(task.elapsed_seconds);
    if (!task.timer_running) return;
    const id = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [task.timer_running, task.elapsed_seconds]);

  const due = dueDateStatus(task.due_date);
  const priorityIcon = { low: '🟢', medium: '🟡', high: '🔴' }[task.priority];
  const categoryIcon = { work: '💼', personal: '🏠', health: '❤️', learning: '📚', shopping: '🛒', other: '📌' }[task.category] || '📌';

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''} priority-${task.priority}`}>
      <div className="task-header">
        <input type="checkbox" checked={task.completed} onChange={() => onToggle(task)} />
        <span className="task-title">{task.title}</span>
        <span className="priority-badge">{priorityIcon}</span>
        <span className="category-badge">{categoryIcon} {task.category}</span>
        {due && <span className={`due-badge ${due.cls}`}>{due.label}</span>}
      </div>
      {task.description && <p className="task-desc">{task.description}</p>}
      <div className="task-footer">
        <span className="timer">⏱ {fmt(elapsed)}</span>
        <div className="task-actions">
          {task.timer_running
            ? <button onClick={() => onTimer(task.id, 'stop')}>⏹ Stop</button>
            : <button onClick={() => onTimer(task.id, 'start')}>▶ Start</button>}
          <button onClick={() => onEdit(task)}>✏️</button>
          <button className="del-btn" onClick={() => onDelete(task.id)}>🗑️</button>
        </div>
      </div>
    </div>
  );
}
