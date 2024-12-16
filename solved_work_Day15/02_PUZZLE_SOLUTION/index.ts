import * as fs from 'fs';

type Position = {
    x: number;
    y: number;
};

type Grid = string[][];

type ParsedInput = {
    movements: string;
    grid: Grid;
};

function parseInput(input: string): ParsedInput {
    const parts = input.split('\n\n');  // Split on blank line
    if (parts.length !== 2) {
        throw new Error('Invalid input format: expected grid and movements separated by blank line');
    }

    // Parse grid and convert to wide format
    const gridLines = parts[0].split('\n');
    const wideGrid = gridLines.map(line => {
        return line.split('').flatMap(char => {
            switch(char) {
                case '@': return ['@', '.'];
                case 'O': return ['[', ']'];
                case '#': return ['#', '#'];
                case '.': return ['.', '.'];
            }
        });
    });

    // Parse movements (combine all remaining lines and clean)
    const movements = parts[1].split('\n').join('').trim();

    return { movements, grid: wideGrid };
}

function findRobot(grid: Grid): Position {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === '@') {
                return { x, y };
            }
        }
    }
    throw new Error('Robot not found in grid');
}

function isValidMove(grid: Grid, pos: Position): 'valid' | 'wall' | 'box' {
    // Check bounds
    if (pos.y < 0 || pos.y >= grid.length || pos.x < 0 || pos.x >= grid[0].length) {
        return 'wall';
    }
    
    const cell = grid[pos.y][pos.x];
    if (cell === '.') return 'valid';
    if (cell === '[' || cell === ']') return 'box';
    return 'wall';
}

