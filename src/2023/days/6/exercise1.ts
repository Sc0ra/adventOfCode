import { readFileSync } from 'fs';
import path from 'path';

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = file.split('\n');

  const [, ...TIMES] = lines[0].split(' ').map(num => Number.parseInt(num));
  const [, ...DISTANCES] = lines[1].split(' ').map(num => Number.parseInt(num));

  let finalResult = 1;

  for (let i = 0; i < TIMES.length; i++) {
    let T = TIMES[i];
    let D = DISTANCES[i];
    let A = -1;
    let B = T;
    let C = -D;

    let delta = B ** 2 - 4 * A * C;

    let sol1 = ((-B + Math.sqrt(delta)) / 2) * A;
    let sol2 = ((-B - Math.sqrt(delta)) / 2) * A;

    let result = Math.floor(sol2) - Math.floor(sol1);

    finalResult *= result;
  }

  return finalResult;
};

console.log(exercise1());
