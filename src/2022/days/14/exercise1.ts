import { readFileSync } from 'fs';
import { isArray, isNumber, range, sum } from 'lodash';
import path from 'path';

enum Elem {
  Air = '.',
  Rock = '#',
  Sand = 'o'
}

type Map = Elem[][]

type Rock = Record<number, Record<number, boolean>>;

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = file.split('\n');

  let rocks: Rock = {};

  const pushInRocks = (x: number, y: number): void => {
    if(rocks[x] === undefined) {
      rocks[x] = {
        [y]: true
      }
    } else {
      rocks[x][y] = true
    }
  }

  for(let line of lines) {
    const rockEdges = line.split(' -> ').map(rockEdgeString => {
      const [x, y] = rockEdgeString.split(',').map(val => Number.parseInt(val))
      return {x, y};
    });

    for(let i=0; i < rockEdges.length-1; i++) {
      const edge1 = rockEdges[i];
      const edge2 = rockEdges[i+1];

      if(edge1.x === edge2.x) {
        for (let k of range(Math.min(edge1.y, edge2.y), Math.max(edge1.y, edge2.y) + 1)) {
          pushInRocks(edge1.x, k)
        }
        continue;
      }

      if(edge1.y === edge2.y) {
        for (let k of range(Math.min(edge1.x, edge2.x), Math.max(edge1.x, edge2.x) + 1)) {
          pushInRocks(k, edge1.y)
        }
      }
    }
  }

  const minX = Math.min(...Object.keys(rocks).map(key => Number.parseInt(key))) - 1;
  const maxX = Math.max(...Object.keys(rocks).map(key => Number.parseInt(key))) + 1;
  const minY = 0;
  const maxY = Math.max(...Object.values(rocks).flatMap(obj => Object.keys(obj)).map(key => Number.parseInt(key))) + 1;

  const display = range(minY, maxY + 1).map(y => range(minX, maxX + 1).map(x => {
    if (x === 500 && y === 0) {
      return '+';
    }
    return (rocks[x] !== undefined && rocks[x][y] === true) ? '#' : '.';
  }).join('')).join('\n');

  console.log(display);
};

const response = exercise1();

console.log(response);
