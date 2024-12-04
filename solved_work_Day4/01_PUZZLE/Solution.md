# Puzzle Analysis and Solution Plan

## Part 1: Finding XMAS
- We need to find all instances of "XMAS" in a word search grid
- The word "XMAS" can appear:
  - Horizontally
  - Vertically
  - Diagonally
  - Backwards
  - Overlapping with other instances

### Example Given
- The puzzle provides a sample 10x10 grid where "XMAS" appears 18 times
- The example shows both the raw grid and a version with non-XMAS letters replaced with dots
- This helps validate the counting approach

### Input Format
- The input appears to be one continuous string of letters
- Need to determine the grid dimensions (appears to be a square grid)
- Each position contains either 'X', 'M', 'A', or 'S'

### Solution Steps
1. **Grid Processing**
   - Convert the continuous string into a 2D grid
   - Calculate grid dimensions (find square root of string length)

2. **Search Implementation**
   - Create functions to search in all 8 possible directions:
     - Left to right
     - Right to left
     - Top to bottom
     - Bottom to top
     - Diagonal top-left to bottom-right
     - Diagonal bottom-right to top-left
     - Diagonal top-right to bottom-left
     - Diagonal bottom-left to top-right

3. **Pattern Matching**
   - For each position in the grid:
     - Check all 8 directions for "XMAS"
     - Count valid occurrences
     - Handle overlapping patterns

4. **Validation**
   - Test with the example grid first
   - Verify the counting logic matches the example's 18 occurrences
   - Apply to the actual puzzle input

5. **Result Generation**
   - Count total occurrences of "XMAS"
   - Return the final count as the answer

## Part 2: Finding X-MAS Patterns

### Problem Description
- We need to find X-shaped patterns made up of two "MAS" strings
- Each "MAS" string can be written forwards or backwards
- The two "MAS" strings must intersect to form an X shape
- The intersection point must be at the 'A' in both "MAS" strings

### Example Analysis
- The example shows a 10x10 grid with 9 valid X-MAS patterns
- Pattern requirements:
  - Two "MAS" strings that intersect at their 'A'
  - One "MAS" forms one diagonal of the X
  - The other "MAS" forms the other diagonal
  - Each "MAS" can be forwards or backwards ("MAS" or "SAM")

### Solution Steps
1. **Pattern Detection**
   - For each 'A' in the grid:
     - Check all four diagonal pairs:
       - Top-left to bottom-right AND top-right to bottom-left
       - Bottom-right to top-left AND bottom-left to top-right
     - For each diagonal, check both "MAS" and "SAM"

2. **Validation Rules**
   - Confirm both diagonals form valid "MAS" patterns
   - Verify the patterns intersect at 'A'
   - Count each unique X-MAS pattern once

3. **Implementation Details**
   - Create helper functions to:
     - Find all 'A' positions in the grid
     - Check diagonal patterns in both directions
     - Validate complete X-MAS patterns
     - Handle pattern counting without duplicates

4. **Testing**
   - Verify against the example grid (should find 9 patterns)
   - Test edge cases:
     - Overlapping patterns
     - Grid boundaries
     - Different combinations of forward/backward "MAS"

5. **Final Count**
   - Process the entire puzzle grid
   - Count total valid X-MAS patterns
   - Return the final count as the answer