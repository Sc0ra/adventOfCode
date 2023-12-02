import { readFileSync } from 'fs';
import path from 'path';
import intersection from 'lodash/intersection';
import sum from 'lodash/sum';

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = file.split('\n');
  const rucksackAnomalies = lines.map(line => {
    const half = Math.ceil(line.length / 2);
    const firstHalf = [...line.slice(0, half)].sort();
    const secondHalf = [...line.slice(half)].sort();
    return intersection(firstHalf, secondHalf)[0];
  });

  return sum(rucksackAnomalies.map(getCharacterPriority));
};

const getCharacterPriority = (character: string): number => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return alphabet.indexOf(character) + 1;
}

console.log(exercise1());