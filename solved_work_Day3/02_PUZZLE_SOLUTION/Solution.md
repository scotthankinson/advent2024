# Puzzle Solution Plan

## Part 1: Basic Multiplication Sum

### 1. Data Processing
1. Read the input.txt file content
2. Create a regular expression pattern to match valid mul() instructions:
   - Must start with "mul("
   - First number: 1-3 digits
   - Followed by comma
   - Second number: 1-3 digits
   - Must end with ")"

### 2. Instruction Processing
1. Find all matches in the input text that meet the pattern
2. For each match:
   - Extract the two numbers
   - Validate they are within 1-3 digits
   - Perform multiplication
   - Add result to running sum

### 3. Result Calculation
1. Sum all valid multiplication results
2. Return the final sum as the answer

### 4. Validation
1. Ensure the solution handles:
   - Valid mul() instructions
   - Ignores corrupted instructions
   - Handles multi-line input
   - Processes all numbers correctly

## Part 2: Toggle-Controlled Multiplication Sum

### 1. Data Processing
1. Read the input.txt file content
2. Create patterns to match:
   - Valid mul() instructions: same as Part 1
   - do() toggle instruction: exactly "do()"
   - don't() toggle instruction: exactly "don't()"

### 2. Instruction Processing
1. Initialize a boolean flag "counting" as true (start in counting state)
2. Process input sequentially, for each match:
   - If do() is found: set counting = true
   - If don't() is found: set counting = false
   - If mul() is found and counting is true:
     - Extract and validate numbers
     - Perform multiplication
     - Add result to running sum
   - If mul() is found and counting is false:
     - Skip this multiplication (ignore result)

### 3. Result Calculation
1. Sum only the multiplication results that occurred while counting was true
2. Return the final sum as the answer

### 4. Validation
1. Ensure the solution handles:
   - Proper toggle behavior of do() and don't()
   - Only counts multiplications when enabled
   - Maintains correct state through entire input
   - Processes all instructions in sequence
   - Handles nested or consecutive toggles correctly