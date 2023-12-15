import { readFileSync } from 'fs';
import path from 'path';
import { sum } from 'lodash';

type Map = ('.' | 'O' | '#')[][];

const displayMap = (map: Map): void => {
  console.log(map.map(row => row.map(elem => elem).join('')).join('\n'));
  console.log('\n\n');
};

const fall = (map: Map, x: number, y: number): void => {
  // console.log(map[x][y]);
  map[x][y] = '.';
  for (let i = x; i >= 0; i--) {
    // console.log(i, map[i][y]);
    if (map[i][y] !== '.') {
      map[i + 1][y] = 'O';
      return;
    }
  }
  map[0][y] = 'O';
};

const getResult = (map: Map): number => {
  return sum(
    map.map((line, i) => line.filter(c => c === 'O').length * (map.length - i)),
  );
};

export const exercise1 = async () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const map = file.split('\n').map(line => line.split('')) as Map;

  displayMap(map);

  for (let i = 1; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] === 'O') {
        fall(map, i, j);
      }
    }
  }

  displayMap(map);

  return getResult(map);
};

const response = exercise1().then(res => console.log(res));
