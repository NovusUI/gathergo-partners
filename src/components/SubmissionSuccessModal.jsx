import React from 'react';
import { COLOR } from '../constants';

export default function SubmissionSuccessModal() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 450, background: 'rgba(10,22,40,0.45)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 20, padding: '26px 22px', textAlign: 'center', boxShadow: '0 20px 60px rgba(10,22,40,0.2)' }}>
        <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'rgba(20,217,196,0.15)', color: COLOR, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 800 }}>✓</div>
        <h3 style={{ margin: '0 0 8px', color: '#0A1628', fontSize: 22, fontWeight: 800 }}>Submission Received</h3>
        <p style={{ margin: 0, color: '#4a5568', fontSize: 14, lineHeight: 1.6 }}>Thank you. One more thing before you go.</p>
      </div>
    </div>
  );
}
