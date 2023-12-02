import { readFileSync } from 'fs';
import { sum } from 'lodash';
import path from 'path';

const regex = new RegExp(/(\d*)-(\d*),(\d*)-(\d*)/);


export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = file.split('\n').map(line => {
    const matchs = regex.exec(line);
    // @ts-expect-error 
    const limits = [parseInt(matchs[1]), parseInt(matchs[2]), parseInt(matchs[3]), parseInt(matchs[4])];
    if (
      (limits[0] <= limits[2] || limits[3] <= limits[1]) || 
      (limits[2] <= limits[0] || limits[1] <= limits[3])
      ) {
      return 1;
    }
    return 0;
  });

  console.log(lines);

  return sum(lines);
};

console.log(exercise1());