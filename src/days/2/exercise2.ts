import { readFileSync } from 'fs';
import path from 'path';

enum Shape {
  Rock = 'A',
  Paper = 'B',
  Scissors = 'C'
}

enum DuelResult {
  Lose = 'X',
  Draw   = 'Y',
  Win = 'Z'
}

type InputLine = {
  enemyShape: Shape;
  duelResult: DuelResult;
}


const ownShapeByEnemyShapeAndDuelResult: Record<Shape, Record<DuelResult, Shape>> = {
  [Shape.Paper]: {
    [DuelResult.Lose]: Shape.Rock,
    [DuelResult.Draw]: Shape.Paper,
    [DuelResult.Win]: Shape.Scissors,
  },
  [Shape.Rock]: {
    [DuelResult.Lose]: Shape.Scissors,
    [DuelResult.Draw]: Shape.Rock,
    [DuelResult.Win]: Shape.Paper,
  },
  [Shape.Scissors]: {
    [DuelResult.Lose]: Shape.Paper,
    [DuelResult.Draw]: Shape.Scissors,
    [DuelResult.Win]: Shape.Rock,
  }
}

const scoreByDuel: Record<DuelResult, number> = {
  [DuelResult.Lose]: 0,
  [DuelResult.Draw]: 3,
  [DuelResult.Win]: 6
};

const scoreByShape: Record<Shape, number> = {
  [Shape.Rock]: 1,
  [Shape.Paper]: 2,
  [Shape.Scissors]: 3
};

export const exercise2 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const input: InputLine[] = file.split('\n').map(line => ({
    enemyShape: line[0] as Shape,
    duelResult: line[2] as DuelResult,
  }));

  const result = input.reduce<number>(
    (totalScore, line) => {
      const ownShape: Shape = ownShapeByEnemyShapeAndDuelResult[line.enemyShape][line.duelResult];
      totalScore += scoreByShape[ownShape];
      totalScore += scoreByDuel[line.duelResult];
      return totalScore;
    }, 0
  );

  return result;
};

console.log(exercise2());