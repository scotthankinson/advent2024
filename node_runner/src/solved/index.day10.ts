import * as fs from 'fs';

interface Point {
    row: number;
    col: number;
}

type Grid = number[][];

function parseGrid(input: string): Grid {
    return input.trim().split('\n').map(line => 
        line.trim().split('').map(Number)
    );
}

function isValid(grid: Grid, point: Point): boolean {
    return point.row >= 0 && 
           point.row < grid.length && 
           point.col >= 0 && 
           point.col < grid[0].length;
}

function findTrailheads(grid: Grid): Point[] {
    const trailheads: Point[] = [];
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            if (grid[row][col] === 0) {
                trailheads.push({ row, col });
            }
        }
    }
    return trailheads;
}

function getNeighbors(grid: Grid, point: Point): Point[] {
    const { row, col } = point;
    const currentHeight = grid[row][col];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    return directions
        .map(([dr, dc]) => ({ row: row + dr, col: col + dc }))
        .filter(p => 
            isValid(grid, p) && 
            grid[p.row][p.col] === currentHeight + 1
        );
}

function findPeaks(grid: Grid, start: Point, visited: Set<string> = new Set()): Set<string> {
    const peaks = new Set<string>();
    const stack: Point[] = [start];
    
    while (stack.length > 0) {
        const current = stack.pop()!;
        const posKey = `${current.row},${current.col}`;
        
        if (visited.has(posKey)) continue;
        visited.add(posKey);
        
        const currentHeight = grid[current.row][current.col];
        
        if (currentHeight === 9) {
            peaks.add(posKey);
            continue;
        }
        
        const neighbors = getNeighbors(grid, current);
        for (const neighbor of neighbors) {
            stack.push(neighbor);
        }
    }
    
    return peaks;
}

function countUniquePaths(grid: Grid, current: Point, visited: Set<string> = new Set()): number {
    const currentHeight = grid[current.row][current.col];
    
    if (currentHeight === 9) {
        return 1;
    }
    
    const posKey = `${current.row},${current.col}`;
    visited.add(posKey);
    
    let pathCount = 0;
    const neighbors = getNeighbors(grid, current);
    
    for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        if (!visited.has(neighborKey)) {
            pathCount += countUniquePaths(grid, neighbor, new Set(visited));
        }
    }
    
    visited.delete(posKey);
    return pathCount;
}

function solve_pt1(input: string): number {
    const grid = parseGrid(input);
    const trailheads = findTrailheads(grid);
    
    let totalScore = 0;
    for (const trailhead of trailheads) {
        const peaks = findPeaks(grid, trailhead);
        totalScore += peaks.size;
    }
    
    return totalScore;
}

function solve_pt2(input: string): number {
    const grid = parseGrid(input);
    const trailheads = findTrailheads(grid);
    
    let totalRating = 0;
    for (const trailhead of trailheads) {
        const pathCount = countUniquePaths(grid, trailhead);
        totalRating += pathCount;
    }
    
    return totalRating;
}

function start() {
    const input = fs.readFileSync('./src/input.txt', 'utf8');
    console.log('Part 1:', solve_pt1(input));
    console.log('Part 2:', solve_pt2(input));
}

start();

export { solve_pt1, solve_pt2 };