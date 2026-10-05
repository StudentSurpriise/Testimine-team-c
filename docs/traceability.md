# Traceability Matrix – inventory.js

| Requirement | Type | Test cases | Test names in code | Status |
|---|---|---|---|---|
| REQ-01 | functional | TC-01 | `REQ-01 restock adds quantity to existing sku` | PASS |
| REQ-02 | functional | TC-02 | `REQ-02 restock throws error on invalid quantities (0, negative, decimals)` | PASS |
| REQ-03 | functional | TC-03 | `REQ-03 pick quantity boundaries (0: error, 1: ok, -1: error, 2.5: error)` | PASS |
| REQ-04 | functional | TC-04 | `REQ-04 pick succeeds when stock is enough, and fails on unknown sku or excess qty` | PASS |
| REQ-05 | functional | TC-05 | `REQ-05 findDuplicateSkus returns unique list of SKUs appearing more than once` | PASS |
| REQ-06 | performance | TC-06 | `Performance: findDuplicateSkus handles 20 000 items in under 100 ms` | FAIL → fixed → PASS |
| REQ-07 | security | TC-07 | `REQ-07 security: throws error on invalid SKU format (%s: "%s")` | PASS |
| REQ-08 | reliability | TC-08 | `REQ-08 reliability: original stock unchanged after a failed restock` | PASS |

**Uncovered requirements:** None.

**Traceability status:** All 8 requirements are covered by at least one test case.
