import { readFileSync } from 'fs';
import { isEqual, sum } from 'lodash';
import path from 'path';

type Map = ('.' | '|' | '-' | '/' | '\\')[][];
type Direction = 'L' | 'R' | 'T' | 'B';
type Pos = { x: number; y: number; from: Direction };

const displayMap = (map: Map): void => {
  console.log(map.map(row => row.map(elem => elem).join('')).join('\n'));
  console.log('\n\n');
};

const displayVisited = (
  map: Map,
  visited: Record<number, Record<number, Record<Direction, boolean>>>,
): void => {
  console.log(
    map
      .map(
        (line, x) =>
          `${line.map(elem => elem).join('')}  ${line
            .map((_, y) =>
              Object.values(visited[x][y]).some(v => v) ? '#' : '.',
            )
            .join('')}`,
      )
      .join('\n'),
  );
  console.log('\n\n');
};

const getNexts = (map: Map, { x, y, from }: Pos): Pos[] => {
  const char = map[x][y];
  switch (char) {
    case '.': {
      if (from === 'T' && map[x + 1] !== undefined) {
        return [{ x: x + 1, y, from }];
      }
      if (from === 'B' && map[x - 1] !== undefined) {
        return [{ x: x - 1, y, from }];
      }
      if (from === 'L' && map[x][y + 1] !== undefined) {
        return [{ x: x, y: y + 1, from }];
      }
      if (from === 'R' && map[x][y - 1] !== undefined) {
        return [{ x, y: y - 1, from }];
      }
      return [];
    }
    case '\\': {
      if (from === 'T' && map[x][y + 1] !== undefined) {
        return [{ x, y: y + 1, from: 'L' }];
      }
      if (from === 'B' && map[x][y - 1] !== undefined) {
        return [{ x, y: y - 1, from: 'R' }];
      }
      if (from === 'L' && map[x + 1] !== undefined) {
        return [{ x: x + 1, y, from: 'T' }];
      }
      if (from === 'R' && map[x - 1] !== undefined) {
        return [{ x: x - 1, y, from: 'B' }];
      }
      return [];
    }
    case '/': {
      if (from === 'T' && map[x][y - 1] !== undefined) {
        return [{ x, y: y - 1, from: 'R' }];
      }
      if (from === 'B' && map[x][y + 1] !== undefined) {
        return [{ x, y: y + 1, from: 'L' }];
      }
      if (from === 'L' && map[x - 1] !== undefined) {
        return [{ x: x - 1, y, from: 'B' }];
      }
      if (from === 'R' && map[x + 1] !== undefined) {
        return [{ x: x + 1, y, from: 'T' }];
      }
      return [];
    }
    case '|': {
      if (from === 'T' && map[x + 1] !== undefined) {
        return [{ x: x + 1, y, from }];
      }
      if (from === 'B' && map[x - 1] !== undefined) {
        return [{ x: x - 1, y, from }];
      }
      const topNext: Pos = { x: x - 1, y, from: 'B' };
      const botNext: Pos = { x: x + 1, y, from: 'T' };

      return [
        ...(map[x - 1] !== undefined ? [topNext] : []),
        ...(map[x + 1] !== undefined ? [botNext] : []),
      ];
    }
    case '-': {
      if (from === 'L' && map[x][y + 1] !== undefined) {
        return [{ x: x, y: y + 1, from }];
      }
      if (from === 'R' && map[x][y - 1] !== undefined) {
        return [{ x, y: y - 1, from }];
      }
      const leftNext: Pos = { x, y: y - 1, from: 'R' };
      const rightNext: Pos = { x, y: y + 1, from: 'L' };

      return [
        ...(map[x][y - 1] !== undefined ? [leftNext] : []),
        ...(map[x][y + 1] !== undefined ? [rightNext] : []),
      ];
    }
  }
};

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const map = file.split('\n').map(line => line.split('')) as Map;

  displayMap(map);

  const start: Pos = { x: 0, y: 0, from: 'L' };
  const visited: Record<
    number,
    Record<number, Record<Direction, boolean>>
  > = {};

  for (let i = 0; i < map.length; i++) {
    visited[i] = {};
    for (let j = 0; j < map[i].length; j++) {
      visited[i][j] = {
        B: false,
        L: false,
        R: false,
        T: false,
      };
    }
  }

  visited[0][0]['L'] = true;

  const nexts: Pos[] = [start];

  while (nexts.length > 0) {
    const next = nexts.pop();
    if (next === undefined) {
      throw new Error();
    }
    visited[next.x][next.y][next.from] = true;

    const neighbors = getNexts(map, next);
    nexts.push(...neighbors.filter(n => !visited[n.x][n.y][n.from]));
  }

  const energized = Object.values(visited)
    .flatMap(line =>
      Object.values(line).map(cell => Object.values(cell).some(dir => dir)),
    )
    .filter(b => b).length;

  return energized;
};

const response = exercise1();
console.log(response);
