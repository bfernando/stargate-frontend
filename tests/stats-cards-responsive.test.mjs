import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

const VIEWPORTS = [
  { name: 'mobile',  width: 375,  height: 812, expectedColumns: 1 },
  { name: 'tablet',  width: 768,  height: 1024, expectedColumns: 2 },
  { name: 'desktop', width: 1280, height: 800,  expectedColumns: 4 },
];

for (const { name, width, height, expectedColumns } of VIEWPORTS) {
  test(`StatsCards wraps to ${expectedColumns} column(s) on ${name} (${width}px)`, async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width, height });
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });

    // Measure the grid container and first two cards to infer column count
    const layout = await page.evaluate(() => {
      const cards = document.querySelectorAll('[data-testid="stats-card"]');
      if (cards.length < 2) return null;
      const rects = Array.from(cards).map((c) => c.getBoundingClientRect());
      // Cards on the same row share the same top value
      const firstRowTop = rects[0].top;
      const cols = rects.filter((r) => Math.abs(r.top - firstRowTop) < 2).length;
      return { cols, cardCount: cards.length };
    });

    assert.ok(layout !== null, 'Stats cards not found — ensure data-testid="stats-card" is set and the dashboard is reachable');
    assert.equal(layout.cardCount, 4, 'Expected 4 stat cards');
    assert.equal(layout.cols, expectedColumns, `Expected ${expectedColumns} column(s) at ${width}px, got ${layout.cols}`);

    await browser.close();
  });
}
