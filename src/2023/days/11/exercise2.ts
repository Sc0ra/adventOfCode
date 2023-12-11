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

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = file.split('\n').map(line => line.split(''));

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

  const dist = (segment: Segment): BigInt => {
    const basicDist = BigInt(
      Math.abs(segment.a.x - segment.b.x) + Math.abs(segment.a.y - segment.b.y),
    );

    const expansionLines = linesToAdd.filter(
      line =>
        line < Math.max(segment.a.x, segment.b.x) &&
        line > Math.min(segment.a.x, segment.b.x),
    );

    const expansionColumns = columnsToAdd.filter(
      col =>
        col < Math.max(segment.a.y, segment.b.y) &&
        col > Math.min(segment.a.y, segment.b.y),
    );

    return (
      basicDist +
      BigInt(expansionLines.length + expansionColumns.length) *
        (BigInt(1000000) - BigInt(1))
    );
  };

  return sum(segments.map(dist));
};

const response = exercise1();

console.log(response);
