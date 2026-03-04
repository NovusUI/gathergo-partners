import React, { useEffect, useRef, useState } from 'react';
import { COLOR } from '../constants';

const PARTNERSHIPS = [
  {
    name: 'NovusUI Feed500',
    location: 'Lagos',
    desc: 'A Vision To Feed 500 Families In Underserved Communities Through Coordinated Outreach Events And Donation Drives.',
    img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
  },
  {
    name: 'Jesus Market',
    location: 'Lagos',
    desc: 'A Faith-Driven Community Market Connecting Local Vendors, Volunteers, And Families Through Purposeful Gatherings And Shared Giving.',
    img: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&q=80',
  },
  {
    name: 'Jesus Market X Feed500',
    location: 'Lagos',
    desc: 'A Collaborative Initiative Between Jesus Market and NovusUI Feed500 To Scale Community Feeding Programs Across Multiple Locations.',
    img: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80',
  },
];

export default function SectionPartnerships({ isMobile, onPartner }) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const ref = useRef(null);
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
  }, []);

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

        <div style={{ flex: 1, position: 'relative', borderRadius: 24, overflow: 'hidden', height: isMobile ? 340 : 540, opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(28px)', transition: 'opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
          <img src={partner.img} alt={partner.name} style={{ width: '100%', height: isMobile ? 340 : 540, objectFit: 'cover', display: 'block', opacity: fading ? 0 : 1, transition: 'opacity 0.35s ease' }} />

          <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)', borderRadius: 50, padding: '7px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13 }}>📍</span>
            <span style={{ color: '#0A1628', fontWeight: 600, fontSize: 13 }}>{partner.location}</span>
          </div>

          <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)', borderRadius: 50, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#0A1628', fontWeight: 700, cursor: 'pointer' }}>↗</div>

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
