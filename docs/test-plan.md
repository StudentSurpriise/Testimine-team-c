# Test Plan – inventory.js
 
## 1. Test item
loeng-1.5-1.6/inventory.js, commit <hash>
 
## 2. Scope
In scope: REQ-01 … REQ-08 (list each).
Out of scope: <what and WHY>
 
## 3. Risks
| Risk | Probability (L/M/H) | Impact (L/M/H) | Mitigation (which tests) |
|---|---|---|---|
| findDuplicateSkus is O(n²) – large stock makes reports time out | H | H | REQ-06 performance test |
| <at least 3 risks; use the mutation table from 3.4> | | | |
 
## 4. Approach
Test types: functional, performance, security, reliability, regression.
Level: unit. Method: black-box from requirements, white-box for coverage.
Tool: Jest in GitHub Codespaces.
 
## 5. Exit criteria (measurable!)
- all 8 REQ covered by at least one test
- 100 % tests pass
- branch coverage >= 90 %
- REQ-06 under 100 ms
- 0 open review comments of severity High
 
## 6. Environment
Codespaces, Node <version>, Jest <version>
 
## 7. Roles
<name>: tests. <name>: documents. Reviewer: team <X>.
