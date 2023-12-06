import { readFileSync } from 'fs';
import path from 'path';
import { Graph } from '../../../libs/graph';

type MonkeyNode = {
  id: number;
  startingItems: bigint[];
  operation: '+' | '*';
  leftOperand: 'old' | number;
  rightOperand: 'old' | number;
  divisibleBy: number;
  inspectionCount: number;
};

type MonkeyEdge = boolean;

const monkeys = new Graph<MonkeyNode, MonkeyEdge>();

monkeys.addNode({
  id: 0,
  startingItems: [
    BigInt(98),
    BigInt(97),
    BigInt(98),
    BigInt(55),
    BigInt(56),
    BigInt(72),
  ],
  operation: '*',
  leftOperand: 'old',
  rightOperand: 13,
  divisibleBy: 11,
  inspectionCount: 0,
});

monkeys.addNode({
  id: 1,
  startingItems: [
    BigInt(73),
    BigInt(99),
    BigInt(55),
    BigInt(54),
    BigInt(88),
    BigInt(50),
    BigInt(55),
  ],
  operation: '+',
  leftOperand: 'old',
  rightOperand: 4,
  divisibleBy: 17,
  inspectionCount: 0,
});

monkeys.addNode({
  id: 2,
  startingItems: [BigInt(67), BigInt(98)],
  operation: '*',
  leftOperand: 'old',
  rightOperand: 11,
  divisibleBy: 5,
  inspectionCount: 0,
});

monkeys.addNode({
  id: 3,
  startingItems: [BigInt(82), BigInt(91), BigInt(92), BigInt(53), BigInt(99)],
  operation: '+',
  leftOperand: 'old',
  rightOperand: 8,
  divisibleBy: 13,
  inspectionCount: 0,
});

monkeys.addNode({
  id: 4,
  startingItems: [
    BigInt(52),
    BigInt(62),
    BigInt(94),
    BigInt(96),
    BigInt(52),
    BigInt(87),
    BigInt(53),
    BigInt(60),
  ],
  operation: '*',
  leftOperand: 'old',
  rightOperand: 'old',
  divisibleBy: 19,
  inspectionCount: 0,
});

monkeys.addNode({
  id: 5,
  startingItems: [BigInt(94), BigInt(80), BigInt(84), BigInt(79)],
  operation: '+',
  leftOperand: 'old',
  rightOperand: 5,
  divisibleBy: 2,
  inspectionCount: 0,
});

monkeys.addNode({
  id: 6,
  startingItems: [BigInt(89)],
  operation: '+',
  leftOperand: 'old',
  rightOperand: 1,
  divisibleBy: 3,
  inspectionCount: 0,
});

monkeys.addNode({
  id: 7,
  startingItems: [BigInt(70), BigInt(59), BigInt(63)],
  operation: '+',
  leftOperand: 'old',
  rightOperand: 3,
  divisibleBy: 7,
  inspectionCount: 0,
});

monkeys.addEdge(monkeys.nodes[0], monkeys.nodes[4], true);
monkeys.addEdge(monkeys.nodes[0], monkeys.nodes[7], false);

monkeys.addEdge(monkeys.nodes[1], monkeys.nodes[2], true);
monkeys.addEdge(monkeys.nodes[1], monkeys.nodes[6], false);

monkeys.addEdge(monkeys.nodes[2], monkeys.nodes[6], true);
monkeys.addEdge(monkeys.nodes[2], monkeys.nodes[5], false);

monkeys.addEdge(monkeys.nodes[3], monkeys.nodes[1], true);
monkeys.addEdge(monkeys.nodes[3], monkeys.nodes[2], false);

monkeys.addEdge(monkeys.nodes[4], monkeys.nodes[3], true);
monkeys.addEdge(monkeys.nodes[4], monkeys.nodes[1], false);

monkeys.addEdge(monkeys.nodes[5], monkeys.nodes[7], true);
monkeys.addEdge(monkeys.nodes[5], monkeys.nodes[0], false);

