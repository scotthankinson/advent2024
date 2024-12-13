import * as fs from 'fs';

interface ButtonMove {
    x: number;
    y: number;
}

interface ClawMachine {
    buttonA: ButtonMove;
    buttonB: ButtonMove;
    prize: ButtonMove;
}

const parseInput = (lines: string[]): ClawMachine[] => {
    const machines: ClawMachine[] = [];
    let currentMachine: Partial<ClawMachine> = {};
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') {
            if (Object.keys(currentMachine).length === 3) {
                machines.push(currentMachine as ClawMachine);
            }
            currentMachine = {};
            continue;
        }

        const [type, coords] = line.split(': ');
        const [xPart, yPart] = coords.split(', ');
        const x = parseInt(xPart.replace('X', '').replace('=', '').replace('+', ''));
        const y = parseInt(yPart.replace('Y', '').replace('=', '').replace('+', ''));

        switch (type) {
            case 'Button A':
                currentMachine.buttonA = { x, y };
                break;
            case 'Button B':
                currentMachine.buttonB = { x, y };
                break;
            case 'Prize':
                currentMachine.prize = { x, y };
                break;
        }
    }

    if (Object.keys(currentMachine).length === 3) {
        machines.push(currentMachine as ClawMachine);
    }

    return machines;
};

const findMinimumTokens = (machine: ClawMachine): number | null => {
    const MAX_PRESSES = 100;
    let minTokens = Infinity;
    let solvable = false;

    for (let a = 0; a <= MAX_PRESSES; a++) {
        for (let b = 0; b <= MAX_PRESSES; b++) {
            const finalX = (machine.buttonA.x * a) + (machine.buttonB.x * b);
            const finalY = (machine.buttonA.y * a) + (machine.buttonB.y * b);

            if (finalX === machine.prize.x && finalY === machine.prize.y) {
                solvable = true;
                const tokens = (3 * a) + (1 * b);
                if (tokens < minTokens) {
                    minTokens = tokens;
                }
            }
        }
    }

    return solvable ? minTokens : null;
};

const findMinimumTokensWithBigInt = (machine: ClawMachine): number | null => {
    const MAX_PRESSES = 100;
    let minTokens = Infinity;
    let solvable = false;

    // Convert coordinates to BigInt
    const buttonAX = BigInt(machine.buttonA.x);
    const buttonAY = BigInt(machine.buttonA.y);
    const buttonBX = BigInt(machine.buttonB.x);
    const buttonBY = BigInt(machine.buttonB.y);
    const prizeX = BigInt(machine.prize.x);
    const prizeY = BigInt(machine.prize.y);

    for (let a = 0; a <= MAX_PRESSES; a++) {
        for (let b = 0; b <= MAX_PRESSES; b++) {
            // Calculate using BigInt
            const finalX = (buttonAX * BigInt(a)) + (buttonBX * BigInt(b));
            const finalY = (buttonAY * BigInt(a)) + (buttonBY * BigInt(b));

            if (finalX === prizeX && finalY === prizeY) {
                solvable = true;
                const tokens = (3 * a) + (1 * b);
                if (tokens < minTokens) {
                    minTokens = tokens;
                }
            }
        }
    }

    return solvable ? minTokens : null;
};

const solve_pt1 = () => {
    try {
        const data = fs.readFileSync('src/input.txt', 'utf8');
        const lines = data.split(/\r?\n/);
        
        const machines = parseInput(lines);
        let totalTokens = 0;
        
        console.log(`Total machines: ${machines.length}`);
        
        for (let i = 0; i < machines.length; i++) {
            const machine = machines[i];
            console.log(`\nAnalyzing machine ${i + 1}:`);
            console.log(`Button A: X${machine.buttonA.x}, Y${machine.buttonA.y}`);
            console.log(`Button B: X${machine.buttonB.x}, Y${machine.buttonB.y}`);
            console.log(`Prize: X=${machine.prize.x}, Y=${machine.prize.y}`);
            
            const tokens = findMinimumTokens(machine);
            if (tokens !== null) {
                totalTokens += tokens;
                console.log(`Machine ${i + 1} is solvable with ${tokens} tokens`);
            } else {
                console.log(`Machine ${i + 1} is NOT solvable`);
            }
        }

        console.log(`\nTotal tokens needed: ${totalTokens}`);
        return totalTokens;
    } catch (e) {
        console.error('Error:', e);
    }
    return -1;
};

const solve_pt2 = () => {
    try {
        const data = fs.readFileSync('src/input.txt', 'utf8');
        const lines = data.split(/\r?\n/);
        
        const machines = parseInput(lines);
        let totalTokens = 0;
        
        const OFFSET = 10000000000000;
        console.log(`\nPart 2 - Adding offset of ${OFFSET} to all prize coordinates`);
        
        for (let i = 0; i < machines.length; i++) {
            const machine = machines[i];
            // Create a modified machine with offset prize coordinates
            const modifiedMachine = {
                buttonA: machine.buttonA,
                buttonB: machine.buttonB,
                prize: {
                    x: machine.prize.x + OFFSET,
                    y: machine.prize.y + OFFSET
                }
            };

            console.log(`\nMachine ${i + 1}:`);
            console.log(`Original prize position: X=${machine.prize.x}, Y=${machine.prize.y}`);
            console.log(`Modified prize position: X=${modifiedMachine.prize.x}, Y=${modifiedMachine.prize.y}`);
            
            const tokens = findMinimumTokensWithBigInt(modifiedMachine);
            if (tokens !== null) {
                totalTokens += tokens;
                console.log(`Machine ${i + 1} is solvable with ${tokens} tokens`);
            } else {
                console.log(`Machine ${i + 1} is NOT solvable with offset coordinates`);
            }
        }

        console.log(`\nTotal tokens needed with offset: ${totalTokens}`);
        return totalTokens;
    } catch (e) {
        console.error('Error:', e);
    }
    return -1;
};

export { solve_pt1, solve_pt2 };