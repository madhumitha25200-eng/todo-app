import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import Clock from '../components/Clock';
import Quote from '../components/Quote';
import Greeting from '../components/Greeting';
import Analytics from './Analytics';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [tab, setTab] = useState('tasks');
  const nav = useNavigate();

  const load = useCallback(async () => {
    const { data } = await api.get('/tasks/');
    setTasks(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const logout = () => { localStorage.clear(); nav('/login'); };

  const deleteTask = async id => {
    await api.delete(`/tasks/${id}/`);
    setTasks(t => t.filter(x => x.id !== id));
  };

  const toggleComplete = async task => {
    const { data } = await api.patch(`/tasks/${task.id}/`, { completed: !task.completed });
    setTasks(t => t.map(x => x.id === data.id ? data : x));
  };

  const timerAction = async (id, action) => {
    const { data } = await api.post(`/tasks/${id}/${action}/`);
    setTasks(t => t.map(x => x.id === data.id ? data : x));
  };

  const pending = tasks.filter(t => !t.completed).length;

  return (
    <div className="dashboard">
      <header>
        <div>
          <h1>📝 My Todo List</h1>
          <Clock />
        </div>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </header>
      <Greeting />
      <Quote />

      <div className="tab-bar">
        <button className={tab === 'tasks' ? 'tab active' : 'tab'} onClick={() => setTab('tasks')}>
          📋 Tasks {pending > 0 && <span className="tab-badge">{pending}</span>}
        </button>
        <button className={tab === 'analytics' ? 'tab active' : 'tab'} onClick={() => setTab('analytics')}>
          📊 Analytics
        </button>
      </div>

      {tab === 'tasks' && (
        <>
          <TaskForm onSaved={task => {
            setTasks(t => editing ? t.map(x => x.id === task.id ? task : x) : [task, ...t]);
            setEditing(null);
          }} editing={editing} onCancel={() => setEditing(null)} />
          <div className="task-list">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task}
                onDelete={deleteTask}
                onToggle={toggleComplete}
                onEdit={t => { setEditing(t); }}
                onTimer={timerAction} />
            ))}
            {tasks.length === 0 && <p className="empty">No tasks yet. Add one above!</p>}
          </div>
        </>
      )}

      {tab === 'analytics' && <Analytics tasks={tasks} />}
    </div>
  );
}
