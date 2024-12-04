"use strict";
import * as fs from 'fs';

const start = (): void => {
    console.log("Solution to part 1: ")
    console.log(solve_pt1());
    console.log("Solution to part 2: ")
    console.log(solve_pt2());
};



const solve_pt1 = () => {
    try {
        let data = fs.readFileSync('src/input.txt', 'utf8');
        const lines = data.split('\n');
        console.log(lines);

        return 0;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('src/input.txt', 'utf8');
        const lines = data.split('\n');
        console.log(lines);

        return 0;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}



start();


export default start;