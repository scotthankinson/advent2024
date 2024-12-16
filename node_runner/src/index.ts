import * as fs from 'fs';

interface Position {
    x: number;
    y: number;
}

class WideWarehouse {
    private walls: boolean[][];  // true for walls, false for empty spaces
    private boxes: Position[];   // array of box positions (left edge)
    private robot: Position;     // robot position
    private width: number;
    private height: number;
    private movements: string;

    constructor(input: string) {
        // Split input into map and movements
        const parts = input.split('\n\n');
        const mapLines = parts[0].split('\n');
        
        // Initialize dimensions
        this.height = mapLines.length;
        this.width = mapLines[0].length * 2; // double width for wide format
        
        // Initialize walls grid
        this.walls = Array(this.height).fill(null)
            .map(() => Array(this.width).fill(false));
        
        // Initialize boxes array
        this.boxes = [];
        
        // Parse the map
        this.parseMap(mapLines);
        
        // Get movements as a single continuous string
        this.movements = parts[1].split('\n').join('').trim();
        
        console.log("Initial warehouse state:");
        this.printWarehouse();
        console.log(`Robot position: (${this.robot.x},${this.robot.y})`);
        console.log(`Movement sequence length: ${this.movements.length}`);
    }

    private parseMap(mapLines: string[]): void {
        for (let y = 0; y < mapLines.length; y++) {
            const line = mapLines[y];
            for (let x = 0; x < line.length; x++) {
                const char = line[x];
                const wideX = x * 2;
                
                switch(char) {
                    case '#':
                        this.walls[y][wideX] = true;
                        this.walls[y][wideX + 1] = true;
                        break;
                    case 'O':
                        this.boxes.push({ x: wideX, y });
                        break;
                    case '@':
                        this.robot = { x: wideX, y };
                        break;
                }
            }
        }
    }

    private isWall(x: number, y: number): boolean {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return true;
        return this.walls[y][x];
    }

    private getBoxAt(x: number, y: number): Position | undefined {
        const box = this.boxes.find(box => 
            (box.x === x || box.x + 1 === x) && box.y === y
        );
        console.log(`Checking for box at (${x},${y}): ${box ? `found at (${box.x},${box.y})` : 'none found'}`);
        return box;
    }
    
    private canPushBox(box: Position, dx: number, hitRightSide: boolean): boolean {
        console.log(`Checking if can push box at (${box.x},${box.y}) by ${dx} (hit right side: ${hitRightSide})`);
        
        // When pushing right
        if (dx > 0) {
            // Check the two positions to the right of the box
            const rightClear = this.isPositionEmpty(box.x + 2, box.y) && 
                              this.isPositionEmpty(box.x + 3, box.y);
            console.log(`Target positions for right push (${box.x + 2},${box.y}) and (${box.x + 3},${box.y}): ${rightClear}`);
            return rightClear;
        }
        
        // When pushing left after hitting right side
        if (dx < 0 && hitRightSide) {
            const leftClear = this.isPositionEmpty(box.x - 1, box.y) && 
                             this.isPositionEmpty(box.x, box.y);
            console.log(`Target positions for left push (${box.x - 1},${box.y}) and (${box.x},${box.y}): ${leftClear}`);
            return leftClear;
        }
        
        // When pushing left from left side
        if (dx < 0) {
            const leftClear = this.isPositionEmpty(box.x - 1, box.y) && 
                             this.isPositionEmpty(box.x, box.y);
            console.log(`Target positions for left push (${box.x - 1},${box.y}) and (${box.x},${box.y}): ${leftClear}`);
            return leftClear;
        }
    
        return false;
    }
    
    private move(direction: string): boolean {
        let dx = 0;
        let dy = 0;
    
        switch(direction) {
            case '^': dy = -1; break;
            case 'v': dy = 1; break;
            case '<': dx = -1; break;
            case '>': dx = 1; break;
            default: return false;
        }
    
        const newX = this.robot.x + dx;
        const newY = this.robot.y + dy;
    
        console.log(`\nMove: ${direction}`);
        console.log(`Attempting to move from (${this.robot.x},${this.robot.y}) to (${newX},${newY})`);
    
        // Check if we're trying to move into a wall
        if (this.isWall(newX, newY)) {
            console.log("Move failed: Wall in the way");
            return false;
        }
    
        // Check if we're pushing a box
        const box = this.getBoxAt(newX, newY);
        if (box) {
            const hitRightSide = (box.x + 1 === newX);
            console.log(`Found box at (${box.x},${box.y}), hit ${hitRightSide ? 'right' : 'left'} side`);
            
            if (this.canPushBox(box, dx, hitRightSide)) {
                console.log("Box push is valid");
                // Move the box
                box.x += dx;
                // Move the robot
                this.robot = { x: newX, y: newY };
                return true;
            } else {
                console.log("Move failed: Cannot push box");
                return false;
            }
        }
    
        // If no box and not a wall, we can move
        if (this.isPositionEmpty(newX, newY)) {
            this.robot = { x: newX, y: newY };
            return true;
        }
    
        console.log("Move failed: Invalid move");
        return false;
    }

    private isBoxAt(x: number, y: number): boolean {
        return this.boxes.some(box => 
            (box.x === x || box.x + 1 === x) && box.y === y
        );
    }

    private isPositionEmpty(x: number, y: number): boolean {
        if (this.isWall(x, y)) return false;
        if (this.isBoxAt(x, y)) return false;
        // Don't count robot position when checking for push targets
        return true;
    }

    private calculateGPS(): number {
        let sum = 0;
        for (const box of this.boxes) {
            const gps = (100 * box.y) + (box.x / 2);
            console.log(`Box at (${box.x/2},${box.y}) GPS: ${gps}`);
            sum += gps;
        }
        console.log(`Total boxes found: ${this.boxes.length}`);
        return sum;
    }

    public processMovements(): number {
        console.log(`Processing ${this.movements.length} moves...\n`);
        
        for (let i = 0; i < this.movements.length; i++) {
            if (i % 100 === 0) {
                console.log(`Processing move ${i+1}/${this.movements.length}`);
            }
            this.move(this.movements[i]);
            this.printWarehouse();
            console.log(`Robot position: (${this.robot.x},${this.robot.y})`);
        }

        console.log("\nFinal warehouse state:");
        this.printWarehouse();
        return this.calculateGPS();
    }

    private printWarehouse(): void {
        console.log("Current warehouse state:");
        const display = Array(this.height).fill(null)
            .map(() => Array(this.width).fill('.'));
        
        // Add walls
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.walls[y][x]) {
                    display[y][x] = '#';
                }
            }
        }
        
        // Add boxes first
        for (const box of this.boxes) {
            display[box.y][box.x] = '[';
            display[box.y][box.x + 1] = ']';
        }
        
        // Add robot, preserving box characters if present
        display[this.robot.y][this.robot.x] = '@';
        
        // Print the map
        display.forEach(line => console.log(line.join('')));
    }
}

function solve_pt2(input: string): number {
    const warehouse = new WideWarehouse(input);
    return warehouse.processMovements();
}

// Read input and solve
const input = fs.readFileSync('./src/input.txt', 'utf8');
console.log("Solution to part 2:");
console.log(solve_pt2(input));