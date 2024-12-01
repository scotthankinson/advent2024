#!/usr/bin/env python3

def find_calibration_value(line: str) -> int:
    """
    Find the calibration value in a line by combining first and last digits.
    Handles both numeric digits and spelled-out numbers.
    """
    # Map of spelled-out numbers to digits
    number_map = {
        'one': '1', 'two': '2', 'three': '3', 'four': '4',
        'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9'
    }
    
    # Dictionary to store positions of all found numbers
    positions = {}
    
    # Find positions of spelled-out numbers
    for word, digit in number_map.items():
        pos = 0
        while True:
            pos = line.find(word, pos)
            if pos == -1:
                break
            positions[pos] = digit
            pos += 1  # Increment by 1 to handle overlapping numbers
    
    # Find positions of numeric digits
    for i, char in enumerate(line):
        if char.isdigit():
            positions[i] = char
    
    if not positions:
        return 0
    
    # Get first and last digits based on position
    sorted_positions = sorted(positions.items())
    first_digit = sorted_positions[0][1]
    last_digit = sorted_positions[-1][1]
    
    # Combine digits and convert to integer
    return int(first_digit + last_digit)

def process_calibration_file(filename: str) -> int:
    """
    Process the calibration file and return the sum of all calibration values.
    """
    total = 0
    try:
        with open(filename, 'r') as file:
            for line in file:
                line = line.strip()
                if line:  # Skip empty lines
                    value = find_calibration_value(line)
                    total += value
        return total
    except FileNotFoundError:
        print(f"Error: File '{filename}' not found.")
        return 0
    except Exception as e:
        print(f"Error processing file: {e}")
        return 0

def main():
    """
    Main function to run the calibration process.
    """
    filename = "input.txt"  # Update with actual input file name
    total = process_calibration_file(filename)
    print(f"Total calibration value: {total}")

if __name__ == "__main__":
    main()