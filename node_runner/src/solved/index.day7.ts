import { readFileSync } from 'fs';

interface Equation {
    testValue: number;
    numbers: number[];
}

// Shared parsing logic
const parseInput = (input: string): Equation[] => {
    return input.trim().split('\n').map(line => {
        const [testStr, numbersStr] = line.split(':');
        return {
            testValue: parseInt(testStr.trim()),
            numbers: numbersStr.trim().split(' ').map(n => parseInt(n))
        };
    });
};

// Evaluate expression with given operators (shared logic with operator parameter)
const evaluateExpression = (numbers: number[], operators: string[]): number => {
    let result = numbers[0];
    for (let i = 0; i < operators.length; i++) {
        switch (operators[i]) {
            case '+':
                result += numbers[i + 1];
                break;
            case '*':
                result *= numbers[i + 1];
                break;
            case '||':
                // Convert current result and next number to strings, concatenate, then parse back to number
                result = parseInt(`${result}${numbers[i + 1]}`);
                break;
        }
    }
    return result;
};

// Part 1: Generate combinations of + and *
const generateOperatorCombinationsPart1 = (length: number): string[][] => {
    const operators = ['+', '*'];
    const combinations: string[][] = [];
    
    const generate = (current: string[]) => {
        if (current.length === length) {
            combinations.push([...current]);
            return;
        }
        for (const op of operators) {
            current.push(op);
            generate(current);
            current.pop();
        }
    };
    
    generate([]);
    return combinations;
};

// Part 2: Generate combinations of +, * and ||
const generateOperatorCombinationsPart2 = (length: number): string[][] => {
    const operators = ['+', '*', '||'];
    const combinations: string[][] = [];
    
    const generate = (current: string[]) => {
        if (current.length === length) {
            combinations.push([...current]);
            return;
        }
        for (const op of operators) {
            current.push(op);
            generate(current);
            current.pop();
        }
    };
    
    generate([]);
    return combinations;
};

// Shared validation logic with operator combinations parameter
const isValidEquation = (equation: Equation, operatorCombinations: string[][]): boolean => {
    const { testValue, numbers } = equation;
    return operatorCombinations.some(operators => 
        evaluateExpression(numbers, operators) === testValue
    );
};

// Part 1 solution
const solvePart1 = (input: string): number => {
    const equations = parseInput(input);
    return equations
        .filter(equation => isValidEquation(
            equation,
            generateOperatorCombinationsPart1(equation.numbers.length - 1)
        ))
        .reduce((sum, equation) => sum + equation.testValue, 0);
};

// Part 2 solution
const solvePart2 = (input: string): number => {
    const equations = parseInput(input);
    return equations
        .filter(equation => isValidEquation(
            equation,
            generateOperatorCombinationsPart2(equation.numbers.length - 1)
        ))
        .reduce((sum, equation) => sum + equation.testValue, 0);
};

// Read input
const input = readFileSync('./input.txt', 'utf-8');

console.log("Part 1: ");
console.log(solvePart1(input));
console.log("Part 2: ");
console.log(solvePart2(input));

// Export both solutions
export default {
    part1: () => solvePart1(input),
    part2: () => solvePart2(input)
};


