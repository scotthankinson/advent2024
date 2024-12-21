# Puzzle Solution Plan

## Part 1: Two-Move Cheats
[Previous Part 1 content remains unchanged]

## Part 2: Extended Cheat Duration

### New Requirements
1. **Updated Cheat Mechanics**:
   - Single cheat allowed during race
   - Cheat can last up to 20 picoseconds (not just 2)
   - Must end on valid track
   - Each cheat still identified by unique start/end positions
   - Unused cheat time is lost (cannot be saved)

2. **Goal Specification**:
   - Count cheats that save ≥ 100 picoseconds
   - Base time remains 84 picoseconds
   - Need paths that complete in ≤ -16 picoseconds (84 - 100)

### Implementation Strategy
1. **Extended Path Analysis**:
   ```python
   def find_valid_cheat_paths(start_pos, max_duration=20):
       paths = []
       visited = set()
       
       def explore(current_pos, duration, path):
           if duration > max_duration:
               return
           
           if is_valid_track(current_pos):
               paths.append((path, duration))
           
           for direction in DIRECTIONS:  # Up, Down, Left, Right only
               next_pos = move(current_pos, direction)
               if valid_bounds(next_pos) and (next_pos not in visited):
                   visited.add(next_pos)
                   explore(next_pos, duration + 1, path + [next_pos])
                   visited.remove(next_pos)
   ```

2. **Cheat Validation Rules**:
   - Can pass through walls for up to 20 moves
   - Must end on valid track ('.' or 'E')
   - Store as (start_pos, end_pos) regardless of path taken
   - Calculate time savings based on:
     * Original path length (84)
     * New path length with cheat
     * Length of cheat sequence used

3. **Path Processing**:
   ```python
   class ExtendedCheat:
       start: Position
       end: Position
       cheat_duration: int
       total_savings: int

   def process_cheat(start, end, cheat_duration):
       # Calculate new total path length:
       # 1. Start to cheat_start
       # 2. Cheat duration
       # 3. cheat_end to final_destination
       total_time = (
           path_to_cheat_start +
           cheat_duration +
           path_from_cheat_end
       )
       return 84 - total_time  # savings
   ```

### Data Collection
- Track all unique cheats by start/end positions
- For each unique start/end pair:
  * Keep track of best saving achieved
  * Multiple paths between same points count as same cheat
  * Only need to store best version of each cheat

### Expected Output
- Count of all unique cheats saving ≥ 100 picoseconds
- Example shows cheats can save up to 76 picoseconds with just 6-move cheats
- With 20 moves available, expect significantly more possibilities

### Algorithm Complexity
- O(4^20) worst case for path exploration (pruned by valid moves)
- O(n²) for start position selection
- Space complexity: O(n²) for unique cheat storage

### Implementation Notes
1. Need efficient path finding for:
   - Base path calculations
   - Path to cheat start points
   - Path from cheat end points

2. Optimization Opportunities:
   - Cache frequently calculated paths
   - Prune invalid paths early
   - Track visited states to avoid cycles
   - Early termination when path exceeds best known

3. Validation Checks:
   - Ensure all paths end on valid track
   - Verify cheat duration ≤ 20
   - Confirm unique start/end pairs
   - Accurate time savings calculations