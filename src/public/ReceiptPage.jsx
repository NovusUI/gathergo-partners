import React, { useState } from 'react';
import { request } from './api';
import { useResource } from './useResource';
import { AppActions, money, ResourceState, VerifiedEmail } from './components';
import { EmailGate, useWebSession } from './WebSession';

const pending = (receipt) => ['PENDING', 'AWAITING_TRANSFER'].includes(receipt.status);
const STATUS_TEXT = {
  PENDING: 'Waiting for payment', AWAITING_TRANSFER: 'Waiting for payment', EXPIRED: 'Checkout expired',
  FAILED: 'Payment not completed', REFUND_REQUIRED: 'Your payment needs a refund', REFUNDED: 'Payment refunded',
};

function PassCard({ pass, title }) {
  return <div className="web-pass"><h3>{title}</h3><img src={pass.qrImage} alt={`QR code for ${title}`} width="256" height="256" /><p>{pass.isUsed ? 'Already checked in' : 'Present this QR code at check-in'}</p><small>{pass.id}</small><a className="web-text-link" href={pass.qrImage} download={`GatherGo-${pass.id}.png`}>Save QR image ↓</a></div>;
}

function Receipt({ id, config }) {
  const { session, clear } = useWebSession();
  const resource = useResource(`/public/checkouts/${encodeURIComponent(id)}`, { pollWhile: pending });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const cancel = async () => {
    setBusy(true); setError(null);
    try { await request(`/public/checkouts/${id}/cancel`, { method: 'POST' }); resource.refresh(); }
    catch (failure) { setError(failure); }
    finally { setBusy(false); }
  };
  if (resource.error?.status === 401) return <div className="web-state"><p>Your email session expired.</p><button className="web-button" onClick={clear}>Verify email again</button></div>;
  return <ResourceState resource={resource}>{(receipt) => {
    const donation = receipt.paymentType === 'DONATION';
    const foodBank = receipt.event?.registrationType === 'foodbank';
    const success = receipt.status === 'SUCCESS';
    return <div className="web-receipt"><p className="web-eyebrow">{donation ? 'Donation receipt' : 'Your event confirmation'}</p><span className={`web-success-mark ${success ? '' : 'pending'}`}>{success ? '✓' : '…'}</span>
      <h1>{success ? donation ? 'Thank you for giving.' : 'You’re part of it.' : STATUS_TEXT[receipt.status]}</h1>
      <VerifiedEmail />
      {receipt.event && <h2>{receipt.event.title}</h2>}
      <dl className="web-price-breakdown"><div><dt>{donation ? 'Donation' : receipt.paymentType === 'REGISTRATION' ? 'Registration' : 'Tickets'}</dt><dd>{money(receipt.baseAmount / 100)}</dd></div><div><dt>Checkout fees</dt><dd>{money((receipt.amount - receipt.baseAmount) / 100)}</dd></div><div className="web-price-total"><dt>{success ? 'Total paid' : 'Total to pay'}</dt><dd>{money(receipt.amount / 100)}</dd></div></dl>
      <p>{success ? donation ? `Your donation is confirmed.${foodBank ? ' This receipt is not a meal pass.' : ''}` : 'Your passes are ready below. A confirmation email is also queued for delivery.' : pending(receipt) ? 'We’re checking your payment before issuing your confirmation. This page updates automatically.' : receipt.status === 'REFUND_REQUIRED' ? 'Your payment was received, but a pass could not be issued. The organiser can help you follow up on the refund.' : 'No new pass has been issued from this checkout.'}</p>
      <p className="web-fine-print">Reference: {receipt.id}</p>
      {!success && <div className="web-inline-actions">{pending(receipt) && receipt.paymentUrl && <a className="web-button" href={receipt.paymentUrl}>Pay securely with Paystack</a>}<button className="web-button secondary" onClick={resource.refresh}>Check payment status</button>{pending(receipt) && !donation && <button className="web-text-button" disabled={busy} onClick={cancel}>{busy ? 'Cancelling…' : 'Cancel checkout'}</button>}</div>}
      {error && <p className="web-error" role="alert">{error.message}</p>}
      <div className="web-passes">{receipt.tickets.map((pass) => <PassCard key={pass.id} pass={pass} title={pass.eventTicket.type} />)}{receipt.registrations.map((pass) => <PassCard key={pass.id} pass={pass} title="Event registration" />)}</div>
      {receipt.event && <><AppActions path={foodBank ? `/food-bank/${receipt.event.id}` : `/event/${receipt.event.id}?openFeed=1`} config={config} title={foodBank ? 'Collect a meal in GatherGo' : donation ? 'Follow the impact in GatherGo' : 'Your next event moments are in GatherGo'}><p>{session.existingAccount ? 'Sign in to your existing GatherGo account to see this activity.' : `Sign up in GatherGo with ${session.email} to keep this activity with your account.`} {foodBank ? 'Meal claims are free and don’t require a donation. Claim your pass in the app while collection places remain available.' : 'Event Live and carpool participation take place in the app.'}</p></AppActions><a className="web-text-link" href={`/event/${receipt.event.id}`}>Back to event →</a></>}
    </div>;
  }}</ResourceState>;
}

export default function ReceiptPage(props) {
  return <div className="web-receipt-shell"><EmailGate><Receipt {...props} /></EmailGate></div>;
}
