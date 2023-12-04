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
  tail: Pos;
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

  console.log({previousPos, headPos});

  throw new Error('should not happen');
}

const getNextState = (history: History, direction: Direction): State => {
  const previousState = history[history.length - 1];

  const nextHeadPos = getNextHeadPos(previousState.head, direction);
  const nextTailPos = getNextTailPos(previousState.tail, nextHeadPos);

  return {
    head: nextHeadPos,
    tail: nextTailPos,
  }
}

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = file.split('\n');

  const directions = lines.reduce<Direction[]>((acc, line) => {
    const direction = directionByLetter[line[0]];
    const count = Number.parseInt(line.substring(2));

    return [...acc, ...Array(count).fill(direction)];
  }, []);

  const startState: State = {
    head: {x: 0, y: 0},
    tail: {x: 0, y: 0},
  }

  const history = directions.reduce<History>((acc, direction) => {
    return [...acc, getNextState(acc, direction)];
  }, [startState]);

  const uniqTailPos = uniq(history.map(state => JSON.stringify(state.tail)));

  return uniqTailPos.length;
};

const response = exercise1();

console.log(response)
