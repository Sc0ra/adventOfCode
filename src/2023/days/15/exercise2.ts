import { readFileSync } from 'fs';
import { isEqual, sum } from 'lodash';
import path from 'path';

interface Instruction {
  label: string;
  operation: '=' | '-';
  focalLength?: number;
}

const parseInstruction = (str: string): Instruction => {
  const minusIndex = str.indexOf('-');
  const equalIndex = str.indexOf('=');

  if (minusIndex !== -1) {
    return {
      label: str.slice(0, minusIndex),
      operation: '-',
    };
  }

  return {
    label: str.slice(0, equalIndex),
    operation: '=',
    focalLength: Number.parseInt(str.slice(equalIndex + 1)),
  };
};

const computeHash = (word: string): number => {
  return [...word].reduce((acc, char) => {
    acc += char.charCodeAt(0);
    acc *= 17;
    acc %= 256;

    return acc;
  }, 0);
};

const hashMap: Record<number, Instruction[]> = {};

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const instructions = file.split(',').map(parseInstruction);

  for (let { label, operation, focalLength } of instructions) {
    const hash = computeHash(label);
    if (operation === '-') {
      if (hashMap[hash] !== undefined) {
        hashMap[hash] = [...hashMap[hash].filter(i => label !== i.label)];
      }
    }
    if (operation === '=') {
      const matching = hashMap[hash]?.find(i => i.label === label);
      if (matching !== undefined) {
        matching.focalLength = focalLength;
      } else {
        hashMap[hash] = [
          ...(hashMap[hash] ?? []),
          { label, operation, focalLength },
        ];
      }
    }
  }

  console.log(hashMap);

  const results = Object.entries(hashMap).flatMap(([boxIndex, slots]) =>
    slots.map(
      (slot, slotIndex) =>
        (Number.parseInt(boxIndex) + 1) *
        (slotIndex + 1) *
        (slot.focalLength ?? 0),
    ),
  );

  return sum(results);
};

const response = exercise1();
console.log(response);
