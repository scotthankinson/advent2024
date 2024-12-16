import { readFileSync } from 'fs';

interface Position {
    x: number;
    y: number;
}

interface Robot {
    position: Position;
    velocity: Position;
}

// Add tracking for best configuration
interface GroupState {
    size: number;
    positions: Map<string, Robot[]>;
    time: number;
}

// Grid dimensions for each part
const SAMPLE_GRID = { width: 11, height: 7 };
const PUZZLE_GRID = { width: 101, height: 103 };
const SIMULATION_TIME_PT1 = 100;
const SIMULATION_TIME_PT2 = 10000000;

function positionToKey(x: number, y: number): string {
    return `${x},${y}`;
}

class SpatialGrid {
    private grid: Map<number, Map<number, Robot[]>>;
    
    constructor() {
        this.grid = new Map();
    }

    add(robot: Robot): void {
        const x = robot.position.x;
        const y = robot.position.y;
        if (!this.grid.has(x)) {
            this.grid.set(x, new Map());
        }
        if (!this.grid.get(x)!.has(y)) {
            this.grid.get(x)!.set(y, []);
        }
        this.grid.get(x)!.get(y)!.push(robot);
    }

    getPotentialNeighbors(pos: Position): Robot[] {
        const neighbors: Robot[] = [];
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                const x = pos.x + dx;
                const y = pos.y + dy;
                if (this.grid.has(x) && this.grid.get(x)!.has(y)) {
                    neighbors.push(...this.grid.get(x)!.get(y)!);
                }
            }
        }
        return neighbors;
    }

    clear(): void {
        this.grid.clear();
    }
}

function parseRobot(line: string): Robot {
    const [posStr, velStr] = line.split(' ');
    
    const posMatch = posStr.match(/p=(-?\d+),(-?\d+)/);
    if (!posMatch) throw new Error(`Invalid position format: ${posStr}`);
    
    const velMatch = velStr.match(/v=(-?\d+),(-?\d+)/);
    if (!velMatch) throw new Error(`Invalid velocity format: ${velStr}`);
    
    return {
        position: {
            x: parseInt(posMatch[1]),
            y: parseInt(posMatch[2])
        },
        velocity: {
            x: parseInt(velMatch[1]),
            y: parseInt(velMatch[2])
        }
    };
}

function updatePosition(pos: Position, vel: Position, width: number, height: number): Position {
    return {
        x: ((pos.x + vel.x) % width + width) % width,
        y: ((pos.y + vel.y) % height + height) % height
    };
}

function getQuadrant(pos: Position, width: number, height: number): number {
    const midX = Math.floor(width / 2);
    const midY = Math.floor(height / 2);
    
    if (pos.x === midX || pos.y === midY) return -1;
    
    if (pos.x < midX) {
        return pos.y < midY ? 0 : 2;
    } else {
        return pos.y < midY ? 1 : 3;
    }
}

function findContiguousGroups(robots: Robot[]): {
    maxGroupSize: number,
    allConnected: boolean,
    positions: Map<string, Robot[]>
} {
    const spatialGrid = new SpatialGrid();
    const positionMap = new Map<string, Robot[]>();
    
    // Build spatial grid and position map simultaneously
    robots.forEach(robot => {
        spatialGrid.add(robot);
        const posKey = positionToKey(robot.position.x, robot.position.y);
        if (!positionMap.has(posKey)) {
            positionMap.set(posKey, []);
        }
        positionMap.get(posKey)!.push(robot);
    });

    let maxGroupSize = 0;
    let robotsWithoutNeighbors = 0;
    const visited = new Set<string>();

    function getConnectedGroupSize(pos: Position): number {
        const posKey = positionToKey(pos.x, pos.y);
        if (visited.has(posKey)) return 0;
        visited.add(posKey);

        let groupSize = positionMap.get(posKey)!.length;
        const neighbors = spatialGrid.getPotentialNeighbors(pos);
        
        for (const neighbor of neighbors) {
            const neighborKey = positionToKey(neighbor.position.x, neighbor.position.y);
            if (!visited.has(neighborKey)) {
                groupSize += getConnectedGroupSize(neighbor.position);
            }
        }
        
        return groupSize;
    }

    // Process positions using spatial grid
    for (const [posKey, robotsHere] of positionMap.entries()) {
        if (!visited.has(posKey)) {
            const [x, y] = posKey.split(',').map(Number);
            const groupSize = getConnectedGroupSize({x, y});
            maxGroupSize = Math.max(maxGroupSize, groupSize);
            
            const neighbors = spatialGrid.getPotentialNeighbors({x, y});
            if (robotsHere.length === 1 && neighbors.length === 0) {
                robotsWithoutNeighbors += 1;
            }
        }
    }

    return {
        maxGroupSize,
        allConnected: robotsWithoutNeighbors === 0,
        positions: positionMap
    };
}

