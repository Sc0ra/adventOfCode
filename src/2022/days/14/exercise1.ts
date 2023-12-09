import { readFileSync } from 'fs';
import { isArray, isNumber, range, sum } from 'lodash';
import path from 'path';

type Rock = Record<number, Record<number, boolean>>;

const displayMap = (map: string[][]): void => {
  console.log(map.map(row => row.map(elem => elem).join('')).join('\n'));
  console.log('\n\n');
};

const fall = (
  map: string[][],
  source: { x: number; y: number },
): { x: number; y: number } | false => {
  let shouldContinue = true;
  let { x, y } = source;
  while (true) {
    // console.log({ x, y });
    // console.log(`${map[y + 1][x - 1]}${map[y + 1][x]}${map[y + 1][x + 1]}`);
    if (map[y + 1] === undefined) {
      return false;
    } else if (map[y + 1][x] === '.') {
      y = y + 1;
      continue;
    } else if (map[y + 1][x - 1] === '.') {
      y = y + 1;
      x = x - 1;
      continue;
    } else if (map[y + 1][x + 1] === '.') {
      y = y + 1;
      x = x + 1;
      continue;
    } else {
      return { x, y };
    }
  }
};

export const exercise1 = async () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = file.split('\n');

  let rocks: Rock = {};

  const pushInRocks = (x: number, y: number): void => {
    if (rocks[x] === undefined) {
      rocks[x] = {
        [y]: true,
      };
    } else {
      rocks[x][y] = true;
    }
  };

  for (let line of lines) {
    const rockEdges = line.split(' -> ').map(rockEdgeString => {
      const [x, y] = rockEdgeString.split(',').map(val => Number.parseInt(val));
      return { x, y };
    });

    for (let i = 0; i < rockEdges.length - 1; i++) {
      const edge1 = rockEdges[i];
      const edge2 = rockEdges[i + 1];

      if (edge1.x === edge2.x) {
        for (let k of range(
          Math.min(edge1.y, edge2.y),
          Math.max(edge1.y, edge2.y) + 1,
        )) {
          pushInRocks(edge1.x, k);
        }
        continue;
      }

      if (edge1.y === edge2.y) {
        for (let k of range(
          Math.min(edge1.x, edge2.x),
          Math.max(edge1.x, edge2.x) + 1,
        )) {
          pushInRocks(k, edge1.y);
        }
      }
    }
  }

  const minX =
    Math.min(...Object.keys(rocks).map(key => Number.parseInt(key))) - 1000;
  const maxX =
    Math.max(...Object.keys(rocks).map(key => Number.parseInt(key))) + 1000;
  const minY = 0;
  const maxY =
    Math.max(
      ...Object.values(rocks)
        .flatMap(obj => Object.keys(obj))
        .map(key => Number.parseInt(key)),
    ) + 2;

  const map: string[][] = range(minY, maxY + 1).map(y =>
    range(minX, maxX + 1).map(x => {
      if (x === 500 && y === 0) {
        return '+';
      }
      if (y === maxY) {
        return '#';
      }
      return rocks[x] !== undefined && rocks[x][y] === true ? '#' : '.';
    }),
  );

  displayMap(map);

  let i = 0;
  while (true) {
    const fallen = fall(map, { x: 500 - minX, y: 0 });

    if (fallen === false) {
      displayMap(map);
      return i;
    }

    if (fallen.y === 0) {
      displayMap(map);
      return i;
    }

    map[fallen.y][fallen.x] = 'o';
    i++;

    if (i % 10 === 0) {
      displayMap(map);
    }
  }
};

const response = exercise1().then(res => console.log(res));
