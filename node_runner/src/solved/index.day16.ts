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

interface DirectionalScore {
    [Direction.North]: number;
    [Direction.South]: number;
    [Direction.East]: number;
    [Direction.West]: number;
}

const getCoordKey = (x: number, y: number): string => `${x},${y}`;

const generateOptimalScoreMap = (grid: string[], end: Point): Map<string, DirectionalScore> => {
    const scoreMap = new Map<string, DirectionalScore>();
    const queue: Position[] = [];
    
    // Initialize end position with all directions
    for (let dir = 0; dir < 4; dir++) {
        queue.push({
            x: end.x,
            y: end.y,
            direction: dir,
            score: 0,
            path: new Set()
        });
        
        const key = getCoordKey(end.x, end.y);
        if (!scoreMap.has(key)) {
            scoreMap.set(key, {
                [Direction.North]: Infinity,
                [Direction.South]: Infinity,
                [Direction.East]: Infinity,
                [Direction.West]: Infinity
            });
        }
        scoreMap.get(key)![dir] = 0;
    }

    while (queue.length > 0) {
        queue.sort((a, b) => a.score - b.score);
        const current = queue.shift()!;

        // Try all possible moves backwards
        for (let dir = 0; dir < 4; dir++) {
            let newX = current.x;
            let newY = current.y;
            
            // Calculate position we came from
            switch (dir) {
                case Direction.North: newY++; break;
                case Direction.South: newY--; break;
                case Direction.East: newX--; break;
                case Direction.West: newX++; break;
            }

            if (newX >= 0 && newX < grid[0].length && 
                newY >= 0 && newY < grid.length && 
                grid[newY][newX] !== '#') {
                
                const newKey = getCoordKey(newX, newY);
                if (!scoreMap.has(newKey)) {
                    scoreMap.set(newKey, {
                        [Direction.North]: Infinity,
                        [Direction.South]: Infinity,
                        [Direction.East]: Infinity,
                        [Direction.West]: Infinity
                    });
                }

                // Calculate score including rotation if needed
                const rotationCost = (dir !== current.direction) ? 1000 : 0;
                const newScore = current.score + 1 + rotationCost;

                if (newScore < scoreMap.get(newKey)![dir]) {
                    scoreMap.get(newKey)![dir] = newScore;
                    queue.push({
                        x: newX,
                        y: newY,
                        direction: dir,
                        score: newScore,
                        path: new Set()
                    });
                }
            }
        }
    }

    return scoreMap;
};

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
    const optimalScoreMap = generateOptimalScoreMap(grid, end);
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
            // Enhanced pruning using optimal score map
            let queueDepth = queue.length;
            queue = queue.filter(pos => {
                const posKey = getCoordKey(pos.x, pos.y);
                const optimalScores = optimalScoreMap.get(posKey);
                if (!optimalScores) return false;
                
                // If current score plus best possible remaining score exceeds target, prune
                const bestPossibleRemaining = Math.min(
                    optimalScores[Direction.North],
                    optimalScores[Direction.South],
                    optimalScores[Direction.East],
                    optimalScores[Direction.West]
                );
                return pos.score + bestPossibleRemaining <= targetScore;
            });
            console.log("Discarded " + (queueDepth - queue.length) + " dead paths, " + queue.length + " paths remaining");
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