# Puzzle Analysis and Solution Plan

## Part 1: Basic File Compaction

### Problem Overview
- We need to help an amphipod compact files on a disk to create contiguous free space
- The input represents a disk map in a dense format
- The goal is to calculate a filesystem checksum after compacting the files

### Key Components

#### Input Format
1. The disk map uses alternating digits to represent:
   - File lengths
   - Free space lengths
2. Each file has an ID number based on its original order (starting from 0)

### Required Process
1. Move file blocks one at a time
2. Always move from the end of the disk
3. Place blocks in leftmost available free space
4. Continue until no gaps remain between file blocks

### Final Step
Calculate filesystem checksum by:
1. Multiply each block's position by its file ID
2. Skip free space blocks
3. Sum all results

### Solution Steps

1. **Parse Input**
   - Read the single long line of numbers
   - Split into alternating file/space lengths
   - Create initial disk representation with file IDs

2. **Implement File Movement**
   - Track current state of disk
   - Identify rightmost file block (signle digit)
   - Find leftmost free space
   - Move blocks one at a time
   - Update disk state after each move

3. **Calculate Checksum**
   - Iterate through final disk state
   - For each position:
     - If block contains file ID, multiply position × ID
     - If block is free space, skip
   - Sum all calculated values

### Expected Output
- A single integer representing the filesystem checksum after compaction

### Example Validation
Using the example from puzzle:
```
Disk Map: 2333133121414131402
Initial: 00...111...2...333.44.5555.6666.777.888899
Final:   0099811188827773336446555566
Checksum: 1928
```


## Part 1: Basic File Compaction

Excellent! That worked for the sample input and the full puzzle input. We need to modify the code now to implement part 2 -- let's makes sure that Part1 stays functional the whole time. Instead of moving single pieces of files one digit at a time, we should move entire blocks. For example:

00...111...2...333.44.5555.6666.777.888899
0099.111...2...333.44.5555.6666.777.8888..
0099.1117772...333.44.5555.6666.....8888..
0099.111777244.333....5555.6666.....8888..
00992111777.44.333....5555.6666.....8888..

On the first line we have our expanded initial state
On the second line, 99 has moved form the end to the open position just after 00
On the third line, 777 moves to the open 3-length spot after 111
etc

One important obsevation: 8888, 6666, and 5555 did not have valid moves at the time they were evaluated and stayed in place. That is to say, we evaluate blocks right to left but blocks are not reevaluated even if a new opening would allow for it to have moved. Do you think you can implement this part2 functionality?