import { readFileSync } from 'fs';
import { flatten, sum } from 'lodash';
import path from 'path';

type Grid = number[][];

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = file.split('\n');

  const grid: Grid = lines.map(line => line.split('').map(string => Number.parseInt(string)));

  const gridHeight = grid.length;
  const gridWidth = grid[0].length; 

  const isTreeVisible: boolean[][] = [...Array(gridHeight)].map(_=>[...Array(gridWidth).fill(false)]);    

  for(let i = 0; i < gridHeight; i++) {
    let lineMaximum = -1;

    // FROM left
    for(let j = 0; j < gridWidth; j++) {
      const value = grid[i][j];
      if(value > lineMaximum) {
        isTreeVisible[i][j] = true;
        lineMaximum = value;
      }
    }

    lineMaximum = -1;

    // FROM right
    for(let j = gridWidth - 1; j >= 0; j--) {
      const value = grid[i][j];
      if(value > lineMaximum) {
        isTreeVisible[i][j] = true;
        lineMaximum = value;
      }
    }
  }

  for(let j = 0; j < gridWidth; j++) {
    let columnMaximum = -1;

      // FROM top
    for(let i = 0; i < gridHeight; i++) {
      const value = grid[i][j];
      if(value > columnMaximum) {
        isTreeVisible[i][j] = true;
        columnMaximum = value;
      }
    }

    columnMaximum = -1;

    // FROM bottom
    for(let i = gridHeight - 1; i >= 0; i--) {
      const value = grid[i][j];
      if(value > columnMaximum) {
        isTreeVisible[i][j] = true;
        columnMaximum = value;
      }
    }
  }

  const answer = sum(flatten(isTreeVisible));

  return answer;
};

const response = exercise1();

console.log(response)
