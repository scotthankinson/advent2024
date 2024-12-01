import * as fs from 'fs';

interface IHistorianData {
    left: number[];
    right: number[];
}

const parseInput = (input: string): IHistorianData => {
    const lines = input.split('\n').filter(line => line.trim().length > 0);
    const left: number[] = [];
    const right: number[] = [];

    lines.forEach(line => {
        const [leftVal, rightVal] = line.split(' ').map(num => parseInt(num.trim(), 10));
        left.push(leftVal);
        right.push(rightVal);
    });

    return { left, right };
};

const solve_pt1 = (data: IHistorianData): number => {
    if (data.left.length !== data.right.length) {
        throw new Error('Left and right lists must have equal length');
    }

    const sortedLeft = [...data.left].sort((a, b) => a - b);
    const sortedRight = [...data.right].sort((a, b) => a - b);

    let totalDistance = 0;
    for (let i = 0; i < sortedLeft.length; i++) {
        totalDistance += Math.abs(sortedLeft[i] - sortedRight[i]);
    }

    return totalDistance;
};

const solve_pt2 = (data: IHistorianData): number => {
    // Create frequency map of right list
    const rightFrequency = new Map<number, number>();
    data.right.forEach(num => {
        rightFrequency.set(num, (rightFrequency.get(num) || 0) + 1);
    });

    // Calculate similarity score
    let totalSimilarity = 0;
    data.left.forEach(leftNum => {
        // Multiply number by its frequency in right list (0 if not present)
        const frequency = rightFrequency.get(leftNum) || 0;
        totalSimilarity += leftNum * frequency;
    });

    return totalSimilarity;
};

const start = async (): Promise<void> => {
    try {
        // Read input file
        const input = fs.readFileSync('./input.txt', 'utf8');
        const data = parseInput(input);

        // Solve part 1
        console.log('Part 1 Solution:');
        const result1 = solve_pt1(data);
        console.log(result1);

        // Solve part 2
        console.log('\nPart 2 Solution:');
        const result2 = solve_pt2(data);
        console.log(result2);

    } catch (err) {
        console.error('Error:', err);
    }
};

start();