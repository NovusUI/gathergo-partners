import React, { createContext, useContext, useEffect, useState } from 'react';
import { readSessionToken, request, saveSessionToken } from './api';

const SessionContext = createContext(null);

export function WebSessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(Boolean(readSessionToken()));
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const clear = () => { saveSessionToken(null); setSession(null); setError(null); };
  useEffect(() => {
    if (!readSessionToken()) return;
    const controller = new AbortController();
    setLoading(true);
    request('/public/session', { signal: controller.signal }).then(setSession).catch((failure) => {
      if (failure.name === 'AbortError') return;
      if (failure.status === 401) clear();
      else setError(failure);
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [attempt]);
  const verified = (result) => { saveSessionToken(result.token); setSession(result); setError(null); };
  return <SessionContext.Provider value={{ session, loading, error, verified, clear, retry: () => { setError(null); setAttempt((value) => value + 1); } }}>{children}</SessionContext.Provider>;
}

export const useWebSession = () => useContext(SessionContext);

export function EmailGate({ children }) {
  const { session, loading, error: sessionError, verified, retry } = useWebSession();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [challenge, setChallenge] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  if (loading) return <p role="status">Checking your email session…</p>;
  if (sessionError) return <div role="alert"><p>{sessionError.message}</p><button className="web-button secondary" onClick={retry}>Try again</button></div>;
  if (session) return children;
  const sendCode = async (event) => {
    event.preventDefault(); setBusy(true); setError(null);
    try { setChallenge(await request('/public/email/code', { method: 'POST', body: { email: email.trim().toLowerCase() } })); }
    catch (failure) { setError(failure); }
    finally { setBusy(false); }
  };
  const verify = async (event) => {
    event.preventDefault(); setBusy(true); setError(null);
    try { verified(await request('/public/email/verify', { method: 'POST', body: { challengeId: challenge.challengeId, code } })); }
    catch (failure) { setError(failure); }
    finally { setBusy(false); }
  };
  return <div className="web-email-gate">
    <img src="/mascot/gogo-wave.svg" alt="Gogo waving" width="104" height="106" />
    <h3>{challenge ? 'Check your inbox' : 'Continue with your email'}</h3>
    <p>{challenge ? `Enter the six-digit code sent to ${challenge.email}.` : 'Keep your confirmation safe and find your activity in GatherGo later. No password or app download needed to continue here.'}</p>
    <form onSubmit={challenge ? verify : sendCode}>
      {challenge ? <label>Email code<input autoFocus required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength="6" value={code} onChange={(event) => setCode(event.target.value)} /></label>
        : <label>Email address<input autoFocus required type="email" autoComplete="email" maxLength="254" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>}
      {error && <p className="web-error" role="alert">{error.message}</p>}
      <button className="web-button" disabled={busy}>{busy ? 'Please wait…' : challenge ? 'Verify email' : 'Send my code'}</button>
    </form>
    {challenge && <div className="web-inline-actions"><button className="web-text-button" disabled={busy} onClick={sendCode}>Send another code</button><button className="web-text-button" disabled={busy} onClick={() => { setChallenge(null); setCode(''); setError(null); }}>Use another email</button></div>}
  </div>;
}
