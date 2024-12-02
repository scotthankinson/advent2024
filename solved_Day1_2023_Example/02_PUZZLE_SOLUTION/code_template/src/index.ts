"use strict";
import * as fs from "fs";

/**
 * Main entry point for the solution
 */
const start = (): void => {
    console.log("Part 1 Solution:", solve_pt1());
    console.log("Part 2 Solution:", solve_pt2());
};

/**
 * Finds the first digit in a string
 * @param line Input string to search
 * @returns First digit found or empty string if none found
 */
const findFirstDigit = (line: string): string => {
    const match = line.match(/\d/);
    return match ? match[0] : "";
};

/**
 * Finds the last digit in a string
 * @param line Input string to search
 * @returns Last digit found or empty string if none found
 */
const findLastDigit = (line: string): string => {
    const match = line.match(/\d/g);
    return match ? match[match.length - 1] : "";
};

/**
 * Processes a single line to get its calibration value
 * @param line Input line to process
 * @returns Two-digit number formed by first and last digits
 */
const getCalibrationValue = (line: string): number => {
    const firstDigit = findFirstDigit(line);
    const lastDigit = findLastDigit(line);
    
    // If no digits found, return 0
    if (!firstDigit) {
        return 0;
    }
    
    // If only one digit found, use it twice
    const value = parseInt(firstDigit + (lastDigit || firstDigit), 10);
    return value;
};

/**
 * Solves part 1 of the puzzle
 * @returns Sum of all calibration values
 */
const solve_pt1 = (): number => {
    try {
        // Read input file
        const data = fs.readFileSync("src/input.txt", "utf8");
        const lines = data.split("\n");
        
        // Process each line and calculate sum
        const sum = lines
            .filter(line => line.trim().length > 0)  // Remove empty lines
            .map(getCalibrationValue)
            .reduce((acc, curr) => acc + curr, 0);
        
        return sum;
    } catch (e) {
        console.error("Error:", e.stack);
        return -1;
    }
};

/**
 * Map of spelled-out numbers to their digit equivalents
 */
const numberWords: { [key: string]: string } = {
    'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
    'six': '6', 'seven': '7', 'eight': '8', 'nine': '9'
};

/**
 * Finds the first digit or spelled-out number in a string
 * @param line Input string to search
 * @returns First digit found (including spelled-out numbers)
 */
const findFirstDigitOrWord = (line: string): string => {
    let firstIndex = Infinity;
    let firstDigit = '';

    // Check for regular digits
    const digitMatch = line.match(/\d/);
    if (digitMatch) {
        firstIndex = line.indexOf(digitMatch[0]);
        firstDigit = digitMatch[0];
    }

    // Check for spelled-out numbers
    for (const [word, digit] of Object.entries(numberWords)) {
        const wordIndex = line.indexOf(word);
        if (wordIndex !== -1 && wordIndex < firstIndex) {
            firstIndex = wordIndex;
            firstDigit = digit;
        }
    }

    return firstDigit;
};

/**
 * Finds the last digit or spelled-out number in a string
 * @param line Input string to search
 * @returns Last digit found (including spelled-out numbers)
 */
const findLastDigitOrWord = (line: string): string => {
    let lastIndex = -1;
    let lastDigit = '';

    // Check for regular digits
    const digitMatches = [...line.matchAll(/\d/g)];
    if (digitMatches.length > 0) {
        const lastMatch = digitMatches[digitMatches.length - 1];
        lastIndex = lastMatch.index!;
        lastDigit = lastMatch[0];
    }

    // Check for spelled-out numbers
    for (const [word, digit] of Object.entries(numberWords)) {
        const wordIndex = line.lastIndexOf(word);
        if (wordIndex !== -1 && wordIndex > lastIndex) {
            lastIndex = wordIndex;
            lastDigit = digit;
        }
    }

    return lastDigit;
};

/**
 * Processes a single line to get its calibration value for part 2
 * @param line Input line to process
 * @returns Two-digit number formed by first and last digits (including spelled-out numbers)
 */
const getCalibrationValuePart2 = (line: string): number => {
    const firstDigit = findFirstDigitOrWord(line);
    const lastDigit = findLastDigitOrWord(line);
    
    // If no digits found, return 0
    if (!firstDigit) {
        return 0;
    }
    
    // If only one digit found, use it twice
    const value = parseInt(firstDigit + (lastDigit || firstDigit), 10);
    return value;
};

/**
 * Solves part 2 of the puzzle
 * @returns Sum of all calibration values including spelled-out numbers
 */
const solve_pt2 = (): number => {
    try {
        const data = fs.readFileSync("src/input.txt", "utf8");
        const lines = data.split("\n");
        
        // Process each line and calculate sum
        const sum = lines
            .filter(line => line.trim().length > 0)  // Remove empty lines
            .map(getCalibrationValuePart2)
            .reduce((acc, curr) => acc + curr, 0);
        
        return sum;
    } catch (e) {
        console.error("Error:", e.stack);
        return -1;
    }
};

// Start the solution
start();

export default start;