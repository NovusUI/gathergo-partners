import React, { useEffect, useRef, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { ROW1, ROW2 } from '../data/cards';
import MarqueeCard from './MarqueeCard';

export default function Section2({ isMobile }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ background: '#132142', padding: '64px 0', position: 'relative', overflow: 'hidden', cursor: 'auto' }}>
      <style>{`
        @keyframes pop60 { 0% { transform: translate(-50%,-50%) translateY(0) scale(0); opacity: 0; } 8% { transform: translate(-50%,-50%) translateY(0) scale(1); opacity: 0.85; } 82% { transform: translate(-50%,-50%) translateY(-60px) scale(1.02); opacity: 0.75; } 93% { transform: translate(-50%,-50%) translateY(-68px) scale(1.3); opacity: 0.3; } 100% { transform: translate(-50%,-50%) translateY(-72px) scale(0); opacity: 0; } }
        @keyframes pop80 { 0% { transform: translate(-50%,-50%) translateY(0) scale(0); opacity: 0; } 8% { transform: translate(-50%,-50%) translateY(0) scale(1); opacity: 0.85; } 82% { transform: translate(-50%,-50%) translateY(-80px) scale(1.02); opacity: 0.75; } 93% { transform: translate(-50%,-50%) translateY(-90px) scale(1.3); opacity: 0.3; } 100% { transform: translate(-50%,-50%) translateY(-95px) scale(0); opacity: 0; } }
        @keyframes pop100 { 0% { transform: translate(-50%,-50%) translateY(0) scale(0); opacity: 0; } 8% { transform: translate(-50%,-50%) translateY(0) scale(1); opacity: 0.85; } 82% { transform: translate(-50%,-50%) translateY(-100px) scale(1.02); opacity: 0.75; } 93% { transform: translate(-50%,-50%) translateY(-112px) scale(1.3); opacity: 0.3; } 100% { transform: translate(-50%,-50%) translateY(-118px) scale(0); opacity: 0; } }
        @keyframes pop120 { 0% { transform: translate(-50%,-50%) translateY(0) scale(0); opacity: 0; } 8% { transform: translate(-50%,-50%) translateY(0) scale(1); opacity: 0.85; } 82% { transform: translate(-50%,-50%) translateY(-120px) scale(1.02); opacity: 0.75; } 93% { transform: translate(-50%,-50%) translateY(-133px) scale(1.3); opacity: 0.3; } 100% { transform: translate(-50%,-50%) translateY(-138px) scale(0); opacity: 0; } }
        @keyframes pop140 { 0% { transform: translate(-50%,-50%) translateY(0) scale(0); opacity: 0; } 8% { transform: translate(-50%,-50%) translateY(0) scale(1); opacity: 0.85; } 82% { transform: translate(-50%,-50%) translateY(-140px) scale(1.02); opacity: 0.75; } 93% { transform: translate(-50%,-50%) translateY(-155px) scale(1.3); opacity: 0.3; } 100% { transform: translate(-50%,-50%) translateY(-162px) scale(0); opacity: 0; } }
      `}</style>

      {[{ x: '4%', y: '18%', r: 22, pop: 'pop100', dur: 3.8, delay: 0 }, { x: '12%', y: '42%', r: 14, pop: 'pop60', dur: 4.5, delay: 1.2 }, { x: '8%', y: '68%', r: 10, pop: 'pop140', dur: 3.2, delay: 2.5 }, { x: '18%', y: '28%', r: 18, pop: 'pop80', dur: 5.1, delay: 0.7 }, { x: '22%', y: '75%', r: 12, pop: 'pop120', dur: 4, delay: 3.1 }, { x: '35%', y: '15%', r: 20, pop: 'pop60', dur: 3.6, delay: 1.8 }, { x: '30%', y: '55%', r: 10, pop: 'pop100', dur: 4.8, delay: 0.4 }, { x: '42%', y: '80%', r: 16, pop: 'pop140', dur: 3.3, delay: 2.2 }, { x: '50%', y: '22%', r: 24, pop: 'pop80', dur: 5.5, delay: 0.9 }, { x: '55%', y: '50%', r: 12, pop: 'pop120', dur: 3.9, delay: 3.6 }, { x: '48%', y: '72%', r: 18, pop: 'pop60', dur: 4.2, delay: 1.5 }, { x: '62%', y: '30%', r: 14, pop: 'pop140', dur: 3.5, delay: 2.8 }, { x: '68%', y: '60%', r: 22, pop: 'pop100', dur: 4.7, delay: 0.3 }, { x: '65%', y: '85%', r: 10, pop: 'pop80', dur: 3.1, delay: 4 }, { x: '75%', y: '18%', r: 20, pop: 'pop120', dur: 5, delay: 1.1 }, { x: '80%', y: '45%', r: 16, pop: 'pop60', dur: 3.7, delay: 2.9 }, { x: '78%', y: '72%', r: 12, pop: 'pop140', dur: 4.3, delay: 0.6 }, { x: '88%', y: '25%', r: 24, pop: 'pop80', dur: 3.4, delay: 3.3 }, { x: '92%', y: '55%', r: 18, pop: 'pop100', dur: 4.9, delay: 1.7 }, { x: '96%', y: '80%', r: 10, pop: 'pop120', dur: 3.8, delay: 0.2 }, { x: '38%', y: '38%', r: 14, pop: 'pop60', dur: 4.1, delay: 2 }].map((b, i) => (
        <div key={i} style={{ position: 'absolute', left: b.x, top: b.y, width: b.r * 2, height: b.r * 2, borderRadius: '50%', background: '#1a2d52', pointerEvents: 'none', zIndex: 0, animation: `${b.pop} ${b.dur}s ease-in-out ${b.delay}s infinite` }} />
      ))}

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', padding: isMobile ? '0 20px' : '0 48px', marginBottom: isMobile ? 48 : 64, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(40px)', transition: 'opacity 1s ease, transform 1s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 32, margin: '0 0 12px', lineHeight: 1.2 }}>Envision A Bright Future For Everyone</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 20, fontWeight: 400, margin: 0 }}>Hope In Action, Impact In Motion</p>
        </div>

        <div style={{ marginBottom: 90 }}>
          <Marquee gradient={false} speed={45} pauseOnHover>
            {ROW1.map((card, i) => <MarqueeCard key={`row1-${i}`} card={card} />)}
          </Marquee>
        </div>

        <div>
          <Marquee gradient={false} speed={45} direction="right" pauseOnHover>
            {ROW2.map((card, i) => <MarqueeCard key={`row2-${i}`} card={card} />)}
          </Marquee>
        </div>

        <p style={{ textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: 700, lineHeight: 1.8, margin: '64px 0 0', padding: isMobile ? '0 24px' : 0, opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.5s' }}>
          GatherGo Connects People, Projects, And Purpose,<br />
          Making It Easier To Build, Join, And Grow Impactful Communities.
        </p>
      </div>
    </section>
  );
}
