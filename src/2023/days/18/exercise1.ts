import { readFileSync } from 'fs';
import { chunk, countBy, isEqual, range, sum } from 'lodash';
import path from 'path';

interface Input {
  direction: string;
  length: number;
}

type Dig = Record<number, Record<number, boolean>>;

const displayMap = (map: string[][]): void => {
  console.log(map.map(row => row.map(elem => elem).join('')).join('\n'));
  console.log('\n\n');
};

const fill = (
  map: string[][],
  { x, y }: { x: number; y: number },
  visited: { x: number; y: number }[],
): string[][] => {
  if (map[x][y] === '.') {
    map[x][y] = '#';
    const newVisited = [...visited, { x, y }];
    if (map[x + 1][y] === '.') {
      fill(map, { x: x + 1, y }, newVisited);
    }
    if (map[x - 1][y] === '.') {
      fill(map, { x: x - 1, y }, newVisited);
    }
    if (map[x][y + 1] === '.') {
      fill(map, { x, y: y + 1 }, newVisited);
    }
    if (map[x][y - 1] === '.') {
      fill(map, { x, y: y - 1 }, newVisited);
    }
  }
  return map;
};

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const inputs: Input[] = file.split('\n').map(line => {
    const [direction, lengthS] = line.split(' ');
    return { direction, length: Number.parseInt(lengthS) };
  });

  const dig: Dig = {
    [0]: { [0]: true },
  };
  const pos = { x: 0, y: 0 };
  for (let { direction, length } of inputs) {
    if (direction === 'R') {
      for (let i = pos.y + 1; i <= pos.y + length; i++) {
        dig[pos.x][i] = true;
      }
      pos.y += length;
    }
    if (direction === 'L') {
      for (let i = pos.y - 1; i >= pos.y - length; i--) {
        dig[pos.x][i] = true;
      }
      pos.y -= length;
    }
    if (direction === 'D') {
      for (let i = pos.x + 1; i <= pos.x + length; i++) {
        if (dig[i] === undefined) {
          dig[i] = {};
        }
        dig[i][pos.y] = true;
      }
      pos.x += length;
    }
    if (direction === 'U') {
      for (let i = pos.x - 1; i >= pos.x - length; i--) {
        if (dig[i] === undefined) {
          dig[i] = {};
        }
        dig[i][pos.y] = true;
      }
      pos.x -= length;
    }
  }

  const minX = Math.min(...Object.keys(dig).map(key => Number.parseInt(key)));
  const maxX = Math.max(...Object.keys(dig).map(key => Number.parseInt(key)));
  const minY = Math.min(
    ...Object.values(dig)
      .flatMap(obj => Object.keys(obj))
      .map(key => Number.parseInt(key)),
  );
  const maxY = Math.max(
    ...Object.values(dig)
      .flatMap(obj => Object.keys(obj))
      .map(key => Number.parseInt(key)),
  );

  const map: string[][] = range(minX, maxX + 1).map(x =>
    range(minY, maxY + 1).map(y => {
      return dig[x] !== undefined && dig[x][y] === true ? '#' : '.';
    }),
  );

  fill(map, { x: 1, y: 80 }, []);

  displayMap(map);

  return sum(map.map(line => countBy(line)['#']));
};

const response = exercise1();
console.log(response);
