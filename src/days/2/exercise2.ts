import { readFileSync } from 'fs';
import path from 'path';

type Color = 'red' | 'green' | 'blue';

type Draw = Partial<Record<Color, number>>;

type InputLine = {
  gameId: number;
  draws: Draw[];
};

const maximums: Record<Color, number> = {
  blue: 14,
  green: 13,
  red: 12,
};

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const input: InputLine[] = file.split('\n').map(line => {
    const [gameString, drawsString] = line.split(':');
    const gameId = Number.parseInt(gameString.split(' ')[1]);

    const draws = drawsString.split(';').map(drawString => {
      const draw: Draw = drawString.split(',').reduce((acc, colorString) => {
        const [, numString, color] = colorString.split(' ');

        return {
          ...acc,
          [color]: Number.parseInt(numString),
        };
      }, {});

      return draw;
    });

    return {
      gameId,
      draws,
    };
  });

  const result = input.reduce((acc, inputLine) => {
    const counts: Draw = inputLine.draws.reduce(
      (acc, draw) => ({
        blue: Math.max(acc.blue ?? 0, draw.blue ?? 0),
        red: Math.max(acc.red ?? 0, draw.red ?? 0),
        green: Math.max(acc.green ?? 0, draw.green ?? 0),
      }),
      {
        blue: 0,
        red: 0,
        green: 0,
      },
    );

    console.log(counts);

    const power = (counts.blue ?? 0) * (counts.red ?? 0) * (counts.green ?? 0);

    return acc + power;
  }, 0);

  return result;
};

console.log(exercise1());
