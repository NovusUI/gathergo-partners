import React, { useEffect, useRef, useState } from 'react';
import { COLOR, TIMER_DURATION } from '../constants';

export default function TimerDot({ active, paused, onClick }) {
  const r = 13;
  const circ = 2 * Math.PI * r;
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }

    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const pct = Math.min(elapsed / TIMER_DURATION, 1);
      setProgress(pct);
      if (pct < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;

    if (paused) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const pct = progress;
    startRef.current = null;
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts - pct * TIMER_DURATION;
      const elapsed = ts - startRef.current;
      const p = Math.min(elapsed / TIMER_DURATION, 1);
      setProgress(p);
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused]);

  const dashOffset = circ * (1 - progress);

  return (
    <button onClick={onClick} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, flexShrink: 0, outline: 'none', position: 'relative', boxSizing: 'border-box' }}>
      <svg width={30} height={30} style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
        <circle cx={15} cy={15} r={r} fill={active ? '#0A1628' : '#fff'} stroke="#ccc" strokeWidth={2} />
        {active && <circle cx={15} cy={15} r={r - 5} fill="#fff" />}
        {active && (
          <circle cx={15} cy={15} r={r} fill="none" stroke={COLOR} strokeWidth={2.5} strokeDasharray={circ} strokeDashoffset={dashOffset} strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
}
