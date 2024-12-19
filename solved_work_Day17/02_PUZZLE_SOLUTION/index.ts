import * as fs from 'fs';

interface Registers {
    A: number;
    B: number;
    C: number;
}

interface ProgramState {
    registers: Registers;
    ip: number;
    program: number[];
    outputs: number[];
}

interface OutputAnalysis {
    value: number;
    outputs: number[];
    matchCount: number;
    matchPositions: boolean[];
}

interface BinaryPattern {
    pattern: string;
    values: number[];
    baseValue: number;
}

interface PositionPattern {
    position: number;
    target: number;
    patterns: BinaryPattern[];
    increasingSequences: number[][];
}

function getOperandValue(operand: number, registers: Registers): number {
    if (operand <= 3) return operand;
    if (operand === 4) return registers.A;
    if (operand === 5) return registers.B;
    if (operand === 6) return registers.C;
    return 0;
}

function executeInstruction(state: ProgramState): void {
    const instruction = state.program[state.ip];
    const operand = state.program[state.ip + 1];
    const comboOperand = getOperandValue(operand, state.registers);

    switch (instruction) {
        case 0:
            state.registers.A = Math.floor(state.registers.A / Math.pow(2, comboOperand));
            state.ip += 2;
            break;
        case 1:
            state.registers.B ^= operand;
            state.ip += 2;
            break;
        case 2:
            state.registers.B = comboOperand % 8;
            state.ip += 2;
            break;
        case 3:
            if (state.registers.A !== 0) {
                state.ip = operand;
            } else {
                state.ip += 2;
            }
            break;
        case 4:
            state.registers.B ^= state.registers.C;
            state.ip += 2;
            break;
        case 5:
            state.outputs.push(comboOperand % 8);
            state.ip += 2;
            break;
        case 6:
            state.registers.B = Math.floor(state.registers.A / Math.pow(2, comboOperand));
            state.ip += 2;
            break;
        case 7:
            state.registers.C = Math.floor(state.registers.A / Math.pow(2, comboOperand));
            state.ip += 2;
            break;
    }
}

function analyzeOutput(value: number, program: number[], debug: boolean = false): OutputAnalysis {
    const state: ProgramState = {
        registers: { A: value, B: 0, C: 0 },
        program: program,
        ip: 0,
        outputs: []
    };
    
    let steps = 0;
    const maxSteps = 1000;
    while (state.ip < state.program.length && steps < maxSteps) {
        executeInstruction(state);
        steps++;
    }

    while (state.outputs.length < program.length) {
        state.outputs.push(undefined);
    }

    const matchPositions = state.outputs.map((output, index) => 
        output !== undefined && index < program.length && output === program[index]
    );
    const matchCount = matchPositions.filter(x => x).length;

    if (debug) {
        console.log(`\nAnalysis for value ${value}:`);
        console.log(`Binary: ${formatBinary(BigInt(value))}`);
        console.log(`Expected: ${program.join(',')}`);
        console.log(`Got     : ${state.outputs.map(x => x === undefined ? 'X' : x).join(',')}`);
        console.log(`Matches : ${matchCount} of ${program.length}`);
        console.log('Match positions: ' + matchPositions.map((m, i) => 
            `${i}:${m ? '✓' : '✗'}`).join(' '));
    }

    return { value, outputs: state.outputs, matchCount, matchPositions };
}

function formatBinary(value: bigint): string {
    return value.toString(2)
        .padStart(48, '0')
        .match(/.{3}/g)!
        .join(' ');
}

