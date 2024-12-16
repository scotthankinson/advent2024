"use strict";
import * as fs from 'fs';

interface Position {
    x: number;
    y: number;
}

type Direction = '^' | 'v' | '<' | '>';

class Warehouse {
    protected map: string[];
    protected robot: Position;
    protected boxes: Position[];
    protected width: number;
    protected height: number;
    protected debug: boolean;

    constructor(input: string[], debug: boolean = false) {
        this.map = input;
        this.boxes = [];
        this.width = input[0].length;
        this.height = input.length;
        this.debug = debug;
        this.initializePositions();
    }

    protected initializePositions(): void {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.map[y][x] === 'O') {
                    this.boxes.push({ x, y });
                } else if (this.map[y][x] === '@') {
                    this.robot = { x, y };
                }
            }
        }
    }

    public executeMove(direction: Direction): boolean {
        return this.move(direction);
    }

    protected move(direction: Direction): boolean {
        if (!this.canMove(direction)) return false;

        const nextPos = this.getNextPosition(this.robot, direction);
        const boxIndex = this.getBoxAt(nextPos);

        if (boxIndex !== -1) {
            const boxChain = this.getBoxChain(nextPos, direction);
            // Move boxes from last to first
            for (let i = boxChain.length - 1; i >= 0; i--) {
                const box = this.boxes[boxChain[i]];
                const newPos = this.getNextPosition(box, direction);
                this.boxes[boxChain[i]] = newPos;
            }
        }

        this.robot = nextPos;
        return true;
    }

    protected canMove(direction: Direction): boolean {
        const nextPos = this.getNextPosition(this.robot, direction);
        
        if (!this.isValidPosition(nextPos)) {
            return false;
        }

        const boxIndex = this.getBoxAt(nextPos);
        if (boxIndex === -1) return true;

        const boxChain = this.getBoxChain(nextPos, direction);
        if (boxChain.length === 0) {
            return false;
        }

        return true;
    }

    protected getBoxChain(startPos: Position, direction: Direction): number[] {
        const chain: number[] = [];
        let currentPos = startPos;
        
        while (true) {
            const boxIndex = this.getBoxAt(currentPos);
            if (boxIndex === -1) break;
            
            chain.push(boxIndex);
            currentPos = this.getNextPosition(currentPos, direction);
            
            if (!this.isValidPosition(currentPos)) {
                return [];
            }
        }
        
        return chain;
    }

    protected getNextPosition(pos: Position, direction: Direction): Position {
        switch (direction) {
            case '^': return { x: pos.x, y: pos.y - 1 };
            case 'v': return { x: pos.x, y: pos.y + 1 };
            case '<': return { x: pos.x - 1, y: pos.y };
            case '>': return { x: pos.x + 1, y: pos.y };
        }
    }

    protected isValidPosition(pos: Position): boolean {
        return pos.x >= 0 && pos.x < this.width && 
               pos.y >= 0 && pos.y < this.height && 
               !this.isWall(pos);
    }

    protected isWall(pos: Position): boolean {
        return this.map[pos.y][pos.x] === '#';
    }

    protected getBoxAt(pos: Position): number {
        return this.boxes.findIndex(b => b.x === pos.x && b.y === pos.y);
    }

    public calculateGPS(): number {
        let total = 0;
        
        for (let i = 0; i < this.boxes.length; i++) {
            const box = this.boxes[i];
            const gps = (100 * box.y) + box.x;
            total += gps;
        }
        
        return total;
    }
}

export function start(): void {
    try {
        console.log("Solution to part 1: ", solve_pt1());
    } catch (e) {
        console.log("Error:", e.message);
    }
}

function solve_pt1(): number {
    const input = fs.readFileSync('./src/input.txt', 'utf8').split('\n');
    const [mapLines, moves] = parseInput(input);
    
    const warehouse = new Warehouse(mapLines, false);
    for (const move of moves) {
        warehouse.executeMove(move as Direction);
    }
    
    return warehouse.calculateGPS();
}


function parseInput(input: string[]): [string[], string] {
    const emptyLineIndex = input.findIndex(line => line.trim() === '');
    const mapLines = input.slice(0, emptyLineIndex);
    const moves = input[emptyLineIndex + 1];
    return [mapLines, moves];
}

console.log("Pt 1 solution: ")
console.log(solve_pt1());