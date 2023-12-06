import { readFileSync } from 'fs';
import { orderBy } from 'lodash';
import path from 'path';

type I = {
  name: string;
  ranges: {
    startDestination: number;
    endDestination: number;
    add: number;
  }[];
};

type Seed = {
  start: number;
  length: number;
};

const rawSeeds = [
  1482445116, 339187393, 3210489476, 511905836, 42566461, 51849137, 256584102,
  379575844, 3040181568, 139966026, 4018529087, 116808249, 2887351536, 89515778,
  669731009, 806888490, 2369242654, 489923931, 2086168596, 82891253,
];

const seeds = rawSeeds.reduce<Seed[]>((acc, number, index) => {
  if (index % 2 === 0) {
    acc.push({ start: number, length: 0 });
  } else {
    acc[acc.length - 1].length = number;
  }
  return acc;
}, []);

const parseGroup = (group: string): I => {
  const [nameString, ...lines] = group.split('\n');

  const name = nameString.replace(':', '');
  const ranges = lines.map(line => {
    const [startDestination, startSource, length] = line.split(' ').map(Number);
    return {
      startDestination,
      endDestination: startDestination + length - 1,
      add: startSource - startDestination,
    };
  });

  return { name, ranges };
};

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

  const inputs: I[] = file.split('\n\n').map(parseGroup).reverse();

  let i = 0;
  let shouldContinue = true;
  while (shouldContinue) {
    if (i % 10000 === 0) {
      console.log(i);
    }
    let value = i;
    for (let mapper of inputs) {
      const range = mapper.ranges.find(
        range =>
          value >= range.startDestination && value <= range.endDestination,
      );
      value += range?.add ?? 0;
      // console.log({ range, value });
    }
    const seed = seeds.find(
      seed => value >= seed.start && value <= seed.start + seed.length,
    );
    if (seed !== undefined) {
      console.log(seed);
      shouldContinue = false;
    } else {
      i++;
    }
  }

  return i;
};

console.log(exercise1());
