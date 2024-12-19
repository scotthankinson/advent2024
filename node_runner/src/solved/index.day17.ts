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
    const { registers, program } = parseInput(input);

    // Known sequence progression
    const knownValues = [
        { A: 2, output: '0' },
        { A: 9, output: '3,0' },
        { A: 68, output: '3,3,0' },
        { A: 542, output: '0,3,3,0' },
        { A: 4330, output: '5,0,3,3,0' },
        { A: 34666, output: '5,5,0,3,3,0' },
        { A: 277327, output: '4,5,5,0,3,3,0' },
        { A: 2218620, output: '4,4,5,5,0,3,3,0' },
        { A: 17748963, output: '3,4,4,5,5,0,3,3,0' },
        { A: 141991706, output: '1,3,4,4,5,5,0,3,3,0' },
        { A: 1135933648, output:  '5,1,3,4,4,5,5,0,3,3,0'},
        { A: 9087469188, output:  '7,5,1,3,4,4,5,5,0,3,3,0'},
        { A: 72699753822, output: '2,7,5,1,3,4,4,5,5,0,3,3,0'},
        { A: 581598030578, output: '1,2,7,5,1,3,4,4,5,5,0,3,3,0'},
        { A: 4652784244624, output: '-3,1,2,7,5,1,3,4,4,5,5,0,3,3,0'},
        { A: 37222273957364, output: '2,-4,1,2,7,5,1,3,4,4,5,5,0,3,3,0'}
    ];

    // Log known progression
    console.log("Known progression:");
    for(let i = 0; i < knownValues.length; i++){
        let v = knownValues[i];
        let increase = 0;
        if (i > 0) increase = v.A / knownValues[i - 1].A;
        console.log(`A = ${v.A} -> ${v.output}, increased by ${increase}`);
    };

    // Get last known value and calculate search range
    const lastKnown = knownValues[knownValues.length - 1].A;
    const searchStart = Math.floor(lastKnown * 7.999999);  // Approximate lower bound
    const searchEnd = Math.ceil(lastKnown * 8.000001);    // Approximate upper bound

    console.log(`\nSearching from ${searchStart} to ${searchEnd}`);

    let lastReportTime = Date.now();
    let valuesChecked = 0;
    const totalValues = searchEnd - searchStart;

    for(let i = searchStart; i < searchEnd; i++) {
        const state: ProgramState = {
            registers: { ...registers, A: i },
            program,
            ip: 0,
            outputs: []
        };

        let result = runProgram(state);
        valuesChecked++;
        
        // Progress report every 5 seconds
        const now = Date.now();
        if (now - lastReportTime >= 5000) {
            const percent = ((valuesChecked / totalValues) * 100).toFixed(2);
            console.log(`\nProgress: ${valuesChecked.toLocaleString()} of ${totalValues.toLocaleString()} values checked (${percent}%)`);
            // console.log(`Current value: A = ${i}`);
            // console.log(`Latest output: ${result}`);
            lastReportTime = now;
        }

        // Log any interesting results
        // 2,4,1,2,7,5,1,3,4,4,5,5,0,3,3,0
        if (result.endsWith('4,1,2,7,5,1,3,4,4,5,5,0,3,3,0')) {  // Adjust this based on what we're looking for
            console.log(`\nFound: A = ${i} -> ${result}`);
        }
    }

    console.log(`\nSearch complete!`);
    console.log(`Total values checked: ${valuesChecked.toLocaleString()}`);
    return "Search complete - check logs";
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

