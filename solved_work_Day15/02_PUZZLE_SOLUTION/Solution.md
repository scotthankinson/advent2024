# Puzzle Analysis and Solution Plan

## Part 1: Original Warehouse

### Key Points from Puzzle Description
1. **Input Components**:
   - Initial warehouse map with:
     - Walls (#)
     - Empty spaces (.)
     - Boxes (O)
     - Robot (@)
   - Movement sequence (^v<>)

2. **Movement Rules**:
   - Robot can move in four directions
   - Robot can push boxes
   - If movement would cause robot or box to hit wall, nothing moves
   - Movement sequence is one continuous string (ignore newlines)

3. **GPS Coordinate Calculation**:
   - For each box: `(100 * distance from top edge) + distance from left edge`
   - Measure to map edges, including through walls
   - **Required Output**: Sum of all boxes' GPS coordinates after robot finishes moving

### Solution Steps

1. **Data Parsing**
   - Parse input.txt to extract:
     - Initial warehouse map as 2D grid
     - Movement sequence as single string
   - Create data structures to track:
     - Robot position
     - Box positions
     - Wall positions

2. **Movement Simulation**
   - For each move in sequence:
     - Check if move is valid
     - If valid:
       - Update robot position
       - If pushing box, update box position
     - If invalid:
       - Skip move, maintain current positions

3. **GPS Calculation**
   - After all moves complete:
     - For each box:
       - Calculate distance from top edge
       - Calculate distance from left edge
       - Calculate GPS coordinate using formula
     - Sum all GPS coordinates

4. **Implementation Details**
   - Use classes/objects to represent:
     - Warehouse state
     - Movement logic
     - Position tracking
   - Include validation checks for:
     - Wall collisions
     - Box pushing mechanics
     - Map boundaries

5. **Testing/Verification**
   - Verify movement logic with example cases
   - Confirm GPS calculation accuracy
   - Test edge cases for movement and collisions

## Part 2: Wide Warehouse

### Key Points from Puzzle Description
1. **Map Transformation Rules**:
   - Everything except the robot is twice as wide
   - Transformation mapping:
     - '#' becomes '##'
     - 'O' becomes '[]'
     - '.' becomes '..'
     - '@' becomes '@.'

2. **New Mechanics**:
   - Robot size remains the same
   - Boxes are now two units wide
   - Robot can push multiple wide boxes simultaneously
   - Movement sequence remains unchanged
   - All movement remains a single square at a time

3. **Modified GPS Calculation**:
   - Measure from map edge to closest edge of box
   - Formula remains: `(100 * distance from top) + distance from left`
   - **Required Output**: Sum of all boxes' GPS coordinates after movement

### Solution Steps

1. **Map Transformation**
   - Process input map according to width rules:
     - Double all non-robot elements
     - Maintain vertical dimensions
     - Apply character substitutions
   - Validate transformed map structure

2. **Updated Movement Logic**
   - Modify movement simulation to handle wide boxes:
     - Collisions occur when encountering either side of a wide box ('[' or ']')
     - Boxes can be pushed if there are any empty '.' spaces opposite of all boxes in sequence before encountering a wall '#'
     - Multiple boxes can be pushed in this way as long as they are not against a wall
   - Keep robot movement rules consistent

3. **Wide Box GPS Calculation**
   - For each wide box:
     - Find left side of the box ('[') element
     - Apply GPS formula 
     - Sum all coordinates

4. **Implementation Modifications**
   - Extend warehouse class for wide format:
     - Update box representation
     - Modify collision detection
     - Adapt position tracking
   - Add validation for wide box mechanics

5. **Testing/Verification**
   - Test with provided example cases
   - Verify wide box pushing mechanics
   - Confirm GPS calculations with wide boxes
   - Test edge cases specific to wide format

6. **Special Considerations**
   - Handle box alignment for multiple pushes
   - Account for doubled wall thickness
   - Maintain robot's single-unit movement
   - Track box edges accurately for GPS