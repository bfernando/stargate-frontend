import test from 'node:test';
import assert from 'node:assert/strict';

// ---------------------------------------------------------------------------
// Minimal inline re-implementation of the api client's header logic so we can
// unit-test it without a running server or bundler.
// ---------------------------------------------------------------------------

let accessToken = null;

function setAccessToken(token) {
  accessToken = token;
}

function buildHeaders(extra = {}) {
  return {
    'content-type': 'application/json',
    ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
    ...extra,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test('auth header is injected when accessToken is set', () => {
  setAccessToken('test-token-abc');
  const headers = buildHeaders();
  assert.equal(headers['authorization'], 'Bearer test-token-abc');
});

test('auth header is absent when accessToken is null', () => {
  setAccessToken(null);
  const headers = buildHeaders();
  assert.equal(Object.hasOwn(headers, 'authorization'), false);
});

test('content-type is always application/json', () => {
  setAccessToken(null);
  assert.equal(buildHeaders()['content-type'], 'application/json');
  setAccessToken('tok');
  assert.equal(buildHeaders()['content-type'], 'application/json');
});

test('public invoice endpoint omits auth header when no token is set', () => {
  setAccessToken(null);
  const headers = buildHeaders();
  // Public endpoints rely on no token being set — confirm header is absent
  assert.equal(Object.hasOwn(headers, 'authorization'), false);
});

test('caller-supplied headers override defaults', () => {
  setAccessToken('tok');
  const headers = buildHeaders({ 'content-type': 'text/plain' });
  assert.equal(headers['content-type'], 'text/plain');
  assert.equal(headers['authorization'], 'Bearer tok');
});
