import { readFileSync } from 'fs';

type StoneMap = Map<string, number>;

function readInitialStones(): string[] {
    console.log("Reading initial stones...");
    const input = readFileSync('src/input.txt', 'utf-8');
    const stones = input.trim().split(' ');
    console.log(`Initial stones loaded: ${stones.join(' ')}`);
    return stones;
}

function arrayToStoneMap(stones: string[]): StoneMap {
    const stoneMap = new Map<string, number>();
    stones.forEach(stone => {
        stoneMap.set(stone, (stoneMap.get(stone) || 0) + 1);
    });
    console.log(`Converted array to map with ${stoneMap.size} unique stones:`);
    stoneMap.forEach((count, stone) => {
        console.log(`Stone: ${stone}, Count: ${count}`);
    });
    return stoneMap;
}

function processStone(stone: string): string[] {
    console.log(`Processing stone: ${stone}`);
    // Rule 1: Convert 0 to 1
    if (stone === '0') {
        console.log(`Rule 1: Converting 0 to 1`);
        return ['1'];
    }
    
    // Rule 2: Split even-length numbers
    if (stone.length % 2 === 0) {
        const mid = Math.floor(stone.length / 2);
        const left = stone.slice(0, mid);
        const right = stone.slice(mid);
        // Handle leading zeros in split results
        const leftProcessed = left.replace(/^0+/, '') || '0';
        const rightProcessed = right.replace(/^0+/, '') || '0';
        console.log(`Rule 2: Splitting ${stone} into ${leftProcessed} and ${rightProcessed}`);
        return [leftProcessed, rightProcessed];
    }
    
    // Rule 3: Multiply by 2024
    const result = (BigInt(stone) * 2024n).toString();
    console.log(`Rule 3: Multiplying ${stone} by 2024 = ${result}`);
    return [result];
}

function processBlinkMap(stoneMap: StoneMap): StoneMap {
    console.log("\nProcessing blink...");
    const newMap = new Map<string, number>();
    
    // Process all transformations first
    const transformations = new Map<string, string[]>();
    for (const [stone] of stoneMap.entries()) {
        transformations.set(stone, processStone(stone));
    }
    
    // Apply all transformations simultaneously
    for (const [stone, count] of stoneMap.entries()) {
        const newStones = transformations.get(stone) || [];
        newStones.forEach(newStone => {
            newMap.set(newStone, (newMap.get(newStone) || 0) + count);
        });
    }
    
    console.log("After blink, new stone counts:");
    newMap.forEach((count, stone) => {
        console.log(`Stone: ${stone}, Count: ${count}`);
    });
    
    return newMap;
}

function calculateTotalStones(stoneMap: StoneMap): number {
    const total = Array.from(stoneMap.values()).reduce((sum, count) => sum + count, 0);
    console.log(`Total stones: ${total}`);
    return total;
}

function processDirectly(initialStones: string[], totalBlinks: number): number {
    console.log(`\nProcessing ${totalBlinks} blinks directly...`);
    let currentState = arrayToStoneMap(initialStones);
    
    for (let i = 0; i < totalBlinks; i++) {
        console.log(`\nBlink ${i + 1}/${totalBlinks}`);
        currentState = processBlinkMap(currentState);
        console.log(`After blink ${i + 1}, total stones: ${calculateTotalStones(currentState)}`);
    }
    
    return calculateTotalStones(currentState);
}

export function solve_pt1(): number {
    console.log("\n=== Starting Part 1 Solution ===");
    try {
        const initialStones = readInitialStones();
        return processDirectly(initialStones, 25);
    } catch (error) {
        console.error("Error in solve_pt1:", error);
        return 0;
    }
}

export function solve_pt2(): number {
    console.log("\n=== Starting Part 2 Solution ===");
    try {
        const initialStones = readInitialStones();
        return processDirectly(initialStones, 75);
    } catch (error) {
        console.error("Error in solve_pt1:", error);
        return 0;
    }
}

export function start(): void {
    console.log("Starting puzzle solution...");
    console.log("Part 1 Result:", solve_pt1());
    console.log("Part 2 Result:", solve_pt2());
}

start();