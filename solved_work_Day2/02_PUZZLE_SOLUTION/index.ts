"use strict";
import * as fs from 'fs';

const start = (): void => {
    console.log(solve_pt1());
    console.log(solve_pt2());
};

// Helper function to check if numbers are strictly increasing
const isStrictlyIncreasing = (numbers: number[]): boolean => {
    for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] <= numbers[i - 1]) return false;
    }
    return true;
};

// Helper function to check if numbers are strictly decreasing
const isStrictlyDecreasing = (numbers: number[]): boolean => {
    for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] >= numbers[i - 1]) return false;
    }
    return true;
};

// Helper function to check if adjacent differences are valid (1-3)
const hasValidDifferences = (numbers: number[]): boolean => {
    for (let i = 1; i < numbers.length; i++) {
        const diff = Math.abs(numbers[i] - numbers[i - 1]);
        if (diff < 1 || diff > 3) return false;
    }
    return true;
};

// Check if a report is safe according to Part 1 rules
const isReportSafe = (numbers: number[]): boolean => {
    if (numbers.length <= 1) return true; // Single number reports are safe
    return (isStrictlyIncreasing(numbers) || isStrictlyDecreasing(numbers)) && 
           hasValidDifferences(numbers);
};

// Check if a report can be made safe by removing one number (Part 2)
const canBeMadeSafe = (numbers: number[]): boolean => {
    if (isReportSafe(numbers)) return true;
    
    // Try removing each number once
    for (let i = 0; i < numbers.length; i++) {
        const modified = [...numbers.slice(0, i), ...numbers.slice(i + 1)];
        if (isReportSafe(modified)) return true;
    }
    return false;
};

const solve_pt1 = () => {
    try {
        let data = fs.readFileSync('src/input.txt', 'utf8');
        const lines = data.trim().split('\n');
        const reports = lines.map(line => 
            line.split(' ').map(num => parseInt(num))
        );

        const safeReports = reports.filter(isReportSafe);
        return safeReports.length;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
};

const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('src/input.txt', 'utf8');
        const lines = data.trim().split('\n');
        const reports = lines.map(line => 
            line.split(' ').map(num => parseInt(num))
        );

        const safeReports = reports.filter(canBeMadeSafe);
        return safeReports.length;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
};

start();

export default start;