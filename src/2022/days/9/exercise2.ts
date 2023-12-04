import { readFileSync } from 'fs';
import { uniq } from 'lodash';
import path from 'path';

type Direction = 'left' | 'right' | 'up' | 'down';

interface Pos {
  x: number;
  y: number;
}

interface State {
  head: Pos;
  1: Pos;
  2: Pos;
  3: Pos;
  4: Pos;
  5: Pos;
  6: Pos;
  7: Pos;
  8: Pos;
  9: Pos;
}

type History = State[];

const directionByLetter: Record<string, Direction> = {
  R: 'right',
  L: 'left',
  U: 'up',
  D: 'down'
}

const getNextHeadPos = (previousPos: Pos, direction: Direction): Pos => {
  switch(direction) {
    case 'left': {
      return { x: previousPos.x - 1, y: previousPos.y };
    }
    case 'right': {
      return { x: previousPos.x + 1, y: previousPos.y };
    }
    case 'up': {
      return { x: previousPos.x, y: previousPos.y + 1 };
    }
    case 'down': {
      return { x: previousPos.x, y: previousPos.y - 1 };
    }
  }
}

const getNextTailPos = (previousPos: Pos, headPos: Pos): Pos => {
  const xDistance = headPos.x - previousPos.x;
  const yDistance = headPos.y - previousPos.y;

  // if touch
  if (Math.abs(xDistance) <= 1 && Math.abs(yDistance) <= 1) {
    return previousPos;
  }

  // if 2 step straight
  if (xDistance === 0 && Math.abs(yDistance) === 2) {
    return {
      x: previousPos.x, y: previousPos.y + (yDistance / 2)
    }
  }

  if (yDistance === 0 && Math.abs(xDistance) === 2) {
    return {
      x: previousPos.x + (xDistance / 2), y: previousPos.y
    }
  }

  // if 2 step diag
  if (Math.abs(xDistance) === 1 && Math.abs(yDistance) === 2) {
    return {
      x: previousPos.x + xDistance, y: previousPos.y + (yDistance / 2)
    }
  }

  if (Math.abs(yDistance) === 1 && Math.abs(xDistance) === 2) {
    return {
      x: previousPos.x + (xDistance / 2), y: previousPos.y + yDistance
    }
  }
  if (Math.abs(yDistance) === 2 && Math.abs(xDistance) === 2) {
    return {
      x: previousPos.x + (xDistance / 2), y: previousPos.y + (yDistance / 2)
    }
  }

  console.log({previousPos, headPos});

  throw new Error('should not happen');
}

const getNextState = (history: History, direction: Direction): State => {
  const previousState = history[history.length - 1];

  const nextHeadPos = getNextHeadPos(previousState.head, direction);
  const next1Pos = getNextTailPos(previousState[1], nextHeadPos);
  const next2Pos = getNextTailPos(previousState[2], next1Pos);
  const next3Pos = getNextTailPos(previousState[3], next2Pos);
  const next4Pos = getNextTailPos(previousState[4], next3Pos);
  const next5Pos = getNextTailPos(previousState[5], next4Pos);
  const next6Pos = getNextTailPos(previousState[6], next5Pos);
  const next7Pos = getNextTailPos(previousState[7], next6Pos);
  const next8Pos = getNextTailPos(previousState[8], next7Pos);
  const next9Pos = getNextTailPos(previousState[9], next8Pos);


  return {
    head: nextHeadPos,
    1: next1Pos,
    2: next2Pos,
    3: next3Pos,
    4: next4Pos,
    5: next5Pos,
    6: next6Pos,
    7: next7Pos,
    8: next8Pos,
    9: next9Pos
  }
}

export const exercise2 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = file.split('\n');

  const directions = lines.reduce<Direction[]>((acc, line) => {
    const direction = directionByLetter[line[0]];
    const count = Number.parseInt(line.substring(2));

    return [...acc, ...Array(count).fill(direction)];
  }, []);

  const startState: State = {
    head: {x: 0, y: 0},
    1: {x: 0, y: 0},
    2: {x: 0, y: 0},
    3: {x: 0, y: 0},
    4: {x: 0, y: 0},
    5: {x: 0, y: 0},
    6: {x: 0, y: 0},
    7: {x: 0, y: 0},
    8: {x: 0, y: 0},
    9: {x: 0, y: 0},
  }

  const history = directions.reduce<History>((acc, direction) => {
    return [...acc, getNextState(acc, direction)];
  }, [startState]);

  const uniqTailPos = uniq(history.map(state => JSON.stringify(state[9])));

  return uniqTailPos.length;
};

const response = exercise2();

console.log(response)
