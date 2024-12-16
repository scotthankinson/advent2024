import { readFileSync } from 'fs';

enum Direction {
    North = 0,
    East = 1,
    South = 2,
    West = 3
}

interface Point {
    x: number;
    y: number;
}

interface Position extends Point {
    direction: Direction;
    score: number;
    path: Set<string>;
}

const canPossiblyReachEnd = (pos: Position, end: Point, targetScore: number): boolean => {
    const remainingScore = targetScore - pos.score;
    const dx = end.x - pos.x;
    const dy = end.y - pos.y;
    
    // Calculate minimum rotations needed based on current direction
    let minRotations = 0;
    let minSteps = Math.abs(dx) + Math.abs(dy);

    switch (pos.direction) {
        case Direction.East:
            if (dx < 0) minRotations = 2; // Need to turn around (two rotations)
            if (dy !== 0) minRotations += 1; // Need one turn for Y adjustment
            break;
        case Direction.West:
            if (dx > 0) minRotations = 2; // Need to turn around
            if (dy !== 0) minRotations += 1; // Need one turn for Y adjustment
            break;
        case Direction.North:
            if (dy > 0) minRotations = 2; // Need to turn around
            if (dx !== 0) minRotations += 1; // Need one turn for X adjustment
            break;
        case Direction.South:
            if (dy < 0) minRotations = 2; // Need to turn around
            if (dx !== 0) minRotations += 1; // Need one turn for X adjustment
            break;
    }

    const minScore = minSteps + (minRotations * 1000);
    return remainingScore >= minScore;
};

const getCoordKey = (x: number, y: number): string => `${x},${y}`;

const move = (pos: Position, grid: string[]): Position[] => {
    const results: Position[] = [];
    const x = pos.x;
    const y = pos.y;

    // Can only move forward
    let newX = x;
    let newY = y;
    
    switch (pos.direction) {
        case Direction.North: newY--; break;
        case Direction.South: newY++; break;
        case Direction.East: newX++; break;
        case Direction.West: newX--; break;
    }

    if (newX >= 0 && newX < grid[0].length && 
        newY >= 0 && newY < grid.length && 
        grid[newY][newX] !== '#') {
        const newPath = new Set(pos.path);
        newPath.add(getCoordKey(newX, newY));
        results.push({
            x: newX,
            y: newY,
            direction: pos.direction,
            score: pos.score + 1,
            path: newPath
        });
    }

    return results;
}

const getRotations = (pos: Position): Position[] => {
    const results: Position[] = [];
    
    // Rotate left
    results.push({
        ...pos,
        direction: (pos.direction + 3) % 4,
        score: pos.score + 1000,
        path: new Set(pos.path)
    });
    
    // Rotate right
    results.push({
        ...pos,
        direction: (pos.direction + 1) % 4,
        score: pos.score + 1000,
        path: new Set(pos.path)
    });

    return results;
}

const findAllOptimalPaths = (grid: string[], start: Point, end: Point, targetScore: number): Set<string> => {
    let queue: Position[] = [];
    const allOptimalPaths = new Set<string>();
    let lastLogTime = Date.now();
    const LOG_INTERVAL = 3000; // Log every n seconds

    // Initialize with East facing direction
    const startPath = new Set<string>();
    startPath.add(getCoordKey(start.x, start.y));
    queue.push({
        x: start.x,
        y: start.y,
        direction: Direction.East,
        score: 0,
        path: startPath
    });

    while (queue.length > 0) {
        const current = queue.shift()!;

        // Progress logging and queue pruning
        if (Date.now() - lastLogTime > LOG_INTERVAL) {
            console.log(`Queue size: ${queue.length}, Current position: (${current.x},${current.y}), Current score: ${current.score}, Unique tiles found: ${allOptimalPaths.size}`);
            // Prune the queue
            let queueDepth = queue.length;
            queue = queue.filter(pos => canPossiblyReachEnd(pos, end, targetScore));
            console.log("Discarded " + (queueDepth - queue.length) + " dead paths");
            lastLogTime = Date.now();
            queue.sort((a, b) => b.score - a.score);
        }

        // If we've reached the end with the target score, collect the path
        if (current.x === end.x && current.y === end.y && current.score === targetScore) {
            current.path.forEach(coord => allOptimalPaths.add(coord));
            continue;
        }

        // Skip if we've exceeded the target score
        if (current.score >= targetScore) {
            continue;
        }

        // Try moving forward
        const movePositions = move(current, grid);
        queue.push(...movePositions);

        // Try rotations
        const rotations = getRotations(current);
        queue.push(...rotations);
        // queue.sort((a, b) => b.score - a.score);
    }

    return allOptimalPaths;
}

const solve = (input: string): number => {
    const grid = input.split('\n');
    let start: Point = { x: 0, y: 0 };
    let end: Point = { x: 0, y: 0 };

    // Find start and end positions
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === 'S') {
                start = { x, y };
            } else if (grid[y][x] === 'E') {
                end = { x, y };
            }
        }
    }

    const queue: Position[] = [];
    const visited = new Map<string, number>();

    // Initialize with East facing direction
    const startPath = new Set<string>();
    startPath.add(getCoordKey(start.x, start.y));
    queue.push({
        x: start.x,
        y: start.y,
        direction: Direction.East,
        score: 0,
        path: startPath
    });

    let minScore = Number.MAX_SAFE_INTEGER;

    while (queue.length > 0) {
        // Sort by score to ensure we explore lower-score paths first
        queue.sort((a, b) => a.score - b.score);
        const current = queue.shift()!;

        if (current.x === end.x && current.y === end.y) {
            if (current.score < minScore) {
                minScore = current.score;
            }
            continue;
        }

        const stateKey = `${current.x},${current.y},${current.direction}`;
        const currentBestScore = visited.get(stateKey);
        
        // Skip if we've seen this state with a better score
        if (currentBestScore !== undefined && currentBestScore <= current.score) {
            continue;
        }
        visited.set(stateKey, current.score);

        // Try moving forward
        const movePositions = move(current, grid);
        queue.push(...movePositions);

        // Try rotations
        const rotations = getRotations(current);
        queue.push(...rotations);
    }

    return minScore;
}

const solve_pt2 = (input: string): number => {
    const grid = input.split('\n');
    let start: Point = { x: 0, y: 0 };
    let end: Point = { x: 0, y: 0 };

    // Find start and end positions
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === 'S') {
                start = { x, y };
            } else if (grid[y][x] === 'E') {
                end = { x, y };
            }
        }
    }

    const minScore = solve(input);
    console.log(`Found minimum score: ${minScore}, searching for all paths with this score...`);
    
    const allTiles = findAllOptimalPaths(grid, start, end, minScore);
    return allTiles.size;
}

// Read input file
const input = readFileSync('src/input.txt', 'utf8');

// Solve part 1
const part1_solution = solve(input);
console.log("Solution to part 1: ");
console.log(part1_solution);

// Solve part 2
const part2_solution = solve_pt2(input);
console.log("Solution to part 2: ");
console.log(part2_solution);