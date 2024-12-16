# Puzzle Analysis and Solution Plan

## Problem Description
- We need to predict robot positions in a bounded space
- Robots move in straight lines with constant velocity
- When hitting boundaries, robots wrap around to the opposite side

## Key Dimensions
- **Sample Space**: 11 tiles wide × 7 tiles tall
- **Actual Space**: 101 tiles wide × 103 tiles tall

## Input Format
- Each line represents one robot with:
  - Position (p=x,y): Distance from left wall (x) and top wall (y)
  - Velocity (v=x,y): Movement in tiles per second (right=+x, down=+y)

## Solution Requirements
1. **Time Frame**: Simulate exactly 100 seconds
2. **Wrapping Behavior**: 
   - Robots teleport to opposite side when hitting edges
   - Maintains same velocity after wrapping

## Calculation Steps
1. Load and parse all robot positions and velocities
2. Implement position update logic with wrapping
3. Run simulation for 100 seconds
4. Count robots in each quadrant
   - Exclude robots on middle lines (horizontal/vertical)
   - Split space into four quadrants
5. Calculate safety factor by multiplying quadrant counts

## Expected Output
- A single number representing the safety factor
- Safety factor = (Q1 robots × Q2 robots × Q3 robots × Q4 robots)

## Sample Data Validation
- Sample input shows 12 as safety factor
- Quadrant counts: 1, 3, 4, and 1
- Verifies multiplication: 1 × 3 × 4 × 1 = 12

## Key Considerations
1. Handle boundary wrapping correctly
2. Track precise positions after 100 seconds
3. Properly exclude robots on dividing lines
4. Account for the different dimensions between sample and actual puzzle

# Part 2: Finding the Easter Egg Pattern

## Problem Description
- The robots have a hidden Easter egg feature
- They will occasionally form a **Christmas tree pattern**
- Need to find the earliest time this pattern appears

## Solution Requirements
1. **Pattern Recognition**: 
   - Monitor robot positions to detect Christmas tree formation
   - Pattern must be clear and distinguishable

2. **Time Analysis**:
   - Find the **minimum number of seconds** needed
   - Pattern may appear multiple times, we want earliest occurrence

## Calculation Steps
1. Reuse position tracking from Part 1
2. Add pattern recognition logic:
   - Define expected Christmas tree shape
   - Check for density clusters in tree shape
   - Verify negative space around the pattern
3. Implement time search algorithm:
   - Start from t=0
   - Check each time step for pattern match
   - Stop at first valid match

## Expected Output
- A single integer representing the minimum seconds needed
- Must be the earliest possible occurrence of the pattern

## Key Considerations
1. Pattern recognition must be robust:
   - Handle various densities of robots
   - Account for potential noise/scattered robots
2. Performance optimization:
   - May need to optimize search strategy
   - Consider parallel pattern checking
3. Validation criteria:
   - Clear Christmas tree shape
   - Sufficient robot density in pattern
   - Minimal robots outside pattern