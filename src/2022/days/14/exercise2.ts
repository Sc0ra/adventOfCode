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
  const lines: string[] = file.split('\n').filter(value => value !== '');
  const values: Value[] = lines.map(val => JSON.parse(val));
  const item1 = [[2]];
  const item2 = [[6]];
  values.push(item1);
  values.push(item2);

  const orderedValues = values.sort(compare);

  console.log(orderedValues.map(val => JSON.stringify(val)));

  const item1Index = orderedValues.findIndex(val => val === item1) + 1;
  const item2Index = orderedValues.findIndex(val => val === item2) + 1;

  console.log(item1Index);
  console.log(item2Index)

  return item1Index * item2Index;
};

const response = exercise1();

console.log(response);
