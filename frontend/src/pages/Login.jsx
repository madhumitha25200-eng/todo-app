import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const WORDS = [
  'Todo', 'Task', 'Done ✓', 'Focus', 'Plan', 'Goals', 'Priority',
  'Deadline', 'Progress', 'Achieve', 'Complete', 'Schedule', 'Organize',
  'Productivity', 'Checklist', 'Reminder', 'Milestone', 'Workflow',
];

function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Floating word particles
    const particles = Array.from({ length: 22 }, (_, i) => ({
      word: WORDS[i % WORDS.length],
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 10 + 11,
      opacity: Math.random() * 0.35 + 0.1,
      color: ['#a5b4fc', '#c4b5fd', '#6ee7b7', '#fde68a', '#fbcfe8'][Math.floor(Math.random() * 5)],
    }));

    // Floating circles
    const circles = Array.from({ length: 10 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 80 + 30,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.08 + 0.03,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gradient background
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(0.5, '#312e81');
      grad.addColorStop(1, '#1e3a5f');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw circles
      circles.forEach(c => {
        c.x += c.vx; c.y += c.vy;
        if (c.x < -c.r) c.x = canvas.width + c.r;
        if (c.x > canvas.width + c.r) c.x = -c.r;
        if (c.y < -c.r) c.y = canvas.height + c.r;
        if (c.y > canvas.height + c.r) c.y = -c.r;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${c.opacity})`;
        ctx.fill();
      });

      // Draw words
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -100) p.x = canvas.width + 100;
        if (p.x > canvas.width + 100) p.x = -100;
        if (p.y < -40) p.y = canvas.height + 40;
        if (p.y > canvas.height + 40) p.y = -40;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.font = `600 ${p.size}px 'Segoe UI', sans-serif`;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fillText(p.word, p.x, p.y);
        ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="auth-canvas" />;
}

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.post('/login/', form);
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      nav('/');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="auth-page">
      <AnimatedBackground />
      <div className="auth-card">
        <div className="auth-logo">📝</div>
        <h1 className="auth-app-name">TodoApp</h1>
        <p className="auth-tagline">Stay organized. Stay productive.</p>
        <h2>Welcome Back</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={submit}>
          <div className="auth-input-wrap">
            <span className="auth-input-icon">👤</span>
            <input placeholder="Username" value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })} required />
          </div>
          <div className="auth-input-wrap">
            <span className="auth-input-icon">🔒</span>
            <input type="password" placeholder="Password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className="auth-btn">Login →</button>
        </form>
        <p className="auth-switch">No account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}
