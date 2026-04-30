import React, { useState, useEffect } from 'react';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good Morning', emoji: '🌅' };
  if (h < 17) return { text: 'Good Afternoon', emoji: '☀️' };
  if (h < 21) return { text: 'Good Evening', emoji: '🌆' };
  return { text: 'Good Night', emoji: '🌙' };
}

function getUsername() {
  try {
    const token = localStorage.getItem('access');
    if (!token) return 'there';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.username || 'there';
  } catch {
    return 'there';
  }
}

export default function Greeting() {
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const id = setInterval(() => setGreeting(getGreeting()), 60000);
    return () => clearInterval(id);
  }, []);

  const name = getUsername();
  const capitalized = typeof name === 'string'
    ? name.charAt(0).toUpperCase() + name.slice(1)
    : name;

  return (
    <div className="greeting">
      <span className="greeting-emoji">{greeting.emoji}</span>
      <span className="greeting-text">{greeting.text}, <strong>{capitalized}</strong>!</span>
    </div>
  );
}
