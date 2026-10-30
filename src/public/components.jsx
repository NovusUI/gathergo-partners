import React, { useEffect, useRef } from 'react';
import { useWebSession } from './WebSession';

export const money = (amount) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 2 }).format(amount);
export const eventDate = (value, timeZone) => new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short', timeZone }).format(new Date(value));

export function ResourceState({ resource, children }) {
  if (resource.error) return <div className="web-state" role="alert"><img src="/mascot/gogo-wave.svg" alt="" width="112" height="114" /><h2>We couldn’t load this page</h2><p>{resource.error.message}</p><button className="web-button" onClick={resource.refresh}>Try again</button><a href="/">GatherGo home</a></div>;
  if (!resource.data) return <p className="web-state" role="status">Loading GatherGo…</p>;
  return children(resource.data);
}

export function AppActionLinks({ path, config }) {
  const platform = /Android/i.test(navigator.userAgent) ? 'android' : /iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'ios' : 'desktop';
  const showPlayStore = platform !== 'ios' && config?.playStoreUrl;
  const showAppStore = platform !== 'android' && config?.appStoreUrl;
  return <div className="web-app-buttons"><a className="web-button" href={`gathergoapp://${path.replace(/^\//, '')}`}>Open GatherGo</a>
      {config && <>{showPlayStore && <a className="web-button secondary" href={config.playStoreUrl}>Get it on Google Play</a>}{showAppStore && <a className="web-button secondary" href={config.appStoreUrl}>Download on the App Store</a>}
        {!showPlayStore && !showAppStore && <p className="web-store-note">Store downloads are coming soon.</p>}<a className="web-text-link" href={config.testingUrl} target="_blank" rel="noopener noreferrer">Join app testing ↗</a></>}
    </div>;
}

export function AppActions({ path, config, title = 'Keep going in GatherGo', children }) {
  return <aside className="web-app-card"><div><p className="web-eyebrow">Together, wherever you go</p><h2>{title}</h2>{children}</div><AppActionLinks path={path} config={config} /></aside>;
}

export function ActionBar({ children, note }) {
  return <nav className="web-action-bar" aria-label="Take part">{note && <p className="web-action-note">{note}</p>}<div className="web-action-buttons">{children}</div></nav>;
}

export function Sheet({ title, onClose, children, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);
  return <dialog className={`web-sheet ${className}`} ref={ref} aria-labelledby="web-sheet-title" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="web-sheet-content"><header><h2 id="web-sheet-title">{title}</h2><button type="button" className="web-close" aria-label="Close" onClick={onClose}>×</button></header>{children}</div>
  </dialog>;
}

export function VerifiedEmail() {
  const { session, clear } = useWebSession();
  return <p className="web-verified">✓ {session.email} <button type="button" className="web-text-button" onClick={clear}>Change</button></p>;
}
