import { readFileSync } from 'fs';
import { sum } from 'lodash';
import path from 'path';

type I = {};

const parseLine = (line: string): I => {
  return {};
};

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const inputs: I[] = file.split('\n').map(parseLine);

  console.log(inputs);

  return;
};

console.log(exercise1());
