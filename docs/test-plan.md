# Test Plan – inventory.js

## 1. Test item

`loeng-1.5-1.6/inventory.js`, commit `<hash>`

## 2. Scope

**In scope:**
- REQ-01 – restock adds quantity to an existing SKU
- REQ-02 – restock rejects invalid quantities
- REQ-03 – pick validates quantity boundaries
- REQ-04 – pick handles sufficient stock, unknown SKU and excessive quantity
- REQ-05 – findDuplicateSkus detects duplicate SKUs
- REQ-06 – findDuplicateSkus meets the performance requirement
- REQ-07 – SKU format validation
- REQ-08 – original stock remains unchanged after failed restock

**Out of scope:**
- UI, database, API and integration testing, because `inventory.js` is tested as an isolated unit and the current requirements cover only its functions.

## 3. Risks

| Risk | Probability (L/M/H) | Impact (L/M/H) | Mitigation (which tests) |
|---|---|---|---|
| `findDuplicateSkus` is O(n²) and large input can cause slow execution | H | H | REQ-06 performance test with 20,000 items and a limit of 100 ms |
| Invalid SKU values can bypass input validation | M | H | REQ-07 security test with empty, too long, whitespace, underscore and special-character SKUs |
| Failed `restock` operation can partially modify the original stock | M | H | REQ-08 reliability test verifies original stock after a failed operation |
| Invalid quantities can result in incorrect inventory values | M | H | REQ-02 and REQ-03 boundary tests for zero, negative and decimal quantities |
| `pick` can allow picking an unknown SKU or more items than available | M | H | REQ-04 tests unknown SKU and quantity greater than stock |

## 4. Approach

**Test types:** functional, performance, security, reliability, regression.

**Level:** unit.

**Method:** black-box testing based on requirements; white-box testing for coverage.

**Tool:** Jest in GitHub Codespaces.

## 5. Exit criteria

- All 8 requirements (REQ-01 … REQ-08) are covered by at least one test.
- 100% of implemented tests pass.
- Branch coverage is at least 90%.
- REQ-06 performance test completes in under 100 ms.
- 0 open review comments of severity High.

## 6. Environment

- GitHub Codespaces
- Node `<version>`
- Jest `<version>`

## 7. Roles

- `<name>`: tests
- `<name>`: documentation
- Reviewer: team `<X>`
