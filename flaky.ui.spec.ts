import { test, expect } from './fixtures';

// A deliberately FLAKY test: it sleeps a fixed time and then checks once.
// The confirmation arrives after 0.3–1.2 s, so sometimes the sleep is long enough, sometimes not.
// Task (handout chapter 6): run it 5 times, watch it flip, then rewrite it with a web-first assertion.
test('FLAKY-01 order confirmation checked after a fixed sleep', async ({ page, shop }) => {
  await shop.add('Wireless Mouse');
  await shop.openCart();
  await shop.checkout('Mari Maasikas', 'mari@example.com', 'Pikk 1, Tallinn');
  await page.waitForTimeout(700);                                  // BAD: fixed sleep
  expect(await shop.confirmation().isVisible()).toBe(true);        // BAD: checks once, does not wait
});
