import React, { useEffect, useRef, useState } from 'react';
import { COLOR } from '../constants';

const PARTNERSHIPS = [
  {
    name: 'NovusUI Feed500',
    location: 'Lagos',
    desc: 'A Vision To Feed 500 Families In Underserved Communities Through Coordinated Outreach Events And Donation Drives.',
    format: 'Relief Activation',
    focus: ['Food support', 'Volunteer mobilization', 'Donor coordination'],
    support: ['Field updates', 'Donor transparency', 'Attendance and logistics'],
  },
  {
    name: 'Jesus Market',
    location: 'Lagos',
    desc: 'A Faith-Based Outreach Program Where Donated Items Are Curated In A Market-Style Setup, Allowing People In The Community To Walk In And Pick What They Need With Dignity.',
    format: 'Faith-Based Outreach',
    focus: ['Donated essentials', 'Dignified access', 'Community care'],
    support: ['Donation coordination', 'Volunteer roles', 'Distribution flow'],
  },
  {
    name: 'Jesus Market X Feed500',
    location: 'Lagos',
    desc: 'A Collaborative Initiative Exploring How Jesus Market And Feed500 Can Combine Dignified Item Distribution With Coordinated Feeding Support For More Families.',
    format: 'Collaborative Rollout',
    focus: ['Multi-partner outreach', 'Item distribution', 'Community feeding'],
    support: ['Cross-team coordination', 'Donation tracking', 'Impact storytelling'],
  },
];

