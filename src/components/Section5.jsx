import React, { useEffect, useRef, useState } from 'react';
import { COLOR } from '../constants';

export default function Section5({ isMobile, isMedium, scrollEl }) {
  const [visible, setVisible] = useState(false);
  const [smoothPct, setSmoothPct] = useState(0);
  const ref = useRef(null);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold: 0.08 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      const next = lerp(currentRef.current, targetRef.current, 0.06);
      if (Math.abs(next - currentRef.current) > 0.0001) {
        currentRef.current = next;
        setSmoothPct(next);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const el = scrollEl;
    if (!el) return undefined;

    const onScroll = () => {
      if (!ref.current) return;
      const sectionRect = ref.current.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const viewH = el.clientHeight;
      const sectionTop = sectionRect.top - elRect.top;
      const sectionH = sectionRect.height;
      const pct = Math.min(1, Math.max(0, -sectionTop / (sectionH - viewH * 0.5)));
      targetRef.current = pct;
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [scrollEl]);

  return (
    <section ref={ref} style={{ background: '#ededed', padding: isMobile ? '32px 16px' : '60px', cursor: 'auto' }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: isMobile ? '40px 20px' : '60px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 56, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.8s ease, transform 0.8s ease' }}>
          <h2 style={{ color: '#0A1628', fontWeight: 800, fontSize: isMobile ? 28 : 40, margin: '0 0 14px' }}>Our Foundation</h2>
          <p style={{ color: '#888', fontSize: 15, margin: 0, lineHeight: 1.7 }}>We Believe Communities Grow Stronger When People Come Together With Purpose.</p>
        </div>

        {!isMobile && (
          <div style={{ display: 'flex', flexDirection: isMedium ? 'column' : 'row', gap: 28, alignItems: 'flex-start' }}>
            <div style={{ flex: isMedium ? 'unset' : '0 0 auto', width: isMedium ? '100%' : 300, display: 'flex', flexDirection: isMedium ? 'row' : 'column', gap: 20, opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-24px)', transition: 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s', marginBottom: isMedium ? 28 : 0 }}>
              <div style={{ flex: isMedium ? 1 : 'unset', height: isMedium ? 220 : 260, borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&q=80" alt="Community" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: isMedium ? 1 : 'unset', background: '#E0FAF6', borderRadius: 18, padding: '24px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <p style={{ color: '#0A1628', fontWeight: 700, fontSize: 18, margin: '0 0 12px' }}>Built for Impact</p>
                <p style={{ color: '#555', fontSize: 14, lineHeight: 1.75, margin: 0 }}>If Your Project Creates Value, Builds Connection, And Drives Positive Change. GatherGo Is Ready To Move With You.</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', gap: 28, flex: 1, alignItems: 'flex-start' }}>
              <div style={{ flex: '0 0 auto', width: isMedium ? 240 : 280, height: isMedium ? 420 : 500, borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s', alignSelf: 'flex-start' }}>
                <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80" alt="Impact" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ flex: 1, display: 'flex', gap: 24, alignItems: 'flex-start', opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(24px)', transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s', paddingTop: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: 4, position: 'relative' }}>
                  <div style={{ width: 1.5, height: 32, background: '#ddd' }} />
                  <div style={{ position: 'relative', width: 1.5, flex: 1, minHeight: 320, background: '#ddd' }}>
                    <div style={{ position: 'absolute', left: '50%', top: `${(smoothPct * 100).toFixed(3)}%`, transform: 'translate(-50%, -50%)', width: 16, height: 16, borderRadius: '50%', border: `3px solid ${COLOR}`, background: '#fff', boxShadow: '0 0 0 4px rgba(61,218,190,0.15)', zIndex: 2 }} />
                  </div>
                </div>
                <div>
                  <p style={{ color: COLOR, fontWeight: 600, fontSize: 14, margin: '0 0 10px', letterSpacing: 0.3 }}>Be The Reason Someone Smiles Today</p>
                  <h3 style={{ color: '#0A1628', fontWeight: 800, fontSize: 36, margin: '0 0 24px', lineHeight: 1.15 }}>About Us</h3>
                  <p style={{ color: '#555', fontSize: 14, lineHeight: 1.85, margin: '0 0 16px' }}>GatherGo Is A Community-Driven Platform Built To Turn Intention Into Action. We Believe Impact Happens When People Show Up. And We Exist To Make That Easier.</p>
                  <p style={{ color: '#555', fontSize: 14, lineHeight: 1.85, margin: 0 }}>We Connect Individuals, Organizers, And Communities Through Meaningful Projects And Events. From Charity Drives And Environmental Initiatives To Creative Gatherings And Youth Programs, GatherGo Helps People Move Together Toward A Shared Purpose.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isMobile && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-24px)', transition: 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ height: 240, borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&q=80" alt="Community" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ background: '#E0FAF6', borderRadius: 18, padding: '24px 26px' }}>
                <p style={{ color: '#0A1628', fontWeight: 700, fontSize: 18, margin: '0 0 12px' }}>Built for Impact</p>
                <p style={{ color: '#555', fontSize: 14, lineHeight: 1.75, margin: 0 }}>If Your Project Creates Value, Builds Connection, And Drives Positive Change. GatherGo Is Ready To Move With You.</p>
              </div>
            </div>
            <div style={{ height: 300, borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.2s' }}>
              <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80" alt="Impact" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.3s', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: 4 }}>
                <div style={{ width: 1.5, height: 28, background: '#ddd' }} />
                <div style={{ position: 'relative', width: 1.5, flex: 1, minHeight: 200, background: '#ddd' }}>
                  <div style={{ position: 'absolute', left: '50%', top: `${(smoothPct * 100).toFixed(3)}%`, transform: 'translate(-50%, -50%)', width: 16, height: 16, borderRadius: '50%', border: `3px solid ${COLOR}`, background: '#fff', boxShadow: '0 0 0 4px rgba(61,218,190,0.15)', zIndex: 2 }} />
                </div>
              </div>
              <div>
                <p style={{ color: COLOR, fontWeight: 600, fontSize: 14, margin: '0 0 10px' }}>Be The Reason Someone Smiles Today</p>
                <h3 style={{ color: '#0A1628', fontWeight: 800, fontSize: 28, margin: '0 0 20px' }}>About Us</h3>
                <p style={{ color: '#555', fontSize: 14, lineHeight: 1.85, margin: '0 0 14px' }}>GatherGo Is A Community-Driven Platform Built To Turn Intention Into Action. We Believe Impact Happens When People Show Up. And We Exist To Make That Easier.</p>
                <p style={{ color: '#555', fontSize: 14, lineHeight: 1.85, margin: 0 }}>We Connect Individuals, Organizers, And Communities Through Meaningful Projects And Events. From Charity Drives And Environmental Initiatives To Creative Gatherings And Youth Programs, GatherGo Helps People Move Together Toward A Shared Purpose.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
