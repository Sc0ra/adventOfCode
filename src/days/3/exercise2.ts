import { readFileSync } from 'fs';
import path from 'path';
import { uniqBy } from 'lodash';

type Schema = {
  numbers: {
    index: number;
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

let globalIndex = 0;

export const exercise2 = () => {
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
              index: globalIndex,
              firstDigitX: x,
              firstDigitY: y,
              isFinished: false,
              length: 1,
              value: Number.parseInt(character),
            });
            globalIndex++;
          }
        } else if (character === '*') {
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

  console.log(JSON.stringify(finalSchema, null, 2));

  let finalSum = 0;

  for (let symbol of finalSchema.symbols) {
    let matchingNumbers: Schema['numbers'] = [];
    for (let i = symbol.x - 1; i <= symbol.x + 1; i++) {
      for (let j = symbol.y - 1; j <= symbol.y + 1; j++) {
        console.log({
          i,
          j,
          matching: finalSchema.numbers.filter(number => {
            return (
              number.firstDigitX === i &&
              number.firstDigitY + number.length > j &&
              number.firstDigitY <= j
            );
          }),
        });
        matchingNumbers = [
          ...matchingNumbers,
          ...finalSchema.numbers.filter(number => {
            return (
              number.firstDigitX === i &&
              number.firstDigitY + number.length > j &&
              number.firstDigitY <= j
            );
          }),
        ];
      }
    }
    matchingNumbers = uniqBy(matchingNumbers, 'index');
    console.log(matchingNumbers);
    if (matchingNumbers.length === 2) {
      finalSum += matchingNumbers[0].value * matchingNumbers[1].value;
    }
  }

  return finalSum;
};

console.log(exercise2());
