import { readFileSync } from 'fs';
import path from 'path';
import sum from 'lodash/sum';

type Input = string[];

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const input: Input = file.split('\n');

  const parsed = input.map(str => {
    const numberChars = str.replace(/[a-z]/g, '');
    return Number.parseInt(
      `${numberChars[0]}${numberChars[numberChars.length - 1]}`,
    );
  });

  return sum(parsed);
};

console.log(exercise1());
