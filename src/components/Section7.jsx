import React, { useEffect, useRef, useState } from 'react';
import { COLOR } from '../constants';

export default function Section7({ isMobile, onSubmissionSuccess }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold: 0.08 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const openUat = () => {
    window.open('https://uat.gathergo.events', '_blank', 'noopener,noreferrer');
    if (onSubmissionSuccess) onSubmissionSuccess('');
  };

  return (
    <section ref={ref} style={{ background: '#fff', position: 'relative', overflow: 'hidden', padding: isMobile ? '72px 24px' : '80px', cursor: 'auto', height: isMobile ? '140vh' : '110vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    
      <style>{`
        @keyframes waveFloat1 { 0%,100% { transform: translateY(0); opacity: 1; } 50% { transform: translateY(-22px); opacity: 0.94; } }
        @keyframes waveFloat2 { 0%,100% { transform: translateY(0); opacity: 0.95; } 50% { transform: translateY(-14px); opacity: 1; } }
        @keyframes waveFloat3 { 0%,100% { transform: translateY(0); opacity: 0.97; } 50% { transform: translateY(-18px); opacity: 0.92; } }
        @keyframes phoneFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>

      <svg  viewBox="0 0 1440 600" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '58%', animation: 'waveFloat1 7s ease-in-out infinite', pointerEvents: 'none', zIndex: 0, willChange:"transform" }}><path d="M0 40 C100 0, 260 120, 500 60 C720 10, 980 100, 1440 80 L1440 600 L0 600 Z" fill="#D8FAF4" /></svg>
      <svg viewBox="0 0 1440 600" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '58%', animation: 'waveFloat2 9s ease-in-out 1s infinite', pointerEvents: 'none', zIndex: 0, willChange:"transform" }}><path d="M0 100 C300 60, 600 130, 900 50 C1100 0, 1300 90, 1440 40 L1440 600 L0 600 Z" fill="#DCF9F2" /></svg>
      <svg viewBox="0 0 1440 600" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '58%', animation: 'waveFloat3 6s ease-in-out 0.5s infinite', pointerEvents: 'none', zIndex: 0, willChange:"transform" }}><path d="M0 120 C360 20, 720 140, 1080 30 C1260 -10, 1380 80, 1440 60 L1440 600 L0 600 Z" fill="#E3FAF5" /></svg>

      <div style={{ textAlign: 'center', marginBottom: isMobile ? 52 : 64, position: 'relative', zIndex: 1, maxWidth: 760, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.8s ease, transform 0.8s ease'}}>
        <h2 style={{ color: '#0A1628', fontWeight: 800, fontSize: isMobile ? 28 : 42, margin: '0 0 18px', lineHeight: 1.2 }}>We Are Currently Running <span style={{color: COLOR}}>UAT</span><br />For GatherGo</h2>
        <p style={{ color: '#888', fontSize: 15, margin: 0, lineHeight: 1.7 }}>The app is almost live, and we are inviting a focused group of early users to test the experience before public launch.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 40 : 80, width: '100%', maxWidth: 1100, position: 'relative', zIndex: 1 }}>
        <div style={{ flex: 1, opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-24px)', transition: 'opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s' }}>
          <h3 style={{ color: '#0A1628', fontWeight: 700, fontSize: isMobile ? 20 : 24, margin: '0 0 18px', lineHeight: 1.4 }}>Help Us Test The Final Experience.</h3>
          <p style={{ color: '#555', fontSize: 14, lineHeight: 1.85, margin: '0 0 20px', maxWidth: 460 }}>GatherGo is in its final stretch before launch. We are validating the flows that matter most, discovering events, joining projects, giving support, and moving with community in a way that feels smooth and trustworthy.</p>
          <p style={{ color: '#555', fontSize: 14, lineHeight: 1.85, margin: '0 0 32px', maxWidth: 460 }}>If you want to see what we are actively testing, jump straight into the UAT environment and explore the product before public launch.</p>

          <button onClick={openUat} style={{ background: '#0A1628', color: '#fff', border: 'none', borderRadius: 50, padding: '14px 30px', fontWeight: 700, fontSize: 14, cursor: 'pointer', letterSpacing: 0.3, whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
            Join APP testing →
          </button>
        </div>

        <div style={{ willChange: 'transform',flexShrink: 0, width: isMobile ? '100%' : 380, height: isMobile ? 280 : 480, background: 'transparent', opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(24px)', transition: 'opacity 0.8s ease 0.25s, transform 0.8s ease 0.25s', animation: visible ? 'phoneFloat 4.8s ease-in-out infinite' : 'none' }}>
          <img loading="lazy" decoding="async" src="/iphone.png" alt="GatherGo App Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }} />
        </div>
      </div>
    </section>
  );
}
