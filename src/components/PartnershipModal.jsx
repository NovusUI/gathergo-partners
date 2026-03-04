import React, { useState } from 'react';
import { submitPartnership } from '../lib/googleForms';
import { isValidEmail } from '../lib/validators';
import { useBreakpoint } from '../hooks/useBreakpoint';


const TYPES = [
  'Community Project',
  'Environmental',
  'Creative / Cultural',
  'Youth Development',
  'Charity / Social Good',
  'Health & Wellness',
];

export default function PartnershipModal({ onClose, onSubmitted, source = 'partnership-modal' }) {
  const [form, setForm] = useState({ name: '', org: '', email: '', other: '' });
  const [checked, setChecked] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({ name: false, email: false });
  const { isMobile } = useBreakpoint();

  const toggle = (type) => setChecked((c) => ({ ...c, [type]: !c[type] }));
  const onChange = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (error) setError('');
  };

  const nameMissing = !form.name.trim();
  const emailMissing = !form.email.trim();
  const emailInvalid = !!form.email.trim() && !isValidEmail(form.email.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (nameMissing || emailMissing || emailInvalid) {
      setTouched({ name: true, email: true });
      setError(emailInvalid ? 'Enter a valid email address.' : 'Please fill in all required fields.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const selectedTypes = Object.keys(checked).filter((k) => checked[k]);
      await submitPartnership({
        name: form.name.trim(),
        org: form.org.trim(),
        email: form.email.trim(),
        types: selectedTypes,
        other: form.other.trim(),
        source,
      });
      setSubmitted(true);
      if (onSubmitted) onSubmitted(form.email.trim());
    } catch (err) {
      setError('Unable to submit right now. Please try again shortly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(10,22,40,0.55)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 'max(12px, env(safe-area-inset-top)) 12px max(16px, env(safe-area-inset-bottom))',
        overflow: 'hidden',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#f0f2ff',
          borderRadius: 24,
          width: 'min(560px, 100%)',
          maxHeight: 'calc(100dvh - 24px)',
          overflowY: 'auto',
          padding: 'clamp(24px, 4vw, 40px) clamp(16px, 4vw, 36px) calc(20px + env(safe-area-inset-bottom))',
          position: 'relative',
          boxShadow: '0 32px 80px rgba(10,22,40,0.25)',
          marginTop: 8,
        }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer', background: '#0A1628', color: '#fff', fontSize: 16, lineHeight: 1 }}>×</button>

        <div style={{ height: isMobile ? 60 : 120, borderRadius: 16, marginBottom: 22, background: 'radial-gradient(circle at 15% 35%, rgba(20,217,196,0.18) 0%, transparent 35%), radial-gradient(circle at 80% 60%, rgba(10,22,40,0.15) 0%, transparent 40%), #e6ebff', border: '1px solid rgba(10,22,40,0.08)' }} />

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <h3 style={{ margin: '0 0 8px', color: '#0A1628', fontSize: 24, fontWeight: 800 }}>Partner With GatherGo</h3>
            <p style={{ margin: '0 0 20px', color: '#42506a', fontSize: 14, lineHeight: 1.7 }}>Tell us about your project and we will reach out for collaboration.</p>
            {!!error && (
              <div style={{ marginBottom: 14, background: '#FEE4E2', color: '#B42318', border: '1px solid #FDA29B', borderRadius: 10, padding: '10px 12px', fontSize: 12, fontWeight: 600 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
              <div>
                <input value={form.name} onChange={(e) => onChange('name', e.target.value)} onBlur={() => setTouched((t) => ({ ...t, name: true }))} placeholder="Your Name *" style={{ width: '100%', height: 44, borderRadius: 12, border: touched.name && nameMissing ? '1px solid #b42318' : '1px solid #d6dcef', padding: '0 14px', fontSize: 14, outline: 'none' }} />
                {touched.name && nameMissing && <p style={{ margin: '6px 2px 0', color: '#b42318', fontSize: 12 }}>Name is required.</p>}
              </div>
              <input value={form.org} onChange={(e) => onChange('org', e.target.value)} placeholder="Organization" style={{ height: 44, borderRadius: 12, border: '1px solid #d6dcef', padding: '0 14px', fontSize: 14, outline: 'none' }} />
              <div>
                <input type="email" value={form.email} onChange={(e) => onChange('email', e.target.value)} onBlur={() => setTouched((t) => ({ ...t, email: true }))} placeholder="Email *" style={{ width: '100%', height: 44, borderRadius: 12, border: touched.email && (emailMissing || emailInvalid) ? '1px solid #b42318' : '1px solid #d6dcef', padding: '0 14px', fontSize: 14, outline: 'none' }} />
                {touched.email && emailMissing && <p style={{ margin: '6px 2px 0', color: '#b42318', fontSize: 12 }}>Email is required.</p>}
                {touched.email && !emailMissing && emailInvalid && <p style={{ margin: '6px 2px 0', color: '#b42318', fontSize: 12 }}>Enter a valid email address.</p>}
              </div>
            </div>

            <p style={{ margin: '0 0 8px', color: '#0A1628', fontWeight: 700, fontSize: 13 }}>Project Type</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {TYPES.map((type) => (
                <button key={type} type="button" onClick={() => toggle(type)} style={{ border: checked[type] ? '1px solid #0A1628' : '1px solid #cad1e6', background: checked[type] ? '#0A1628' : '#fff', color: checked[type] ? '#fff' : '#33415e', borderRadius: 999, padding: '8px 12px', fontSize: 12, cursor: 'pointer' }}>
                  {type}
                </button>
              ))}
            </div>

            <textarea value={form.other} onChange={(e) => onChange('other', e.target.value)} rows={4} placeholder="Anything else you'd like us to know?" style={{ width: '100%', borderRadius: 12, border: '1px solid #d6dcef', padding: 12, resize: 'vertical', fontSize: 14, outline: 'none', marginBottom: 16 }} />

            <button type="submit" disabled={submitting} style={{ background: '#0A1628', color: '#fff', border: 'none', borderRadius: 50, padding: '12px 22px', fontWeight: 700, fontSize: 13, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.75 : 1, letterSpacing: 0.3, fontFamily: 'inherit' }}>
              {submitting ? 'Submitting...' : 'Submit Partnership Request'}
            </button>
          </form>
        ) : (
          <div>
            <h3 style={{ margin: '0 0 10px', color: '#0A1628', fontSize: 24, fontWeight: 800 }}>Request Received</h3>
            <p style={{ margin: 0, color: '#42506a', fontSize: 14, lineHeight: 1.7 }}>Thanks for reaching out. Our team will contact you soon with next steps.</p>
          </div>
        )}
      </div>
    </div>
  );
}
