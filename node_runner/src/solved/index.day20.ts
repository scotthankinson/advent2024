import { readFileSync } from 'fs';

interface Position {
    x: number;
    y: number;
}

interface CheatPath {
    start: Position;
    end: Position;
    length: number;
}

const DIRECTIONS = [
    { x: 0, y: 1 },  // down
    { x: 1, y: 0 },  // right
    { x: 0, y: -1 }, // up
    { x: -1, y: 0 }, // left
];

const posToString = (pos: Position): string => `${pos.x},${pos.y}`;

const stringToPos = (s: string): Position => {
    const [x, y] = s.split(',').map(Number);
    return { x, y };
};

const findStartEnd = (grid: string[][]): [Position, Position] => {
    let start: Position = { x: 0, y: 0 };
    let end: Position = { x: 0, y: 0 };
    
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x] === 'S') start = { x, y };
            if (grid[y][x] === 'E') end = { x, y };
        }
    }
    return [start, end];
};

const findShortestPath = (grid: string[][], start: Position, end: Position): number => {
    const queue: [Position, number][] = [[start, 0]];
    const visited = new Set<string>();
    visited.add(posToString(start));

    while (queue.length > 0) {
        const [current, steps] = queue.shift()!;

        if (current.x === end.x && current.y === end.y) {
            return steps;
        }

        for (const dir of DIRECTIONS) {
            const next: Position = {
                x: current.x + dir.x,
                y: current.y + dir.y
            };

            const nextPosStr = posToString(next);
            if (next.y < 0 || next.y >= grid.length ||
                next.x < 0 || next.x >= grid[0].length ||
                grid[next.y][next.x] === '#' ||
                visited.has(nextPosStr)) continue;

            visited.add(nextPosStr);
            queue.push([next, steps + 1]);
        }
    }

    return Infinity;
};

const findHonestlyReachablePositions = (grid: string[][], start: Position): Set<string> => {
    const reachable = new Set<string>();
    const queue: Position[] = [start];
    reachable.add(posToString(start));
    
    while (queue.length > 0) {
        const current = queue.shift()!;
        
        for (const dir of DIRECTIONS) {
            const next: Position = {
                x: current.x + dir.x,
                y: current.y + dir.y
            };
            
            if (next.y < 0 || next.y >= grid.length ||
                next.x < 0 || next.x >= grid[0].length ||
                grid[next.y][next.x] === '#') continue;
            
            const nextStr = posToString(next);
            if (!reachable.has(nextStr)) {
                reachable.add(nextStr);
                queue.push(next);
            }
        }
    }
    
    return reachable;
};

const findPotentialCheatEndpoints = (grid: string[][], start: Position): CheatPath[] => {
    const endpoints: CheatPath[] = [];
    
    for (let dy = -20; dy <= 20; dy++) {
        for (let dx = -20; dx <= 20; dx++) {
            if (Math.abs(dx) + Math.abs(dy) > 20) continue;
            
            const end: Position = {
                x: start.x + dx,
                y: start.y + dy
            };
            
            if (end.y < 0 || end.y >= grid.length ||
                end.x < 0 || end.x >= grid[0].length ||
                grid[end.y][end.x] === '#' ||
                (dx === 0 && dy === 0)) continue;
            
            endpoints.push({
                start,
                end,
                length: Math.abs(dx) + Math.abs(dy)
            });
        }
    }
    
    return endpoints;
};

