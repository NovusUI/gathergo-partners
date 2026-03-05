import React, { useEffect, useMemo, useRef, useState } from 'react';
import { COLOR, SPRING, THRESHOLDS, TORCH_RADIUS } from './constants';
import { SDGS } from './data/sdgs';
import { stages } from './data/stages';
import { useBreakpoint } from './hooks/useBreakpoint';
import Footer from './components/Footer';
import SdgTile from './components/SdgTile';
import Section2 from './components/Section2';
import Section3 from './components/Section3';
import SectionPartnerships from './components/SectionPartnerships';
import Section4 from './components/Section4';
import Section5 from './components/Section5';
import Section6 from './components/Section6';
import Section7 from './components/Section7';
import PartnershipModal from './components/PartnershipModal';
import DonateModal from './components/DonateModal';
import SubmissionSuccessModal from './components/SubmissionSuccessModal';

const SDG_MODAL_ASSETS = {
  1: '/sdgs/no_poverty.png',
  2: '/sdgs/zero_hunger.png',
  3: '/sdgs/good_health.png',
  4: '/sdgs/quality_education.png',
  5: '/sdgs/gender_equality.png',
  6:  '/sdgs/clean_water.png',
  7: '/sdgs/clean_energy.png',
  8: '/sdgs/decent_work.png',
  9: '/sdgs/innovation.png',
  10: '/sdgs/reduced_inequalities.png',
  11: '/sdgs/sustainable_cities.png',
  12: '/sdgs/responsible_consumption.png',
  13: '/sdgs/climate_action.png',
  14: '/sdgs/life_below_water.png',
  15: '/sdgs/life_on_land.png',
  16: '/sdgs/peace_justice.png',
  17: '/sdgs/partnership.png',
};

