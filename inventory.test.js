const { restock, pick, findDuplicateSkus } = require('./inventory');

// ---- Functional tests (etapp 1a) ----
test('REQ-01 restock adds quantity to existing sku', () => {
  const stock = { 'A-1': 5 };
  expect(restock(stock, [{ sku: 'A-1', qty: 3 }])).toEqual({ 'A-1': 8 });
});
// REQ-02: restock - vigane kogus (<= 0 või mitte täisarv) viskab vea
test('REQ-02 restock throws error on invalid quantities (0, negative, decimals)', () => {
  const stock = { 'A-1': 5 };
  
  expect(() => restock(stock, { sku: 'A-1', qty: 0 })).toThrow();
  expect(() => restock(stock, { sku: 'A-1', qty: -2 })).toThrow();
  expect(() => restock(stock, { sku: 'A-1', qty: 1.5 })).toThrow();
});

// REQ-03: pick - piirväärtused kogusele (qty = 0 viga, qty = 1 OK, qty = -1 viga, qty = 2.5 viga)
test('REQ-03 pick quantity boundaries (0: error, 1: ok, -1: error, 2.5: error)', () => {
  const stock = { 'A-1': 5 };

  expect(() => pick(stock, 'A-1', 0)).toThrow();
  
  const updated = pick(stock, 'A-1', 1);
  expect(updated['A-1']).toBe(4);

  expect(() => pick(stock, 'A-1', -1)).toThrow();
  expect(() => pick(stock, 'A-1', 2.5)).toThrow();
});

// REQ-04: pick - kaks suunda (õnnestub ja keeldub: tundmatu sku või qty > laoseis) ning originaal jääb samaks
test('REQ-04 pick succeeds when stock is enough, and fails on unknown sku or excess qty', () => {
  const stock = { 'A-1': 5 };

  // Õnnestub (kogus väheneb)
  const result = pick(stock, 'A-1', 2);
  expect(result['A-1']).toBe(3);

  // Keeldub (tundmatu SKU)
  expect(() => pick(stock, 'UNKNOWN', 1)).toThrow();

  // Keeldub (kogus suurem kui laoseis)
  expect(() => pick(stock, 'A-1', 10)).toThrow();

  // Immutabiilsuse kontroll (originaalobjekt on muutumatu)
  expect(stock['A-1']).toBe(5);
});

// REQ-05: findDuplicateSkus - leiab korduvad SKU-d korrektselt
test('REQ-05 findDuplicateSkus returns unique list of SKUs appearing more than once', () => {
  const items = [
    { sku: 'A-1', name: 'Item 1' },
    { sku: 'B-2', name: 'Item 2' },
    { sku: 'A-1', name: 'Item 3' },
    { sku: 'C-3', name: 'Item 4' },
    { sku: 'B-2', name: 'Item 5' }
  ];

  const duplicates = findDuplicateSkus(items);
  expect(duplicates.sort()).toEqual(['A-1', 'B-2'].sort());
});



// ---- Security and reliability tests (etapp 1c) ----



// ---- Performance test (etapp 1b) ----
// TODO: generate 20 000 items with some duplicates, measure findDuplicateSkus,
// assert it finishes under 100 ms. See project guide chapter 3.2.
// ---- Performance test (etapp 1b) ----
test('Performance: findDuplicateSkus handles 20 000 items in under 100 ms', () => {
  const items = [];
  for (let i = 0; i < 20000; i++) {
    items.push({ sku: `SKU-${i % 1000}` });
  }

  const start = performance.now();
  const duplicates = findDuplicateSkus(items);
  const duration = performance.now() - start;

  expect(duplicates.length).toBeGreaterThan(0);
  expect(duration).toBeLessThan(100);
});
// ---- Security and reliability tests (etapp 1c) ----
// TODO: REQ-07 with test.each, REQ-08 original stock unchanged after a failed restock.
// REQ-07: test.each kasutamine vigaste SKU-de valideerimiseks
test.each([
  ['invalid_underscore', 'A_1'],
  ['too_short', ''],
  ['too_long', 'A'.repeat(21)],
  ['special_chars', 'A-1!'],
  ['spaces', 'A- 1']
])('REQ-07 security: throws error on invalid SKU format (%s: "%s")', (_, invalidSku) => {
  const stock = { 'A-1': 5 };
  expect(() => restock(stock, { sku: invalidSku, qty: 1 })).toThrow();
});

// REQ-08: originaallaoseis peab jääma muutumatuks ka pärast ebaõnnestunud restock operatsiooni
test('REQ-08 reliability: original stock unchanged after a failed restock', () => {
  const stock = { 'A-1': 10 };
  const deliveries = [
    { sku: 'A-1', qty: 5 },
    { sku: 'INVALID_SKU!', qty: 2 } // See tekitab vea
  ];

  expect(() => restock(stock, deliveries)).toThrow();
  expect(stock).toEqual({ 'A-1': 10 }); // Originaal ei tohi olla osaliselt muudetud
});