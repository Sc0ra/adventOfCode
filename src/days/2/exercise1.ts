import { readFileSync } from 'fs';
import path from 'path';

enum EnemyShape {
  Rock = 'A',
  Paper = 'B',
  Scissors = 'C'
}

enum OwnShape {
  Rock = 'X',
  Paper = 'Y',
  Scissors = 'Z'
}

type InputLine = {
  enemyShape: EnemyShape;
  ownShape: OwnShape;
}


const scoreByOwnShape: Record<OwnShape, number> = {
  [OwnShape.Rock]: 1,
  [OwnShape.Paper]: 2,
  [OwnShape.Scissors]: 3,
}

const scoreByDuel: Record<EnemyShape, Record<OwnShape, number>> = {
  [EnemyShape.Rock]: {
    [OwnShape.Rock]: 3,
    [OwnShape.Paper]: 6,
    [OwnShape.Scissors]: 0,
  },
  [EnemyShape.Paper]: {
    [OwnShape.Rock]: 0,
    [OwnShape.Paper]: 3,
    [OwnShape.Scissors]: 6,
  },
  [EnemyShape.Scissors]: {
    [OwnShape.Rock]: 6,
    [OwnShape.Paper]: 0,
    [OwnShape.Scissors]: 3,
  },
};

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const input: InputLine[] = file.split('\n').map(line => ({
    enemyShape: line[0] as EnemyShape,
    ownShape: line[2] as OwnShape,
  }))

  const result = input.reduce<number>(
    (totalScore, line) => {
      totalScore += scoreByOwnShape[line.ownShape];
      totalScore += scoreByDuel[line.enemyShape][line.ownShape];
      return totalScore;
    }, 0
  );

  return result;
};

console.log(exercise1());