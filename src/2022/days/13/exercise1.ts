import { readFileSync } from 'fs';
import { isArray, isNumber, sum } from 'lodash';
import path from 'path';

type Value = number | Value[];

const compare = (valueLeft: Value, valueRight: Value): number => {
  console.log(`Compare ${JSON.stringify(valueLeft)} vs ${JSON.stringify(valueRight)}`);
  if(isNumber(valueLeft) && isNumber(valueRight)) {
    return valueLeft - valueRight;
  }
  if(isArray(valueLeft) && isArray(valueRight)) {
    for(let i = 0; i < Math.max(valueRight.length, valueLeft.length); i++) {
      const left = valueLeft[i];
      const right = valueRight[i];
      if(left === undefined && right === undefined) {
        return 0;
      }
      if (left === undefined && right !== undefined) {
        console.log('Left is empty');
        return -1;
      }
      if (left !== undefined && right === undefined) {
        console.log('Right is empty');
        return 1;
      }
      const compareResult = compare(left, right);
      if (compareResult !== 0) {
        return compareResult;
      }
    }
    return 0;
  }
  if(isArray(valueLeft) && isNumber(valueRight)) {
    return compare(valueLeft, [valueRight]);
  }
  if(isNumber(valueLeft) && isArray(valueRight)) {
    return compare([valueLeft], valueRight);
  }
  throw new Error();
};

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const groups = file.split('\n\n');

  const inputs = groups.map(group => {
    const lines: Value[] = group.split('\n').map(value => JSON.parse(value));

    return {valueLeft: lines[0], valueRight: lines[1]};
  });
 
  console.log(inputs);

  const results = inputs.map(({valueLeft, valueRight}, i) => {
    console.log('---')
    console.log(`Pair ${i+1}`)

    const result = compare(valueLeft, valueRight);
    console.log(`Result ${result <= 0}`)

    return result
  });

  console.log(results.map((result, i) => result <= 0 ? i+1 : 0));

  return sum(results.map((result, i) => result <= 0 ? i+1 : 0));
};

const response = exercise1();

console.log(response);