function drawGrid(positions: Map<string, Robot[]>, width: number, height: number) {
    console.log('\nGrid visualization:');
    
    // Find bounds
    let minX = width, maxX = 0, minY = height, maxY = 0;
    for (const [posKey] of positions) {
        const [x, y] = posKey.split(',').map(Number);
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
    }

    // Add padding
    minX = Math.max(0, minX - 1);
    maxX = Math.min(width - 1, maxX + 1);
    minY = Math.max(0, minY - 1);
    maxY = Math.min(height - 1, maxY + 1);

    // Draw grid
    for (let y = minY; y <= maxY; y++) {
        let line = '';
        for (let x = minX; x <= maxX; x++) {
            const posKey = positionToKey(x, y);
            if (positions.has(posKey)) {
                const count = positions.get(posKey)!.length;
                line += count > 9 ? '*' : count;
            } else {
                line += '.';
            }
        }
        console.log(line);
    }
}

function solve_pt1(input: string): number {
    const robots: Robot[] = input.trim().split('\n').map(parseRobot);
    
    console.log('Part 1 - Initial robot positions:');
    robots.forEach((robot, i) => {
        console.log(`Robot ${i}: pos=(${robot.position.x}, ${robot.position.y}), vel=(${robot.velocity.x}, ${robot.velocity.y})`);
    });

    for (let second = 0; second < SIMULATION_TIME_PT1; second++) {
        robots.forEach(robot => {
            robot.position = updatePosition(robot.position, robot.velocity, SAMPLE_GRID.width, SAMPLE_GRID.height);
        });
        
        if (second % 10 === 0) {
            console.log(`\nPositions at second ${second}:`);
            robots.forEach((robot, i) => {
                console.log(`Robot ${i}: (${robot.position.x}, ${robot.position.y})`);
            });
        }
    }

    console.log('\nFinal positions:');
    robots.forEach((robot, i) => {
        console.log(`Robot ${i}: (${robot.position.x}, ${robot.position.y})`);
    });

    const quadrantCounts = [0, 0, 0, 0];
    robots.forEach(robot => {
        const quadrant = getQuadrant(robot.position, SAMPLE_GRID.width, SAMPLE_GRID.height);
        console.log(`Calculating quadrant for position (${robot.position.x}, ${robot.position.y}), midX=${Math.floor(SAMPLE_GRID.width/2)}, midY=${Math.floor(SAMPLE_GRID.height/2)}`);
        console.log(`Assigned to quadrant ${quadrant}`);
        if (quadrant !== -1) {
            quadrantCounts[quadrant]++;
        }
    });

    console.log('Quadrant counts:', quadrantCounts);
    
    const safetyFactor = quadrantCounts.reduce((acc, count) => acc * count, 1);
    console.log(`Safety factor calculation: ${quadrantCounts.join(' × ')} = ${safetyFactor}`);
    
    return safetyFactor;
}

function solve_pt2(input: string): number {
    const robots: Robot[] = input.trim().split('\n').map(parseRobot);
    
    console.log('\nPart 2 - Initial robot positions:');
    console.log(`Total robots: ${robots.length}`);
    
    let bestConfiguration: GroupState = {
        size: 0,
        positions: new Map(),
        time: 0
    };
    let foundAllConnected = false;

    // Simulate until all robots are connected or time limit reached
    for (let second = 0; second <= SIMULATION_TIME_PT2; second++) {
        const { maxGroupSize, allConnected, positions } = findContiguousGroups(robots);
        
        // Track best configuration
        if (maxGroupSize > bestConfiguration.size) {
            bestConfiguration = {
                size: maxGroupSize,
                positions: new Map(positions), // Create a deep copy
                time: second
            };
            console.log(`\nNew maximum group size at time ${second}: ${maxGroupSize}`);
        }
        
        if (allConnected && !foundAllConnected) {
            console.log(`\nAll robots connected at time ${second}`);
            drawGrid(positions, PUZZLE_GRID.width, PUZZLE_GRID.height);
            foundAllConnected = true;
            return second;
        }

        // Show best configuration every 100,000 seconds
        if (second % 100_000 === 0) {
            console.log(`\nTime ${second}:`);
            console.log(`Current maximum group size: ${maxGroupSize}`);
            console.log(`Best group size so far: ${bestConfiguration.size} (at time ${bestConfiguration.time})`);
            console.log('\nBest configuration found so far:');
            drawGrid(bestConfiguration.positions, PUZZLE_GRID.width, PUZZLE_GRID.height);
        }

        // Update positions for next second
        robots.forEach(robot => {
            robot.position = updatePosition(
                robot.position, 
                robot.velocity, 
                PUZZLE_GRID.width, 
                PUZZLE_GRID.height
            );
        });
    }

    console.log('\nSimulation completed without finding all robots connected');
    console.log(`Best group size achieved: ${bestConfiguration.size} at time ${bestConfiguration.time}`);
    return -1;
}

export function start() {
    console.log('Solution to puzzle:');
    const input = readFileSync('src/input.txt', 'utf-8');
    console.log(solve_pt1(input));
    console.log(solve_pt2(input));
}

start();