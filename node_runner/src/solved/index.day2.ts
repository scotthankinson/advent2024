import { readFileSync } from 'fs';

const isValidSequence = (sequence: number[]): boolean => {
    if (sequence.length <= 1) return true;
    
    let increasing: boolean | null = null;
    
    for (let i = 1; i < sequence.length; i++) {
        const diff = sequence[i] - sequence[i-1];
        
        // Check if difference is between 1 and 3
        if (diff === 0 || Math.abs(diff) > 3) return false;
        
        // Determine direction on first valid difference
        if (increasing === null) {
            increasing = diff > 0;
        }
        // Check if direction remains consistent
        else if ((diff > 0) !== increasing) {
            return false;
        }
    }
    
    return true;
}

const canBeMadeValidWithOneOrMoreRemoval = (sequence: number[]): boolean => {
    // If sequence is already valid, it needs 0 removals
    if (isValidSequence(sequence)) return true;
    
    // Try removing each number once and check if sequence becomes valid
    let validRemovalCount = 0;
    
    for (let i = 0; i < sequence.length; i++) {
        // Create new sequence without current number
        const newSequence = [...sequence.slice(0, i), ...sequence.slice(i + 1)];
        
        if (isValidSequence(newSequence)) {
            validRemovalCount++;
        }
        
        // If we found more than one valid removal, return false
        if (validRemovalCount > 0) return true;
    }
    
    // Return true if exactly one removal makes it valid
    return validRemovalCount === 1;
}

export const solve_pt1 = (input_file: string): number => {
    try {
        const fileContent = readFileSync(input_file, 'utf-8');
        const lines = fileContent.trim().split('\n');
        
        let validCount = 0;
        
        for (const line of lines) {
            const sequence = line.trim().split(' ').map(Number);
            if (isValidSequence(sequence)) {
                validCount++;
            }
        }
        
        return validCount;
    } catch (error) {
        console.error('Error reading or processing file:', error);
        return 0;
    }
}

export const solve_pt2 = (input_file: string): number => {
    try {
        const fileContent = readFileSync(input_file, 'utf-8');
        const lines = fileContent.trim().split('\n');
        
        let validCount = 0;
        
        for (const line of lines) {
            const sequence = line.trim().split(' ').map(Number);
            if (canBeMadeValidWithOneOrMoreRemoval(sequence)) {
                validCount++;
            }
        }
        
        return validCount;
    } catch (error) {
        console.error('Error reading or processing file:', error);
        return 0;
    }
}

export const start = (): void => {
    console.log('Part 1 solution:', solve_pt1('input.txt'));
    console.log('Part 2 solution:', solve_pt2('input.txt'));
}

start();