# Solution Plan for Puzzle 1: Red-Nosed Reports

## Problem Understanding
- Analyzing reactor safety reports from the Red-Nosed reactor
- Each report is a line of numbers representing levels
- Need to determine which reports are safe based on specific rules

## Key Rules
1. Reports must satisfy TWO conditions to be safe:
   - Levels must be either **all increasing** OR **all decreasing**
   - Adjacent levels must differ by **at least 1** and **at most 3**

2. Example Analysis:
   ```
   7 6 4 2 1: SAFE (all decreasing by 1-2)
   1 2 7 8 9: UNSAFE (2->7 increases by 5)
   9 7 6 2 1: UNSAFE (6->2 decreases by 4)
   1 3 2 4 5: UNSAFE (increases then decreases)
   8 6 4 4 1: UNSAFE (no change between 4->4)
   1 3 6 7 9: SAFE (all increasing by 1-3)
   ```

## Solution Steps
1. Parse Input
   - Read each line from input file
   - Convert each line into array of numbers

2. Create Safety Check Function
   - Check if sequence is monotonic (all increasing or all decreasing)
   - Verify adjacent differences are between 1 and 3 inclusive
   - Return true only if both conditions are met

3. Process Reports
   - For each report:
     - Apply safety check function
     - Count safe reports

4. Return Result
   - Output the **total count of safe reports**

## Expected Output
- A single integer representing the number of safe reports
- Example shows 2 safe reports out of 6 test cases

## Implementation Notes
- Need to handle varying number of levels per report
- Must check both increasing and decreasing patterns
- Adjacent difference check is inclusive (1 ≤ diff ≤ 3)
- Previous answer was 334 (for verification)