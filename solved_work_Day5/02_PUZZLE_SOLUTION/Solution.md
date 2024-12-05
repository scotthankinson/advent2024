# Puzzle Analysis and Solution Plan

## Part 1: Finding Valid Updates

### Problem Overview
- We need to determine which safety manual updates are in the correct order
- Each update must follow specific page ordering rules
- For correctly ordered updates, we need to find their middle page numbers and sum them

### Key Requirements
1. **Input Format**:
   - First section: Page ordering rules (X|Y format)
   - Second section: Lists of pages to be printed (comma-separated numbers)

2. **Rules**:
   - Format X|Y means page X must be printed before page Y
   - Pages don't need to be immediately consecutive
   - Only rules involving pages in the current update apply
   - Order is valid if all applicable rules are satisfied

3. **Goal**: 
   - Find updates that satisfy all their applicable rules
   - For each valid update, identify the middle page number
   - Sum all middle page numbers from valid updates

### Solution Steps

1. **Parse Input**
   - Split input into rules section and updates section
   - Convert rules into a structured format (dependency graph)
   - Parse each update into a list of numbers

2. **Rule Processing**
   - For each update:
     - Identify applicable rules (only those where both pages exist in update)
     - Create a subset of rules for validation

3. **Update Validation**
   - For each update:
     - Check if the order satisfies all applicable rules
     - Mark update as valid or invalid

4. **Middle Page Calculation**
   - For each valid update:
     - Find the middle position
     - Extract the middle page number
     - Add to running sum

5. **Output**
   - Return the sum of all middle page numbers from valid updates

### Example Validation Process
Using the sample from puzzle.txt:
```
75,47,61,53,29 (Valid)
- Rules checked: 75|47, 75|61, 75|53, 47|61, 47|53, 61|53, etc.
- Middle page: 61

97,61,53,29,13 (Valid)
- Rules checked: 97|61, 97|53, 97|29, 61|53, 61|29, etc.
- Middle page: 53

75,29,13 (Valid)
- Rules checked: 75|29, 75|13, 29|13
- Middle page: 29
```

### Expected Output
The puzzle asks for the sum of middle page numbers from all correctly ordered updates in the input file. Based on the example, this would be calculated as: 61 + 53 + 29 = 143

## Part 2: Fixing Invalid Updates

### Problem Overview
- Focus on the incorrectly-ordered updates from Part 1
- Reorder these updates according to the page ordering rules
- Find the middle page numbers of the corrected sequences
- Sum these middle page numbers

### Key Requirements
1. **Input Processing**:
   - Use only the updates identified as invalid in Part 1
   - Apply the same rules from Part 1

2. **Reordering Process**:
   - Take each invalid update
   - Rearrange pages to satisfy all applicable rules
   - Maintain all original pages in the update

3. **Goal**: 
   - Find the middle page number of each corrected sequence
   - Sum these middle numbers together

### Solution Steps

1. **Invalid Update Collection**
   - Filter out updates marked as invalid from Part 1
   - Keep track of original and required ordering rules

2. **Sequence Reordering**
   - For each invalid update:
     - Use topological sort based on applicable rules
     - Generate the correct order of pages

3. **Middle Number Calculation**
   - For each reordered sequence:
     - Find the middle position
     - Extract the middle page number
     - Add to running sum

### Example Process
From the puzzle example:
```
Original Invalid -> Corrected Order
75,97,47,61,53 -> 97,75,47,61,53 (middle: 47)
61,13,29 -> 61,29,13 (middle: 29)
97,13,75,29,47 -> 97,75,47,29,13 (middle: 47)
```

### Expected Output
Sum of middle numbers from corrected invalid sequences: 47 + 29 + 47 = 123