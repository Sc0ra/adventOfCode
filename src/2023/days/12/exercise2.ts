import { readFileSync } from 'fs';
import path from 'path';

type Input = {
  pattern: string;
  groups: number[];
};

const cache = new Map<string, number>();

const getPossibleArrangementsAmount = (
  groups: number[],
  pattern: string,
): number => {
  const cacheKey = `${groups.join(',')};${pattern}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey) ?? 0;
  }

  const space = pattern.length;

  if (groups.length === 1) {
    const result = Array(space - groups[0] + 1)
      .fill(null)
      .map(
        (_, i) =>
          '.'.repeat(i) +
          '#'.repeat(groups[0]) +
          '.'.repeat(space - i - groups[0]),
      )
      .filter(str => isMatching(str, pattern)).length;

    cache.set(cacheKey, result);
    return result;
  }

  const [first, ...rest] = groups;
  const restMinSpace = rest.reduce((a, b) => a + b) + rest.length - 1;
  const firstPossiblePositions = space - restMinSpace - first;

  let result = 0;

  for (let i = 0; i < firstPossiblePositions; i++) {
    const curStr = '.'.repeat(i) + '#'.repeat(first) + '.';

    if (!isMatching(curStr, pattern.slice(0, curStr.length))) {
      continue;
    }
    result += getPossibleArrangementsAmount(rest, pattern.slice(curStr.length));
  }

  cache.set(cacheKey, result);
  return result;
};

const isMatching = (str: string, pattern: string): boolean => {
  if (str.length !== pattern.length) {
    throw new Error("lengths don't match");
  }

  for (let i = 0; i < str.length; i++) {
    if (pattern[i] === '?') continue;
    if (str[i] !== pattern[i]) {
      return false;
    }
  }
  return true;
};

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = file.split('\n');

  const inputs: Input[] = lines
    .map(line => {
      const [pattern, numbersString] = line.split(' ');
      const groups = numbersString.split(',').map(s => Number.parseInt(s));

      return { pattern, groups };
    })
    .map(input => ({
      groups: Array(5)
        .fill(null)
        .flatMap(() => [...input.groups]),
      pattern: Array(5).fill(input.pattern).join('?'),
    }));

  let totalSum = 0;

  for (let input of inputs) {
    console.log(input);
    const result = getPossibleArrangementsAmount(input.groups, input.pattern);

    console.log(result);

    totalSum += result;
  }

  return totalSum;
};

const response = exercise1();

console.log(response);
