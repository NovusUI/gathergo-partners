import React, { useEffect, useRef, useState } from 'react';
import { COLOR } from '../constants';
import { submitWaitlist } from '../lib/googleForms';
import { isValidEmail } from '../lib/validators';

export default function Footer({
  isMobile,
  onPartner,
  onWaitlistSuccess,
  onNavigate,
}) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [cursor, setFooterCursor] = useState({ x: -1, y: -1 });
  const ref = useRef(null);

  const handleSubmit = async () => {
    if (submitting) return;
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Email is required.');
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await submitWaitlist({ email: cleanEmail, source: 'footer' });
      setSubmitted(true);
      if (onWaitlistSuccess) onWaitlistSuccess(cleanEmail);
    } catch (err) {
      setError('Unable to submit right now. Please try again shortly.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      setFooterCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    const onLeave = () => setFooterCursor({ x: -1, y: -1 });

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const blush = cursor.x >= 0
    ? `radial-gradient(ellipse 380px 280px at ${cursor.x}px ${cursor.y}px, rgba(61,218,190,0.13) 0%, transparent 100%)`
    : 'none';

  const NAV = [
    {
      heading: 'Products',
      links: [
        { label: 'Features', action: () => onNavigate?.('Our Goals') },
        { label: 'Integrations', action: () => onNavigate?.('Roadmap') },
      ],
    },
    {
      heading: 'Partnerships',
      links: [
        { label: 'Our Partners', action: () => onNavigate?.('Partnerships') },
        { label: 'Become A Partner', action: () => onPartner?.() },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About', action: () => onNavigate?.('About') },
        { label: 'Contact', action: () => onNavigate?.('Waitlist') },
      ],
    },
  ];

  return (
    <footer ref={ref} style={{ background: '#07122B', position: 'relative', overflow: 'hidden', padding: isMobile ? '60px 24px 48px' : '80px 80px 60px', cursor: 'auto' }}>
      {cursor.x >= 0 && <div style={{ position: 'absolute', inset: 0, background: blush, pointerEvents: 'none', zIndex: 0, transition: 'background 0.1s ease' }} />}

      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 48 : 0, justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ maxWidth: 400 }}>
          <img src="/ggologo.png" alt="GatherGo" style={{ width: 140, height: 'auto', marginBottom: 24, display: 'block' }} />

          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.8, margin: '0 0 32px' }}>Join Our Waitlist And Be Part Of The First People To Be Notified Once Our App Is Ready.</p>

          {submitted ? (
            <div style={{ background: 'rgba(61,218,190,0.12)', border: `1px solid ${COLOR}`, borderRadius: 50, padding: '13px 24px', color: COLOR, fontSize: 14, fontWeight: 600, display: 'inline-block' }}>✓ You're on the list!</div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.07)', borderRadius: 50, padding: '5px 5px 5px 20px', maxWidth: 360, border: '1px solid rgba(255,255,255,0.1)' }}>
                <input type="email" placeholder="Your Email" value={email} onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} style={{ flex: 1, border: 'none', background: 'transparent', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
                <button onClick={handleSubmit} disabled={submitting} style={{ background: COLOR, color: '#07122B', border: 'none', borderRadius: 50, padding: '12px 26px', fontWeight: 700, fontSize: 14, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, letterSpacing: 0.3, whiteSpace: 'nowrap', fontFamily: 'inherit' }}>{submitting ? 'Submitting...' : 'Submit'}</button>
              </div>
              {!!error && <p style={{ margin: '10px 0 0', color: '#ffb4b4', fontSize: 12 }}>{error}</p>}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: isMobile ? 40 : 80, flexWrap: 'wrap' }}>
          {NAV.map((col) => (
            <div key={col.heading}>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: 16, margin: '0 0 20px' }}>{col.heading}</p>
              {col.links.map((link) => (
                <p key={link.label} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 14px', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => { e.target.style.color = COLOR; }} onMouseLeave={(e) => { e.target.style.color = 'rgba(255,255,255,0.5)'; }} onClick={link.action}>
                  {link.label}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
