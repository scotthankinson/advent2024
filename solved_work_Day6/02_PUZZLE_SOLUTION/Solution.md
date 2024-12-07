# Puzzle Analysis and Solution Plan

## Part 1: Guard Path Tracking

### Problem Description
- We need to track a guard's movement through a lab in 1518
- The guard follows a strict patrol protocol
- We must predict the path and count distinct positions visited

### Key Elements to Track
1. **Guard Properties**:
   - Initial position marked with `^` (facing up)
   - Movement direction (starts facing up)
   - Current position coordinates

2. **Map Properties**:
   - Obstructions marked with `#`
   - Empty spaces marked with `.`
   - Grid boundaries

### Movement Rules
1. **Guard Protocol**:
   - If obstacle ahead: Turn right 90 degrees
   - If no obstacle: Move forward one step
   - Continue until leaving mapped area

### Required Tracking
- Must track **distinct** positions visited
- Include the guard's starting position in the count
- Track until guard leaves mapped area

### Solution Steps
1. **Map Processing**:
   - Parse input into 2D grid
   - Locate initial guard position and direction
   - Record starting position in visited set

2. **Movement Simulation**:
   - Implement direction changes (right turns)
   - Track forward movement
   - Record each visited position
   - Check for map boundary exits

3. **Position Counting**:
   - Maintain set of unique coordinates visited
   - Count total distinct positions when guard exits

### Expected Output
- A single integer representing the total number of distinct positions visited by the guard before leaving the mapped area

### Validation Criteria
- Must include starting position in count
- Must only count each position once
- Must stop counting when guard leaves map boundaries

## Part 2: Finding Loop-Creating Positions

### Problem Description
- Need to find positions where placing a new obstruction will trap the guard in a loop
- Cannot place obstruction at guard's starting position
- Must find all possible positions that create loops
- Must minimize time paradox risk

### Key Considerations
1. **Obstruction Properties**:
   - Must be a single new obstacle
   - Cannot be placed at guard's starting position
   - Must create a closed loop in guard's path

2. **Path Analysis**:
   - Need to simulate guard's movement for each possible obstruction position
   - Must detect when a loop forms
   - Must verify the loop is stable

### Solution Steps
1. **Position Identification**:
   - Create list of all empty spaces (`.`) as potential positions
   - Exclude guard's starting position
   - For each position:
     - Temporarily place obstruction
     - Simulate guard movement
     - Check if a loop forms

2. **Loop Detection**:
   - Track guard's position and direction over time
   - Identify repeated position+direction combinations
   - Verify the loop is complete and stable

3. **Validation**:
   - Ensure obstruction creates a true loop
   - Verify guard never exits the map
   - Confirm loop is stable and repeating

### Path Notation
- `#` : Static obstruction 
- `O` : New obstruction position
- `.` : Valid movement space

### Expected Output
- A single integer representing the total number of different positions where placing an obstruction would create a stable loop

### Validation Criteria
- Must exclude guard's starting position
- Must only count positions that create stable loops
- Must verify guard never exits the map
- Each position must create exactly one loop pattern