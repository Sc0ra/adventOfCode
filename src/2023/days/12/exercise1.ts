import { readFileSync } from 'fs';
import { isEqual, sum } from 'lodash';
import path from 'path';

interface Input {
  springs: string;
  brokenCounts: number[];
}

const isValid = ({ springs, brokenCounts }: Input): boolean => {
  if (springs.includes('?')) return false;
  const springGroups = springs
    .replace(/\./g, ' ')
    .trim()
    .split(/\s+/g)
    .map(g => g.length);

  return isEqual(springGroups, brokenCounts);
};

const isPartialValid = ({ springs, brokenCounts }: Input): boolean => {
  const firstUndefined = springs.indexOf('?');
  const subString = springs.slice(0, firstUndefined);

  const subSpringGroups = subString
    .replace(/\./g, ' ')
    .trim()
    .split(/\s+/g)
    .map(g => g.length);

  // console.log(springs);
  // console.log(subString);
  // console.log(subSpringGroups);
  // console.log(brokenCounts);

  let areAllFirstEquals = true;

  if (subSpringGroups.length > 1) {
    areAllFirstEquals = isEqual(
      subSpringGroups.slice(0, subSpringGroups.length - 1),
      brokenCounts.slice(0, subSpringGroups.length - 1),
    );
  }

  const isLastValid =
    subSpringGroups[subSpringGroups.length - 1] <=
    brokenCounts[subSpringGroups.length - 1];

  console.log({
    areAllFirstEquals,
    isLastValid,
    isValid: areAllFirstEquals && isLastValid,
  });
  console.log('---');

  return areAllFirstEquals && isLastValid;
};

const generateCombination = (
  springs: string,
  brokenCounts: number[],
  undefinedCount: number,
  missingSpringCount: number,
): string[] => {
  if (undefinedCount === 0) {
    return [springs];
  }

  if (missingSpringCount === 0) {
    return [springs.replace(/\?/g, '.')];
  }

  if (missingSpringCount === undefinedCount) {
    return [springs.replace(/\?/g, '#')];
  }

  const isValid = isPartialValid({
    springs,
    brokenCounts,
  });

  if (!isValid) {
    return [];
  }

  console.log('Exploring ', springs);

  return [
    ...generateCombination(
      springs.replace('?', '.'),
      brokenCounts,
      undefinedCount - 1,
      missingSpringCount,
    ),
    ...generateCombination(
      springs.replace('?', '#'),
      brokenCounts,
      undefinedCount - 1,
      missingSpringCount - 1,
    ),
  ];
};

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = file.split('\n');

  const inputs: Input[] = lines.map(line => {
    const [springs, numbersString] = line.split(' ');
    const brokenCounts = numbersString.split(',').map(s => Number.parseInt(s));

    return { springs, brokenCounts };
  });

  let totalSum = 0;

  for (let input of [inputs[2]]) {
    console.log(input);
    const result = generateCombination(
      input.springs,
      input.brokenCounts,
      [...input.springs].filter(c => c === '?').length,
      sum(input.brokenCounts) -
        [...input.springs].filter(c => c === '#').length,
    )
      .map(springs => isValid({ springs, brokenCounts: input.brokenCounts }))
      .filter(v => v).length;

    console.log(result);

    totalSum += result;
  }

  return totalSum;
};

const response = exercise1();

console.log(response);
