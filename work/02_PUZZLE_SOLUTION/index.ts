"use strict";
import * as fs from 'fs';

class WideWarehouse {
    private map: string[];
    private robotX: number;
    private robotY: number;
    private width: number;
    private height: number;

    constructor(input: string[]) {
        this.map = this.transformMap(input);
        [this.robotX, this.robotY] = this.findRobot();
        this.height = this.map.length;
        this.width = this.map[0].length;
    }

    private transformMap(input: string[]): string[] {
        return input.map(line => {
            let newLine = '';
            for (let char of line) {
                switch (char) {
                    case '#': newLine += '##'; break;
                    case 'O': newLine += '[]'; break;
                    case '.': newLine += '..'; break;
                    case '@': newLine += '@.'; break;
                    default: newLine += char + char;
                }
            }
            return newLine;
        });
    }

    private findRobot(): [number, number] {
        for (let y = 0; y < this.map.length; y++) {
            const x = this.map[y].indexOf('@');
            if (x !== -1) {
                return [x, y];
            }
        }
        throw new Error('Robot not found in map');
    }

    public move(direction: string): boolean {
        console.log(`\nMove: ${direction}`);
        let [newX, newY] = [this.robotX, this.robotY];

        switch (direction) {
            case '>': newX += 1; break;
            case '<': newX -= 1; break;
            case '^': newY -= 1; break;
            case 'v': newY += 1; break;
        }

        console.log(`Attempting to move from (${this.robotX},${this.robotY}) to (${newX},${newY})`);

        // Check if move is valid
        if (this.isValidMove(newX, newY, direction)) {
            // Update robot position
            let row = this.map[this.robotY].split('');
            row[this.robotX] = '.';
            row[this.robotX + 1] = '.';  // Clear both robot positions
            this.map[this.robotY] = row.join('');

            row = this.map[newY].split('');
            row[newX] = '@';
            row[newX + 1] = '.';  // Set both robot positions
            this.map[newY] = row.join('');

            this.robotX = newX;
            this.robotY = newY;
            
            console.log('Move successful');
            return true;
        }

        console.log('Move failed: Invalid move');
        return false;
    }

    private isValidMove(newX: number, newY: number, direction: string): boolean {
        // Check bounds
        if (newY < 0 || newY >= this.height || newX < 0 || newX >= this.width) {
            return false;
        }

        // Check if moving into a wall
        if (this.map[newY][newX] === '#') {
            return false;
        }

        // Check if moving into or pushing a box
        if (this.map[newY][newX] === '[' || this.map[newY][newX] === ']') {
            return this.canPushBox(newX, newY, direction);
        }

        return true;
    }

    private canPushBox(boxX: number, boxY: number, direction: string): boolean {
        let leftX = (this.map[boxY][boxX] === '[') ? boxX : boxX - 1;
        let rightX = leftX + 1;
        
        let newLeftX = leftX;
        let newRightX = rightX;

        switch (direction) {
            case '>':
                newLeftX += 1;
                newRightX += 1;
                break;
            case '<':
                newLeftX -= 1;
                newRightX -= 1;
                break;
        }

        // Check if new position is valid for both parts of the box
        if (newLeftX < 0 || newRightX >= this.width) return false;
        if (this.map[boxY][newLeftX] !== '.' || this.map[boxY][newRightX] !== '.') return false;

        // Move is valid, push the box
        this.moveBox(leftX, rightX, boxY, newLeftX, newRightX);
        return true;
    }

    private moveBox(oldLeftX: number, oldRightX: number, y: number, newLeftX: number, newRightX: number) {
        let row = this.map[y].split('');
        row[oldLeftX] = '.';
        row[oldRightX] = '.';
        row[newLeftX] = '[';
        row[newRightX] = ']';
        this.map[y] = row.join('');
    }

    public calculateGPS(): number {
        let total = 0;
        let boxCount = 0;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.map[y][x] === '[') {
                    const gps = (100 * y) + (x / 2);
                    console.log(`Box at (${x},${y}), GPS: ${gps}`);
                    total += gps;
                    boxCount++;
                }
            }
        }

        console.log(`Total boxes found: ${boxCount}`);
        return total;
    }

    public printState(): void {
        console.log('Current warehouse state:');
        this.map.forEach(line => console.log(line));
        console.log(`Robot position: (${this.robotX},${this.robotY})`);
    }
}

const start = (): void => {
    console.log("Solution to part 2:");
    console.log(solve_pt2());
};

const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('input.txt', 'utf8');
        const lines = data.split('\n');
        const moves = lines[0];
        const warehouse = new WideWarehouse(lines.slice(1));

        console.log('Initial warehouse state:');
        warehouse.printState();

        console.log(`Processing ${moves.length} moves...`);
        
        for (let i = 0; i < moves.length; i++) {
            console.log(`\nProcessing move ${i + 1}/${moves.length}`);
            warehouse.move(moves[i]);
            warehouse.printState();
        }

        console.log('\nFinal warehouse state:');
        warehouse.printState();
        
        return warehouse.calculateGPS();
    } catch (e) {
        console.log('Error:', e);
    }
    return -1;
};

start();

export default start;