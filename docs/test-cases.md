# Test Case Specification – inventory.js

| ID | Requirement | Type | Priority | Precondition | Input | Expected result | Test name in code |
|---|---|---|---|---|---|---|---|
| TC-01 | REQ-01 | functional | High | `stock = { 'A-1': 5 }` | `restock` with `[{ sku: 'A-1', qty: 3 }]` | Returns `{ 'A-1': 8 }` | `REQ-01 restock adds quantity to existing sku` |
| TC-02 | REQ-02 | functional | High | `stock = { 'A-1': 5 }` | `restock` with `qty = 0, -2, 1.5` | Throws an error for each invalid quantity | `REQ-02 restock throws error on invalid quantities (0, negative, decimals)` |
| TC-03 | REQ-03 | functional | High | `stock = { 'A-1': 5 }` | `pick` with `qty = 0, 1, -1, 2.5` | `qty = 0, -1, 2.5` throw an error; `qty = 1` succeeds and leaves `A-1 = 4` | `REQ-03 pick quantity boundaries (0: error, 1: ok, -1: error, 2.5: error)` |
| TC-04 | REQ-04 | functional | High | `stock = { 'A-1': 5 }` | `pick('A-1', 2)`; unknown SKU; `pick('A-1', 10)` | Valid pick returns `A-1 = 3`; unknown SKU and excessive quantity throw errors; original stock remains unchanged | `REQ-04 pick succeeds when stock is enough, and fails on unknown sku or excess qty` |
| TC-05 | REQ-05 | functional | High | Items contain duplicate SKUs | `findDuplicateSkus(items)` where `A-1` and `B-2` appear twice | Returns unique duplicate SKU list: `['A-1', 'B-2']` | `REQ-05 findDuplicateSkus returns unique list of SKUs appearing more than once` |
| TC-06 | REQ-06 | performance | High | 20,000 items generated from 1,000 SKU values | `findDuplicateSkus(items)` | Returns duplicates and completes in under 100 ms | `Performance: findDuplicateSkus handles 20 000 items in under 100 ms` |
| TC-07 | REQ-07 | security | High | `stock = { 'A-1': 5 }` | `restock` with invalid SKUs: `A_1`, `''`, 21-character SKU, `A-1!`, `A- 1` | Throws an error for every invalid SKU format | `REQ-07 security: throws error on invalid SKU format (%s: "%s")` |
| TC-08 | REQ-08 | reliability | High | `stock = { 'A-1': 10 }` | `restock` with valid delivery followed by invalid SKU | Operation throws an error and original stock remains `{ 'A-1': 10 }` | `REQ-08 reliability: original stock unchanged after a failed restock` |
