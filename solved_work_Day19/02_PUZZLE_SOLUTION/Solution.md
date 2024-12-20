# Towel Pattern Matching Puzzle - Solution Plan

## Part 1: Finding Possible Designs

### Problem Understanding
- We need to determine how many towel designs are possible using available patterns
- Each towel has colored stripes: white (w), blue (u), black (b), red (r), green (g)
- We can use multiple towels to create a design
- Towels cannot be flipped/reversed

### Input Analysis
1. **Available Patterns** (first line):
   - r (red)
   - wr (white-red)
   - b (black)
   - g (green)
   - bwu (black-white-blue)
   - rb (red-black)
   - gb (green-black)
   - br (black-red)

2. **Desired Designs** (after blank line):
   - brwrr
   - bggr
   - gbbr
   - rrbgbr
   - ubwu
   - bwurrg
   - brgr
   - bbrgwb

### Solution Strategy
1. **Parse Input**
   - Split input into available patterns and desired designs
   - Create sets/lists for easy pattern matching

2. **Pattern Matching Algorithm**
   - For each desired design:
     a. Start with empty combination
     b. Try to build the design using available patterns
     c. Use recursive approach to try different combinations
     d. Mark design as possible if any valid combination is found

3. **Validation Rules**
   - Combinations must exactly match the desired design
   - Can use multiple instances of same pattern
   - Complete match must use all stripes in order

4. **Output**
   - Count number of possible designs
   - Return final count as answer

### Expected Output
- A single integer representing the number of possible designs
- Based on example data: 6 designs are possible

### Implementation Notes
- Need to handle pattern combinations efficiently
- Should implement backtracking to try different combinations
- Must check exact matches (no partial matches allowed)
- Consider using dynamic programming for optimization

## Part 2: Counting All Possible Combinations

### Problem Understanding
- Instead of just determining if a design is possible, we need to count ALL possible ways to create each design
- Multiple valid combinations for the same design count separately
- Need to sum up the total number of possible combinations across all valid designs

### Input Analysis
Same input format as Part 1, but now we need to track all valid combinations

### Solution Strategy
1. **Modify Pattern Matching Algorithm**
   - Instead of stopping at first valid match, continue searching for all possible combinations
   - Keep track of unique combinations for each design
   - Use a counter for each design to track number of valid ways to create it

2. **Combination Tracking**
   - For each design, maintain a list/set of all valid combinations
   - Different orderings of the same patterns count as different combinations
   - Example combinations for 'gbbr':
     * g, b, b, r
     * g, b, br
     * gb, b, r
     * gb, br

3. **Validation Rules**
   - Same rules as Part 1
   - Must track complete combinations, not just success/failure
   - Different arrangements of patterns count separately even if they create the same final design

4. **Output Calculation**
   - For each valid design:
     * Count all possible combinations
     * Add to running total
   - Return sum of all combination counts

### Expected Output
- A single integer representing the total number of different ways to create all possible designs
- Based on example data: 16 total combinations (2 + 1 + 4 + 6 + 1 + 2)

### Implementation Notes
- Need efficient data structure to store combinations
- Must handle duplicate combinations correctly
- Consider using a tree structure for pattern matching
- Memory usage may be significant for complex patterns
- May need to optimize for designs with many possible combinations