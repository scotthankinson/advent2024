# Puzzle Analysis and Solution Plan

## Part 1: Finding the Lowest Score Path

### Problem Definition
- **Goal**: Find the lowest possible score for a Reindeer traversing a maze
- **Starting Condition**: Reindeer starts at 'S' facing East
- **Target**: Reach tile marked 'E'

### Scoring Rules
1. **Movement Cost**:
   - Forward movement: +1 point per tile
   - Rotation (90° clockwise or countercllock): +1000 points per turn

### Constraints
1. **Movement Restrictions**:
   - Cannot move through walls (#)
   - Can only move forward one tile at a time
   - Can only rotate 90 degrees at a time

### Solution Strategy
1. Parse the maze input:
   - Identify start position 'S'
   - Identify end position 'E'
   - Create a map of valid paths (non-wall spaces)

2. Implement pathfinding algorithm:
   - Track both position AND direction at each step
   - Consider cost of turns (1000) vs forward movement (1)
   - Optimize for minimal total score

3. Score calculation:
   - Count number of forward steps × 1
   - Count number of turns × 1000
   - Sum total score

## Part 2: Finding All Optimal Path Tiles

### Problem Definition
- **Goal**: Count the number of tiles that are part of ANY optimal (lowest-score) path through the maze
- **Included Tiles**: All non-wall tiles (S, ., or E) that appear in at least one optimal path
- **Target Value**: Total count of tiles used in any optimal solution

### Analysis Requirements
1. First find ALL paths that achieve the minimum score from Part 1
2. For each optimal path:
   - Mark all tiles used in that path
   - Include start (S) and end (E) tiles
   - Include all intermediate tiles (.) used

### Solution Strategy
1. Modify Part 1's pathfinding to store ALL paths with minimum score:
   - When finding a path with same score as current minimum, store it
   - When finding a path with lower score, clear previous paths and store new one
   
2. Create a tile tracking system:
   - Initialize a set to store coordinates of tiles used in optimal paths
   - For each optimal path found:
     - Add all tile coordinates to the set
   - Set will automatically handle duplicates

3. Count unique tiles:
   - The size of the set will give us our answer
   - This represents all tiles that appear in ANY optimal path

### Implementation Notes
- Must store complete path information, not just scores
- Need to track ALL optimal paths, not just one
- Final count should include:
  - Starting position 'S'
  - Ending position 'E'
  - All intermediate positions '.' used in ANY optimal path

### Validation
- Can visualize optimal paths by marking used tiles with 'O'
- Example shows how multiple optimal paths might use different tiles
- All tiles that appear in ANY optimal path count toward the final total