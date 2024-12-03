// Solution for Puzzle 02
const mulPattern = /mul\((\d{1,3}),(\d{1,3})\)/;

export function solve_pt1(input: string): number {
    let sum = 0;
    let remaining = input;

    while (remaining.length > 0) {
        const match = remaining.match(mulPattern);
        if (!match) {
            break;
        }

        const [fullMatch, num1, num2] = match;
        if (num1.length <= 3 && num2.length <= 3) {
            sum += parseInt(num1) * parseInt(num2);
        }

        remaining = remaining.substring(match.index! + fullMatch.length);
    }

    return sum;
}

export function solve_pt2(input: string): number {
    let countableSegments: string[] = [];
    let counting = true;
    let currentSegment = '';
    let remaining = input;
    
    while (remaining.length > 0) {
        const doIndex = remaining.indexOf('do()');
        const dontIndex = remaining.indexOf('don\'t()');
        
        if (doIndex === -1 && dontIndex === -1) {
            // No more toggles, process remaining text if counting
            if (counting) {
                currentSegment += remaining;
            }
            break;
        }
        
        const nextToggle = (doIndex === -1) ? dontIndex :
                          (dontIndex === -1) ? doIndex :
                          Math.min(doIndex, dontIndex);
        
        // Add text before toggle to current segment if counting
        if (counting) {
            currentSegment += remaining.substring(0, nextToggle);
        }
        
        // Update counting state based on next toggle
        const nextInstruction = remaining.substring(nextToggle, nextToggle + 5);
        const wasCountingBefore = counting;
        counting = nextInstruction === 'do()';
        
        // Only save segment when transitioning from counting to not counting
        if (wasCountingBefore && !counting && currentSegment) {
            countableSegments.push(currentSegment);
            currentSegment = '';
        }
        
        // Move past the toggle instruction
        remaining = remaining.substring(nextToggle + 5);
    }
    
    // Add final segment if it exists and we're still counting
    if (currentSegment) {
        countableSegments.push(currentSegment);
    }
    
    // Process all countable segments using Part 1 logic
    return solve_pt1(countableSegments.join(''));
}

// Only run this if this is the main module
if (import.meta.url.endsWith(process.argv[1])) {
    const fs = await import('fs');
    const input = fs.readFileSync('./input.txt', 'utf8');
    console.log('Part 1:', solve_pt1(input));
    console.log('Part 2:', solve_pt2(input));
}