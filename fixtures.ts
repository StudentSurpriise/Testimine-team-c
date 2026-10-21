import { test as base } from '@playwright/test';
import { ShopPage } from './shop.page';

// Custom fixture: every test gets a ShopPage that is already open on the products page.
// Usage:  import { test, expect } from './fixtures';
//         test('...', async ({ shop }) => { await shop.add('USB-C Hub'); ... });
export const test = base.extend<{ shop: ShopPage }>({
  shop: async ({ page }, use) => {
    const shop = new ShopPage(page);
    await shop.open();
    await use(shop);
  },
});

export { expect } from '@playwright/test';
