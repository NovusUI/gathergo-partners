import React, { useEffect, useRef, useState } from 'react';
import { COLOR, TIMER_DURATION } from '../constants';
import { FOCUS_PAIRS } from '../data/focusPairs';
import TimerDot from './TimerDot';

export default function Section3({ isSmall }) {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);
  const ref = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (paused) return;
      setFading(true);
      setTimeout(() => {
        setActive((a) => (a + 1) % FOCUS_PAIRS.length);
        setFading(false);
      }, 400);
    }, TIMER_DURATION);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [paused]);

  const handleDotClick = (i) => {
    clearInterval(timerRef.current);
    setFading(true);
    setTimeout(() => {
      setActive(i);
      setFading(false);
      startTimer();
    }, 400);
  };

  return (
    <section ref={ref} style={{ background: '#ededed', padding: isSmall ? '32px 16px' : '60px', cursor: 'auto' }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: isSmall ? '32px 20px' : '60px', position: 'relative', overflow: 'hidden', maxWidth: 1100, margin: '0 auto' }}>
        {[{ x: '5%', y: '4%' }, { x: '22%', y: '1%' }, { x: '42%', y: '5%' }, { x: '62%', y: '2%' }, { x: '80%', y: '6%' }, { x: '94%', y: '3%' }, { x: '2%', y: '32%' }, { x: '88%', y: '35%' }, { x: '5%', y: '65%' }, { x: '90%', y: '68%' }, { x: '8%', y: '88%' }, { x: '30%', y: '92%' }, { x: '55%', y: '90%' }, { x: '76%', y: '88%' }, { x: '92%', y: '91%' }].map((pos, i) => (
          <svg key={i} viewBox="0 0 120 50" width={64} height={27} style={{ position: 'absolute', left: pos.x, top: pos.y, opacity: 0.07, pointerEvents: 'none' }}>
            {[18, 52, 82].map((cx, j) => <circle key={j} cx={cx} cy={22} r={14} fill="none" stroke={COLOR} strokeWidth={5} />)}
            {[18, 52].map((cx, j) => <path key={j} d={`M${cx - 10} 36 Q${cx} 46 ${cx + 10} 36`} stroke={COLOR} strokeWidth={5} strokeLinecap="round" fill="none" />)}
          </svg>
        ))}

        <div style={{ display: 'flex', flexDirection: isSmall ? 'column' : 'row', alignItems: isSmall ? 'flex-start' : 'center', gap: isSmall ? 40 : 80, position: 'relative', zIndex: 1 }}>
          <div style={{ flex: 1, minWidth: 0, opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-30px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>
            <p style={{ color: COLOR, fontSize: 14, fontWeight: 600, margin: '0 0 10px', letterSpacing: 0.5 }}>You are the hope for others</p>
            <h2 style={{ color: '#0A1628', fontWeight: 800, fontSize: isSmall ? 28 : 38, margin: '0 0 16px', lineHeight: 1.15 }}>Our Goals</h2>
            <p style={{ color: '#666', fontSize: 15, lineHeight: 1.7, margin: '0 0 36px', maxWidth: 420 }}>To Make It Easier For People To Organize, Attend, And Support Impact-Driven Events, While Ensuring Transparency, Participation, And Measurable Impact.</p>
            <p style={{ color: '#0A1628', fontWeight: 700, fontSize: 17, margin: '0 0 20px' }}>Our 2026 Focus</p>

            <div style={{ display: 'flex', gap: 20, alignItems: 'stretch' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 1, height: 20, background: '#ccc' }} />
                {FOCUS_PAIRS.map((_, i) => (
                  <React.Fragment key={i}>
                    <TimerDot active={i === active} paused={paused} onClick={() => handleDotClick(i)} />
                    {i < FOCUS_PAIRS.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 16, background: '#ccc' }} />}
                  </React.Fragment>
                ))}
                <div style={{ width: 1, height: 20, background: '#ccc' }} />
              </div>

              <div style={{ flex: 1, position: 'relative' }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
                {FOCUS_PAIRS.map((pair, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 16, position: i === 0 ? 'relative' : 'absolute', top: 0, left: 0, right: 0, opacity: i === active && !fading ? 1 : 0, transform: i === active && !fading ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.4s ease, transform 0.4s ease', pointerEvents: i === active ? 'auto' : 'none' }}>
                    {pair.map((card, j) => (
                      <div key={j} style={{ background: card.bg, borderRadius: 16, padding: '18px 22px' }}>
                        <p style={{ color: card.titleColor, fontWeight: 700, fontSize: 16, margin: '0 0 12px' }}>{card.title}</p>
                        {card.bullets.map((b, k) => (
                          <div key={k} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: k < card.bullets.length - 1 ? 8 : 0 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLOR, flexShrink: 0, marginTop: 6 }} />
                            <p style={{ color: card.textColor, fontSize: 13, lineHeight: 1.6, margin: 0 }}>{b}</p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ flexShrink: 0, width: 350, height: 525, borderRadius: '40% / 34%', overflow: 'hidden', alignSelf: isSmall ? 'center' : 'auto', opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(30px)', transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}>
            <img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1719277836510-8a46520a2a2e?w=700&q=80" alt="Impact" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
