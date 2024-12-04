import * as fs from 'fs';

const start = (): void => {
    console.log("Solution to part 1: ")
    console.log(solve_pt1());
    console.log("Solution to part 2: ")
    console.log(solve_pt2());
};

const solve_pt1 = () => {
    try {
        let data = fs.readFileSync('input.txt', 'utf8');
        const pattern = /mul\((\d{1,3}),(\d{1,3})\)/g;
        let sum = 0;

        // Find all matches in the input
        const matches = data.matchAll(pattern);
        
        for (const match of matches) {
            const [_, num1, num2] = match;
            
            // Validate numbers are 1-3 digits
            if (num1.length <= 3 && num2.length <= 3) {
                // Convert to numbers and multiply
                const result = parseInt(num1) * parseInt(num2);
                sum += result;
            }
        }

        return sum;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('input.txt', 'utf8');
        let sum = 0;
        let counting = true; // Start in counting state

        let filtered_data = '';
        // Process the input character by character to maintain sequence
        let position = 0;
        while (position < data.length) {
            // Check for toggle instructions
            if (data.startsWith('do()', position)) {
                counting = true;
                position += 4; // Length of "do()"
                continue;
            }
            if (data.startsWith("don't()", position)) {
                counting = false;
                position += 7; // Length of "don't()"
                continue;
            }

            if (counting)
                filtered_data += data[position];
            // Move to next character if no matches
            position++;
        }

        const pattern = /mul\((\d{1,3}),(\d{1,3})\)/g;
        
        // Find all matches in the input
        const matches = filtered_data.matchAll(pattern);
        
        for (const match of matches) {
            const [_, num1, num2] = match;
            
            // Validate numbers are 1-3 digits
            if (num1.length <= 3 && num2.length <= 3) {
                // Convert to numbers and multiply
                const result = parseInt(num1) * parseInt(num2);
                sum += result;
            }
        }

        return sum;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

start();

export default start;