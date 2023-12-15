import { readFileSync } from 'fs';
import path from 'path';
import { isEqual, sum } from 'lodash';

type Map = ('.' | 'O' | '#')[][];

const displayMap = (map: Map): void => {
  console.log(map.map(row => row.map(elem => elem).join('')).join('\n'));
  console.log('\n');
};

const fallNorth = (map: Map, x: number, y: number): void => {
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

const fallWest = (map: Map, x: number, y: number): void => {
  // console.log(map[x][y]);
  map[x][y] = '.';
  for (let j = y; j >= 0; j--) {
    // console.log(i, map[i][y]);
    if (map[x][j] !== '.') {
      map[x][j + 1] = 'O';
      return;
    }
  }
  map[x][0] = 'O';
};

const fallSouth = (map: Map, x: number, y: number): void => {
  // console.log(map[x][y]);
  map[x][y] = '.';
  for (let i = x; i < map.length; i++) {
    // console.log(i, map[i][y]);
    if (map[i][y] !== '.') {
      map[i - 1][y] = 'O';
      return;
    }
  }
  map[map.length - 1][y] = 'O';
};

const fallEast = (map: Map, x: number, y: number): void => {
  // console.log(map[x][y]);
  map[x][y] = '.';
  for (let j = y; j < map[x].length; j++) {
    // console.log(i, map[i][y]);
    if (map[x][j] !== '.') {
      map[x][j - 1] = 'O';
      return;
    }
  }
  map[x][map[0].length - 1] = 'O';
};

const getResult = (map: Map): number => {
  return sum(
    map.map((line, i) => line.filter(c => c === 'O').length * (map.length - i)),
  );
};

export const exercise1 = async () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  let map = file.split('\n').map(line => line.split('')) as Map;

  // displayMap(map);

  const mapHistory: Map[] = [[...map.map(line => [...line])]];

  let foundIndex = -1;
  let foundK = 1;

  for (foundK; foundK <= 1000000000; foundK++) {
    for (let i = 1; i < map.length; i++) {
      for (let j = 0; j < map[0].length; j++) {
        if (map[i][j] === 'O') {
          fallNorth(map, i, j);
        }
      }
    }

    for (let j = 0; j < map[0].length; j++) {
      for (let i = 0; i < map.length; i++) {
        if (map[i][j] === 'O') {
          fallWest(map, i, j);
        }
      }
    }

    for (let i = map.length - 2; i >= 0; i--) {
      for (let j = 0; j < map[0].length; j++) {
        if (map[i][j] === 'O') {
          fallSouth(map, i, j);
        }
      }
    }

    for (let j = map[0].length - 2; j >= 0; j--) {
      for (let i = 0; i < map.length; i++) {
        if (map[i][j] === 'O') {
          fallEast(map, i, j);
        }
      }
    }

    // displayMap(map);

    foundIndex = mapHistory.findIndex(m => isEqual(m, map));

    if (foundIndex !== -1) {
      console.log({ foundIndex, foundK });
      break;
    }
    mapHistory.push([...map.map(line => [...line])]);
  }

  for (let a = 0; a < mapHistory.length; a++) {
    console.log(`Map turn ${a}: \n`);
    // displayMap(mapHistory[a]);
    console.log(`North load: ${getResult(mapHistory[a])} \n\n###\n`);
  }

  console.log(mapHistory.map(m => getResult(m)));

  map = mapHistory[1000000000 % (foundK - foundIndex)];

  const x = (1000000000 - foundIndex) % (foundK - foundIndex);

  console.log(x);

  console.log(getResult(mapHistory[foundIndex + x]));

  return getResult(map);
};

const response = exercise1().then(res => console.log(res));
