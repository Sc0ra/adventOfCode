import { readFileSync } from 'fs';
import path from 'path';

type Schema = {
  numbers: {
    firstDigitX: number;
    firstDigitY: number;
    length: number;
    value: number;
    isFinished: boolean;
  }[];
  symbols: {
    x: number;
    y: number;
  }[];
};

const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = file.split('\n');

  const finalSchema = lines.reduce<Schema>(
    (schema, line, x) => {
      line.split('').forEach((character, y) => {
        const lastNumber = schema.numbers[schema.numbers.length - 1];

        if (character === '.') {
          if (lastNumber !== undefined && !lastNumber.isFinished) {
            lastNumber.isFinished = true;
          }
        } else if (digits.includes(character)) {
          if (lastNumber !== undefined && !lastNumber.isFinished) {
            lastNumber.length += 1;
            lastNumber.value =
              lastNumber.value * 10 + Number.parseInt(character);
          } else {
            schema.numbers.push({
              firstDigitX: x,
              firstDigitY: y,
              isFinished: false,
              length: 1,
              value: Number.parseInt(character),
            });
          }
        } else {
          if (lastNumber !== undefined && !lastNumber.isFinished) {
            lastNumber.isFinished = true;
          }
          schema.symbols.push({
            x,
            y,
          });
        }
      });

      schema.numbers[schema.numbers.length - 1].isFinished = true;
      return schema;
    },
    {
      numbers: [],
      symbols: [],
    },
  );

  // console.log(JSON.stringify(finalSchema, null, 2));

  let finalSum = 0;

  loop1: for (let number of finalSchema.numbers) {
    loop2: for (
      let i = number.firstDigitX - 1;
      i <= number.firstDigitX + 1;
      i++
    ) {
      loop3: for (
        let j = number.firstDigitY - 1;
        j <= number.firstDigitY + number.length;
        j++
      ) {
        if (
          finalSchema.symbols.some(symbol => symbol.x === i && symbol.y === j)
        ) {
          console.log(`number ${number.value} has symbol aside`);
          finalSum += number.value;
          break loop2;
        }
      }
    }
  }

  return finalSum;
};

console.log(exercise1());
