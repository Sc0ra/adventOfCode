import { readFileSync } from 'fs';
import path from 'path';
import { sum } from 'lodash';

export const exercise2 = () => {
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

  console.log(allFactors);

  const nextVals = allFactors.map(
    factors =>
      factors[0][0] -
      sum(
        factors
          .slice(1)
          .map((factor, i) => (((i + 1) % 2) * 2 - 1) * factor[0]),
      ),
  );

  console.log(nextVals);

  return sum(nextVals);
};

console.log(exercise2());
