"use strict";
import * as fs from 'fs';

// Types
type Point = {
    x: number;
    y: number;
};

type QueueItem = {
    point: Point;
    steps: number;
};

const SAMPLE_MODE = true; // Toggle between sample (7x7) and full (71x71)
const GRID_SIZE = SAMPLE_MODE ? 7 : 71;
const BYTES_TO_PROCESS = SAMPLE_MODE ? 12 : 1024;

const start = (): void => {
    console.log("Solution to part 1: ")
    console.log(solve_pt1());
    console.log("Solution to part 2: ")
    console.log(solve_pt2());
};

const createGrid = (size: number): string[][] => {
    return Array(size).fill('.').map(() => Array(size).fill('.'));
};

const isValidMove = (x: number, y: number, grid: string[][]): boolean => {
    return x >= 0 && x < grid.length && y >= 0 && y < grid.length && grid[y][x] === '.';
};

// Function to visualize the grid
const printGrid = (grid: string[][], visited: Set<string> = new Set()): void => {
    console.log("\nCurrent Grid State:");
    for (let y = 0; y < grid.length; y++) {
        let row = '';
        for (let x = 0; x < grid[y].length; x++) {
            if (visited.has(`${x},${y}`)) {
                row += 'O'; // Mark visited path
            } else {
                row += grid[y][x];
            }
        }
        console.log(row);
    }
    console.log(); // Empty line for readability
};

const findShortestPath = (grid: string[][]): number => {
    const movements = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    const queue: QueueItem[] = [{ point: { x: 0, y: 0 }, steps: 0 }];
    const visited = new Set<string>();
    const target = { x: grid.length - 1, y: grid.length - 1 };

    visited.add('0,0');

    while (queue.length > 0) {
        const current = queue.shift()!;
        const { x, y } = current.point;

        if (x === target.x && y === target.y) {
            return current.steps;
        }

        for (const [dx, dy] of movements) {
            const newX = x + dx;
            const newY = y + dy;
            const key = `${newX},${newY}`;

            if (isValidMove(newX, newY, grid) && !visited.has(key)) {
                visited.add(key);
                queue.push({
                    point: { x: newX, y: newY },
                    steps: current.steps + 1
                });
            }
        }
    }

    return -1; // No path exists
};

// Function to check if a path exists (returns boolean)
const pathExists = (grid: string[][]): boolean => {
    return findShortestPath(grid) !== -1;
};

const solve_pt1 = () => {
    try {
        let data = fs.readFileSync('input.txt', 'utf8');
        const lines = data.split('\n');
        const grid = createGrid(GRID_SIZE);
        
        // Process only the first N bytes based on mode
        const bytesToProcess = Math.min(BYTES_TO_PROCESS, lines.length);
        
        // Mark corrupted spaces
        for (let i = 0; i < bytesToProcess; i++) {
            const [x, y] = lines[i].split(',').map(Number);
            if (x < GRID_SIZE && y < GRID_SIZE) {
                grid[y][x] = '#';
            }
        }

        const shortestPath = findShortestPath(grid);
        return shortestPath === -1 ? "No path exists" : shortestPath;

    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
};

const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('input.txt', 'utf8');
        const lines = data.split('\n');
        const grid = createGrid(GRID_SIZE);
        
        // Process bytes one at a time until path is blocked
        for (let i = 0; i < lines.length; i++) {
            const [x, y] = lines[i].split(',').map(Number);
            if (x < GRID_SIZE && y < GRID_SIZE) {
                grid[y][x] = '#';
                
                // Check if path still exists after adding this byte
                if (!pathExists(grid)) {
                    // Return the coordinates of the blocking byte as "x,y"
                    return `${x},${y}`;
                }
            }
        }

        return "All bytes processed, path still exists";

    } catch (e) {
        console.log('Error:', e.stack);
    }
    return "Error processing input";
};

start();

export default start;