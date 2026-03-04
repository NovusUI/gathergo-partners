import React, { useEffect, useRef, useState } from 'react';
import { COLOR, INNER_R, OUTER_R } from '../constants';
import { PROJECTS } from '../data/projects';

const TRACK_R = (INNER_R + OUTER_R) / 2;
const N = PROJECTS.length;

export default function Section4({ isMobile, onPartner }) {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [cursor4, setCursor4] = useState({ x: -1, y: -1 });
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      setCursor4({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    const onLeave = () => setCursor4({ x: -1, y: -1 });

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const advance = () => {
    setFading(true);
    setTimeout(() => {
      setActive((a) => (a + 1) % N);
      setRotation((r) => r - 360 / N);
      setFading(false);
    }, 450);
  };

  useEffect(() => {
    intervalRef.current = setInterval(advance, 4500);
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleDotClick = (i) => {
    clearInterval(intervalRef.current);
    const diff = i - active;
    setFading(true);
    setTimeout(() => {
      setActive(i);
      setRotation((r) => r - diff * (360 / N));
      setFading(false);
      intervalRef.current = setInterval(advance, 4500);
    }, 450);
  };

  const proj = PROJECTS[active];
  const sectionW = sectionRef.current?.offsetWidth || 1200;
  const hasCursor = cursor4.x >= 0;
  const blushStyle = hasCursor
    ? {
      background: `radial-gradient(ellipse 340px 340px at ${cursor4.x}px ${cursor4.y}px,
      ${cursor4.x / sectionW < 0.5 ? 'rgba(240,251,236,0.55)' : 'rgba(241,230,227,0.55)'} 0%,
      transparent 100%), #EFFFFC`,
    }
    : { background: '#EFFFFC' };

  return (
    <section ref={sectionRef} style={{ ...blushStyle, minHeight: '100vh', position: 'relative', overflow: 'hidden', cursor: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '80px 24px' : '80px 60px', boxSizing: 'border-box' }}>
      <div style={{ position: 'absolute', left: -OUTER_R + 70, top: '50%', width: OUTER_R * 2, height: OUTER_R * 2, transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.45)', boxShadow: '0 8px 40px rgba(180,220,210,0.18), inset 0 1px 0 rgba(255,255,255,0.6)' }} />
        <div style={{ position: 'absolute', top: OUTER_R - INNER_R, left: OUTER_R - INNER_R, width: INNER_R * 2, height: INNER_R * 2, borderRadius: '50%', background: '#d8e7e5', boxShadow: '0 2px 20px rgba(0,200,180,0.08)', zIndex: 1 }} />

        <div style={{ position: 'absolute', inset: 0, transform: `rotate(${rotation}deg)`, transition: 'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 2 }}>
          {PROJECTS.map((_, i) => {
            const angle = ((i * 360) / N - 90) * (Math.PI / 180);
            const x = OUTER_R + TRACK_R * Math.cos(angle);
            const y = OUTER_R + TRACK_R * Math.sin(angle);
            const isActive = i === active;
            const rippleDelay = fading ? `${((i - active + N) % N) * 80}ms` : '0ms';

            return (
              <div key={i} style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${-rotation}deg)`, transition: 'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1)', pointerEvents: 'auto', cursor: 'pointer' }} onClick={() => handleDotClick(i)}>
                <div style={{ width: 47, height: 47, borderRadius: '50%', background: isActive ? '#fff' : fading ? `rgba(10,22,40,${0.08 + ((i - active + N) % N) * 0.06})` : 'rgba(180,200,195,0.55)', boxShadow: isActive ? '0 4px 16px rgba(10,22,40,0.3)' : 'none', transition: `background 0.35s ease ${rippleDelay}, width 0.4s ease, height 0.4s ease` }} />
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: 960, position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 56 }}>
          <p style={{ color: COLOR, fontSize: 14, fontWeight: 600, letterSpacing: 1, margin: '0 0 12px' }}>Be The Reason Someone Smiles Today</p>
          <h2 style={{ color: '#0A1628', fontWeight: 800, fontSize: isMobile ? 28 : 42, margin: 0, lineHeight: 1.2 }}>The Type Of Project We Want TO<br />Partner With</h2>
        </div>

        {!isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36 }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', gap: 20, opacity: fading ? 0 : 1, transform: fading ? 'translateY(8px)' : 'translateY(0)', transition: 'opacity 0.45s ease, transform 0.45s ease' }}>
              <div style={{ textAlign: 'right', maxWidth: 280 }}>
                <p style={{ color: '#0A1628', fontWeight: 700, fontSize: 20, margin: '0 0 16px' }}>{proj.title}</p>
                <p style={{ color: '#666', fontSize: 14, lineHeight: 1.8, margin: '0 0 16px' }}>{proj.desc}</p>
                <button onClick={onPartner} style={{ background: '#0A1628', color: '#fff', border: 'none', borderRadius: 50, padding: '11px 24px', fontWeight: 700, fontSize: 13, cursor: 'pointer', letterSpacing: 0.3, fontFamily: 'inherit' }}>
                  Become A Partner →
                </button>
              </div>
              <div style={{ width: 1, height: 140, background: '#ccc', flexShrink: 0, marginTop: 4 }} />
            </div>

            <div style={{ width: 380, height: 280, borderRadius: 20, overflow: 'hidden', opacity: fading ? 0 : 1, transform: fading ? 'scale(0.97)' : 'scale(1)', transition: 'opacity 0.45s ease, transform 0.45s ease', boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}>
              <img src={proj.img} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div style={{ width: '100%', height: 240, borderRadius: 20, overflow: 'hidden', opacity: fading ? 0 : 1, transform: fading ? 'scale(0.97)' : 'scale(1)', transition: 'opacity 0.45s ease, transform 0.45s ease', boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}>
              <img src={proj.img} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ opacity: fading ? 0 : 1, transform: fading ? 'translateY(8px)' : 'translateY(0)', transition: 'opacity 0.45s ease, transform 0.45s ease' }}>
              <p style={{ color: '#0A1628', fontWeight: 700, fontSize: 18, margin: '0 0 12px' }}>{proj.title}</p>
              <p style={{ color: '#666', fontSize: 14, lineHeight: 1.8, margin: '0 0 14px' }}>{proj.desc}</p>
              <button onClick={onPartner} style={{ background: '#0A1628', color: '#fff', border: 'none', borderRadius: 50, padding: '11px 24px', fontWeight: 700, fontSize: 13, cursor: 'pointer', letterSpacing: 0.3, fontFamily: 'inherit' }}>
                Become A Partner →
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
