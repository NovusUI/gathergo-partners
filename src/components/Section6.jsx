import React, { useEffect, useRef, useState } from 'react';
import { COLOR } from '../constants';
import { ROADMAP_MONTHS } from '../data/roadmapMonths';
import { useCountdown } from '../hooks/useCountdown';

export default function Section6({ isMobile, onPartner }) {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [timerPct, setTimerPct] = useState(0);
  const ref = useRef(null);
  const startRef = useRef(null);
  const rafRef = useRef(null);
  const AUTO_DURATION = 8000;

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold: 0.05 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const startAutoTimer = (fromPct = 0) => {
    cancelAnimationFrame(rafRef.current);
    startRef.current = null;

    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts - fromPct * AUTO_DURATION;
      const elapsed = ts - startRef.current;
      const pct = Math.min(elapsed / AUTO_DURATION, 1);
      setTimerPct(pct);

      if (pct < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setFading(true);
        setTimeout(() => {
          setActive((a) => (a + 1) % ROADMAP_MONTHS.length);
          setFading(false);
          setTimerPct(0);
          startAutoTimer(0);
        }, 350);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    startAutoTimer(0);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  const selectMonth = (i) => {
    if (i === active) return;
    cancelAnimationFrame(rafRef.current);
    setFading(true);
    setTimeout(() => {
      setActive(i);
      setFading(false);
      setTimerPct(0);
    }, 350);
  };

  const proj = ROADMAP_MONTHS[active];
  const { d, h, m, s } = useCountdown(proj.target);
  const pad = (n) => String(n).padStart(2, '0');
  const SIZE = isMobile ? 56 : 72;

  return (
    <section ref={ref} style={{ background: '#030A31', minHeight: '100vh', padding: isMobile ? '60px 20px' : '72px 0', display: 'flex', alignItems: 'center', cursor: 'auto', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: isMobile ? 16 : 28, right: isMobile ? 16 : 36, width: SIZE, height: SIZE, borderRadius: '50%', background: `conic-gradient(#EFFFFC 0deg, #EFFFFC ${timerPct * 360}deg, ${COLOR} ${timerPct * 360}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,200,180,0.15)' }}>
        <div style={{ width: SIZE - 20, height: SIZE - 20, borderRadius: '50%', background: COLOR, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
          <span style={{ color: '#EFFFFC', fontSize: isMobile ? 11 : 13, fontWeight: 700 }}>{proj.num}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', width: '100%', maxWidth: 1300, margin: '0 auto', gap: isMobile ? 20 : 0 }}>
        {!isMobile && (
          <div style={{ width: 220, flexShrink: 0, display: 'flex', paddingLeft: 60, paddingTop: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: isMobile ? 12 : 20 }}>
            <div style={{ width: 1.5, height: 24, background: 'rgba(255,255,255,0.15)' }} />
            {ROADMAP_MONTHS.map((rm, i) => {
              const isActive = i === active;
              const isPast = i < active;
              return (
                <React.Fragment key={rm.month + rm.num}>
                  <button onClick={() => selectMonth(i)} style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${isActive || isPast ? COLOR : 'rgba(255,255,255,0.25)'}`, background: isActive ? COLOR : 'transparent', cursor: 'pointer', padding: 0, flexShrink: 0, outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box' }}>
                    {isActive && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#030A31', margin: 'auto' }} />}
                  </button>
                  {i < ROADMAP_MONTHS.length - 1 && <div style={{ width: 1.5, flex: 1, minHeight: 48, background: 'rgba(255,255,255,0.15)', margin: '2px 0' }} />}
                </React.Fragment>
              );
            })}
            <div style={{ width: 1.5, height: 24, background: 'rgba(255,255,255,0.15)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 24 }}>
            {ROADMAP_MONTHS.map((rm, i) => {
              const isActive = i === active;
              return (
                <div key={rm.month} style={{ height: 20, marginBottom: i < ROADMAP_MONTHS.length - 1 ? 48 : 0, display: 'flex', alignItems: 'center' }}>
                  <span onClick={() => selectMonth(i)} style={{ color: isActive ? COLOR : 'rgba(255,255,255,0.45)', fontSize: isMobile ? 12 : 15, fontWeight: isActive ? 600 : 400, cursor: 'pointer', transition: 'color 0.3s ease', whiteSpace: 'nowrap' }}>{rm.month}</span>
                </div>
              );
            })}
          </div>
          </div>
        )}

        <div style={{ flex: 1, width: '100%', paddingLeft: isMobile ? 0 : undefined, paddingRight: isMobile ? 0 : 80, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease' }}>
          {isMobile && (
            <div style={{ width: '100%', overflowX: 'auto', display: 'flex', gap: 8, marginBottom: 14, paddingBottom: 6 }}>
              {ROADMAP_MONTHS.map((rm, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={rm.month + rm.num}
                    onClick={() => selectMonth(i)}
                    style={{
                      border: isActive ? `1px solid ${COLOR}` : '1px solid rgba(255,255,255,0.25)',
                      background: isActive ? 'rgba(20,217,196,0.15)' : 'transparent',
                      color: isActive ? COLOR : 'rgba(255,255,255,0.7)',
                      borderRadius: 999,
                      padding: '8px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                    }}
                  >
                    {rm.num}. {rm.month}
                  </button>
                );
              })}
            </div>
          )}

          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ color: COLOR, fontSize: 14, fontWeight: 600, letterSpacing: 1, margin: '0 0 10px' }}>Planned Projects for 2026</p>
            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: isMobile ? 32 : 52, margin: 0, lineHeight: 1.1 }}>Roadmap</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 14, marginBottom: 28, opacity: fading ? 0 : 1, transition: 'opacity 0.35s ease' }}>
            {[{ v: pad(d), l: 'DAYS' }, { v: pad(h), l: 'HOURS' }, { v: pad(m), l: 'MIN' }, { v: pad(s), l: 'SEC' }].map((unit, i) => (
              <React.Fragment key={unit.l}>
                <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', borderRadius: 50, width: isMobile ? 52 : 90, height: isMobile ? 52 : 90, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: isMobile ? 18 : 30, lineHeight: 1 }}>{unit.v}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 500, marginTop: 4, letterSpacing: 1 }}>{unit.l}</span>
                </div>
                {i < 3 && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: isMobile ? 16 : 28, fontWeight: 300 }}>:</span>}
              </React.Fragment>
            ))}
          </div>

          <div style={{ background: '#fff', borderRadius: 20, padding: isMobile ? '24px 16px' : '40px 48px', width: '100%', maxWidth: 640, position: 'relative', opacity: fading ? 0 : 1, transform: fading ? 'translateY(8px)' : 'translateY(0)', transition: 'opacity 0.35s ease, transform 0.35s ease' }}>
            <div style={{ position: 'absolute', top: -16, right: isMobile ? 20 : 40, width: 40, height: 40, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600 }}>{proj.num}</div>

            <h3 style={{ color: '#0A1628', fontWeight: 700, fontSize: isMobile ? 18 : 22, textAlign: 'center', margin: '0 0 16px', lineHeight: 1.3 }}>{proj.title}</h3>
            <div style={{ width: '100%', height: 1, background: '#eee', marginBottom: 20 }} />
            <p style={{ color: '#555', fontSize: 14, lineHeight: 1.8, margin: '0 0 14px' }}>{proj.desc}</p>
            {proj.bullets.map((b, i) => (
              <div key={b} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < proj.bullets.length - 1 ? 8 : 0 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0A1628', flexShrink: 0, marginTop: 6 }} />
                <p style={{ color: '#555', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{b}</p>
              </div>
            ))}

            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={onPartner}
                style={{
                  background: '#0A1628',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 50,
                  padding: '11px 24px',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  letterSpacing: 0.3,
                  fontFamily: 'inherit',
                }}
              >
                Partner With Us →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
