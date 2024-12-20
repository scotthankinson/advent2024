# RAM Run Puzzle Solver Plan

## Problem Analysis
- We need to find the shortest path from (0,0) to the bottom-right corner
- Two grid sizes to consider:
  - Sample puzzle: 7x7 grid (0-6 coordinates)
  - Full puzzle: 71x71 grid (0-70 coordinates)
- Bytes fall into memory space making coordinates corrupted
- Must process 1024 bytes for the full solution
- Cannot move through corrupted spaces or outside grid boundaries
- Movement allowed: up, down, left, right (no diagonals)

## Input Processing
1. Read coordinate pairs from input file
2. Parse each line into (x,y) tuples
3. Create a toggle mechanism for grid size:
   ```python
   SAMPLE_MODE = True  # Toggle between sample (7x7) and full (71x71)
   GRID_SIZE = 7 if SAMPLE_MODE else 71
   ```

## Grid Management
1. Create a 2D grid representation
   - Initialize with '.' for safe spaces
   - Mark '#' for corrupted spaces as bytes fall
2. Track corrupted spaces in a set for efficient lookup
3. Implement grid boundary checking

## Pathfinding Implementation
1. Use Breadth-First Search (BFS) algorithm
   - Guarantees shortest path
   - Works well with grid-based movement
2. Key components:
   - Queue for BFS frontier
   - Visited set to avoid cycles
   - Path tracking for solution
3. Movement vectors: [(0,1), (0,-1), (1,0), (-1,0)]

## Solution Steps
1. Initialize grid based on size toggle
2. Process first N bytes (N=12 for sample, N=1024 for full puzzle)
3. Apply BFS to find shortest path
   - Start at (0,0)
   - Target (GRID_SIZE-1, GRID_SIZE-1)
   - Avoid corrupted spaces
4. Return path length if found, or "No path exists" if blocked

## Visualization (Optional)
1. Print grid with:
   - '.' for safe spaces
   - '#' for corrupted spaces
   - 'O' for solution path

## Testing Strategy
1. Verify against sample input first:
   - Set SAMPLE_MODE = True
   - Process first 12 bytes
   - Confirm path length = 22
2. Run full solution:
   - Set SAMPLE_MODE = False
   - Process 1024 bytes
   - Find minimum steps to (70,70)

# Part 2: Finding the Critical Byte

## Problem Analysis
- Need to find the first byte that makes the exit unreachable
- Must process bytes one at a time until no path exists
- In sample puzzle, byte at (6,1) is the critical byte
- Must work with both sample (7x7) and full (71x71) grids

## Solution Approach
1. Modify existing solution to process bytes incrementally
2. After each byte falls:
   - Update grid with new corrupted space
   - Run pathfinding algorithm
   - Check if path still exists
3. Stop when first impossible path is found

## Implementation Changes
1. Create byte-by-byte processing function:
   ```python
   def process_bytes_until_blocked(coordinates):
       for i, (x, y) in enumerate(coordinates):
           add_byte(grid, x, y)
           if not path_exists():
               return (x, y)  # Return coordinates of blocking byte
   ```

2. Modify pathfinding to return boolean:
   ```python
   def path_exists():
       return bfs() is not None
   ```

## Testing Strategy
1. Verify with sample input:
   - Set SAMPLE_MODE = True
   - Process bytes until blocked
   - Confirm blocking coordinates are (6,1)
2. Run full solution:
   - Set SAMPLE_MODE = False
   - Process bytes until blocked
   - Return coordinates as "x,y" format

## Output Format
- Return two integers separated by a comma
- No additional characters (spaces, parentheses, etc.)
- Example: "6,1" for sample puzzle

## Verification
1. Check sample puzzle first
2. Ensure coordinates are within grid bounds
3. Verify no path exists after blocking byte
4. Confirm path existed before blocking byte