function canPushBox(grid: Grid, boxPos: Position, direction: string, depth: number = 0): boolean {
    if (depth > 20) return false;
    
    const indent = '  '.repeat(depth);
    console.log(`${indent}Checking push at (${boxPos.x},${boxPos.y}) direction ${direction}, depth ${depth}`);
    
    const targetPos = { ...boxPos };
    
    switch (direction) {
        case '<':
            targetPos.x -= 2;  // Check two spaces over (we're pushing against ']')
            if (targetPos.x < 0) return false;
            // If target space is empty, we can push
            if (grid[targetPos.y][targetPos.x] === '.') return true;
            // If target space is a box, check if that box can be pushed
            if (grid[targetPos.y][targetPos.x] === '[' || grid[targetPos.y][targetPos.x] === ']') {
                return canPushBox(grid, targetPos, direction, depth + 1);
            }
            return false;
        
        case '>':
            targetPos.x += 2;  // Check two spaces over (we're pushing against '[')
            if (targetPos.x + 1 >= grid[0].length) return false;
            if (grid[targetPos.y][targetPos.x] === '.') return true;
            if (grid[targetPos.y][targetPos.x] === '[' || grid[targetPos.y][targetPos.x] === ']') {
                return canPushBox(grid, { x: targetPos.x, y: targetPos.y }, direction, depth + 1);
            }
            return false;
            
        case '^': {
            targetPos.y -= 1;
            if (targetPos.y < 0) {
                console.log(`${indent}Out of bounds`);
                return false;
            }

            const pushingOnLeft = grid[boxPos.y][boxPos.x] === '[';
            const leftX = pushingOnLeft ? boxPos.x : boxPos.x - 1;
            const rightX = leftX + 1;

            console.log(`${indent}Checking above at (${leftX},${targetPos.y}) and (${rightX},${targetPos.y})`);
            console.log(`${indent}Found: '${grid[targetPos.y][leftX]}' and '${grid[targetPos.y][rightX]}'`);

            // First, verify both target spaces are not walls
            if (grid[targetPos.y][leftX] === '#' || grid[targetPos.y][rightX] === '#') {
                console.log(`${indent}Found wall, push blocked`);
                return false;
            }

            // Check if there's a '][' pattern above
            if (grid[targetPos.y][leftX] === ']' && grid[targetPos.y][rightX] === '[') {
                console.log(`${indent}Found '][' pattern, checking both boxes`);
                // Verify spaces for both boxes
                if (grid[targetPos.y][leftX - 1] === '#' || grid[targetPos.y][rightX + 1] === '#') {
                    console.log(`${indent}Found wall blocking connected boxes`);
                    return false;
                }
                const leftBoxPushable = canPushBox(grid, { x: leftX, y: targetPos.y }, direction, depth + 1);
                const rightBoxPushable = canPushBox(grid, { x: rightX, y: targetPos.y }, direction, depth + 1);
                console.log(`${indent}Left box pushable: ${leftBoxPushable}, Right box pushable: ${rightBoxPushable}`);
                return leftBoxPushable && rightBoxPushable;
            }
            
            // If no '][' pattern, check for single box or empty space
            if (grid[targetPos.y][leftX] === '.' && grid[targetPos.y][rightX] === '.') {
                console.log(`${indent}Found empty space`);
                return true;
            }
            
            // Check for any box above (complete or partial)
            if ((grid[targetPos.y][leftX] === '[' || grid[targetPos.y][leftX] === ']') ||
                (grid[targetPos.y][rightX] === '[' || grid[targetPos.y][rightX] === ']')) {
                
                // If we see a ']', the box starts one position left
                // If we see a '[', that's the start of the box
                let boxLeftX = grid[targetPos.y][leftX] === ']' ? leftX - 1 : leftX;
                if (grid[targetPos.y][rightX] === '[') {
                    boxLeftX = rightX;
                }
                
                // Verify both spaces for the box we're pushing are valid
                if (grid[targetPos.y][boxLeftX] === '#' || grid[targetPos.y][boxLeftX + 1] === '#') {
                    console.log(`${indent}Found wall blocking box movement`);
                    return false;
                }
                
                console.log(`${indent}Found box starting at ${boxLeftX}, checking if pushable`);
                return canPushBox(grid, { x: boxLeftX, y: targetPos.y }, direction, depth + 1);
            }

            console.log(`${indent}No valid push found`);
            return false;
        }
        
        case 'v': {
            targetPos.y += 1;
            if (targetPos.y >= grid.length) {
                console.log(`${indent}Out of bounds`);
                return false;
            }

            const pushingOnLeft = grid[boxPos.y][boxPos.x] === '[';
            const leftX = pushingOnLeft ? boxPos.x : boxPos.x - 1;
            const rightX = leftX + 1;

            console.log(`${indent}Checking below at (${leftX},${targetPos.y}) and (${rightX},${targetPos.y})`);
            console.log(`${indent}Found: '${grid[targetPos.y][leftX]}' and '${grid[targetPos.y][rightX]}'`);

            // First, verify both target spaces are not walls
            if (grid[targetPos.y][leftX] === '#' || grid[targetPos.y][rightX] === '#') {
                console.log(`${indent}Found wall, push blocked`);
                return false;
            }

            // Check if there's a '][' pattern below
            if (grid[targetPos.y][leftX] === ']' && grid[targetPos.y][rightX] === '[') {
                console.log(`${indent}Found '][' pattern, checking both boxes`);
                // Verify spaces for both boxes
                if (grid[targetPos.y][leftX - 1] === '#' || grid[targetPos.y][rightX + 1] === '#') {
                    console.log(`${indent}Found wall blocking connected boxes`);
                    return false;
                }
                const leftBoxPushable = canPushBox(grid, { x: leftX, y: targetPos.y }, direction, depth + 1);
                const rightBoxPushable = canPushBox(grid, { x: rightX, y: targetPos.y }, direction, depth + 1);
                console.log(`${indent}Left box pushable: ${leftBoxPushable}, Right box pushable: ${rightBoxPushable}`);
                return leftBoxPushable && rightBoxPushable;
            }
            
            // If no '][' pattern, check for single box or empty space
            if (grid[targetPos.y][leftX] === '.' && grid[targetPos.y][rightX] === '.') {
                console.log(`${indent}Found empty space`);
                return true;
            }
            
            // Check for any box below (complete or partial)
            if ((grid[targetPos.y][leftX] === '[' || grid[targetPos.y][leftX] === ']') ||
                (grid[targetPos.y][rightX] === '[' || grid[targetPos.y][rightX] === ']')) {
                
                // If we see a ']', the box starts one position left
                // If we see a '[', that's the start of the box
                let boxLeftX = grid[targetPos.y][leftX] === ']' ? leftX - 1 : leftX;
                if (grid[targetPos.y][rightX] === '[') {
                    boxLeftX = rightX;
                }
                
                // Verify both spaces for the box we're pushing are valid
                if (grid[targetPos.y][boxLeftX] === '#' || grid[targetPos.y][boxLeftX + 1] === '#') {
                    console.log(`${indent}Found wall blocking box movement`);
                    return false;
                }
                
                console.log(`${indent}Found box starting at ${boxLeftX}, checking if pushable`);
                return canPushBox(grid, { x: boxLeftX, y: targetPos.y }, direction, depth + 1);
            }

            console.log(`${indent}No valid push found`);
            return false;
        }
        
        default:
            return false;
    }
}

