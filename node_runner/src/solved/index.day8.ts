import { readFileSync } from 'fs';

interface Position {
    x: number;
    y: number;
}

interface Antenna {
    position: Position;
    frequency: string;
}

const isWithinBounds = (pos: Position, maxX: number, maxY: number): boolean => {
    return pos.x >= 0 && pos.x < maxX && pos.y >= 0 && pos.y < maxY;
};

const findAntinodePosition = (a1: Antenna, a2: Antenna): Position[] => {
    if (a1.frequency !== a2.frequency) return [];
    
    const dx = a2.position.x - a1.position.x;
    const dy = a2.position.y - a1.position.y;
    
    if (dx === 0 && dy === 0) return [];
    
    console.log(`\nChecking antennas of frequency ${a1.frequency}:`);
    console.log(`Antenna 1: (${a1.position.x}, ${a1.position.y})`);
    console.log(`Antenna 2: (${a2.position.x}, ${a2.position.y})`);
    console.log(`Vector: (${dx}, ${dy})`);
    
    let result = [];
    for(let i = 0; i < 100; i++){
       const antinode1: Position = {
            x: a1.position.x - (dx * i),
            y: a1.position.y - (dy * i)
        };
        result.push(antinode1);
    }
    for(let i = 0; i < 100; i++){
        const antinode2: Position = {
            x: a2.position.x + (dx * i),
            y: a2.position.y + (dy * i)
        };    
        result.push(antinode2);
    }
    
    return result;
};

const positionToString = (pos: Position): string => {
    return `${pos.x},${pos.y}`;
};

export const solve_pt1 = (): number => {
    try {
        const input = readFileSync('./input.txt', 'utf-8');
        const lines = input.trim().split('\n');
        
        // Get grid dimensions
        const height = lines.length;
        const width = lines[0].length;
        
        console.log(`Grid dimensions: ${width}x${height}`);
        
        const antennas: Antenna[] = [];
        
        // Parse input
        for (let y = 0; y < lines.length; y++) {
            const line = lines[y];
            for (let x = 0; x < line.length; x++) {
                const char = line[x];
                if (char !== '.' && char !== ' ') {
                    antennas.push({
                        position: { x, y },
                        frequency: char
                    });
                }
            }
        }
        
        console.log("\nFound antennas:");
        antennas.forEach(a => console.log(`Frequency ${a.frequency} at (${a.position.x}, ${a.position.y})`));
        
        const frequencyGroups = new Map<string, Antenna[]>();
        for (const antenna of antennas) {
            if (!frequencyGroups.has(antenna.frequency)) {
                frequencyGroups.set(antenna.frequency, []);
            }
            frequencyGroups.get(antenna.frequency)?.push(antenna);
        }
        
        const antinodes = new Set<string>();
        
        for (const [freq, group] of frequencyGroups) {
            console.log(`\nProcessing frequency group: ${freq}`);
            for (let i = 0; i < group.length; i++) {
                for (let j = i + 1; j < group.length; j++) {
                    const potentialAntinodes = findAntinodePosition(group[i], group[j]);
                    for (const antinode of potentialAntinodes) {
                        if (isWithinBounds(antinode, width, height)) {
                            const posStr = positionToString(antinode);
                            antinodes.add(posStr);
                            console.log(`Added antinode at ${posStr}`);
                        }
                    }
                }
            }
        }
        
        console.log("\nFinal antinodes:");
        antinodes.forEach(pos => console.log(pos));
        console.log(`\nTotal unique antinodes: ${antinodes.size}`);
        
        return antinodes.size;
    } catch (error) {
        console.error('Error solving puzzle:', error);
        return 0;
    }
};

export const solve_pt2 = (): number => {
    try {
        const input = readFileSync('./input.txt', 'utf-8');
        const lines = input.trim().split('\n');
        
        // Get grid dimensions
        const height = lines.length;
        const width = lines[0].length;
        
        console.log(`Grid dimensions: ${width}x${height}`);
        
        const antennas: Antenna[] = [];
        
        // Parse input
        for (let y = 0; y < lines.length; y++) {
            const line = lines[y];
            for (let x = 0; x < line.length; x++) {
                const char = line[x];
                if (char !== '.' && char !== ' ') {
                    antennas.push({
                        position: { x, y },
                        frequency: char
                    });
                }
            }
        }
        
        console.log("\nFound antennas:");
        antennas.forEach(a => console.log(`Frequency ${a.frequency} at (${a.position.x}, ${a.position.y})`));
        
        const frequencyGroups = new Map<string, Antenna[]>();
        for (const antenna of antennas) {
            if (!frequencyGroups.has(antenna.frequency)) {
                frequencyGroups.set(antenna.frequency, []);
            }
            frequencyGroups.get(antenna.frequency)?.push(antenna);
        }
        
        const antinodes = new Set<string>();
        
        for (const [freq, group] of frequencyGroups) {
            console.log(`\nProcessing frequency group: ${freq}`);
            for (let i = 0; i < group.length; i++) {
                for (let j = i + 1; j < group.length; j++) {
                    const potentialAntinodes = findAntinodePosition(group[i], group[j]);
                    for (const antinode of potentialAntinodes) {
                        if (isWithinBounds(antinode, width, height)) {
                            const posStr = positionToString(antinode);
                            antinodes.add(posStr);
                            console.log(`Added antinode at ${posStr}`);
                        }
                    }
                }
            }
        }
        
        console.log("\nFinal antinodes:");
        antinodes.forEach(pos => console.log(pos));
        console.log(`\nTotal unique antinodes: ${antinodes.size}`);
        
        return antinodes.size;
    } catch (error) {
        console.error('Error solving puzzle:', error);
        return 0;
    }
};

console.log(solve_pt2());