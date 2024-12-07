"use strict";
import * as fs from 'fs';

interface Rule {
    before: number;
    after: number;
}

class Solution {
    private rules: Rule[] = [];
    private updates: number[][] = [];
    private invalidUpdates: number[][] = [];

    constructor(input: string) {
        this.parseInput(input);
    }

    private parseInput(input: string): void {
        const sections = input.trim().split('\n\n');
        const rulesSection = sections[0];
        const updatesSection = sections[1];

        // Parse rules
        this.rules = rulesSection.split('\n').map(line => {
            const [before, after] = line.split('|').map(Number);
            return { before, after };
        });

        // Parse updates
        this.updates = updatesSection.split('\n').map(line => 
            line.split(',').map(Number)
        );
    }

    private isValidUpdate(update: number[]): boolean {
        // Get all applicable rules for this update
        for (const rule of this.rules) {
            const beforeIndex = update.indexOf(rule.before);
            const afterIndex = update.indexOf(rule.after);
            
            // If both pages exist in the update
            if (beforeIndex !== -1 && afterIndex !== -1) {
                // Check if the order is violated
                if (beforeIndex > afterIndex) {
                    return false;
                }
            }
        }
        return true;
    }

    private getMiddlePage(update: number[]): number {
        const middleIndex = Math.floor(update.length / 2);
        return update[middleIndex];
    }

    private topologicalSort(update: number[]): number[] {
        // Create adjacency list
        const graph = new Map<number, Set<number>>();
        const inDegree = new Map<number, number>();
        
        // Initialize
        update.forEach(page => {
            graph.set(page, new Set());
            inDegree.set(page, 0);
        });

        // Build graph
        for (const rule of this.rules) {
            if (update.includes(rule.before) && update.includes(rule.after)) {
                graph.get(rule.before)?.add(rule.after);
                inDegree.set(rule.after, (inDegree.get(rule.after) || 0) + 1);
            }
        }

        // Find nodes with no incoming edges
        const queue: number[] = [];
        update.forEach(page => {
            if ((inDegree.get(page) || 0) === 0) {
                queue.push(page);
            }
        });

        // Process queue
        const result: number[] = [];
        while (queue.length > 0) {
            const current = queue.shift()!;
            result.push(current);

            graph.get(current)?.forEach(neighbor => {
                inDegree.set(neighbor, (inDegree.get(neighbor) || 0) - 1);
                if ((inDegree.get(neighbor) || 0) === 0) {
                    queue.push(neighbor);
                }
            });
        }

        return result;
    }

    public solvePart1(): number {
        let sum = 0;
        for (const update of this.updates) {
            if (this.isValidUpdate(update)) {
                sum += this.getMiddlePage(update);
            } else {
                this.invalidUpdates.push(update);
            }
        }
        return sum;
    }

    public solvePart2(): number {
        let sum = 0;
        for (const update of this.invalidUpdates) {
            const correctedOrder = this.topologicalSort(update);
            if (correctedOrder.length === update.length) { // Valid sort found
                sum += this.getMiddlePage(correctedOrder);
            }
        }
        return sum;
    }
}

const start = (): void => {
    console.log("Solution to part 1: ")
    console.log(solve_pt1());
    console.log("Solution to part 2: ")
    console.log(solve_pt2());
};

const solve_pt1 = () => {
    try {
        let data = fs.readFileSync('src/input.txt', 'utf8');
        const solution = new Solution(data);
        return solution.solvePart1();
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('src/input.txt', 'utf8');
        const solution = new Solution(data);
        solution.solvePart1(); // Need to run part 1 first to collect invalid updates
        return solution.solvePart2();
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

start();

export default start;