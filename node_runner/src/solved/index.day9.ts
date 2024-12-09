"use strict";
import * as fs from 'fs';

// Types for our solution
type DiskBlock = {
    fileId: number | null;  // null represents free space
    size: number;
};

const start = (): void => {
    console.log("Solution to part 1: ")
    console.log(solve_pt1());
    console.log("Solution to part 2: ")
    console.log(solve_pt2());
};

const parseDiskMap = (input: string): DiskBlock[] => {
    const numbers = input.split('').map(Number);
    const blocks: DiskBlock[] = [];
    let fileId = 0;
    
    for (let i = 0; i < numbers.length; i++) {
        const size = numbers[i];
        // Even indices are file blocks, odd indices are free space
        blocks.push({
            fileId: i % 2 === 0 ? fileId++ : null,
            size: size
        });
    }
    
    return blocks;
};

const expandDiskMap = (blocks: DiskBlock[]): DiskBlock[] => {
    const expanded: DiskBlock[] = [];
    
    blocks.forEach(block => {
        for (let i = 0; i < block.size; i++) {
            expanded.push({
                fileId: block.fileId,
                size: 1
            });
        }
    });
    
    return expanded;
};

const findRightmostFile = (disk: DiskBlock[]): number => {
    for (let i = disk.length - 1; i >= 0; i--) {
        if (disk[i].fileId !== null) {
            return i;
        }
    }
    return -1;
};

const findLeftmostSpace = (disk: DiskBlock[], beforeIndex: number): number => {
    for (let i = 0; i < beforeIndex; i++) {
        if (disk[i].fileId === null) {
            return i;
        }
    }
    return -1;
};

const calculateChecksum = (disk: DiskBlock[]): number => {
    let checksum = 0;
    for (let i = 0; i < disk.length; i++) {
        if (disk[i].fileId !== null) {
            checksum += i * disk[i].fileId;
        }
    }
    return checksum;
};

const compactDisk = (disk: DiskBlock[]): DiskBlock[] => {
    const workingDisk = [...disk];
    
    while (true) {
        const rightmostFileIndex = findRightmostFile(workingDisk);
        if (rightmostFileIndex === -1) break;
        
        const leftmostSpaceIndex = findLeftmostSpace(workingDisk, rightmostFileIndex);
        if (leftmostSpaceIndex === -1) break;
        
        // Move the file block
        workingDisk[leftmostSpaceIndex] = workingDisk[rightmostFileIndex];
        workingDisk[rightmostFileIndex] = { fileId: null, size: 1 };
    }
    
    return workingDisk;
};

// Part 2 Functions

const findRightmostBlock = (disk: DiskBlock[], processed: Set<number>): [number, number] => {
    let currentId: number | null = null;
    let blockStart = -1;
    let blockSize = 0;
    
    for (let i = disk.length - 1; i >= 0; i--) {
        const block = disk[i];
        if (block.fileId !== null && !processed.has(block.fileId)) {
            if (currentId === null || currentId === block.fileId) {
                currentId = block.fileId;
                blockSize++;
                if (blockStart === -1) blockStart = i;
            } else if (currentId !== block.fileId) {
                return [blockStart, blockSize];
            }
        } else if (currentId !== null) {
            return [blockStart, blockSize];
        }
    }
    return blockStart !== -1 ? [blockStart, blockSize] : [-1, 0];
};

const findLeftmostFitSpace = (disk: DiskBlock[], beforeIndex: number, size: number): number => {
    let spaceStart = -1;
    let spaceSize = 0;
    
    for (let i = 0; i < beforeIndex; i++) {
        if (disk[i].fileId === null) {
            if (spaceStart === -1) spaceStart = i;
            spaceSize++;
            if (spaceSize === size) {
                return spaceStart;
            }
        } else {
            spaceStart = -1;
            spaceSize = 0;
        }
    }
    return -1;
};

const compactDiskBlocks = (disk: DiskBlock[]): DiskBlock[] => {
    const workingDisk = [...disk];
    const processed = new Set<number>();
    
    while (true) {
        const [blockEnd, blockSize] = findRightmostBlock(workingDisk, processed);
        if (blockEnd === -1 || blockSize === 0) break;
        
        const fileId = workingDisk[blockEnd].fileId;
        if (fileId === null) break;
        
        processed.add(fileId);
        
        const spaceStart = findLeftmostFitSpace(workingDisk, blockEnd, blockSize);
        if (spaceStart === -1) continue;
        
        // Move the entire block
        for (let i = 0; i < blockSize; i++) {
            workingDisk[spaceStart + i] = { fileId, size: 1 };
            workingDisk[blockEnd - i] = { fileId: null, size: 1 };
        }
    }
    
    return workingDisk;
};

const solve_pt1 = () => {
    try {
        let data = fs.readFileSync('src/input.txt', 'utf8');
        const lines = data.split('\\n');
        const diskMap = lines[0];  // Take first line as input
        
        // Parse the disk map into blocks
        const initialBlocks = parseDiskMap(diskMap);
        
        // Expand the blocks into individual units
        const expandedDisk = expandDiskMap(initialBlocks);
        
        // Compact the disk
        const compactedDisk = compactDisk(expandedDisk);
        
        // Calculate and return checksum
        return calculateChecksum(compactedDisk);
        
    } catch (e) {
        console.log('Error:', e.stack);
        return -1;
    }
};

const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('src/input.txt', 'utf8');
        const lines = data.split('\\n');
        const diskMap = lines[0];  // Take first line as input
        
        // Parse the disk map into blocks
        const initialBlocks = parseDiskMap(diskMap);
        
        // Expand the blocks into individual units
        const expandedDisk = expandDiskMap(initialBlocks);
        
        // Compact the disk using block movement
        const compactedDisk = compactDiskBlocks(expandedDisk);
        
        // Calculate and return checksum
        return calculateChecksum(compactedDisk);
        
    } catch (e) {
        console.log('Error:', e.stack);
        return -1;
    }
};

start();

export default start;