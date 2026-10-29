import React, { useState } from 'react';
import { useResource } from './useResource';
import { AppActions, eventDate, money, ResourceState, Sheet } from './components';
import { EmailGate } from './WebSession';
import Participation from './Participation';

const TITLES = { tickets: 'Choose your tickets', registration: 'Register for this event', donation: 'Support this event', volunteer: 'Give your time' };

export default function EventPage({ id, mode, config }) {
  const resource = useResource(`/public/events/${encodeURIComponent(id)}`);
  const [action, setAction] = useState(null);
  return <ResourceState resource={resource}>{(event) => {
    const ended = new Date(event.endDate) <= new Date();
    const recruiting = new Date(event.startDate) > new Date();
    const foodBank = event.registrationType === 'foodbank';
    if (mode === 'meals' && !foodBank) return <div className="web-state"><h1>This event is not a food bank</h1><a href={`/event/${event.id}`}>View event details</a></div>;
    return <>
      <div className="web-event-grid"><article>
        <div className="web-event-cover">{event.imageUrl ? <img src={event.imageUrl} alt={event.title} /> : <div className="web-cover-art"><img src="/mascot/gogo-wave.svg" alt="" /><span>Good things happen<br />when we gather.</span></div>}</div>
        <p className="web-eyebrow">{mode === 'meals' ? 'Meal collection' : mode === 'live' ? 'Live event' : event.registrationType === 'volunteer' ? 'Volunteer & give' : 'Gather with purpose'}</p>
        <h1>{event.title}</h1>
        <p className="web-organiser">Hosted by {event.creator.fullName ?? event.creator.username ?? 'a GatherGo organiser'}</p>
        <div className="web-event-facts"><p><span>When</span>{eventDate(event.startDate, event.foodBankTimeZone)}<small>Until {eventDate(event.endDate, event.foodBankTimeZone)} · {event.foodBankTimeZone}</small></p><p><span>Where</span>{event.isPhysicalEvent ? event.location : 'Online event'}</p></div>
        {event.description && <section className="web-content-section"><h2>About this event</h2><p className="web-preserve-lines">{event.description}</p></section>}
        {event.impactTitle && <section className="web-impact"><p className="web-eyebrow">The impact behind it</p><h2>{event.impactTitle}</h2>{event.impactDescription && <p>{event.impactDescription}</p>}</section>}
        {event.registrationType === 'volunteer' && <section className="web-content-section"><h2>A place for your skills</h2>{event.volunteerRoles.map((role) => <div className="web-role" key={role.id}><h3>{role.title}</h3><p>{role.description}</p><small>{role.isOpen ? `${Math.max(0, role.capacity - role._count.applications)} places available` : 'Recruitment closed'} · {role.requiresApproval ? 'Organiser approval required' : 'Join directly'}</small></div>)}</section>}
        {event.links.length > 0 && <section className="web-content-section"><h2>Useful links</h2><div className="web-useful-links">{event.links.map((link) => <a href={link} key={link} target="_blank" rel="noopener noreferrer">{new URL(link).hostname} ↗</a>)}</div></section>}
      </article>
      <aside className="web-event-sidebar">
        {mode === 'live' ? <AppActions path={`/event/${event.id}?openFeed=1`} config={config} title="Live happens in GatherGo"><p>Follow the live feed and join the event conversation in the app. You can get your ticket or register here first.</p></AppActions> : null}
        {foodBank && <div className="web-action-card"><p className="web-eyebrow">Meal collection</p><h2>A meal, with dignity.</h2><p>Claim and manage your meal pass in GatherGo. One pass per account for this food bank. No donation is required.</p><p className="web-collection-status">Collection: {event.collectionAvailability.replaceAll('_', ' ')}</p><AppActions path={`/food-bank/${event.id}`} config={config} title="Collect with GatherGo" /><a className="web-text-link" href={mode === 'meals' ? `/event/${event.id}` : `/food-bank/${event.id}`}>{mode === 'meals' ? 'Full event details' : 'View collection page'} →</a></div>}
        {event.registrationType === 'ticket' && <div className="web-action-card"><p className="web-eyebrow">Be part of it</p><h2>Your place starts here.</h2><p>Choose your tickets and receive your passes by email. Event Live and carpool participation continue in the app.</p><button className="web-button" disabled={ended || event.eventTickets.length === 0} onClick={() => setAction('tickets')}>{ended ? 'Event ended' : event.eventTickets.length === 0 ? 'Tickets not available' : 'Get tickets'}</button></div>}
        {event.registrationType === 'registration' && <div className="web-action-card"><p className="web-eyebrow">Make it a date</p><h2>{event.registrationFee === 0 ? 'Free registration' : money(event.registrationFee)}</h2><p>Register with your email. Follow event Live and updates in GatherGo.</p><button className="web-button" disabled={ended} onClick={() => setAction('registration')}>{ended ? 'Event ended' : 'Register for event'}</button></div>}
        {event.registrationType === 'volunteer' && <div className="web-action-card"><p className="web-eyebrow">Give your time</p><h2>Show up for something good.</h2><p>Apply with your name and email. Track your application and follow the event in the app.</p><button className="web-button" disabled={!recruiting} onClick={() => setAction('volunteer')}>{recruiting ? 'Volunteer for this event' : 'Recruitment closed'}</button></div>}
        {event.donationsEnabled && <div className="web-action-card donation"><p className="web-eyebrow">Every bit of support matters</p><h2>{foodBank ? 'Help keep this food bank going.' : 'Support the purpose.'}</h2><p>{foodBank ? 'A web donation receives a donation receipt. It does not issue or reserve a meal pass.' : 'Donate securely with Paystack and receive your donation receipt.'}</p><button className="web-button" disabled={ended} onClick={() => setAction('donation')}>{ended ? 'Donations closed' : 'Make a donation'}</button></div>}
        {!foodBank && mode !== 'live' && <AppActions path={`/event/${event.id}?openFeed=1`} config={config} title="There’s more in GatherGo"><p>Join event Live, coordinate a carpool, and keep your activity together.</p></AppActions>}
      </aside></div>
      {action && <Sheet title={TITLES[action]} onClose={() => setAction(null)}><EmailGate><Participation event={event} action={action} config={config} /></EmailGate></Sheet>}
    </>;
  }}</ResourceState>;
}
