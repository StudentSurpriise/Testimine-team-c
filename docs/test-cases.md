# Test Case Specification – inventory.js
 
| ID | Requirement | Type | Priority | Precondition | Input | Expected result | Test name in code |
|---|---|---|---|---|---|---|---|
| TC-01 | REQ-01 | functional | High | stock = { 'A-1': 5 } | restock with [{ sku: 'A-1', qty: 3 }] | { 'A-1': 8 } | REQ-01 restock adds quantity … |
| TC-02 | REQ-02 | functional | High | stock = { 'A-1': 5 } | restock, then read stock | stock['A-1'] still 5 | REQ-02 restock returns a new object … |
| TC-06 | REQ-06 | performance | High | 20 000 items, 1 000 duplicates | findDuplicateSkus | < 100 ms | REQ-06 findDuplicateSkus handles … |
| … | | | | | | | |
