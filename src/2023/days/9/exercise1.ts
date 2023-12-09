import { readFileSync } from 'fs';
import path from 'path';
import { sum } from 'lodash';

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const series = file
    .split('\n')
    .map(line => line.split(' ').map(num => Number.parseInt(num)));

  const allFactors: number[][][] = [];
  for (let serie of series) {
    const factors: number[][] = [serie];
    while (factors[factors.length - 1].some(num => num !== 0)) {
      const newFactor = factors[factors.length - 1].reduce<number[]>(
        (acc, val, i, arr) => {
          if (arr[i + 1] !== undefined) {
            acc.push(arr[i + 1] - val);
          }

          return acc;
        },
        [],
      );
      factors.push(newFactor);
    }
    allFactors.push(factors);
  }

  const nextVals = allFactors.map(factors =>
    sum(factors.map(factor => factor[factor.length - 1])),
  );

  console.log(nextVals);

  return sum(nextVals);
};

console.log(exercise1());
