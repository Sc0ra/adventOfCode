import { readFileSync } from 'fs';
import { sum } from 'lodash';
import path from 'path';

const computeHash = (word: string): number => {
  return [...word].reduce((acc, char) => {
    acc += char.charCodeAt(0);
    acc *= 17;
    acc %= 256;

    return acc;
  }, 0);
};

export const exercise1 = async () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const words = file.split(',');

  const hashs = words.map(computeHash);

  return sum(hashs);
};

const response = exercise1().then(res => console.log(res));
