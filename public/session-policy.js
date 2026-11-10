/* Shared, browser-safe inactivity policy. */
(function(root){
  const IDLE_MS = 30 * 60 * 1000;
  const expired = (last, now = Date.now()) => !Number.isFinite(last) || last <= 0 || now - last >= IDLE_MS;
  root.portalSessionPolicy = { IDLE_MS, expired };
})(globalThis);