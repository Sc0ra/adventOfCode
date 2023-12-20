import { readFileSync } from 'fs';
import { chunk, countBy, isEqual, range, sum } from 'lodash';
import path from 'path';

interface Input {
  direction: string;
  length: number;
}

type Point = { x: number; y: number };

const displayMap = (map: string[][]): void => {
  console.log(map.map(row => row.map(elem => elem).join('')).join('\n'));
  console.log('\n\n');
};

const trad = {
  0: 'R',
  1: 'D',
  2: 'L',
  3: 'U',
};

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const inputs: Input[] = file.split('\n').map(line => {
    const [, , input] = line.split(' ');

    return {
      direction: trad[input[input.length - 2]],
      length: Number.parseInt(input.substring(2, input.length - 2), 16),
    };
  });

  let points: Point[] = [{ x: 0, y: 0 }];

  let perimeter = 0;

  for (let { direction, length } of inputs) {
    perimeter += length;
    const { x, y } = points[points.length - 1];
    if (direction === 'R') {
      points.push({ x, y: y + length });
    }
    if (direction === 'L') {
      points.push({ x, y: y - length });
    }
    if (direction === 'D') {
      points.push({ x: x + length, y });
    }
    if (direction === 'U') {
      points.push({ x: x - length, y });
    }
  }

  // console.log(perimeter);

  // console.log(points);

  let interiorSurface = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];

    interiorSurface += 0.5 * (b.x * a.y - a.x * b.y);
    // console.log({ a, b, interiorSurface });
  }

  return Math.floor(interiorSurface) + Math.floor(perimeter / 2) + 1;
};

const response = exercise1();
console.log(response);
