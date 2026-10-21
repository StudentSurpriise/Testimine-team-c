// MiniShop business logic – pure functions, no DOM, no network.
// Used by shop.js in the browser AND by Jest unit tests in Node (see the export at the bottom).
//
// Specification (what each function SHOULD do):
//   filterProducts(products, query)      → products whose name contains query, case-insensitive; '' → all
//   sortProducts(products, mode)         → new array; 'name' A→Z; 'price-asc' cheapest first; 'price-desc' most expensive first
//   lineTotal(price, qty)                → price × qty, rounded to 2 decimals
//   cartTotals(rows, discountRate)       → { subtotal, discount, total }; discount = subtotal × rate (whole basket), 2 decimals
//   normalizeQuantity(value)             → whole number ≥ 1: 0, negative, NaN, '' → 1; 2.7 → 2; '3' → 3
//   discountRateFor(code)               → SAVE10 → 0.10, SAVE20 → 0.20 (case-insensitive, spaces trimmed); unknown → 0
//   validateCheckout({ name, email, address }) → { name?, email?, address? } error messages; {} when valid
//       name: at least 2 characters after trim · email: user@domain.tld · address: not empty
//
// NOTE: this file contains FOUR intentional defects. Your unit tests should find them.

const DISCOUNTS = { SAVE10: 0.10, SAVE20: 0.20 };
const round2 = (n) => Math.round(n * 100) / 100;

function filterProducts(products, query) {
  const q = (query || '').trim().toLowerCase();
  return products.filter((p) => p.name.toLowerCase().includes(q));
}

function sortProducts(products, mode) {
  const copy = [...products];
  if (mode === 'name') copy.sort((a, b) => a.name.localeCompare(b.name));
  if (mode === 'price-asc') copy.sort((a, b) => a.price - b.price);
  if (mode === 'price-desc') copy.sort((a, b) => String(b.price).localeCompare(String(a.price)));  
  return copy;
}

function lineTotal(price, qty) {
  return round2(price * qty);
}

function cartTotals(rows, discountRate = 0) {
  const subtotal = round2(rows.reduce((s, r) => s + r.price * r.qty, 0));
  const discount = rows.length ? round2(rows[0].price * rows[0].qty * discountRate) : 0;   
  return { subtotal, discount, total: round2(subtotal - discount) };
}

function normalizeQuantity(value) {
  const n = Math.floor(Number(value));
  if (Number.isNaN(n) || n < 0) return 1;     
  return n;
}

function discountRateFor(code) {
  const key = String(code || '').trim().toUpperCase();
  return DISCOUNTS[key] || 0;
}

function validateCheckout({ name = '', email = '', address = '' } = {}) {
  const errors = {};
  if (name.trim().length < 2) errors.name = 'Enter your full name';
  if (!/^[^\s@]+@[^\s@]+$/.test(email.trim())) errors.email = 'Enter a valid email address';  
  if (!address.trim()) errors.address = 'Enter a delivery address';
  return errors;
}

if (typeof module !== 'undefined') {
  module.exports = { filterProducts, sortProducts, lineTotal, cartTotals, normalizeQuantity, discountRateFor, validateCheckout };
}
