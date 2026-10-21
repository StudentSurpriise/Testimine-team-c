import { test, expect } from '@playwright/test';

// Every test starts on a fresh page: the app keeps its state in memory,
// so a new page = empty cart. No cleanup needed between tests.
test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

// UI-01 · the products page loads with all 6 products
test('UI-01 products page shows 6 products', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();   // 1. we are on the right page
  await expect(page.getByTestId('product')).toHaveCount(6);                      // 2. all products rendered
  await expect(page.getByTestId('result-count')).toHaveText('6 products');       // 3. counter matches
});

// TODO: write UI-02 … UI-10 from your scenario table (handout, chapter 4).
// One test() per scenario. Keep the UI-ID in the test name.
