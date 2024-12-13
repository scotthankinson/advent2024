# Puzzle Solution Plan

## Part 1: Original Coordinates
### Problem Understanding
1. **Goal**: Find the fewest tokens needed to win all possible prizes
2. **Cost Structure**:
   - Button A: 3 tokens per press
   - Button B: 1 token per press

### Key Constraints
1. **Movement**:
   - Each button moves the claw by specific X and Y coordinates
   - Must reach exact X and Y coordinates to win prize
2. **Limitations**:
   - Each button press must be ≤ 100 times per solution
   - Need to find valid solutions for as many machines as possible

### Solution Approach
1. For each claw machine:
   - Parse button movements (A and B)
   - Parse prize coordinates
   - Find valid combinations of A and B presses that:
     * Match both X and Y coordinates exactly
     * Use ≤ 100 presses for each button
   - Calculate token cost for valid solutions
   - Track if machine is solvable

2. For all solvable machines:
   - Sum up minimum token costs
   - This sum is the final answer

### Implementation Steps
1. Create function to parse input into structured data
2. For each machine:
   ```python
   for a_presses in range(0, 101):
       for b_presses in range(0, 101):
           check if combination reaches target X,Y
           if valid: calculate and store token cost
   ```
3. Track minimum token cost for each solvable machine
4. Sum all minimum costs for final answer

### Expected Output
- A single integer representing the minimum total tokens needed to win all possible prizes

### Validation
- Ensure solutions meet all constraints:
  * Exact coordinate matches
  * ≤ 100 button presses
  * Valid solutions found where possible
  * Minimum token costs calculated correctly

## Part 2: Adjusted Coordinates
### Problem Understanding
1. **Goal**: Same as Part 1, but with adjusted prize coordinates
2. **Cost Structure** (unchanged):
   - Button A: 3 tokens per press
   - Button B: 1 token per press
3. **Key Change**:
   - Add 10000000000000 to both X and Y coordinates of every prize

### Key Insights
1. **Scale Challenge**:
   - Prize coordinates are now much larger
   - Previous brute force approach won't work
   - Need mathematical approach using LCM (Least Common Multiple)

### Solution Approach
1. For each claw machine:
   - The problem can be expressed as two linear equations:
     * For X: a_presses * A_x + b_presses * B_x = target_X
     * For Y: a_presses * A_y + b_presses * B_y = target_Y
   - Use LCM to find the pattern of button presses that repeats
   - Find the smallest positive solution using modular arithmetic

2. Mathematical Process:
   ```python
   def find_solution(A_movement, B_movement, target):
       # Find period using LCM
       period = lcm(A_movement, B_movement)
       
       # Find base solution using modular arithmetic
       for i in range(period):
           if (A_movement * i) % period == target % period:
               return i
   ```

3. For each coordinate:
   - Find the base solution
   - Adjust for the large target number
   - Verify solution reaches exact coordinates

### Implementation Steps
1. Create LCM helper function
2. For each machine:
   - Solve X and Y coordinates independently using modular arithmetic
   - Combine solutions to find total button presses needed
   - Calculate token cost if solution exists

### Expected Output
- A single integer representing the minimum total tokens needed to win all possible prizes
- Note: Solutions will likely require many more than 100 button presses

### Validation
- Ensure solutions meet all constraints:
  * Exact coordinate matches
  * Solutions must be mathematically proven to work
  * Minimum token costs calculated correctly
  * Handle very large numbers properly