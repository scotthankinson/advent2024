import { readFileSync } from 'fs';

type StoneMap = Map<string, number>;

interface CycleData {
    cycleLength: number;
    stateHistory: StoneMap[];
    firstRepeatIndex: number;
}

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
    console.log(`Converted array to map with ${stoneMap.size} unique stones`);
    return stoneMap;
}

function serializeState(state: StoneMap): string {
    return Array.from(state.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([stone, count]) => `${stone}:${count}`)
        .join('|');
}

function processStone(stone: string): string[] {
    console.log(`Processing stone: ${stone}`);
    if (stone === '0') {
        console.log(`Rule 1: Converting 0 to 1`);
        return ['1'];
    }
    
    if (stone.length % 2 === 0) {
        const mid = Math.floor(stone.length / 2);
        const left = stone.slice(0, mid);
        const right = stone.slice(mid);
        console.log(`Rule 2: Splitting ${stone} into ${left} and ${right}`);
        return [left, right];
    }
    
    const result = (BigInt(stone) * 2024n).toString();
    console.log(`Rule 3: Multiplying ${stone} by 2024 = ${result}`);
    return [result];
}

function processBlinkMap(stoneMap: StoneMap): StoneMap {
    console.log("\nProcessing blink for map...");
    const newMap = new Map<string, number>();
    
    for (const [stone, count] of stoneMap.entries()) {
        const newStones = processStone(stone);
        newStones.forEach(newStone => {
            newMap.set(newStone, (newMap.get(newStone) || 0) + count);
        });
    }
    
    console.log(`After blink: ${newMap.size} unique stones`);
    return newMap;
}

function detectCycle(initialStones: string[], maxIterations: number = 100): CycleData | null {
    console.log("\nAttempting to detect cycle...");
    const history: StoneMap[] = [];
    let currentState = arrayToStoneMap(initialStones);
    
    for (let i = 0; i < maxIterations; i++) {
        console.log(`\nIteration ${i + 1}`);
        const stateSignature = serializeState(currentState);
        console.log(`Current state signature length: ${stateSignature.length}`);
        
        const previousIndex = history.findIndex(h => serializeState(h) === stateSignature);
        if (previousIndex !== -1) {
            console.log(`Cycle detected! Length: ${i - previousIndex}, First occurrence: ${previousIndex}`);
            return {
                cycleLength: i - previousIndex,
                stateHistory: history,
                firstRepeatIndex: previousIndex
            };
        }
        
        history.push(new Map(currentState));
        currentState = processBlinkMap(currentState);
    }
    
    console.log("No cycle detected within iteration limit");
    return null;
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
        if (i % 5 === 0) {
            console.log(`Processing blink ${i + 1}/${totalBlinks}`);
        }
        currentState = processBlinkMap(currentState);
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
        const cycleData = detectCycle(initialStones);
        
        if (cycleData) {
            const totalBlinks = 75;
            const remainingBlinks = (totalBlinks - cycleData.firstRepeatIndex) % cycleData.cycleLength;
            const finalStateIndex = cycleData.firstRepeatIndex + remainingBlinks;
            
            console.log(`Using cycle data to calculate final state after ${totalBlinks} blinks`);
            console.log(`Remaining blinks after cycle: ${remainingBlinks}`);
            console.log(`Final state index: ${finalStateIndex}`);
            
            return calculateTotalStones(cycleData.stateHistory[finalStateIndex]);
        }
        
        return processDirectly(initialStones, 75);
    } catch (error) {
        console.error("Error in solve_pt2:", error);
        return 0;
    }
}

export function start(): void {
    console.log("Starting puzzle solution...");
    console.log("Part 1 Result:", solve_pt1());
    console.log("Part 2 Result:", solve_pt2());
}

start();