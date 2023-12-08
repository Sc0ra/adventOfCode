import { readFileSync } from 'fs';
import path from 'path';
import { countBy, orderBy, sum } from 'lodash';

interface I {
  card1: number;
  card2: number;
  card3: number;
  card4: number;
  card5: number;
  handType: number;
  bid: number;
}

const dict = {
  T: 10,
  J: 9,
  Q: 12,
  K: 13,
  A: 14,
};

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = file.split('\n');

  const inputs: I[] = lines.map(line => {
    const [cards, bid] = line.split(' ');
    const [card1, card2, card3, card4, card5] = cards
      .split('')
      .map(cardString => {
        if (dict[cardString]) {
          return dict[cardString];
        }
        return Number.parseFloat(cardString);
      });

    const counts = countBy(cards.split(''));
    const countValues = Object.values(counts);

    const handType =
      Math.max(...countValues) === 5
        ? 10 //FIVE
        : Math.max(...countValues) === 4
        ? 9 // FOUR
        : Math.max(...countValues) === 3
        ? Math.min(...countValues) === 2
          ? 8 // FULL
          : 7 // THREE
        : Math.max(...countValues) === 2
        ? countValues.filter(count => count === 2).length === 2
          ? 6 // TWO PAIR
          : 5 // PAIR
        : 0;

    return {
      card1,
      card2,
      card3,
      card4,
      card5,
      handType,
      bid: Number.parseInt(bid),
    };
  });

  const ordered = orderBy(
    inputs,
    ['handType', 'card1', 'card2', 'card3', 'card4', 'card5'],
    ['asc', 'asc', 'asc', 'asc', 'asc', 'asc'],
  );

  const result = sum(ordered.map((val, i) => val.bid * (i + 1)));

  return result;
};

console.log(exercise1());
