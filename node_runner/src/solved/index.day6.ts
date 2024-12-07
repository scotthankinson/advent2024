import * as fs from 'fs';

const DEBUG = false;

type Direction = 'up' | 'right' | 'down' | 'left';
type Position = { x: number; y: number };

interface GuardState {
    position: Position;
    direction: Direction;
}

function debug(...args: any[]): void {
    if (DEBUG) {
        console.log(...args);
    }
}

function printGrid(grid: string[][]): void {
    if (!DEBUG) return;
    console.log('Current grid state:');
    console.log(grid.map(row => row.join('')).join('\n'));
    console.log();
}

function parseGrid(input: string): string[][] {
    return input.trim().split('\n').map(line => line.split(''));
}

function findGuardStart(grid: string[][]): Position | null {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === '^') {
                return { x, y };
            }
        }
    }
    return null;
}

function turnRight(direction: Direction): Direction {
    const directions: Direction[] = ['up', 'right', 'down', 'left'];
    const currentIndex = directions.indexOf(direction);
    return directions[(currentIndex + 1) % 4];
}

function getNextPosition(position: Position, direction: Direction): Position {
    switch (direction) {
        case 'up':
            return { x: position.x, y: position.y - 1 };
        case 'right':
            return { x: position.x + 1, y: position.y };
        case 'down':
            return { x: position.x, y: position.y + 1 };
        case 'left':
            return { x: position.x - 1, y: position.y };
    }
}

function isValidPosition(position: Position, grid: string[][]): boolean {
    return position.y >= 0 && 
           position.y < grid.length && 
           position.x >= 0 && 
           position.x < grid[0].length;
}

function isObstacle(position: Position, grid: string[][]): boolean {
    return grid[position.y][position.x] === '#';
}

function getStateKey(state: GuardState): string {
    return `${state.position.x},${state.position.y},${state.direction}`;
}

function simulateGuardMovement(grid: string[][]): Set<string> | null {
    const startPos = findGuardStart(grid);
    if (!startPos) {
        debug('No guard start position found!');
        return null;
    }

    const initialState: GuardState = {
        position: startPos,
        direction: 'up'
    };

    const visitedPositions = new Set<string>();
    const stateHistory = new Set<string>();
    let currentState = { ...initialState };

    while (true) {
        const stateKey = getStateKey(currentState);
        if (stateHistory.has(stateKey)) {
            debug('Loop detected!');
            return visitedPositions;
        }

        stateHistory.add(stateKey);
        visitedPositions.add(`${currentState.position.x},${currentState.position.y}`);

        let nextPos = getNextPosition(currentState.position, currentState.direction);
        
        if (!isValidPosition(nextPos, grid)) {
            debug('Guard exited the map!');
            return null;
        }

        if (isObstacle(nextPos, grid)) {
            currentState.direction = turnRight(currentState.direction);
            debug('Hit obstacle, turning right to', currentState.direction);
        } else {
            currentState.position = nextPos;
            debug('Moving to', nextPos);
        }
    }
}

function solve_pt2(input: string): number {
    const grid = parseGrid(input);
    const startPos = findGuardStart(grid);
    if (!startPos) {
        throw new Error('No guard start position found');
    }

    debug('Initial grid:');
    printGrid(grid);
    debug('Guard starts at:', startPos);

    let loopCount = 0;

    let positionCheck = 0;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x] === '.' && (x !== startPos.x || y !== startPos.y)) {
                debug(`\nTrying obstacle at (${x}, ${y})`);
                grid[y][x] = '#';
                const result = simulateGuardMovement(grid);
                if (result !== null) {
                    debug('Found valid loop configuration');
                    loopCount++;
                }
                grid[y][x] = '.';
            }
            positionCheck += 1;
            console.log("Checking " + positionCheck);
        }
    }

    return loopCount;
}

// Example usage:
const sample_input = fs.readFileSync('src/input.txt', 'utf-8');
console.log('Solution:', solve_pt2(sample_input));