import { readFileSync } from 'fs';
import { sum } from 'lodash';
import path from 'path';

interface Point {
  x: number;
  y: number;
}

interface Segment {
  a: Point;
  b: Point;
}

const displayMap = (lines: string[][]) => {
  console.log(lines.map(line => line.join('')).join('\n'));
};

const expand = (lines: string[][]): string[][] => {
  const linesToAdd: number[] = [];
  const columnsToAdd: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].includes('#')) {
      linesToAdd.push(i);
    }
  }
  for (let j = 0; j < lines[0].length; j++) {
    if (!lines.map(line => line[j]).includes('#')) {
      columnsToAdd.push(j);
    }
  }

  for (let k = 0; k < linesToAdd.length; k++) {
    lines.splice(k + linesToAdd[k], 0, Array(lines[0].length).fill('.'));
  }

  for (let i = 0; i < lines.length; i++) {
    for (let k = 0; k < columnsToAdd.length; k++) {
      lines[i].splice(k + columnsToAdd[k], 0, '.');
    }
  }

  return lines;
};

const dist = (segment: Segment): number =>
  Math.abs(segment.a.x - segment.b.x) + Math.abs(segment.a.y - segment.b.y);

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = file.split('\n').map(line => line.split(''));

  displayMap(lines);
  console.log('---');

  const afterExpansion = expand(lines);

  displayMap(afterExpansion);

  const points: Point[] = [];

  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      if (lines[i][j] === '#') {
        points.push({ x: i, y: j });
      }
    }
  }

  const segments: { a: Point; b: Point }[] = [];

  for (let k = 0; k < points.length; k++) {
    for (let p = k + 1; p < points.length; p++) {
      segments.push({ a: points[k], b: points[p] });
    }
  }

  console.log(segments.length);

  console.log(segments.map(dist));

  return sum(segments.map(dist));
};

const response = exercise1();

console.log(response);
