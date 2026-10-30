import assert from 'node:assert/strict';
import { test } from 'node:test';
import { eventActions } from './event-actions.js';

const now = Date.parse('2026-10-30T12:00:00Z');
const event = {
  registrationType: 'ticket', startDate: '2026-10-31T12:00:00Z', endDate: '2026-10-31T16:00:00Z',
  eventTickets: [{ price: 1000 }], donationsEnabled: true,
};

test('meal collection and donations remain separate actions on both food-bank routes', () => {
  const foodBank = { ...event, registrationType: 'foodbank' };
  const actions = eventActions(foodBank, 'meals', now);
  assert.deepEqual(actions.map((action) => action.id), ['meals', 'donation']);
  assert.ok(actions.every((action) => !action.disabled));
  assert.deepEqual(eventActions(foodBank, 'event', now), actions);
});

test('ticket buttons distinguish free passes, paid tickets and unavailable inventory', () => {
  assert.equal(eventActions(event, 'event', now)[0].label, 'Buy tickets');
  assert.equal(eventActions({ ...event, eventTickets: [{ price: 0 }] }, 'event', now)[0].label, 'Get tickets');
  assert.equal(eventActions({ ...event, eventTickets: [] }, 'event', now)[0].disabled, true);
});

test('ended events cannot start ticket, registration or donation checkout', () => {
  for (const registrationType of ['ticket', 'registration', 'donation']) {
    const actions = eventActions({ ...event, registrationType, endDate: '2026-10-29T12:00:00Z' }, 'event', now);
    assert.ok(actions.length > 0);
    assert.ok(actions.every((action) => action.disabled));
  }
});

test('volunteer recruitment closes at the start while donations remain open until the end', () => {
  const volunteer = { ...event, registrationType: 'volunteer', startDate: '2026-10-30T11:00:00Z' };
  const actions = eventActions(volunteer, 'event', now);
  assert.equal(actions.find((action) => action.id === 'volunteer').disabled, true);
  assert.equal(actions.find((action) => action.id === 'donation').disabled, false);
});

test('Live retains web registration and donation alongside its app-only action', () => {
  const actions = eventActions({ ...event, registrationType: 'registration' }, 'live', now);
  assert.deepEqual(actions.map((action) => action.id), ['registration', 'donation', 'live']);
  assert.ok(actions.every((action) => !action.disabled));
});