monkeys.addEdge(monkeys.nodes[6], monkeys.nodes[0], true);
monkeys.addEdge(monkeys.nodes[6], monkeys.nodes[5], false);

monkeys.addEdge(monkeys.nodes[7], monkeys.nodes[4], true);
monkeys.addEdge(monkeys.nodes[7], monkeys.nodes[3], false);

// monkeys.addNode({
//   id: 0,
//   startingItems: [BigInt(79), BigInt(98)],
//   operation: '*',
//   leftOperand: 'old',
//   rightOperand: 19,
//   divisibleBy: 23,
//   inspectionCount: 0,
// });

// monkeys.addNode({
//   id: 1,
//   startingItems: [BigInt(54), BigInt(65), BigInt(75), BigInt(74)],
//   operation: '+',
//   leftOperand: 'old',
//   rightOperand: 6,
//   divisibleBy: 19,
//   inspectionCount: 0,BigInt(
// });

// monkeys.addNode({
//   id: 2,
//   startingItems: [BigInt(79), BigInt(60), BigInt(97)],
//   operation: '*',
//   leftOperand: 'old',
//   rightOperand: 'old',
//   divisibleBy: 13,
//   inspectionCount: 0,
// });

// monkeys.addNode({
//   id: 3,
//   startingItems: [BigInt(74)],
//   operation: '+',
//   leftOperand: 'old',
//   rightOperand: 3,
//   divisibleBy: 17,
//   inspectionCount: 0,
// });

// monkeys.addEdge(monkeys.nodes[0], monkeys.nodes[2], true);
// monkeys.addEdge(monkeys.nodes[0], monkeys.nodes[3], false);

// monkeys.addEdge(monkeys.nodes[1], monkeys.nodes[2], true);
// monkeys.addEdge(monkeys.nodes[1], monkeys.nodes[0], false);

// monkeys.addEdge(monkeys.nodes[2], monkeys.nodes[1], true);
// monkeys.addEdge(monkeys.nodes[2], monkeys.nodes[3], false);

// monkeys.addEdge(monkeys.nodes[3], monkeys.nodes[0], true);
// monkeys.addEdge(monkeys.nodes[3], monkeys.nodes[1], false);

const modulo =
  monkeys.nodes[0].value.divisibleBy *
  monkeys.nodes[1].value.divisibleBy *
  monkeys.nodes[2].value.divisibleBy *
  monkeys.nodes[3].value.divisibleBy *
  monkeys.nodes[4].value.divisibleBy *
  monkeys.nodes[5].value.divisibleBy *
  monkeys.nodes[6].value.divisibleBy *
  monkeys.nodes[7].value.divisibleBy;

export const exercise1 = () => {
  // const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  // const lines = file.split('\n');

  for (let i = 0; i < 10000; i++) {
    for (let monkey of monkeys.nodes) {
      while (monkey.value.startingItems.length > 0) {
        const item = monkey.value.startingItems.shift() as bigint;
        monkey.value.inspectionCount++;
        const leftOperand =
          monkey.value.leftOperand === 'old'
            ? item
            : BigInt(monkey.value.leftOperand);
        const rightOperand =
          monkey.value.rightOperand === 'old'
            ? item
            : BigInt(monkey.value.rightOperand);
        let computedItem =
          (monkey.value.operation === '*'
            ? leftOperand * rightOperand
            : leftOperand + rightOperand) % BigInt(modulo);

        if (computedItem % BigInt(monkey.value.divisibleBy) === BigInt(0)) {
          monkey.neighbors
            .find(neighbor => neighbor.weight === true)
            ?.node.value.startingItems.push(computedItem);
        } else {
          monkey.neighbors
            .find(neighbor => neighbor.weight === false)
            ?.node.value.startingItems.push(computedItem);
        }
      }
    }
    console.log(monkeys.nodes.map(node => node.value.inspectionCount));
  }
};

const response = exercise1();

console.log(response);