export default function App() {
  const DONOR_EMAIL_KEY = 'gathergo_donor_email';
  const [step, setStep] = useState(0);
  const [eyeOpen, setEyeOpen] = useState(true);
  const [showText, setShowText] = useState(false);
  const [cursor, setCursor] = useState({ x: -999, y: -999 });
  const [selectedSdg, setSelectedSdg] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [partnerSource, setPartnerSource] = useState('unknown');
  const [donateOpen, setDonateOpen] = useState(false);
  const [donorEmail, setDonorEmail] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const { isMobile, isMedium, isSmall, width } = useBreakpoint();
  const heroHeightVh = isMobile ? 220 : isMedium ? 300 : 420;

  const scrollRef = useRef(null);
  const stickyRef = useRef(null);
  const audioCtx = useRef(null);
  const blinkTimer = useRef(null);
  const sec3Ref = useRef(null);
  const sec4Ref = useRef(null);
  const sec5Ref = useRef(null);
  const sec6Ref = useRef(null);
  const sec7Ref = useRef(null);

  const scrollToSection = (name) => {
    const el = scrollRef.current;
    if (!el) return;

    const targets = {
      Home: 0,
      'Our Goals': sec3Ref.current?.offsetTop,
      Partnerships: sec4Ref.current?.offsetTop,
      About: sec5Ref.current?.offsetTop,
      Roadmap: sec6Ref.current?.offsetTop,
      Waitlist: sec7Ref.current?.offsetTop,
    };

    const top = targets[name];
    if (top !== undefined) el.scrollTo({ top, behavior: 'smooth' });
  };

  const ICONS = useMemo(() => {
    const count = isMobile ? 18 : 34;
    return Array.from({ length: count }, (_, i) => ({
      ...SDGS[i % 17],
      id: i,
      x: Math.random() * 90 + 5,
      y: Math.random() * 90 + 5,
      size: Math.random() * 28 + 44,
      rotate: Math.random() * 20 - 10,
    }));
  }, [isMobile]);

  const initAudio = () => {
    if (!audioCtx.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioCtx.current = new Ctx();
    }
  };

  const playBlip = (freq = 440) => {
    if (!audioCtx.current) return;

    const osc = audioCtx.current.createOscillator();
    const g = audioCtx.current.createGain();
    osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
    g.gain.setValueAtTime(0.05, audioCtx.current.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.current.currentTime + 0.1);
    osc.connect(g);
    g.connect(audioCtx.current.destination);
    osc.start();
    osc.stop(audioCtx.current.currentTime + 0.1);
  };

  const openPartnerModal = (source) => {
    setPartnerSource(source);
    setPartnerOpen(true);
  };

  const startDonateFlow = (email = '') => {
    if (email) setDonorEmail(email);
    setSuccessOpen(true);
  };

  const openDonateDirect = () => {
    setDonateOpen(true);
  };

  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem(DONOR_EMAIL_KEY);
      if (savedEmail) setDonorEmail(savedEmail);
    } catch (err) {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    if (!successOpen) return undefined;
    const id = setTimeout(() => {
      setSuccessOpen(false);
      setDonateOpen(true);
    }, 900);
    return () => clearTimeout(id);
  }, [successOpen]);

  useEffect(() => {
    if (step > 1) {
      setEyeOpen(true);
      return undefined;
    }

    const runBlink = () => {
      setEyeOpen(false);
      blinkTimer.current = setTimeout(() => {
        setEyeOpen(true);
        blinkTimer.current = setTimeout(runBlink, 3000 + Math.random() * 3000);
      }, 500);
    };

    blinkTimer.current = setTimeout(runBlink, 2000);
    return () => clearTimeout(blinkTimer.current);
  }, [step]);

  useEffect(() => {
    const onMove = (e) => {
      initAudio();
      const rect = stickyRef.current?.getBoundingClientRect();
      if (rect) setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    Object.values(SDG_MODAL_ASSETS).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;

    const onScroll = () => {
      const heroScrollHeight = (heroHeightVh / 100) * window.innerHeight - window.innerHeight;
      const pct = Math.min(el.scrollTop / heroScrollHeight, 1);
      let s = 0;

      for (let i = THRESHOLDS.length - 1; i >= 0; i -= 1) {
        if (pct >= THRESHOLDS[i]) {
          s = i;
          break;
        }
      }

      setStep(s);
      setShowText(pct >= 0.6);
    };

    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [heroHeightVh]);

  const { rings, smiles, eyes = [] } = stages[step];
  const activeRings = step <= 1
    ? rings.map((r, i) => (i < 2 ? { ...r, r: eyeOpen ? 16 : 0, opacity: eyeOpen ? 1 : 0 } : r))
    : rings;

  const activeEyes = step <= 1 ? eyes.map((e) => ({ ...e, op: eyeOpen ? 0 : 1 })) : eyes;

  const getSmile = (s, i) => {
    if (step <= 1 && i === 0) return step === 0 ? { ...s, qy: 125 } : { ...s, qy: 172 };
    return s;
  };

  const svgW = isMobile ? Math.min(width - 32, 400) : 560;
  const svgH = svgW * (206 / 560);
  const torchGradient = `radial-gradient(circle ${TORCH_RADIUS}px at ${cursor.x}px ${cursor.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0) 100%)`;
  const NAV_ITEMS = ['Home', 'Our Goals', 'Partnerships', 'About', 'Roadmap'];

  return (
    <div ref={scrollRef} style={{ height: '100vh', overflowY: 'scroll', background: '#030A31', scrollBehavior: 'smooth' }}>
      <style>{`
        @keyframes bounce { 0%,100% { transform: translateY(0); opacity: 1; } 50% { transform: translateY(6px); opacity: 0.5; } }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ height: `${heroHeightVh}vh`, position: 'relative' }}>
        <div ref={stickyRef} style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: isMobile ? 20 : 32, overflow: 'hidden', cursor: isMobile ? 'auto' : 'none' }}>
          {!isMobile && (
            <nav style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', borderRadius: 50, padding: '12px 36px', display: 'flex', alignItems: 'center', gap: 36, opacity: showText ? 1 : 0, pointerEvents: showText ? 'auto' : 'none', transition: 'opacity 1s ease', zIndex: 20, whiteSpace: 'nowrap' }}>
              {NAV_ITEMS.map((item, i) => (
                <a key={item} onClick={() => scrollToSection(item)} style={{ color: i === 0 ? COLOR : '#fff', fontSize: 14, fontWeight: i === 0 ? 700 : 400, textDecoration: 'none', letterSpacing: 0.3, cursor: 'pointer' }}>{item}</a>
              ))}
            </nav>
          )}

          {isMobile && showText && (
            <button onClick={() => setMenuOpen((o) => !o)} style={{ position: 'absolute', top: 24, right: 20, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4, padding: 8, zIndex: 25 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 22, height: 2, background: COLOR, borderRadius: 2, transition: 'transform 0.3s, opacity 0.3s', transform: menuOpen ? (i === 0 ? 'rotate(45deg) translate(4px, 4px)' : i === 1 ? 'scaleX(0)' : 'rotate(-45deg) translate(4px, -4px)') : 'none', opacity: menuOpen && i === 1 ? 0 : 1 }} />
              ))}
            </button>
          )}

          {isMobile && menuOpen && showText && (
            <div style={{ position: 'absolute', top: 72, left: 16, right: 16, background: 'rgba(3,10,49,0.96)', backdropFilter: 'blur(16px)', borderRadius: 20, padding: '16px 0', zIndex: 30, border: '1px solid rgba(20,217,196,0.15)', animation: 'fadeSlide 0.25s ease' }}>
              {NAV_ITEMS.map((item, i) => (
                <a key={item} onClick={() => { scrollToSection(item); setMenuOpen(false); }} style={{ display: 'block', padding: '12px 24px', color: i === 0 ? COLOR : '#fff', fontSize: 15, fontWeight: i === 0 ? 700 : 400, textDecoration: 'none', cursor: 'pointer' }}>{item}</a>
              ))}
            </div>
          )}

          <div style={{ position: 'absolute', top: isMobile ? 24 : 28, left: isMobile ? 20 : 36, opacity: showText ? 1 : 0, transition: 'opacity 1s ease', zIndex: 20 }}>
            <img src="/ggologo.png" alt="GatherGo" style={{ width: isMobile ? 64 : 90, height: 'auto', display: 'block' }} />
          </div>

          <div style={{ position: 'absolute', inset: 0, WebkitMaskImage: torchGradient, maskImage: torchGradient, pointerEvents: 'none' }}>
            {ICONS.map((icon) => {
              const iconXpx = (icon.x / 100) * (stickyRef.current?.offsetWidth || 0);
              const iconYpx = (icon.y / 100) * (stickyRef.current?.offsetHeight || 0);
              const dx = cursor.x - iconXpx;
              const dy = cursor.y - iconYpx;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const isActive = dist < TORCH_RADIUS;
              const pull = isActive ? 12 : 0;

              return (
                <div key={`reveal-${icon.id}`} onClick={() => { playBlip(880); setSelectedSdg(icon); }} style={{ position: 'absolute', left: `${icon.x}%`, top: `${icon.y}%`, transform: `translate(calc(-50% + ${(dx / (dist || 1)) * pull}px), calc(-50% + ${(dy / (dist || 1)) * pull}px)) scale(${isActive ? 1.2 : 1})`, opacity: isActive ? 1 : 0, transition: 'transform 0.2s ease-out, opacity 0.4s ease', pointerEvents: isActive ? 'auto' : 'none', cursor: 'pointer', zIndex: 5 }}>
                  <SdgTile sdg={icon} />
                </div>
              );
            })}
          </div>

          <svg viewBox="0 0 600 220" width={svgW} height={svgH} style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>
            {activeEyes.map((e, i) => <path key={`eye-${i}`} d={e.d} stroke={COLOR} strokeWidth={7} strokeLinecap="round" fill="none" opacity={e.op} style={{ transition: 'opacity 0.5s ease' }} />)}
            {activeRings.map((r, i) => <circle key={`ring-${i}`} cx={r.cx} cy={r.cy} r={r.r} fill="none" stroke={COLOR} strokeWidth={r.sw} opacity={r.opacity} style={{ transition: SPRING }} />)}
            {smiles.map((s, i) => {
              const ds = getSmile(s, i);
              return <path key={`smile-${i}`} d={`M${ds.mx} ${ds.my} Q${ds.qx} ${ds.qy} ${ds.ex} ${ds.my}`} stroke={COLOR} strokeWidth={activeRings[i]?.sw ?? 7} strokeLinecap="round" fill="none" opacity={ds.opacity} style={{ transition: i === 2 ? 'opacity 0.6s ease, all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' : SPRING }} />;
            })}
          </svg>

          <div style={{ display: 'flex', gap: isMobile ? 12 : 20, flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', opacity: showText ? 1 : 0, pointerEvents: showText ? 'auto' : 'none', transform: showText ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 1s ease 0.3s, transform 1s ease 0.3s', zIndex: 2, width: isMobile ? '80%' : 'auto' }}>
            <button onClick={() => openPartnerModal('hero-partnership-cta')} style={{ padding: isMobile ? '13px 0' : '14px 36px', width: isMobile ? '100%' : 'auto', background: COLOR, border: 'none', borderRadius: 50, color: '#030A31', fontWeight: 700, fontSize: isMobile ? 14 : 15, cursor: 'pointer', letterSpacing: 0.5 }}>Partnership</button>
            <button onClick={() => scrollToSection('Waitlist')} style={{ padding: isMobile ? '13px 0' : '14px 36px', width: isMobile ? '100%' : 'auto', background: 'transparent', border: `2px solid ${COLOR}`, borderRadius: 50, color: '#fff', fontWeight: 600, fontSize: isMobile ? 14 : 15, cursor: 'pointer', letterSpacing: 0.5 }}>Join App Waitlist</button>
          </div>

          <p style={{ color: '#fff', fontSize: isMobile ? 16 : 22, fontWeight: 700, textAlign: 'center', padding: isMobile ? '0 24px' : 0, opacity: showText ? 1 : 0, transform: showText ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 1s ease, transform 1s ease', margin: 0, zIndex: 2 }}>Home For Impact Driven Events</p>

          {!isMobile && <div style={{ position: 'absolute', width: 12, height: 12, borderRadius: '50%', background: COLOR, left: cursor.x, top: cursor.y, transform: 'translate(-50%,-50%)', boxShadow: `0 0 15px ${COLOR}`, pointerEvents: 'none', zIndex: 100 }} />}

          <div style={{ position: 'absolute', bottom: isMobile ? 'calc(env(safe-area-inset-bottom, 0px) + 88px)' : 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: step === 0 ? 1 : 0, transition: 'opacity 0.5s ease', zIndex: 10 }}>
            <p style={{ color: COLOR, fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', margin: 0, fontWeight: 700 }}>Scroll to Smile</p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              {[0, 1, 2].map((i) => <div key={i} style={{ width: 2, height: 6, borderRadius: 2, background: COLOR, animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
            </div>
          </div>
        </div>
      </div>

      <div style={{ opacity: showText ? 1 : 0, pointerEvents: showText ? 'auto' : 'none', transform: showText ? 'translateY(0)' : 'translateY(150px)', transition: 'opacity 1.5s ease, transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)', zIndex: 50, position: 'relative' }}>
        <Section2 isMobile={isMobile} />
      </div>

      <div ref={sec3Ref} style={{ opacity: showText ? 1 : 0, pointerEvents: showText ? 'auto' : 'none', transition: 'opacity 1.5s ease 0.3s', position: 'relative', zIndex: 50 }}>
        <Section3 isSmall={isSmall} />
      </div>

      <div ref={sec4Ref} style={{ opacity: showText ? 1 : 0, pointerEvents: showText ? 'auto' : 'none', transition: 'opacity 1.5s ease 0.4s', position: 'relative', zIndex: 50 }}>
        <SectionPartnerships isMobile={isMobile} onPartner={() => openPartnerModal('section4-partnerships-cta')} />
      </div>

      <div style={{ opacity: showText ? 1 : 0, pointerEvents: showText ? 'auto' : 'none', transition: 'opacity 1.5s ease 0.45s', position: 'relative', zIndex: 50 }}>
        <Section4 isMobile={isMobile} onPartner={() => openPartnerModal('section5-project-card')} />
      </div> 

      <div ref={sec5Ref} style={{ opacity: showText ? 1 : 0, pointerEvents: showText ? 'auto' : 'none', transition: 'opacity 1.5s ease 0.5s', position: 'relative', zIndex: 50 }}>
        <Section5 isMobile={isMobile} isMedium={isMedium} scrollEl={scrollRef.current} />
      </div>

      <div ref={sec6Ref} style={{ opacity: showText ? 1 : 0, pointerEvents: showText ? 'auto' : 'none', transition: 'opacity 1.5s ease 0.6s', position: 'relative', zIndex: 50 }}>
        <Section6 isMobile={isMobile} onPartner={() => openPartnerModal('section6-roadmap-card')} />
      </div>

      <div ref={sec7Ref} style={{ opacity: showText ? 1 : 0, pointerEvents: showText ? 'auto' : 'none', transition: 'opacity 1.5s ease 0.7s', position: 'relative', zIndex: 50 }}>
        <Section7 isMobile={isMobile} onSubmissionSuccess={startDonateFlow} />
      </div>

      <div style={{ opacity: showText ? 1 : 0, pointerEvents: showText ? 'auto' : 'none', transition: 'opacity 1.5s ease 0.8s', position: 'relative', zIndex: 50 }}>
        <Footer
          isMobile={isMobile}
          onPartner={() => openPartnerModal('footer-partnership-link')}
          onWaitlistSuccess={startDonateFlow}
          onNavigate={scrollToSection}
        />
      </div>

      <button
        onClick={openDonateDirect}
        style={{
          position: 'fixed',
          right: isMobile ? 14 : 22,
          bottom: isMobile ? 16 : 24,
          zIndex: 180,
          border: 'none',
          borderRadius: 999,
          background: COLOR,
          color: '#0A1628',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: isMobile ? '10px 14px' : '12px 18px',
          fontWeight: 800,
          fontSize: isMobile ? 13 : 15,
          cursor: 'pointer',
          boxShadow: '0 10px 24px rgba(20,217,196,0.35)',
        }}
      >
        <span style={{ fontSize: isMobile ? 14 : 16, lineHeight: 1 }}>❤</span>
        <span>Give</span>
      </button>

      {partnerOpen && (
        <PartnershipModal
          source={partnerSource}
          onSubmitted={(email) => {
            setPartnerOpen(false);
            startDonateFlow(email);
          }}
          onClose={() => setPartnerOpen(false)}
        />
      )}

      {successOpen && <SubmissionSuccessModal />}
      {donateOpen && (
        <DonateModal
          donorEmail={donorEmail}
          onEmailUpdate={(email) => {
            setDonorEmail(email);
            try {
              localStorage.setItem(DONOR_EMAIL_KEY, email);
            } catch (err) {
              // ignore storage errors
            }
          }}
          onClose={() => setDonateOpen(false)}
        />
      )}

      {selectedSdg && (
        <div
          onClick={() => setSelectedSdg(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: `radial-gradient(circle at 50% 35%, ${selectedSdg.color}26 0%, transparent 45%), linear-gradient(160deg, rgba(4,10,35,0.96) 0%, rgba(9,18,52,0.92) 45%, rgba(4,10,35,0.96) 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            backdropFilter: 'blur(14px)',
            cursor: 'default',
            padding: 24,
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: selectedSdg.color, borderRadius: 30, width: isMobile ? 260 : 340, height: isMobile ? 260 : 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {SDG_MODAL_ASSETS[selectedSdg.n] ? (
              <div style={{ width: isMobile ? 180 : 240, height: isMobile ? 180 : 240, margin: '0 auto', borderRadius: 18, overflow: 'hidden' }}>
                <img src={SDG_MODAL_ASSETS[selectedSdg.n]} alt={selectedSdg.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            ) : (
              <div style={{ fontSize: isMobile ? 88 : 120, margin: 0 }}>{selectedSdg.symbol}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
