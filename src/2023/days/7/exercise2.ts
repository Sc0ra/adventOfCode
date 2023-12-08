import { readFileSync } from 'fs';
import path from 'path';
import { countBy, orderBy, sum } from 'lodash';

interface I {
  cards: string;
  card1: number;
  card2: number;
  card3: number;
  card4: number;
  card5: number;
  handType: string;
  handTypeValue: number;
  bid: number;
}

const dict = {
  T: 10,
  J: -1,
  Q: 12,
  K: 13,
  A: 14,
};

const handTypeDict = {
  FIVE: 10,
  FOUR: 9,
  FULL: 8,
  THREE: 7,
  TWO_PAIR: 6,
  PAIR: 5,
  NONE: 0,
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

    let counts = countBy(cards.split(''));
    console.log(counts);

    if (counts['J'] !== undefined) {
      let countVal = orderBy(
        Object.entries(counts)
          .map(([key, value]) => ({ key, value }))
          .filter(val => val.key !== 'J'),
        ['value'],
        ['desc'],
      );

      console.log(countVal);

      if (countVal[0] !== undefined) {
        countVal[0].value += counts['J'];
      } else {
        countVal = [{ key: 'J', value: 5 }];
      }

      counts = Object.fromEntries(
        countVal.map(({ key, value }) => [key, value]),
      );
    }

    const countValues = Object.values(counts);

    console.log(counts);

    const handType =
      Math.max(...countValues) === 5
        ? 'FIVE' //FIVE
        : Math.max(...countValues) === 4
        ? 'FOUR' // FOUR
        : Math.max(...countValues) === 3
        ? Math.min(...countValues) === 2
          ? 'FULL' // FULL
          : 'THREE' // THREE
        : Math.max(...countValues) === 2
        ? countValues.filter(count => count === 2).length === 2
          ? 'TWO_PAIR' // TWO PAIR
          : 'PAIR' // PAIR
        : 'NONE';

    return {
      cards,
      card1,
      card2,
      card3,
      card4,
      card5,
      handType,
      handTypeValue: handTypeDict[handType],
      bid: Number.parseInt(bid),
    };
  });

  const ordered = orderBy(
    inputs,
    ['handTypeValue', 'card1', 'card2', 'card3', 'card4', 'card5'],
    ['asc', 'asc', 'asc', 'asc', 'asc', 'asc'],
  );

  console.log(
    JSON.stringify(
      ordered.map(val => `${val.cards} ${val.handType}`),
      null,
      2,
    ),
  );

  const result = sum(ordered.map((val, i) => val.bid * (i + 1)));

  return result;
};

console.log(exercise1());
