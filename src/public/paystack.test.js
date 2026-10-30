import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

const originalDocument = globalThis.document;
const originalWindow = globalThis.window;
afterEach(() => {
  globalThis.document = originalDocument;
  globalThis.window = originalWindow;
});

async function setup() {
  const scripts = [];
  const transactions = [];
  globalThis.document = {
    createElement: () => ({ remove() { this.removed = true; } }),
    head: { appendChild: (script) => scripts.push(script) },
  };
  globalThis.window = {
    PaystackPop: class {
      resumeTransaction(accessCode, callbacks) { transactions.push({ accessCode, callbacks }); }
    },
  };
  const { openPaystackCheckout } = await import(`./paystack.js?test=${Math.random()}`);
  return { scripts, transactions, openPaystackCheckout };
}

test('reuses one SDK load and resumes server-created payments with lifecycle callbacks', async () => {
  const { scripts, transactions, openPaystackCheckout } = await setup();
  const calls = [];
  const callbacks = {
    onSuccess: () => calls.push('verify'),
    onCancel: () => calls.push('refresh'),
    onError: () => calls.push('error'),
  };
  const first = openPaystackCheckout('server-access-code', callbacks);
  const second = openPaystackCheckout('another-checkout', callbacks);
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].src, 'https://js.paystack.co/v2/inline.js');
  assert.equal(transactions.length, 0);
  scripts[0].onload();
  await Promise.all([first, second]);
  assert.deepEqual(transactions.map((item) => item.accessCode), ['server-access-code', 'another-checkout']);
  transactions[0].callbacks.onSuccess();
  transactions[0].callbacks.onCancel();
  transactions[0].callbacks.onError(new Error('Provider unavailable'));
  assert.deepEqual(calls, ['verify', 'refresh', 'error']);
});

test('a failed SDK request can be retried without starting another transaction', async () => {
  const { scripts, transactions, openPaystackCheckout } = await setup();
  const failed = openPaystackCheckout('same-server-code', {});
  scripts[0].onerror();
  await assert.rejects(failed, /Paystack could not load/);
  assert.equal(scripts[0].removed, true);
  assert.equal(transactions.length, 0);
  const retry = openPaystackCheckout('same-server-code', {});
  scripts[1].onload();
  await retry;
  assert.equal(transactions.length, 1);
  assert.equal(transactions[0].accessCode, 'same-server-code');
});
