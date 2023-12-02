import { readFileSync } from 'fs';
import path from 'path';
import sum from 'lodash/sum';

type Input = string[];

const numberTranslation = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const input: Input = file.split('\n');

  const parsed = input.map(str => {
    const regex = new RegExp(
      /(?=((one|two|three|four|five|six|seven|eight|nine|[0-9])))/g,
    );

    const matchs = Array.from(str.matchAll(regex), m => m[1]);
    console.log(matchs);

    const firstMatch = matchs[0];
    const firstMatchParsed = Object.keys(numberTranslation).includes(firstMatch)
      ? numberTranslation[firstMatch]
      : Number.parseInt(firstMatch);

    const lastMatch = matchs[matchs.length - 1];
    const lastMatchparsed = Object.keys(numberTranslation).includes(lastMatch)
      ? numberTranslation[lastMatch]
      : Number.parseInt(lastMatch);

    return firstMatchParsed * 10 + lastMatchparsed;
  });

  return sum(parsed);
};

console.log(exercise1());
