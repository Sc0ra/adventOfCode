import { readFileSync } from 'fs';
import path from 'path';


export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = file.split('\n');
  
  const signal = lines.reduce<number[]>((acc, instruction) => {
    const lastValue = acc[acc.length - 1];
    if (instruction === 'noop') {
      return [...acc, lastValue];
    }

    const valueToAdd = Number.parseInt(instruction.substring(5));

    return [...acc, lastValue, lastValue + valueToAdd];

  }, [1]);

  console.log(signal[19]);
  console.log(signal[59]);
  console.log(signal[99]);
  console.log(signal[139]);
  console.log(signal[179]);
  console.log(signal[219]);

  return signal[19]*20 + signal[59]*60 + signal[99]*100 + signal[139]*140 + signal[179]*180 + signal[219]*220;
};

const response = exercise1();

console.log(response)
