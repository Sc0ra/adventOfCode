import { readFileSync } from 'fs';
import { uniq } from 'lodash';
import path from 'path';

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const characters = file.split('');

  let buffer: string[] = [];

  for (let index = 0; index < characters.length; index++) {
    const character = characters[index];

    if(index <= 13) {
      buffer = [...buffer, character];
    } else {
      buffer = [...buffer.slice(1), character];
    }

    if (buffer.length < 14) {
      continue;
    }

    if(buffer.length === uniq(buffer).length) {
      return index + 1;
    }
  }
};

console.log(exercise1());