function analyzeEnhancedValueGeneration(program: number[], baseValue: bigint): PositionPattern[] {
    console.log("\n=== Enhanced Value Generation Analysis ===");
    console.log(`Starting from base value: ${baseValue}`);
    
    const ANALYSIS_RANGE = 1024;
    const patterns: PositionPattern[] = [];
    
    // Analyze base value first
    const baseAnalysis = analyzeOutput(Number(baseValue), program, true);
    
    // Find positions that need improvement
    const problemPositions = baseAnalysis.matchPositions
        .map((matches, index) => matches ? -1 : index)
        .filter(index => index !== -1);
    
    console.log(`Problem positions: ${problemPositions.join(', ')}`);
    
    // Analyze each problem position
    for (const pos of problemPositions) {
        console.log(`\n=== Analyzing Position ${pos} (Target: ${program[pos]}) ===`);
        
        const posPattern: PositionPattern = {
            position: pos,
            target: program[pos],
            patterns: [],
            increasingSequences: []
        };
        
        // Track binary patterns and their results
        const binaryPatterns = new Map<string, number[]>();
        
        // Test incremental values above base value
        for (let i = 0; i < ANALYSIS_RANGE; i++) {
            const testValue = baseValue + BigInt(i);
            const analysis = analyzeOutput(Number(testValue), program);
            
            // Create binary pattern key (focus on relevant bits)
            const binStr = testValue.toString(2).padStart(48, '0');
            const relevantBits = binStr.slice(-24);  // Last 24 bits
            const patternKey = relevantBits.match(/.{1,3}/g)!.join('_');
            
            if (!binaryPatterns.has(patternKey)) {
                binaryPatterns.set(patternKey, []);
            }
            binaryPatterns.get(patternKey)!.push(analysis.outputs[pos]);
            
            // Track increasing sequences
            if (analysis.outputs[pos] > baseAnalysis.outputs[pos]) {
                const sequence = [Number(testValue)];
                posPattern.increasingSequences.push(sequence);
            }
        }
        
        // Analyze patterns that produce higher values
        console.log("\nPatterns producing higher values:");
        binaryPatterns.forEach((values, pattern) => {
            const maxValue = Math.max(...values);
            if (maxValue > baseAnalysis.outputs[pos]) {
                posPattern.patterns.push({
                    pattern,
                    values,
                    baseValue: Number(baseValue)
                });
                console.log(`Pattern ${pattern}:`);
                console.log(`Values: ${values.join(',')}`);
                console.log(`Max value: ${maxValue}`);
            }
        });
        
        patterns.push(posPattern);
    }
    
    return patterns;
}

function findHigherSolution(program: number[], baseValue: bigint): number {
    console.log("\n=== Searching for Higher Value Solution ===");
    
    const patterns = analyzeEnhancedValueGeneration(program, baseValue);
    let bestValue = baseValue;
    let bestMatches = analyzeOutput(Number(baseValue), program).matchCount;
    
    // Try combining patterns that increase values
    for (const posPattern of patterns) {
        console.log(`\nTrying patterns for position ${posPattern.position}`);
        
        for (const pattern of posPattern.patterns) {
            // Calculate value adjustments based on pattern
            const patternBits = pattern.pattern.replace(/_/g, '');
            const adjustment = BigInt('0b' + patternBits);
            
            // Try values around this adjustment
            for (let offset = -16; offset <= 16; offset++) {
                const testValue = baseValue + adjustment + BigInt(offset);
                
                // Only test values higher than our base
                if (testValue <= baseValue) continue;
                
                const analysis = analyzeOutput(Number(testValue), program);
                
                if (analysis.matchCount >= bestMatches && testValue > bestValue) {
                    bestMatches = analysis.matchCount;
                    bestValue = testValue;
                    console.log(`\nFound higher solution:`);
                    console.log(`Value: ${testValue}`);
                    console.log(`Binary: ${formatBinary(testValue)}`);
                    console.log(`Matches: ${analysis.matchCount}`);
                    console.log(`Outputs: ${analysis.outputs.join(',')}`);
                }
            }
        }
    }
    
    return Number(bestValue);
}

function parseInput(input: string): { registers: Registers, program: number[] } {
    const lines = input.trim().split('\n');
    
    const registerA = parseInt(lines[0].split(': ')[1]);
    const registerB = parseInt(lines[1].split(': ')[1]);
    const registerC = parseInt(lines[2].split(': ')[1]);
    
    const program = lines[4].split(': ')[1].split(',').map(Number);
    
    return {
        registers: { A: registerA, B: registerB, C: registerC },
        program
    };
}

function runProgram(state: ProgramState): string {
    while (state.ip < state.program.length) {
        executeInstruction(state);
    }
    return state.outputs.join(',');
}

export function solve_pt1(input: string): string {
    console.log("\n=== Solving Part 1 ===");
    const { registers, program } = parseInput(input);
    const state: ProgramState = {
        registers,
        program,
        ip: 0,
        outputs: []
    };
    return runProgram(state);
}

export function solve_pt2(input: string): string {
    console.log("\n=== Solving Part 2 ===");
    const { program } = parseInput(input);
    
    const baseValue = 35295846907380n;
    const result = findHigherSolution(program, baseValue);
    
    if (result === Number(baseValue)) {
        return "No improved solution found";
    }
    
    return result.toString();
}

export function start(): void {
    console.log("Starting...");
    
    try {
        const inputPath = 'src/input.txt';
        console.log(`Reading input from ${inputPath}`);
        const input = fs.readFileSync(inputPath, 'utf8');
        
        console.log("Part 1 Solution:", solve_pt1(input));
        console.log("Part 2 Solution:", solve_pt2(input));
    } catch (err) {
        console.error("Error reading input file:", err);
    }
}

start();