export default function SectionPartnerships({ isMobile, onPartner }) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hoverPoint, setHoverPoint] = useState({ x: 50, y: 50, active: false });
  const ref = useRef(null);
  const cardRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold: 0.06 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const startAuto = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (paused) return;
      setFading(true);
      setTimeout(() => {
        setCurrent((i) => (i + 1) % PARTNERSHIPS.length);
        setFading(false);
      }, 350);
    }, 4000);
  };

  useEffect(() => {
    startAuto();
    return () => clearInterval(intervalRef.current);
  }, [paused]);

  const goTo = (i) => {
    if (i === current) return;
    setFading(true);
    setTimeout(() => {
      setCurrent(i);
      setFading(false);
    }, 350);
    startAuto();
  };

  const goSlide = (dir) => goTo((current + dir + PARTNERSHIPS.length) % PARTNERSHIPS.length);
  const partner = PARTNERSHIPS[current];

  const handleCardMove = (e) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHoverPoint({ x, y, active: true });
  };

  const ringOffsetX = isMobile ? 0 : (hoverPoint.x - 50) * 0.12;
  const ringOffsetY = isMobile ? 0 : (hoverPoint.y - 50) * 0.12;

  return (
    <section ref={ref} style={{ background: '#030A31', padding: isMobile ? '60px 20px' : '72px 64px', cursor: 'auto' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 32 : 40, alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 auto', width: isMobile ? '100%' : 340, display: 'flex', flexDirection: 'column', gap: 20, opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-28px)', transition: 'opacity 0.8s ease, transform 0.8s ease' }}>
          <p style={{ color: COLOR, fontWeight: 600, fontSize: 14, margin: 0, letterSpacing: 0.4 }}>You can bring change to the world</p>

          <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '28px 24px', height: isMobile ? 280 : 320, display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: isMobile ? 24 : 28, margin: '0 0 20px', lineHeight: 1.25 }}>Some Of Our<br />Partnerships</h2>
            <div style={{ borderLeft: `3px solid ${COLOR}`, paddingLeft: 14, marginBottom: 20, opacity: fading ? 0 : 1, transform: fading ? 'translateY(6px)' : 'translateY(0)', transition: 'opacity 0.35s ease, transform 0.35s ease', flex: 1 }}>
              <p style={{ color: COLOR, fontWeight: 700, fontSize: 15, margin: '0 0 8px' }}>{partner.name}</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.8, margin: 0 }}>{partner.desc}</p>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {PARTNERSHIPS.map((_, i) => (
                <div key={i} onClick={() => goTo(i)} style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 4, background: i === current ? COLOR : 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.3s ease' }} />
              ))}
            </div>
          </div>

          <div style={{ background: '#C8F5EC', borderRadius: 20, padding: '28px 24px' }}>
            <h3 style={{ color: '#0A1628', fontWeight: 800, fontSize: 20, margin: '0 0 12px', lineHeight: 1.3 }}>Be Our Next Partner</h3>
            <p style={{ color: '#444', fontSize: 13, lineHeight: 1.8, margin: '0 0 22px' }}>Become A Partner Of An Impact Project Or Something Better? Host An Impact Project Or Event.</p>
            <button onClick={onPartner} style={{ width: '100%', background: '#0A1628', color: '#fff', border: 'none', borderRadius: 50, padding: '13px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer', letterSpacing: 0.4, fontFamily: 'inherit' }}>
              Partner With Us →
            </button>
          </div>
        </div>

        <div
          ref={cardRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => {
            setPaused(false);
            setHoverPoint({ x: 50, y: 50, active: false });
          }}
          onMouseMove={handleCardMove}
          style={{ flex: 1, position: 'relative', borderRadius: 24, overflow: 'hidden', height: isMobile ? 340 : 540, opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(28px)', transition: 'opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', background: 'linear-gradient(140deg, #10214a 0%, #07122B 55%, #0b3850 100%)' }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at ${hoverPoint.x}% ${hoverPoint.y}%, rgba(20,217,196,${hoverPoint.active ? 0.18 : 0}) 0%, transparent 24%), radial-gradient(circle at 20% 25%, rgba(20,217,196,0.16) 0%, transparent 30%), radial-gradient(circle at 75% 30%, rgba(255,255,255,0.08) 0%, transparent 32%), radial-gradient(circle at 68% 72%, rgba(20,217,196,0.1) 0%, transparent 28%)`,
              transition: 'background 0.18s ease-out',
            }}
          />
          <div style={{ position: 'absolute', top: isMobile ? -10 : -20 + ringOffsetY * 0.4, right: isMobile ? -10 : -20 - ringOffsetX * 0.4, width: isMobile ? 150 : 220, height: isMobile ? 150 : 220, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', transition: 'top 0.18s ease-out, right 0.18s ease-out' }} />
          <div style={{ position: 'absolute', top: isMobile ? 20 : 38 + ringOffsetY * 0.7, right: isMobile ? 20 : 42 - ringOffsetX * 0.7, width: isMobile ? 110 : 156, height: isMobile ? 110 : 156, borderRadius: '50%', border: '1px solid rgba(20,217,196,0.18)', transition: 'top 0.18s ease-out, right 0.18s ease-out' }} />
          <div style={{ position: 'absolute', top: isMobile ? 48 : 82 + ringOffsetY, right: isMobile ? 48 : 70 - ringOffsetX, width: isMobile ? 54 : 76, height: isMobile ? 54 : 76, borderRadius: '50%', border: '3px solid rgba(20,217,196,0.9)', transition: 'top 0.18s ease-out, right 0.18s ease-out' }} />

          <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)', borderRadius: 50, padding: '7px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13 }}>📍</span>
            <span style={{ color: '#0A1628', fontWeight: 600, fontSize: 13 }}>{partner.location}</span>
          </div>

          <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)', borderRadius: 50, padding: '7px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#0A1628', fontWeight: 700 }}>
            {partner.format}
          </div>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', padding: isMobile ? '76px 20px 90px' : '94px 28px 102px' }}>
            <div style={{ maxWidth: isMobile ? '100%' : 420, opacity: fading ? 0 : 1, transform: fading ? 'translateY(6px)' : 'translateY(0)', transition: 'opacity 0.35s ease, transform 0.35s ease' }}>
              <p style={{ margin: '0 0 10px', color: COLOR, fontWeight: 700, fontSize: 13, letterSpacing: 0.4 }}>
                Partnership Snapshot
              </p>
              <h3 style={{ margin: '0 0 14px', color: '#fff', fontSize: isMobile ? 24 : 34, fontWeight: 800, lineHeight: 1.12 }}>
                {partner.name}
              </h3>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.72)', fontSize: 14, lineHeight: 1.8 }}>
                {partner.desc}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 14, opacity: fading ? 0 : 1, transform: fading ? 'translateY(6px)' : 'translateY(0)', transition: 'opacity 0.35s ease, transform 0.35s ease' }}>
              <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: '16px 16px 14px', backdropFilter: 'blur(10px)' }}>
                <p style={{ margin: '0 0 10px', color: '#fff', fontSize: 13, fontWeight: 700 }}>
                  What This Needs
                </p>
                <div style={{ display: 'grid', gap: 8 }}>
                  {partner.support.map((item) => (
                    <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLOR, marginTop: 6, flexShrink: 0 }} />
                      <p style={{ margin: 0, color: 'rgba(255,255,255,0.74)', fontSize: 12, lineHeight: 1.6 }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: '16px 16px 14px', backdropFilter: 'blur(10px)' }}>
                <p style={{ margin: '0 0 10px', color: '#fff', fontSize: 13, fontWeight: 700 }}>
                  Focus Areas
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {partner.focus.map((item) => (
                    <div key={item} style={{ borderRadius: 999, background: 'rgba(20,217,196,0.14)', border: '1px solid rgba(20,217,196,0.2)', padding: '8px 10px', color: '#dbfffb', fontSize: 12, fontWeight: 600 }}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(3,10,49,0.88) 0%, transparent 100%)', padding: '40px 20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={() => goSlide(-1)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: 'none', borderRadius: 50, padding: '10px 18px', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>← Last Project</button>
            <div style={{ display: 'flex', gap: 6 }}>
              {PARTNERSHIPS.map((_, i) => (
                <div key={i} style={{ width: i === current ? 32 : 20, height: 3, borderRadius: 2, background: i === current ? '#fff' : 'rgba(255,255,255,0.35)', transition: 'all 0.3s ease' }} />
              ))}
            </div>
            <button onClick={() => goSlide(1)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#0A1628', border: 'none', borderRadius: 50, padding: '10px 18px', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Next Project →</button>
          </div>
        </div>
      </div>
    </section>
  );
}
