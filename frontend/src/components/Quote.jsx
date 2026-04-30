import React from 'react';

const QUOTES = [
  "The secret of getting ahead is getting started. – Mark Twain",
  "It always seems impossible until it's done. – Nelson Mandela",
  "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
  "Focus on being productive instead of busy. – Tim Ferriss",
  "Action is the foundational key to all success. – Pablo Picasso",
  "You don't have to be great to start, but you have to start to be great. – Zig Ziglar",
  "The way to get started is to quit talking and begin doing. – Walt Disney",
];

export default function Quote() {
  const idx = new Date().getDate() % QUOTES.length;
  return <blockquote className="quote">💬 {QUOTES[idx]}</blockquote>;
}
