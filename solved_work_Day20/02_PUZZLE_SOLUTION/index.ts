"use strict";
import * as fs from 'fs';

interface Position {
    x: number;
    y: number;
}

const DIRECTIONS = [
    { dx: 0, dy: 1 },  // down
    { dx: 0, dy: -1 }, // up
    { dx: 1, dy: 0 },  // right
    { dx: -1, dy: 0 }  // left
];

const start = (): void => {
    console.log("Solution to part 1: ")
    console.log(solve_pt1());
    console.log("Solution to part 2: ")
    console.log(solve_pt2());
};

const isValidPosition = (grid: string[][], x: number, y: number): boolean => {
    if (x < 0 || x >= grid[0].length || y < 0 || y >= grid.length) {
        return false;
    }
    return grid[y][x] === '.' || grid[y][x] === 'S' || grid[y][x] === 'E';
};

const calculatePathSavings = (start: Position, end: Position): number => {
    // Base path is 84 picoseconds
    // Calculate Manhattan distance between points as new path length
    const pathLength = Math.abs(end.x - start.x) + Math.abs(end.y - start.y);
    return 84 - pathLength; // Positive number means we saved time
};

const solve_pt1 = () => {
    try {
        let data = fs.readFileSync('src/input.txt', 'utf8');
        const lines = data.split('\n');
        const grid = lines.map(line => line.split(''));
        
        const cheats = new Set<string>();
        let validCheatsCount = 0;

        console.log("Discovered cheats:");
        // Try all possible cheat combinations
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[0].length; x++) {
                if (!isValidPosition(grid, x, y)) continue;

                for (const move1 of DIRECTIONS) {
                    for (const move2 of DIRECTIONS) {
                        const endX = x + move1.dx + move2.dx;
                        const endY = y + move1.dy + move2.dy;

                        if (!isValidPosition(grid, endX, endY)) continue;

                        const cheatStart: Position = { x, y };
                        const cheatEnd: Position = { x: endX, y: endY };
                        
                        // Create unique key for this cheat
                        const cheatKey = `${x},${y}-${endX},${endY}`;
                        
                        if (!cheats.has(cheatKey)) {
                            const savings = calculatePathSavings(cheatStart, cheatEnd);
                            console.log(`Cheat from (${x},${y}) to (${endX},${endY}) saves ${savings} picoseconds`);
                            if (savings >= 100) {
                                cheats.add(cheatKey);
                                validCheatsCount++;
                                console.log(`  ^ This is a valid cheat! (≥100 picoseconds)`);
                            }
                        }
                    }
                }
            }
        }

        console.log(`\nTotal valid cheats (saving ≥100 picoseconds): ${validCheatsCount}`);
        return validCheatsCount;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const solve_pt2 = () => {
    return 0;
}

start();

export default start;