const findAllValidPaths = (grid: string[][]): Map<string, number> => {
    const [start, end] = findStartEnd(grid);
    const cheats = new Map<string, number>();
    
    const distanceCache = new Map<string, number>();
    const getCachedDistance = (from: Position, to: Position): number => {
        const key = `${posToString(from)}-${posToString(to)}`;
        if (!distanceCache.has(key)) {
            distanceCache.set(key, findShortestPath(grid, from, to));
        }
        return distanceCache.get(key)!;
    };
    
    const baselineLength = getCachedDistance(start, end);
    console.log(`Baseline path length: ${baselineLength}`);
    
    const honestlyReachable = findHonestlyReachablePositions(grid, start);
    console.log(`Found ${honestlyReachable.size} honestly reachable positions`);
    
    let cheatsEvaluated = 0;
    let validCheatsFound = 0;
    let lastUpdateTime = Date.now();
    
    for (const posStr of honestlyReachable) {
        const pos = stringToPos(posStr);
        const potentialCheats = findPotentialCheatEndpoints(grid, pos);
        
        for (const cheat of potentialCheats) {
            cheatsEvaluated++;
            
            // Progress update every 10 seconds
            const currentTime = Date.now();
            if (currentTime - lastUpdateTime > 10000) {
                console.log(`Progress: evaluated ${cheatsEvaluated} cheats, found ${validCheatsFound} valid (${new Date().toLocaleTimeString()})`);
                lastUpdateTime = currentTime;
            }
            
            const startToCheatStart = getCachedDistance(start, cheat.start);
            const cheatEndToGoal = getCachedDistance(cheat.end, end);
            
            if (cheatEndToGoal === Infinity) continue;
            
            const totalLength = startToCheatStart + cheat.length + cheatEndToGoal;
            
            if (totalLength < baselineLength) {
                const key = `${posToString(cheat.start)}-${posToString(cheat.end)}`;
                if (!cheats.has(key) || cheats.get(key)! > cheat.length) {
                    cheats.set(key, cheat.length);
                    validCheatsFound++;
                }
            }
        }
    }
    
    console.log(`\nFinal stats: evaluated ${cheatsEvaluated} cheats, found ${validCheatsFound} valid`);
    return cheats;
};

export const solve_pt2 = (): number => {
    try {
        const input = readFileSync('src/input.txt', 'utf-8');
        const grid = input.trim().split('\n').map(line => line.split(''));
        
        const cheats = findAllValidPaths(grid);
        console.log(`Processing ${cheats.size} cheats for savings calculation...`);
        
        const savingsMap = new Map<number, number>();
        let processed = 0;
        let lastUpdateTime = Date.now();
        
        for (const [cheatKey, cheatLength] of cheats) {
            processed++;
            
            // Progress update every 10 seconds
            const currentTime = Date.now();
            if (currentTime - lastUpdateTime > 10000) {
                console.log(`Savings calculation progress: ${processed}/${cheats.size} cheats (${new Date().toLocaleTimeString()})`);
                lastUpdateTime = currentTime;
            }
            
            const [startStr, endStr] = cheatKey.split('-');
            const start = stringToPos(startStr);
            const end = stringToPos(endStr);
            
            const normalLength = findShortestPath(grid, start, end);
            const savings = normalLength - cheatLength;
            
            if (savings > 0) {
                savingsMap.set(savings, (savingsMap.get(savings) || 0) + 1);
            }
        }
        
        const sortedSavings = Array.from(savingsMap.entries())
            .sort((a, b) => a[0] - b[0])
            .filter(([savings, _]) => savings >= 50);
            
        console.log('\nCheats saving ≥ 50 picoseconds:');
        for (const [savings, count] of sortedSavings) {
            if (count === 1) {
                console.log(`There is one cheat that saves ${savings} picoseconds.`);
            } else {
                console.log(`There are ${count} cheats that save ${savings} picoseconds.`);
            }
        }
        
        return sortedSavings
            .filter(([savings, _]) => savings >= 100)
            .reduce((acc, [_, count]) => acc + count, 0);
    } catch (error) {
        console.error('Error reading or processing file:', error);
        return 0;
    }
};

export const solve_pt1 = (): number => {
    return 0;  // Part 1 disabled
};

export const start = (): void => {
    const part2Result = solve_pt2();
    console.log(`\nNumber of cheats saving ≥100 picoseconds: ${part2Result}`);
};

start();