function moveBox(grid: Grid, boxPos: Position, direction: string, depth: number = 0): boolean {
    const indent = '  '.repeat(depth);
    console.log(`${indent}Attempting to move box at (${boxPos.x},${boxPos.y}) direction ${direction}, depth ${depth}`);
    
    if (!canPushBox(grid, boxPos, direction)) {
        return false;
    }

    const targetPos = { ...boxPos };
    switch (direction) {
        case '<':
            targetPos.x -= 2;
            if (grid[targetPos.y][targetPos.x] === '[' || grid[targetPos.y][targetPos.x] === ']') {
                if (!moveBox(grid, targetPos, direction, depth + 1)) return false;
            }
            grid[boxPos.y][boxPos.x] = '.';
            grid[boxPos.y][boxPos.x + 1] = '.';
            grid[targetPos.y][targetPos.x] = '[';
            grid[targetPos.y][targetPos.x + 1] = ']';
            break;
            
        case '>':
            targetPos.x += 1;
            if (grid[targetPos.y][targetPos.x + 1] === '[' || grid[targetPos.y][targetPos.x + 1] === ']') {
                if (!moveBox(grid, { x: targetPos.x + 1, y: targetPos.y }, direction, depth + 1)) return false;
            }
            grid[boxPos.y][boxPos.x] = '.';
            grid[boxPos.y][boxPos.x + 1] = '.';
            grid[targetPos.y][targetPos.x] = '[';
            grid[targetPos.y][targetPos.x + 1] = ']';
            break;
            
        case '^': {
            targetPos.y -= 1;
            const pushingOnLeft = grid[boxPos.y][boxPos.x] === '[';
            const leftX = pushingOnLeft ? boxPos.x : boxPos.x - 1;
            const rightX = leftX + 1;

            // Check if there's a '][' pattern above
            if (grid[targetPos.y][leftX] === ']' && grid[targetPos.y][rightX] === '[') {
                // Move both boxes
                if (!moveBox(grid, { x: leftX, y: targetPos.y }, direction, depth + 1) ||
                    !moveBox(grid, { x: rightX, y: targetPos.y }, direction, depth + 1)) {
                    return false;
                }
            } else if ((grid[targetPos.y][leftX] === '[' || grid[targetPos.y][leftX] === ']') ||
                       (grid[targetPos.y][rightX] === '[' || grid[targetPos.y][rightX] === ']')) {
                // If we see a ']', the box starts one position left
                // If we see a '[', that's the start of the box
                let boxLeftX = grid[targetPos.y][leftX] === ']' ? leftX - 1 : leftX;
                if (grid[targetPos.y][rightX] === '[') {
                    boxLeftX = rightX;
                }
                
                if (!moveBox(grid, { x: boxLeftX, y: targetPos.y }, direction, depth + 1)) {
                    return false;
                }
            }

            // Move current box
            grid[boxPos.y][leftX] = '.';
            grid[boxPos.y][rightX] = '.';
            grid[targetPos.y][leftX] = '[';
            grid[targetPos.y][rightX] = ']';
            break;
        }
        
        case 'v': {
            targetPos.y += 1;
            const pushingOnLeft = grid[boxPos.y][boxPos.x] === '[';
            const leftX = pushingOnLeft ? boxPos.x : boxPos.x - 1;
            const rightX = leftX + 1;

            // Check if there's a '][' pattern below
            if (grid[targetPos.y][leftX] === ']' && grid[targetPos.y][rightX] === '[') {
                // Move both boxes
                if (!moveBox(grid, { x: leftX, y: targetPos.y }, direction, depth + 1) ||
                    !moveBox(grid, { x: rightX, y: targetPos.y }, direction, depth + 1)) {
                    return false;
                }
            } else if ((grid[targetPos.y][leftX] === '[' || grid[targetPos.y][leftX] === ']') ||
                       (grid[targetPos.y][rightX] === '[' || grid[targetPos.y][rightX] === ']')) {
                // If we see a ']', the box starts one position left
                // If we see a '[', that's the start of the box
                let boxLeftX = grid[targetPos.y][leftX] === ']' ? leftX - 1 : leftX;
                if (grid[targetPos.y][rightX] === '[') {
                    boxLeftX = rightX;
                }
                
                if (!moveBox(grid, { x: boxLeftX, y: targetPos.y }, direction, depth + 1)) {
                    return false;
                }
            }

            // Move current box
            grid[boxPos.y][leftX] = '.';
            grid[boxPos.y][rightX] = '.';
            grid[targetPos.y][leftX] = '[';
            grid[targetPos.y][rightX] = ']';
            break;
        }
    }

    return true;
}

