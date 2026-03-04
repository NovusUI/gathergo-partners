import React, { useEffect, useMemo, useState } from 'react';
import { COLOR } from '../constants';
import { isValidEmail } from '../lib/validators';

export default function DonateModal({ onClose, donorEmail, onEmailUpdate }) {
  const paystackUrl = import.meta.env.VITE_PAYSTACK_DONATION_URL;
  const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  const currency = import.meta.env.VITE_PAYSTACK_CURRENCY || 'NGN';
  const defaultAmountKobo = Number(import.meta.env.VITE_PAYSTACK_DONATION_AMOUNT_KOBO || 500000);
  const defaultAmountMajor = Number.isFinite(defaultAmountKobo) && defaultAmountKobo > 0 ? (defaultAmountKobo / 100).toFixed(2) : '5000';
  const [loadingSdk, setLoadingSdk] = useState(false);
  const [amount, setAmount] = useState(defaultAmountMajor);
  const [amountError, setAmountError] = useState('');
  const [emailInput, setEmailInput] = useState(donorEmail || '');
  const [emailError, setEmailError] = useState('');
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  useEffect(() => {
    setEmailInput(donorEmail || '');
  }, [donorEmail]);

  const activeEmail = (emailInput || '').trim();
  const hasValidEmail = isValidEmail(activeEmail);
  const canUseInline = Boolean(paystackPublicKey && hasValidEmail);
  const canDonate = canUseInline || Boolean(paystackUrl);

  const reference = useMemo(() => `gathergo_${Date.now()}`, []);

  useEffect(() => {
    if (!paystackPublicKey) return undefined;
    if (window.PaystackPop) return undefined;

    setLoadingSdk(true);
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setLoadingSdk(false);
    script.onerror = () => setLoadingSdk(false);
    document.body.appendChild(script);

    return () => {};
  }, [paystackPublicKey]);

  const handleDonate = () => {
    if (!hasValidEmail) {
      setEmailError('Enter a valid email to continue.');
      return;
    }
    if (onEmailUpdate) onEmailUpdate(activeEmail);

    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setAmountError('Enter a valid donation amount.');
      return;
    }
    const amountKobo = Math.round(parsed * 100);
    if (amountKobo < 100) {
      setAmountError('Minimum donation is 1.00');
      return;
    }

    setAmountError('');

    if (canUseInline && window.PaystackPop) {
      const handler = window.PaystackPop.setup({
        key: paystackPublicKey,
        email: activeEmail,
        amount: amountKobo,
        currency,
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: 'Platform',
              variable_name: 'platform',
              value: 'gathergo-web',
            },
          ],
        },
        callback: () => {
          onClose();
        },
      });
      handler.openIframe();
      return;
    }

    if (paystackUrl) window.open(paystackUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(10,22,40,0.55)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? 10 : 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#EAEAEA', border: `1.5px solid ${COLOR}`, borderRadius: isMobile ? 24 : 40, width: '100%', maxWidth: 680, maxHeight: '92dvh', overflowY: 'auto', padding: isMobile ? '22px 16px 16px' : '46px 42px 24px', boxSizing: 'border-box' }}>
        <h2 style={{ margin: '0 0 6px', color: '#0B1445', fontWeight: 800, fontSize: 'clamp(30px, 8vw, 48px)', lineHeight: 1.05 }}>Donate To GatherGo</h2>
        <p style={{ margin: '0 0 16px', color: COLOR, fontWeight: 700, fontSize: 'clamp(24px, 7vw, 42px)', lineHeight: 1.05 }}>Back Gathergo</p>

        <p style={{ margin: '0 0 14px', color: '#111', fontSize: isMobile ? 15 : 17, lineHeight: 1.45 }}>GatherGo Is Building The Future Of Community Impact And We’re Doing It Independently.</p>
        <p style={{ margin: '0 0 14px', color: '#111', fontSize: isMobile ? 15 : 17, lineHeight: 1.45 }}>No Big Investors. No Outside Funding. Just Vision, Execution, And Belief.</p>
        <p style={{ margin: '0 0 18px', color: '#111', fontSize: isMobile ? 15 : 17, lineHeight: 1.45 }}>If You Believe Communities Deserve Better Tools To Connect And Create Change, Support The Mission. Your Contribution Helps Us Build Faster, Scale Smarter, And Reach More People. This Is Bigger Than An App. It’s A Movement.</p>

        <div style={{ marginBottom: 14 }}>
          <label htmlFor="donation-email" style={{ display: 'block', marginBottom: 8, color: '#0B1445', fontWeight: 700, fontSize: 15 }}>
            Email
          </label>
          <input
            id="donation-email"
            type="email"
            value={emailInput}
            onChange={(e) => {
              setEmailInput(e.target.value);
              if (emailError) setEmailError('');
            }}
            placeholder="Enter your email"
            style={{ width: '100%', height: 52, borderRadius: 14, border: emailError ? '1px solid #B42318' : '1px solid rgba(10,22,40,0.2)', background: '#fff', padding: '0 14px', fontSize: 16, outline: 'none', boxSizing: 'border-box' }}
          />
          {!!emailError && <p style={{ margin: '8px 2px 0', color: '#B42318', fontSize: 12, fontWeight: 600 }}>{emailError}</p>}
        </div>

        <div style={{ marginBottom: 18 }}>
          <label htmlFor="donation-amount" style={{ display: 'block', marginBottom: 8, color: '#0B1445', fontWeight: 700, fontSize: 15 }}>
            Donation Amount ({currency})
          </label>
          <input
            id="donation-amount"
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (amountError) setAmountError('');
            }}
            placeholder="Enter amount"
            style={{ width: '100%', height: 52, borderRadius: 14, border: amountError ? '1px solid #B42318' : '1px solid rgba(10,22,40,0.2)', background: '#fff', padding: '0 14px', fontSize: 16, outline: 'none', boxSizing: 'border-box' }}
          />
          {!!amountError && <p style={{ margin: '8px 2px 0', color: '#B42318', fontSize: 12, fontWeight: 600 }}>{amountError}</p>}
        </div>

        <div style={{ position: 'sticky', bottom: -1, background: 'linear-gradient(to top, #EAEAEA 75%, rgba(234,234,234,0.75) 100%)', paddingTop: 10, marginTop: 8 }}>
          <button
            onClick={handleDonate}
            disabled={!canDonate || loadingSdk}
            style={{ width: '100%', height: isMobile ? 56 : 68, borderRadius: isMobile ? 16 : 24, border: 'none', background: COLOR, color: '#0B1445', fontWeight: 800, fontSize: isMobile ? 28 : 44, lineHeight: 1, cursor: canDonate && !loadingSdk ? 'pointer' : 'not-allowed', opacity: canDonate && !loadingSdk ? 1 : 0.65 }}
          >
            {loadingSdk ? 'Loading...' : 'Donate'}
          </button>
        </div>

        {!canDonate && (
          <p style={{ margin: '14px 4px 0', color: '#B42318', fontSize: 12, fontWeight: 600 }}>
            Add a valid email
          </p>
        )}
      </div>
    </div>
  );
}
