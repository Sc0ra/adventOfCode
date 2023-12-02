import { readFileSync } from 'fs';
import { intersection, range, sum } from 'lodash';
import path from 'path';

const regex = new RegExp(/move (\d.*) from (\d.*) to (\d.*)/);


export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = file.split('\n');

  const stock = {
    1: ['R', 'S', 'L', 'F', 'Q'],
    2: ['N', 'Z', 'Q', 'G', 'P', 'T'],
    3: ['S', 'M', 'Q', 'B'],
    4: ['T', 'G', 'Z', 'J', 'H', 'C', 'B', 'Q'],
    5: ['P', 'H', 'M', 'B', 'N', 'F', 'S'],
    6: ['P', 'C', 'Q', 'N', 'S', 'L', 'V', 'G'],
    7: ['W', 'C', 'F'],
    8: ['Q', 'H', 'G', 'Z', 'W', 'V', 'P', 'M'],
    9: ['G', 'Z', 'D', 'L', 'C', 'N', 'R'],
  } as Record<number, string[]>;

  const instructions = lines.slice(10).map(line => {
    const match = regex.exec(line) as string[];

    return {
      count: Number.parseInt(match[1]),
      from: Number.parseInt(match[2]),
      to: Number.parseInt(match[3]),
    }
  })

  instructions.forEach(instruction => {
    console.log('\n###\n');
    console.log('from', stock[instruction.from]);
    const toMove = stock[instruction.from].splice(-instruction.count, instruction.count);
    console.log('from', stock[instruction.from]);
    console.log('toMove', toMove);
    stock[instruction.to] = [...stock[instruction.to], ...toMove];
    console.log('to', stock[instruction.to]);
  });

  return Object.values(stock).map(row => row[row.length - 1]).join('');
};

console.log(exercise1());