function moveRobot(grid: Grid, direction: string): boolean {
    const robotPos = findRobot(grid);
    const newPos = { ...robotPos };

    switch (direction) {
        case '<': newPos.x -= 1; break;
        case '>': newPos.x += 1; break;
        case '^': newPos.y -= 1; break;
        case 'v': newPos.y += 1; break;
        default: return false;
    }

    const moveResult = isValidMove(grid, newPos);
    
    if (moveResult === 'wall') {
        console.log(`\nAttempting to move ${direction}: blocked by wall`);
        return false;
    }
    
    if (moveResult === 'box') {
        console.log(`\nAttempting to move ${direction} (box push):`);
        printGrid(grid);
        
        if (!moveBox(grid, newPos, direction)) {
            console.log('Push failed');
            printGrid(grid);
            return false;
        }
        
        console.log('Push successful');
    }

    // Update robot position
    grid[robotPos.y][robotPos.x] = '.';
    grid[newPos.y][newPos.x] = '@';
    
    printGrid(grid);
    return true;
}

function printGrid(grid: Grid) {
    console.log('Current grid state:');
    grid.forEach(row => console.log(row.join('')));
}

function calculateGPS(grid: Grid): number {
    let totalGPS = 0;
    
    // Find all '[' positions and calculate their GPS coordinates
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x] === '[') {
                // GPS = 100 * distance from top + distance from left
                const gps = 100 * y + x;
                totalGPS += gps;
            }
        }
    }
    
    return totalGPS;
}

export function solve_pt2(input: string): number {
    const { movements, grid } = parseInput(input);
    
    console.log('\nInitial state:');
    printGrid(grid);

    for (const move of movements) {
        if (!'<>^v'.includes(move)) continue;
        moveRobot(grid, move);
    }

    return calculateGPS(grid);
}

// Main execution
try {
    const input = fs.readFileSync('./src/input.txt', 'utf-8');
    console.log('Part 2 Solution:', solve_pt2(input));
} catch (error) {
    console.error('Error reading or processing file:', error);
}