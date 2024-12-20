"use strict";
import * as fs from 'fs';

const start = (): void => {
    console.log("Solution to part 1: ")
    console.log(solve_pt1());
    console.log("Solution to part 2: ")
    console.log(solve_pt2());
};

const canBuildPattern = (
    target: string,
    patterns: string[],
    currentPos: number = 0,
    memo: Map<number, boolean> = new Map()
): boolean => {
    // If we've reached the end of the target, we've found a valid combination
    if (currentPos === target.length) {
        return true;
    }

    // If we've already computed this position, return the cached result
    if (memo.has(currentPos)) {
        return memo.get(currentPos)!;
    }

    // Try each available pattern
    for (const pattern of patterns) {
        if (currentPos + pattern.length <= target.length &&
            target.substring(currentPos, currentPos + pattern.length) === pattern) {
            if (canBuildPattern(target, patterns, currentPos + pattern.length, memo)) {
                memo.set(currentPos, true);
                return true;
            }
        }
    }

    memo.set(currentPos, false);
    return false;
};

const countPatternCombinations = (
    target: string,
    patterns: string[],
    currentPos: number = 0,
    memo: Map<number, number> = new Map()
): number => {
    // If we've reached the end of the target, we've found a valid combination
    if (currentPos === target.length) {
        return 1;
    }

    // If we've already computed this position, return the cached result
    if (memo.has(currentPos)) {
        return memo.get(currentPos)!;
    }

    let totalCombinations = 0;
    // Try each available pattern
    for (const pattern of patterns) {
        if (currentPos + pattern.length <= target.length &&
            target.substring(currentPos, currentPos + pattern.length) === pattern) {
            totalCombinations += countPatternCombinations(target, patterns, currentPos + pattern.length, memo);
        }
    }

    memo.set(currentPos, totalCombinations);
    return totalCombinations;
};

const solve_pt1 = () => {
    try {
        let data = fs.readFileSync('src/input.txt', 'utf8');
        const [patternsStr, designsStr] = data.split('\n\n');
        
        // Parse available patterns
        const patterns = patternsStr.split(', ').map(p => p.trim());
        
        // Parse desired designs
        const designs = designsStr.split('\n').map(d => d.trim());
        
        // Count possible designs
        let possibleDesigns = 0;
        for (const design of designs) {
            if (canBuildPattern(design, patterns)) {
                possibleDesigns++;
            }
        }

        return possibleDesigns;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('src/input.txt', 'utf8');
        const [patternsStr, designsStr] = data.split('\n\n');
        
        // Parse available patterns
        const patterns = patternsStr.split(', ').map(p => p.trim());
        
        // Parse desired designs
        const designs = designsStr.split('\n').map(d => d.trim());
        
        // Count total combinations for all possible designs
        let totalCombinations = 0;
        for (const design of designs) {
            if (canBuildPattern(design, patterns)) {
                totalCombinations += countPatternCombinations(design, patterns);
            }
        }

        return totalCombinations;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

start();

export default start;