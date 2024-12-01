# Historian Hysteria Puzzle Solution

## Part 1: Distance Calculation

### Problem Overview
The Chief Historian is missing, and two groups of Senior Historians have created lists of location IDs to search. The lists need to be compared to determine how different they are from each other.

### Solution Steps
1. Sort both lists in ascending order
2. Pair up numbers from each list based on their position (smallest with smallest, etc.)
3. Calculate the absolute difference between each pair
4. Sum all the differences to get the total distance

### Example
Using the sample data:
```
Left List: 1, 2, 3, 3, 3, 4
Right List: 3, 3, 3, 4, 5, 9

Pairs and distances:
1 ↔ 3 = 2
2 ↔ 3 = 1
3 ↔ 3 = 0
3 ↔ 4 = 1
3 ↔ 5 = 2
4 ↔ 9 = 5

Total distance = 11
```

## Part 2: Similarity Score Calculation

### Problem Overview
After further analysis, it's noticed that many location IDs appear in both lists. A similarity score needs to be calculated by multiplying each number in the left list by the frequency of its appearance in the right list.

### Solution Steps
1. For each number in the left list:
   - Count how many times it appears in the right list
   - Multiply the number by its frequency in the right list
   - Add this product to the running total
2. The final sum is the similarity score

### Example
Using the same sample data:
```
Left List: 3, 4, 2, 1, 3, 3
Right List: 4, 3, 5, 3, 9, 3

Calculations:
3 appears 3 times: 3 * 3 = 9
4 appears 1 time: 4 * 1 = 4
2 appears 0 times: 2 * 0 = 0
1 appears 0 times: 1 * 0 = 0
3 appears 3 times: 3 * 3 = 9
3 appears 3 times: 3 * 3 = 9

Total similarity score = 31
```