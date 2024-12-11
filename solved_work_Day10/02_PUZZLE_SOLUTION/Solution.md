# Puzzle Analysis and Solution Plan

## Part 1: Trailhead Scores
### Problem Definition
- We need to find hiking trails on a topographic map
- The goal is to calculate the **sum of scores for all trailheads**

### Key Rules and Constraints
1. **Map Properties**:
   - Height scale: 0 (lowest) to 9 (highest)
   - Grid-based movement only (up, down, left, right)
   - No diagonal steps allowed

2. **Trail Requirements**:
   - Must start at height 0 (trailhead)
   - Must end at height 9
   - Must increase by exactly 1 at each step
   - Must be continuous

3. **Scoring System**:
   - A trailhead's score = number of reachable height-9 positions
   - Each trailhead can potentially reach multiple 9s
   - Need to sum all trailhead scores for final answer

### Solution Algorithm (Part 1)
1. **Trailhead Identification**:
   - Scan the entire map
   - Mark all positions with height 0 as potential trailheads

2. **Path Finding**:
   - For each trailhead:
     - Implement a path-finding algorithm
     - Track only valid paths (increasing by 1)
     - Follow paths until reaching height 9
     - Count unique 9s reachable from each trailhead

3. **Score Calculation**:
   - For each trailhead:
     - Count number of unique height-9 positions reached
     - Add this score to running total

## Part 2: Trailhead Ratings
### Problem Definition
- Calculate the **rating** for each trailhead
- Sum all trailhead ratings for final answer

### Key Changes for Part 2
1. **Rating Definition**:
   - A trailhead's rating = number of **distinct hiking trails** from that trailhead
   - Each unique path to a height-9 position counts separately
   - Multiple paths to the same height-9 position are counted individually

### Solution Algorithm (Part 2)
1. **Path Enumeration**:
   - For each trailhead:
     - Use modified path-finding algorithm to count all possible paths
     - Each unique sequence of steps counts as a distinct trail
     - Must track complete paths, not just endpoints

2. **Rating Calculation**:
   - For each trailhead:
     - Count total number of unique valid paths
     - Add this rating to running total

### Implementation Steps
1. Reuse trailhead finding logic from Part 1
2. Modify path-finding algorithm to:
   - Track complete paths instead of just endpoints
   - Count unique paths rather than unique destinations
   - Use backtracking to explore all possible routes
3. Implement path counting logic
4. Calculate and sum all ratings

## Expected Output
- Part 1: Single integer (sum of all trailhead scores)
- Part 2: Single integer (sum of all trailhead ratings)

## Validation
### Part 1 Test Cases:
- Small example with score 1
- Medium example with score 2
- Larger example with total score 36

### Part 2 Test Cases:
- Simple example with rating 3
- Medium example with rating 13
- Complex example with rating 227
- Larger example with total rating 81

## Implementation Notes
- Part 2 will require more memory and processing power
- Need efficient path tracking to handle multiple valid paths
- Consider using memoization for common sub-paths
- May need to optimize for performance with large input