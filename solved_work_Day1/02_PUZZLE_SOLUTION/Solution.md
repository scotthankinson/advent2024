# Puzzle Solution Plan: Historian Hysteria

## Problem Overview
- Two groups of Senior Historians have created lists of location IDs
- Need to reconcile differences between the lists
- Must pair numbers and calculate total distance between pairs
- Goal: Find total distance between left and right lists

## Solution Steps

1. **Data Processing**
   - Parse input.txt into two separate lists (left and right columns)
   - Convert all strings to integers for numerical comparison
   - Create two arrays to store left and right values

2. **List Sorting**
   - Sort both left and right lists independently in ascending order
   - This ensures we pair smallest with smallest, second-smallest with second-smallest, etc.

3. **Distance Calculation**
   - For each pair of numbers at the same index:
     - Calculate absolute difference between left and right number
     - Add this difference to running total
   - Continue until all pairs are processed

4. **Implementation Details**
   - Use array/list data structures for storage
   - Implement absolute value calculation for differences
   - Track running sum of all differences

5. **Validation**
   - Ensure both lists have same length
   - Verify all values are valid integers
   - Handle any potential edge cases

## Example (from puzzle.txt)
```
Input pairs:    Distance
1 and 3    →    2
2 and 3    →    1
3 and 3    →    0
3 and 4    →    1
3 and 5    →    2
4 and 9    →    5
Total:          11
```

## Expected Output
- Single integer representing total distance between all paired numbers
- Based on much larger dataset than example (500+ pairs)

## Part 2: Similarity Score Calculation

### New Problem Overview
- Instead of finding differences, we need to find similarities between lists
- Each number in the left list needs to be compared against all numbers in the right list
- Calculate how many times each left number appears in the right list
- Multiply each left number by its frequency in the right list
- Sum all these products for the final similarity score

### Solution Steps for Part 2

1. **Data Processing**
   - Keep the same input parsing from part 1
   - Maintain original order of lists (no sorting needed)

2. **Frequency Calculation**
   - For each number in left list:
     - Count how many times it appears in right list
     - Multiply the number by its frequency
     - Add to running total

3. **Implementation Details**
   - Use hash map/dictionary to track frequencies
   - Process each left number exactly once
   - Track running sum of products

### Example (from puzzle2.txt)
```
Left: 3,4,2,1,3,3
Right: 4,3,5,3,9,3

Calculations:
3 appears 3 times: 3 * 3 = 9
4 appears 1 time:  4 * 1 = 4
2 appears 0 times: 2 * 0 = 0
1 appears 0 times: 1 * 0 = 0
3 appears 3 times: 3 * 3 = 9
3 appears 3 times: 3 * 3 = 9

Total similarity score: 31
```

### Expected Output
- Single integer representing the total similarity score
- Each left number contributes (its value × its frequency in right list)
- Sum of all such products