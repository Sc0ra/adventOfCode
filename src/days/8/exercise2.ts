import { readFileSync } from 'fs';
import { flatten, max, slice, sum } from 'lodash';
import path from 'path';

type Grid = number[][];

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = file.split('\n');

  const grid: Grid = lines.map(line => line.split('').map(string => Number.parseInt(string)));

  const gridHeight = grid.length;
  const gridWidth = grid[0].length; 

  const scenicScores: number[][] = [...Array(gridHeight)].map(_=>[...Array(gridWidth).fill(1)]);  

  for(let i = 0; i < gridHeight; i++) {

    // FROM left
    for(let j = 0; j < gridWidth; j++) {
      if (i === 0 || i === gridHeight - 1 || j === 0 || j === gridWidth - 1) {
        scenicScores[i][j] = 0;
        continue;
      }

      const value = grid[i][j];
      let localScenicScore = 0;

      for (let k = j - 1; k >= 0; k--) {
        localScenicScore ++;
        if (grid[i][k] >= value) {
          break;
        }
      }

      scenicScores[i][j] *= localScenicScore;
    }

    // FROM right
    for(let j = gridWidth - 1; j >= 0; j--) {
      if (i === 0 || i === gridHeight - 1 || j === 0 || j === gridWidth - 1) {
        scenicScores[i][j] = 0;
        continue;
      }

      const value = grid[i][j];
      let localScenicScore = 0;

      for (let k = j + 1; k < gridWidth; k++) {
        localScenicScore ++;
        if (grid[i][k] >= value) {
          break;
        }
      }

      scenicScores[i][j] *= localScenicScore;
    }
  }



  for(let j = 0; j < gridWidth; j++) {
      // FROM top
    for(let i = 0; i < gridHeight; i++) {
      if (i === 0 || i === gridHeight - 1 || j === 0 || j === gridWidth - 1) {
        scenicScores[i][j] = 0;
        continue;
      }

      const value = grid[i][j];
      let localScenicScore = 0;

      for (let k = i - 1; k >= 0; k--) {
        localScenicScore ++;
        if (grid[k][j] >= value) {
          break;
        }
      }

      scenicScores[i][j] *= localScenicScore;
    }

    // FROM bottom
    for(let i = gridHeight - 1; i >= 0; i--) {
      if (i === 0 || i === gridHeight - 1 || j === 0 || j === gridWidth - 1) {
        scenicScores[i][j] = 0;
        continue;
      }

      const value = grid[i][j];
      let localScenicScore = 0;

      for (let k = i + 1; k < gridHeight; k++) {
        localScenicScore ++;
        if (grid[k][j] >= value) {
          break;
        }
      }

      scenicScores[i][j] *= localScenicScore;
    }
  }

  const answer = max(flatten(scenicScores));

  return answer;
};

const response = exercise1();

console.log(response)
