# Puzzle Analysis and Solution Plan

## Part 1: Distance-Based Antinodes

### Problem Overview
- Find **antinodes** created by antennas on a map
- Goal: count **unique locations** that contain an antinode within the map bounds

### Key Rules
1. **Antenna Properties**:
   - Each antenna has a specific frequency (lowercase letter, uppercase letter, or digit)
   - Different case letters count as different frequencies (e.g., 'A' ≠ 'a')

2. **Antinode Formation**:
   - Occurs when two antennas of the **same frequency** are aligned
   - One antenna must be **twice** as far from the antinode as the other
   - Antinodes can occur at antenna locations
   - Only antennas of the same frequency interact

### Input Analysis
- Map size: 50x50 grid (based on input.txt)
- Contains various frequencies:
  - Lowercase letters (a, c, e, j, k, m, n, p, q, s, t, u, x, y)
  - Uppercase letters (A, C, E, J, K, M, N, P, Q, S, T, U, X, Y)
  - Digits (0-9)

### Solution Steps
1. **Data Preparation**:
   - Parse input.txt into a 2D grid
   - Create collections of antenna positions grouped by frequency

2. **Antinode Detection**:
   - For each frequency group:
     - Find all pairs of same-frequency antennas
     - For each pair:
       - Calculate potential antinode positions (two per pair)
       - Verify if antinodes fall within map bounds (0-49 for both x and y)
       - Store valid antinode positions

3. **Result Calculation**:
   - Collect all valid antinode positions
   - Remove duplicates (as multiple antenna pairs may create antinodes at the same spot)
   - Count unique positions

## Part 2: Resonant Harmonics

### Updated Problem Overview
- Find **antinodes** based on resonant harmonics
- Goal remains the same: count **unique locations** within map bounds containing an antinode

### Key Rule Changes
1. **New Antinode Formation Rules**:
   - Antinodes now occur at **any grid position** exactly in line with at least two antennas of the same frequency
   - Distance between antennas no longer matters
   - Antenna positions themselves are antinodes if they share a frequency with at least one other antenna
   - Must be perfectly aligned (horizontally, vertically, or diagonally)

### Solution Steps
1. **Data Preparation**:
   - Same as Part 1
   - Group antennas by frequency

2. **Enhanced Antinode Detection**:
   - For each frequency group with at least 2 antennas:
     a. **Line Detection**:
        - For each pair of antennas:
          * Calculate the line equation between them
          * Find all grid points that lie exactly on this line
          * Add all these points as potential antinodes
     b. **Antenna Position Check**:
        - Add antenna positions themselves as antinodes if the frequency appears more than once
     c. **Boundary Verification**:
        - Only keep antinodes within map bounds (0-49 for both x and y)

3. **Result Calculation**:
   - Collect all valid antinode positions
   - Remove duplicates
   - Count unique positions

### Implementation Considerations
1. Need efficient line equation calculation
2. Must handle all possible alignments:
   - Horizontal
   - Vertical
   - Diagonal
3. Precise coordinate tracking for line calculations
4. Boundary checking (0-49 for both x and y coordinates)
5. Efficient duplicate removal for final count
6. Special handling for antenna positions that qualify as antinodes