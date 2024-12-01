# Puzzle Solution Plan

## Problem Analysis
- The puzzle involves calibration values hidden in text lines
- Each calibration value is formed by combining first and last digits in each line
- Digits can be actual numbers within text
- Need to process input.txt and sum all calibration values

## Example Understanding
From puzzle.txt example:
```
1abc2 -> 12
pqr3stu8vwx -> 38
a1b2c3d4e5f -> 15
treb7uchet -> 77
Sum = 142
```

## Solution Steps

1. **Input Processing**
   - Read each line from input.txt
   - Create array/list of lines for processing

2. **Line Processing**
   - For each line:
     - Find first digit
     - Find last digit
     - Combine them to form two-digit number
     - Convert to integer

3. **Calculation**
   - Sum all two-digit numbers
   - Track running total

4. **Output**
   - Return final sum as solution

## Implementation Notes
- Need to handle single-digit lines (use same digit twice)
- Only consider numeric digits (0-9)
- Process entire file sequentially
- Maintain accuracy in number combination