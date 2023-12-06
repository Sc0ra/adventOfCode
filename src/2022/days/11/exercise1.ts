import { readFileSync } from 'fs';
import path from 'path';
import { Graph } from '../../../libs/graph';

type MonkeyNode = {
  id: number;
  startingItems: number[];
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
  startingItems: [79, 98],
  operation: '*',
  leftOperand: 'old',
  rightOperand: 19,
  divisibleBy: 23,
  inspectionCount: 0,
});

monkeys.addNode({
  id: 1,
  startingItems: [54, 65, 75, 74],
  operation: '+',
  leftOperand: 'old',
  rightOperand: 6,
  divisibleBy: 19,
  inspectionCount: 0,
});

monkeys.addNode({
  id: 2,
  startingItems: [79, 60, 97],
  operation: '*',
  leftOperand: 'old',
  rightOperand: 'old',
  divisibleBy: 13,
  inspectionCount: 0,
});

monkeys.addNode({
  id: 3,
  startingItems: [74],
  operation: '+',
  leftOperand: 'old',
  rightOperand: 3,
  divisibleBy: 17,
  inspectionCount: 0,
});

monkeys.addEdge(monkeys.nodes[0], monkeys.nodes[2], true);
monkeys.addEdge(monkeys.nodes[0], monkeys.nodes[3], false);

monkeys.addEdge(monkeys.nodes[1], monkeys.nodes[2], true);
monkeys.addEdge(monkeys.nodes[1], monkeys.nodes[0], false);

monkeys.addEdge(monkeys.nodes[2], monkeys.nodes[1], true);
monkeys.addEdge(monkeys.nodes[2], monkeys.nodes[3], false);

monkeys.addEdge(monkeys.nodes[3], monkeys.nodes[0], true);
monkeys.addEdge(monkeys.nodes[3], monkeys.nodes[1], false);

export const exercise1 = () => {
  // const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  // const lines = file.split('\n');

  for (let i = 0; i < 20; i++) {
    for (let monkey of monkeys.nodes) {
      while (monkey.value.startingItems.length > 0) {
        const item = monkey.value.startingItems.shift() as number;
        monkey.value.inspectionCount++;
        const leftOperand =
          monkey.value.leftOperand === 'old' ? item : monkey.value.leftOperand;
        const rightOperand =
          monkey.value.rightOperand === 'old'
            ? item
            : monkey.value.rightOperand;
        let computedItem =
          monkey.value.operation === '*'
            ? leftOperand * rightOperand
            : leftOperand + rightOperand;
        computedItem = Math.floor(computedItem / 3);

        console.log(
          JSON.stringify(
            {
              i,
              id: monkey.value.id,
              computedItem,
              divisibleBy: computedItem % monkey.value.divisibleBy === 0,
            },
            null,
            2,
          ),
        );

        if (computedItem % monkey.value.divisibleBy === 0) {
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
