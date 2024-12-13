import * as fs from 'fs';

interface Point {
    x: number;
    y: number;
}

interface Region {
    type: string;
    points: Point[];
}

function countSides(points: Point[]): number {
    return 0;
}

function findRegions(grid: string[][]): Region[] {
    const regions: Region[] = [];
    const visited = new Set<string>();

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const key = `${x},${y}`;
            if (!visited.has(key)) {
                const type = grid[y][x];
                const points: Point[] = [];
                const queue: Point[] = [{x, y}];

                while (queue.length > 0) {
                    const p = queue.shift()!;
                    const k = `${p.x},${p.y}`;
                    
                    if (!visited.has(k) && grid[p.y][p.x] === type) {
                        visited.add(k);
                        points.push(p);

                        // Check all four directions
                        const directions = [[-1,0], [1,0], [0,-1], [0,1]];
                        for (const [dx, dy] of directions) {
                            const nx = p.x + dx;
                            const ny = p.y + dy;
                            
                            if (nx >= 0 && nx < grid[0].length && 
                                ny >= 0 && ny < grid.length && 
                                !visited.has(`${nx},${ny}`) && 
                                grid[ny][nx] === type) {
                                queue.push({x: nx, y: ny});
                            }
                        }
                    }
                }

                if (points.length > 0) {
                    regions.push({type, points});
                }
            }
        }
    }

    return regions;
}

function calculatePerimeter(points: Point[], grid: string[][]): number {
    let perimeter = 0;
    const pointSet = new Set(points.map(p => `${p.x},${p.y}`));

    for (const point of points) {
        // Check all four adjacent cells
        if (point.x === 0 || !pointSet.has(`${point.x - 1},${point.y}`)) perimeter++;
        if (point.y === 0 || !pointSet.has(`${point.x},${point.y - 1}`)) perimeter++;
        if (point.x === grid[0].length - 1 || !pointSet.has(`${point.x + 1},${point.y}`)) perimeter++;
        if (point.y === grid.length - 1 || !pointSet.has(`${point.x},${point.y + 1}`)) perimeter++;
    }

    return perimeter;
}

function solve_pt1(): number {
    const input = fs.readFileSync('./src/input.txt', 'utf8');
    const grid = input.trim().split('\n').map(line => line.split(''));
    
    const regions = findRegions(grid);
    let totalValue = 0;

    regions.forEach((region) => {
        const area = region.points.length;
        const perimeter = calculatePerimeter(region.points, grid);
        const price = area * perimeter;
        totalValue += price;
    });

    return totalValue;
}

function solve_pt2(): number {
    const input = fs.readFileSync('./src/input.txt', 'utf8');
    const grid = input.trim().split('\n').map(line => line.split(''));
    
    console.log('Grid dimensions:', grid.length, 'x', grid[0].length);
    const regions = findRegions(grid);
    console.log(`Found ${regions.length} regions`);
    
    let totalValue = 0;
    regions.forEach((region, index) => {
        const area = region.points.length;
        const sides = countSides(region.points);
        const price = area * sides;
        
        console.log(`\nRegion ${index + 1}:`);
        console.log(`Type: ${region.type}`);
        console.log(`Area: ${area}`);
        console.log(`Sides: ${sides}`);
        console.log(`Price: ${area} × ${sides} = ${price}`);
        console.log('Points:', region.points.map(p => `(${p.x},${p.y})`).join(' '));
        
        totalValue += price;
    });
    
    return totalValue;
}

function start() {
    console.log('Part 1:', solve_pt1());
    console.log('Part 2:', solve_pt2());
}

start();