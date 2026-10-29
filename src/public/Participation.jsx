import React, { useRef, useState } from 'react';
import { request } from './api';
import { AppActions, money, VerifiedEmail } from './components';
import { useWebSession } from './WebSession';

export default function Participation({ event, action, config }) {
  const { session, clear } = useWebSession();
  const [quantities, setQuantities] = useState({});
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [fullName, setFullName] = useState(session.fullName ?? '');
  const [roleId, setRoleId] = useState('');
  const [application, setApplication] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const key = useRef({ signature: null, value: null });
  const totalQuantity = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0);
  const submit = async (formEvent) => {
    formEvent.preventDefault(); setBusy(true); setError(null);
    let path; let body;
    if (action === 'tickets') {
      path = '/public/tickets';
      body = { items: event.eventTickets.filter((ticket) => quantities[ticket.id] > 0).map((ticket) => ({ id: ticket.id, quantity: quantities[ticket.id], ticketName: ticket.type })) };
      if (totalQuantity < 1 || totalQuantity > event.maxTicketsPerCheckout) { setError(new Error(`Choose between 1 and ${event.maxTicketsPerCheckout} tickets.`)); setBusy(false); return; }
    } else if (action === 'registration') { path = `/public/events/${event.id}/registration`; }
    else if (action === 'donation') { path = '/public/donations'; body = { eventId: event.id, amount: Number(amount), message, isAnonymous: anonymous, ...(event.registrationType === 'foodbank' ? { source: 'FOOD_BANK' } : {}) }; }
    else { path = `/public/events/${event.id}/volunteer-roles/${roleId}/apply`; body = { fullName, note: message }; }
    const signature = JSON.stringify({ path, body });
    if (key.current.signature !== signature) key.current = { signature, value: crypto.randomUUID() };
    try {
      const result = await request(path, { method: 'POST', body, key: key.current.value });
      if (action === 'volunteer') setApplication(result);
      else window.location.assign(`/checkout/${result.transactionId}`);
    } catch (failure) { setError(failure); }
    finally { setBusy(false); }
  };
  if (application) return <div className="web-confirmation" role="status"><span className="web-success-mark">✓</span><h3>{application.status === 'ACCEPTED' ? 'Your volunteer place is confirmed' : 'Your application has been submitted'}</h3><p>{application.status === 'ACCEPTED' ? 'You have joined this role.' : 'The organiser will review your application.'} Use {session.email} in GatherGo to follow your application and event updates.</p><AppActions path={`/event/${event.id}`} config={config} title="Follow the event in GatherGo" /></div>;
  return <form className="web-participation" onSubmit={submit}>
    <VerifiedEmail />
    {action === 'tickets' && <><p>Choose up to {event.maxTicketsPerCheckout} tickets. Prices below exclude checkout fees.</p><div className="web-ticket-options">{event.eventTickets.map((ticket) => <label className="web-ticket-option" key={ticket.id}><span><strong>{ticket.type}</strong><small>{ticket.description}</small><b>{money(ticket.updatedPrice ?? ticket.price)}</b>{ticket.perks.length > 0 && <small>{ticket.perks.join(' · ')}</small>}</span><input aria-label={`${ticket.type} quantity`} type="number" min="0" max={Math.min(event.maxTicketsPerCheckout, ticket.quantity - ticket.sold)} value={quantities[ticket.id] ?? 0} onChange={(change) => setQuantities({ ...quantities, [ticket.id]: Number(change.target.value) })} /></label>)}</div></>}
    {action === 'registration' && <p>{event.registrationFee === 0 ? 'Registration is free.' : `Registration is ${money(event.registrationFee)} before checkout fees.`} One active registration per person and event.</p>}
    {action === 'donation' && <><p>{event.registrationType === 'foodbank' ? 'Your web donation supports this food bank and receives a donation receipt. It does not reserve or issue a meal pass. Meals can be claimed in GatherGo without donating.' : 'Support this event with a donation. Your receipt will be available after payment is confirmed.'}</p><label>Donation amount (NGN)<input required type="number" min="500" step="0.01" value={amount} onChange={(change) => setAmount(change.target.value)} placeholder="Minimum ₦500" /></label><label className="web-checkbox"><input type="checkbox" checked={anonymous} onChange={(change) => setAnonymous(change.target.checked)} />Keep my donation anonymous publicly</label></>}
    {action === 'volunteer' && <><label>Your full name<input required autoComplete="name" maxLength="120" value={fullName} onChange={(change) => setFullName(change.target.value)} /></label><label>Volunteer role<select required value={roleId} onChange={(change) => setRoleId(change.target.value)}><option value="">Choose a role</option>{event.volunteerRoles.map((role) => <option key={role.id} value={role.id} disabled={!role.isOpen || role._count.applications >= role.capacity}>{role.title}{!role.isOpen ? ' — closed' : role._count.applications >= role.capacity ? ' — full' : ''}</option>)}</select></label>{roleId && <p>{event.volunteerRoles.find((role) => role.id === roleId).description}</p>}</>}
    {(action === 'donation' || action === 'volunteer') && <label>{action === 'volunteer' ? 'Application note (optional)' : 'Message (optional)'}<textarea maxLength={action === 'volunteer' ? 1000 : 500} value={message} onChange={(change) => setMessage(change.target.value)} rows="3" /></label>}
    {error && <div className="web-error" role="alert"><p>{error.message}</p>{error.transactionId && <a href={`/checkout/${error.transactionId}`}>Open your existing checkout</a>}{error.status === 401 && <button type="button" className="web-text-button" onClick={clear}>Verify your email again</button>}</div>}
    <button className="web-button" disabled={busy || (action === 'tickets' && totalQuantity === 0)}>{busy ? 'Please wait…' : action === 'volunteer' ? 'Submit application' : 'Continue'}</button>
    <p className="web-fine-print">{session.existingAccount ? 'Your activity belongs to your existing GatherGo account.' : 'Sign up in GatherGo with this same email to keep your tickets, registrations, donations and applications together.'}</p>
  </form>;
}
