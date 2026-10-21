// Unit tests for shop-logic.js. One describe() per function, one test() per behaviour.
// Pattern: Arrange (data) → Act (call the function) → Assert (expect).
const { filterProducts, sortProducts, lineTotal, cartTotals, normalizeQuantity, discountRateFor, validateCheckout } = require('./shop-logic');

const PRODUCTS = [
  { id: 1, name: 'Laptop Stand', price: 29.90 },
  { id: 2, name: 'USB-C Hub', price: 39.00 },
  { id: 3, name: 'Monitor 27"', price: 249.00 },
  { id: 4, name: 'Wireless Mouse', price: 24.50 },
];

describe('filterProducts', () => {
  test('UT-01 empty query returns all products', () => {
    expect(filterProducts(PRODUCTS, '')).toHaveLength(4);        // Arrange is PRODUCTS, Act is the call, Assert is expect
  });
  // TODO: UT-02 'mouse' (lower case) finds Wireless Mouse · UT-03 no match → []
});

// TODO: describe blocks for sortProducts, lineTotal, cartTotals, normalizeQuantity, discountRateFor, validateCheckout
// (handout chapter 3 lists the behaviours; chapter 2 has the specification).
