import { readFileSync } from 'fs';
import path from 'path';
import intersection from 'lodash/intersection';
import sum from 'lodash/sum';
import chunk from 'lodash/chunk';

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = file.split('\n').map(line => [...line]);
  const rucksackGroups = chunk(lines, 3);
  const rucksackBadges = rucksackGroups.map(group => intersection(...group)[0]);

  return sum(rucksackBadges.map(getCharacterPriority));
};

const getCharacterPriority = (character: string): number => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return alphabet.indexOf(character) + 1;
}

console.log(exercise1());