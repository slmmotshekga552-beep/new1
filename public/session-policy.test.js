import { test, expect } from 'bun:test';
import './session-policy.js';
const { expired, IDLE_MS } = globalThis.portalSessionPolicy;
test('active refresh stays signed in before 30 minutes', () => {
  expect(expired(1000, 1000 + IDLE_MS - 1)).toBe(false);
});
test('30 minutes without use expires the portal session', () => {
  expect(expired(1000, 1000 + 30 * 60 * 1000)).toBe(true);
});
test('missing activity cannot restore an old session', () => {
  expect(expired(NaN)).toBe(true);
});