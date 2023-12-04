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
    const isValid = inputLine.draws.every(draw => {
      return Object.entries(draw).every(
        ([color, count]) => count <= maximums[color],
      );
    });
    if (isValid) {
      return acc + inputLine.gameId;
    }
    return acc;
  }, 0);

  return result;
};

console.log(exercise1());
