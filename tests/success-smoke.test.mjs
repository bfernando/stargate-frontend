import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('/pay/[id]/success route smoke', () => {
  const src = readFileSync(
    resolve(process.cwd(), 'app/pay/[id]/success/page.tsx'),
    'utf8',
  );
  assert.ok(src.includes('Payment confirmed'), 'success page should contain "Payment confirmed"');
  assert.ok(src.includes('reconciled'), 'success page should mention payment reconciliation');
});
