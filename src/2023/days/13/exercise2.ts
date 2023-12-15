import { readFileSync } from 'fs';
import { isEqual, sum } from 'lodash';
import path from 'path';

type Map = ('.' | '#')[][];

const displayMap = (map: Map): void => {
  console.log(map.map(line => line.join('')).join('\n'));
};

export const getColumns = (map: Map): Map => {
  const columns: Map = [];
  for (let i = 0; i < map[0].length; i++) {
    columns.push(map.map(line => line[i]));
  }

  return columns;
};

export const getFirstVerticalReflexionIndex = (map: Map): number => {
  for (let j = 0; j < map[0].length - 1; j++) {
    const k = Math.min(j, map[0].length - 2 - j);
    let defaultCount = 0;
    for (let line of map) {
      const left = line.slice(j - k, j + 1);
      const right = line.slice(j + 1, j + 2 + k);
      const reflexion = isEqual(left, [...right].reverse());

      if (!reflexion) {
        defaultCount++;
      }
      if (defaultCount > 1) {
        break;
      }
    }
    if (defaultCount === 1) {
      return j + 1;
    }
  }
  return 0;
};

export const getFirstHorizontalReflexionIndex = (map: Map): number => {
  const columns = getColumns(map);
  return getFirstVerticalReflexionIndex(columns);
};

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const mapStrings = file.split('\n\n');

  const maps: Map[] = mapStrings.map(mapString =>
    mapString.split('\n').map(line => line.split('') as ('.' | '#')[]),
  );

  let score = 0;

  for (let map of maps) {
    displayMap(map);
    console.log('vert');
    const vert = getFirstVerticalReflexionIndex(map);
    console.log('hor');
    const hor = getFirstHorizontalReflexionIndex(map);
    const mapScore = hor * 100 + vert;
    score += mapScore;
    console.log({ vert, hor, mapScore });
    console.log('\n###\n');
  }

  return score;
};

const response = exercise1();

console.log(response);
