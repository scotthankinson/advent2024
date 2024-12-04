"use strict";
import * as fs from 'fs';

// Define the directions for searching (8 directions)
const directions: Array<[number, number]> = [
    [0, 1],   // right
    [1, 0],   // down
    [0, -1],  // left
    [-1, 0],  // up
    [1, 1],   // diagonal down-right
    [-1, -1], // diagonal up-left
    [-1, 1],  // diagonal up-right
    [1, -1]   // diagonal down-left
];

const start = (): void => {
    console.log("Solution to part 1: ")
    console.log(solve_pt1());
    // Part 2 is not needed for this puzzle
};

// Function to print the grid in a readable format
const printGrid = (grid: string[][]): void => {
    console.log("\nGrid Structure:");
    console.log("-".repeat(grid[0].length * 2 + 1));
    for (let row of grid) {
        console.log("|" + row.join(" ") + "|");
    }
    console.log("-".repeat(grid[0].length * 2 + 1));
};

// Convert linear string to 2D grid
const createGrid = (input: string): string[][] => {
    // Remove any whitespace or newlines
    input = input.replace(/\s/g, '');
    const size = Math.sqrt(input.length);
    
    // Verify if we have a perfect square
    if (!Number.isInteger(size)) {
        console.error(`Input length ${input.length} is not a perfect square`);
        return [];
    }
    
    console.log(`Creating grid of size ${size}x${size} from input of length ${input.length}`);
    const grid: string[][] = [];
    
    for (let i = 0; i < size; i++) {
        grid[i] = input.slice(i * size, (i + 1) * size).split('');
    }
    
    // Print the grid for verification
    printGrid(grid);
    return grid;
};

// Check if XMAS exists in a given direction from a starting position
const checkXMAS = (grid: string[][], row: number, col: number, direction: [number, number]): boolean => {
    const pattern = "XMAS";
    const size = grid.length;
    
    for (let i = 0; i < pattern.length; i++) {
        const newRow = row + direction[0] * i;
        const newCol = col + direction[1] * i;
        
        if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
            return false;
        }
        
        if (grid[newRow][newCol] !== pattern[i]) {
            return false;
        }
    }
    
    console.log("Found XMAS in " + direction + " from " + row + "," + col);
    return true;
};

const solve_pt1 = () => {
    try {
        let data = fs.readFileSync('./input.txt', 'utf8');
        const lines = data.split('\\n');
        let count = 0;
        
        // Process each line
        for (const line of lines) {
            if (line.trim() === '') continue;
            
            // Create grid from the line
            const grid = createGrid(line);
            if (grid.length === 0) continue; // Skip if grid creation failed
            
            const size = grid.length;
            
            // Check each position in the grid
            for (let row = 0; row < size; row++) {
                for (let col = 0; col < size; col++) {
                    // If current position is 'X', check all directions
                    if (grid[row][col] === 'X') {
                        for (const direction of directions) {
                            if (checkXMAS(grid, row, col, direction)) {
                                count++;
                            }
                        }
                    }
                }
            }
        }
        
        return count;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

start();

export default start;