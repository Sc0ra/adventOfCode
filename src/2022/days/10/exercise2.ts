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

  const screen = signal.reduce<string>((acc, signalStrength, cycle) => {
    if(Math.abs(signalStrength - cycle % 40) <= 1) {
      return acc + '#';
    }

    return acc + '.';
  }, '');

  console.log(screen.substring(0, 40));
  console.log(screen.substring(40, 80));
  console.log(screen.substring(80, 120));
  console.log(screen.substring(120, 160));
  console.log(screen.substring(160, 200));
  console.log(screen.substring(200, 240));
};

exercise1();

