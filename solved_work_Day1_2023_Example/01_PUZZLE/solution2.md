# Solution for Puzzle 2

This puzzle is a variation of the first calibration puzzle, but now we need to consider both numeric digits (0-9) and spelled-out numbers (one through nine) as valid digits.

## Approach

1. Create a dictionary to map spelled-out numbers to digits:
   ```python
   number_map = {
       'one': '1', 'two': '2', 'three': '3', 'four': '4',
       'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9'
   }
   ```

2. For each line:
   - Search for both numeric digits and spelled-out numbers
   - Keep track of their positions to find the true first and last digits
   - Convert spelled-out numbers to digits
   - Combine first and last digits into a two-digit number

3. Sum all calibration values

## Python Solution

```python
def find_calibration_value(line):
    # Dictionary for number words and their positions
    positions = {}
    
    # Find all spelled-out numbers
    number_words = {
        'one': '1', 'two': '2', 'three': '3', 'four': '4',
        'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9'
    }
    
    # Find positions of spelled-out numbers
    for word, digit in number_words.items():
        pos = 0
        while True:
            pos = line.find(word, pos)
            if pos == -1:
                break
            positions[pos] = digit
            pos += 1
    
    # Find positions of numeric digits
    for i, char in enumerate(line):
        if char.isdigit():
            positions[i] = char
    
    if not positions:
        return 0
        
    # Get first and last digits based on position
    first_pos = min(positions.keys())
    last_pos = max(positions.keys())
    
    return int(positions[first_pos] + positions[last_pos])

# Process input file
total = 0
with open('input.txt', 'r') as file:
    for line in file:
        value = find_calibration_value(line.strip())
        total += value

print(f"The sum of all calibration values is: {total}")
```

## Example Test Cases

From the puzzle example:
```
two1nine -> 29
eightwothree -> 83
abcone2threexyz -> 13
xtwone3four -> 24
4nineeightseven2 -> 42
zoneight234 -> 14
7pqrstsixteen -> 76
```

The sum of these values is 281, which matches the example output.

## Key Differences from Part 1

1. We now need to search for spelled-out numbers in addition to numeric digits
2. Position matters more than ever, as we need to find the true first and last digits
3. We need to handle overlapping cases (like "oneight" containing both "one" and "eight")
4. The solution needs to scan the string multiple times to find all possible numbers

The final solution will process the input.txt file and sum all calibration values according to these new rules.