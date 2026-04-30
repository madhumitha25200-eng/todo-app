import React, { useState, useEffect } from 'react';
import api from '../api';

const empty = { title: '', description: '', priority: 'medium', category: 'other', due_date: '' };

export default function TaskForm({ onSaved, editing, onCancel }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    setForm(editing ? {
      title: editing.title,
      description: editing.description,
      priority: editing.priority,
      category: editing.category || 'other',
      due_date: editing.due_date || ''
    } : empty);
  }, [editing]);

  const submit = async e => {
    e.preventDefault();
    const payload = { ...form, due_date: form.due_date || null };
    const { data } = editing
      ? await api.patch(`/tasks/${editing.id}/`, payload)
      : await api.post('/tasks/', payload);
    onSaved(data);
    setForm(empty);
  };

  return (
    <form className="task-form" onSubmit={submit}>
      <input placeholder="Task title" value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })} required />
      <textarea placeholder="Description (optional)" value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })} />
      <div className="form-row">
        <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
          <option value="work">💼 Work</option>
          <option value="personal">🏠 Personal</option>
          <option value="health">❤️ Health</option>
          <option value="learning">📚 Learning</option>
          <option value="shopping">🛒 Shopping</option>
          <option value="other">📌 Other</option>
        </select>
        <input type="date" value={form.due_date}
          onChange={e => setForm({ ...form, due_date: e.target.value })} />
        <button type="submit">{editing ? 'Update' : 'Add Task'}</button>
        {editing && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
