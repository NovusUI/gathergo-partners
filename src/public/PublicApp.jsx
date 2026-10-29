import React, { useEffect } from 'react';
import { useResource } from './useResource';
import { AppActions, ResourceState } from './components';
import { WebSessionProvider } from './WebSession';
import EventPage from './EventPage';
import ReceiptPage from './ReceiptPage';
import './public.css';

export function parsePublicRoute(path) {
  const match = /^\/(event|food-bank|carpool|checkout|s)\/([A-Za-z0-9_-]+)(\/live)?\/?$/.exec(path);
  if (!match || (match[3] && match[1] !== 'event')) return null;
  return { kind: match[1], id: match[2], mode: match[3] ? 'live' : match[1] === 'food-bank' ? 'meals' : 'event' };
}

function SharedLink({ code }) {
  const resource = useResource(`/share-links/${encodeURIComponent(code)}`);
  useEffect(() => {
    if (!resource.data) return;
    const paths = { event: '/event', foodbank: '/food-bank', carpool: '/carpool' };
    window.location.replace(`${paths[resource.data.kind]}/${encodeURIComponent(resource.data.targetId)}`);
  }, [resource.data]);
  return <ResourceState resource={resource}>{() => <p className="web-state" role="status">Opening your GatherGo link…</p>}</ResourceState>;
}

function CarpoolPage({ id, config }) {
  const resource = useResource(`/public/carpools/${encodeURIComponent(id)}`);
  return <ResourceState resource={resource}>{(ride) => <div className="web-carpool"><p className="web-eyebrow">Go together</p><h1>A shared ride.<br />A shared purpose.</h1><div className="web-route-card"><p><span>From</span>{ride.origin}</p><div aria-hidden="true">↓</div><p><span>To</span>{ride.destination ?? 'See destination in GatherGo'}</p><p><span>Departure</span>{ride.departureTime}</p><p>{ride.availableSeats} seats available</p>{ride.event && <a href={`/event/${ride.event.id}`}>{ride.event.title} →</a>}</div><AppActions path={`/carpool/${ride.id}`} config={config} title="Join this carpool in GatherGo"><p>Ride requests, driver details and carpool chat are available in the app.</p></AppActions></div>}</ResourceState>;
}

export default function PublicApp() {
  const route = parsePublicRoute(window.location.pathname);
  const config = useResource('/public/config');
  return <WebSessionProvider><div className="web-app"><header className="web-header"><a href="/" className="web-wordmark">GatherGo<span>Events that bring us together.</span></a><a className="web-header-link" href="https://uat.gathergo.events" target="_blank" rel="noopener noreferrer">Try GatherGo ↗</a></header><main>
    {route?.kind === 's' ? <SharedLink code={route.id} /> : route?.kind === 'checkout' ? <ReceiptPage id={route.id} config={config.data} /> : route?.kind === 'carpool' ? <CarpoolPage id={route.id} config={config.data} /> : route ? <EventPage id={route.id} mode={route.mode} config={config.data} /> : <div className="web-state"><h1>This page isn’t available</h1><a href="/">Visit GatherGo home</a></div>}
    {config.error && <p className="web-config-error" role="status">App download information is temporarily unavailable. <button className="web-text-button" onClick={config.refresh}>Retry</button></p>}
    </main><footer className="web-footer"><a href="/">GatherGo</a><p>Good things happen when we gather.</p></footer></div></WebSessionProvider>;
}
