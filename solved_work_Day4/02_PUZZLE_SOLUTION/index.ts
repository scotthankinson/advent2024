import { readFileSync } from 'fs';

// Utility function to create grid from input
function createGrid(input: string): string[][] {
    return input.trim().split('\n').map(line => line.split(''));
}

// Part 1 solution
const directions = [
    [-1, -1], // up-left
    [-1, 0],  // up
    [-1, 1],  // up-right
    [0, -1],  // left
    [0, 1],   // right
    [1, -1],  // down-left
    [1, 0],   // down
    [1, 1]    // down-right
];

function checkXMAS(grid: string[][], row: number, col: number, direction: number[]): boolean {
    const pattern = 'XMAS';
    for (let i = 0; i < pattern.length; i++) {
        const newRow = row + (direction[0] * i);
        const newCol = col + (direction[1] * i);
        if (newRow < 0 || newRow >= grid.length || newCol < 0 || newCol >= grid[0].length) {
            return false;
        }
        if (grid[newRow][newCol] !== pattern[i]) {
            return false;
        }
    }
    return true;
}

function solve_pt1(input: string): number {
    const grid = createGrid(input);
    let count = 0;

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === 'X') {
                for (const direction of directions) {
                    if (checkXMAS(grid, row, col, direction)) {
                        count++;
                        break;
                    }
                }
            }
        }
    }

    return count;
}

// Part 2 solution
const diagonalDirections = [
    [-1, -1], // up-left
    [-1, 1],  // up-right
    [1, -1],  // down-left
    [1, 1]    // down-right
];

function getThreeLetterSequence(grid: string[][], row: number, col: number, direction: number[]): string {
    let sequence = '';
    for (let i = -1; i <= 1; i++) {
        const newRow = row + (direction[0] * i);
        const newCol = col + (direction[1] * i);
        if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
            sequence += grid[newRow][newCol];
        }
    }
    return sequence;
}

function checkXShapedMAS(grid: string[][], row: number, col: number): boolean {
    // Get diagonal sequences crossing at the 'A'
    const diagonal1 = getThreeLetterSequence(grid, row, col, diagonalDirections[0]); // up-left to down-right
    const diagonal2 = getThreeLetterSequence(grid, row, col, diagonalDirections[1]); // up-right to down-left

    console.log(`At position [${row},${col}], found diagonal sequences: ${diagonal1} and ${diagonal2}`);

    const isValidSequence = (seq: string) => seq === "MAS" || seq === "SAM";
    return isValidSequence(diagonal1) && isValidSequence(diagonal2);
}

function solve_pt2(input: string): number {
    const grid = createGrid(input);
    let count = 0;

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === 'A') {
                if (checkXShapedMAS(grid, row, col)) {
                    count++;
                }
            }
        }
    }

    return count;
}

// Main execution
function start() {
    const input = readFileSync('./input.txt', 'utf-8');
    console.log("Part 1 Solution:", solve_pt1(input));
    console.log("Part 2 Solution:", solve_pt2(input));
}

start();