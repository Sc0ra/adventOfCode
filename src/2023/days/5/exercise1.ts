import { readFileSync } from 'fs';
import { sum } from 'lodash';
import path from 'path';

type I = {
  name: string;
  ranges: {
    startDestination: number;
    startSource: number;
    length: number;
  }[];
};

const seeds = [
  1482445116, 339187393, 3210489476, 511905836, 42566461, 51849137, 256584102,
  379575844, 3040181568, 139966026, 4018529087, 116808249, 2887351536, 89515778,
  669731009, 806888490, 2369242654, 489923931, 2086168596, 82891253,
];

const parseGroup = (group: string): I => {
  const [nameString, ...lines] = group.split('\n');

  const name = nameString.replace(':', '');
  const ranges = lines.map(line => {
    const [startDestination, startSource, length] = line.split(' ').map(Number);
    return { startSource, startDestination, length };
  });

  return { name, ranges };
};

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

  const inputs: I[] = file.split('\n\n').map(parseGroup);

  const values: number[] = [];

  for (let seed of seeds) {
    let value = seed;
    for (let mapper of inputs) {
      let range = mapper.ranges.find(range => {
        return (
          range.startSource <= value &&
          value <= range.startSource + range.length
        );
      });
      if (range === undefined) {
        continue;
      } else {
        value = range.startDestination + (value - range.startSource);
      }
    }

    values.push(value);
  }

  return Math.min(...values);
};

console.log(exercise1());
