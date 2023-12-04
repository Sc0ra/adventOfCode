import { readFileSync } from 'fs';
import { intersection, uniq, sum } from 'lodash';
import path from 'path';

type Input = {
  gameId: number;
  cardNumbers: number[];
  myNumbers: number[];
};

function range(size, startAt = 0) {
  return [...Array(size).keys()].map(i => i + startAt);
}

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const inputs: Input[] = file.split('\n').map(line => {
    const [gameString, numberString] = line.split(':');
    const gameId = Number.parseInt(gameString.split(' ')[1]);
    const [cardNumbersString, myNumbersString] = numberString.split('|');
    const cardNumbers = cardNumbersString
      .split(' ')
      .filter(numberString => numberString !== ' ' && numberString !== '')
      .map(numberString => Number.parseInt(numberString));
    const myNumbers = myNumbersString
      .split(' ')
      .filter(numberString => numberString !== ' ' && numberString !== '')
      .map(numberString => Number.parseInt(numberString));

    return {
      gameId,
      cardNumbers,
      myNumbers,
    };
  });

  let cards = [...inputs];

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const matchCount = intersection(
      uniq(card.cardNumbers),
      uniq(card.myNumbers),
    );
    const cardToAdd = range(matchCount, card.gameId + 1)
      .map(cardId => inputs.find(card => card.gameId === cardId))
      .filter(card => card !== undefined) as Input[];

    console.log({ i, card, cardToAdd });
    cards.push(...cardToAdd);
  }

  console.log(cards);

  return cards.length;
};

console.log(exercise1());
