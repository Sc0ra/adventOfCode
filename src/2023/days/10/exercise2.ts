import { readFileSync } from 'fs';
import path from 'path';
import { Node, Graph } from '../../../libs/graph';

type GraphNodeValue = {
  x: number;
  y: number;
  symbol: string;
  equivalentSymbol: string;
  cost: number;
};

const graph = new Graph<GraphNodeValue, undefined>();

type GraphNode = Node<GraphNodeValue, undefined>;

const EQUIVALENT_SYMBOL = '|';
//const EQUIVALENT_SYMBOL = '7';

export const search = (startNode: GraphNode, exitNode: GraphNode) => {
  const visited: Set<GraphNode> = new Set();
  const queue: GraphNode[] = [];

  visited.add(startNode);
  queue.push(startNode);

  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    for (const neighbor of currentNode.neighbors.filter(
      n => n.node !== currentNode,
    )) {
      if (!visited.has(neighbor.node)) {
        neighbor.node.value.cost = currentNode.value.cost + 1;
        visited.add(neighbor.node);
        queue.push(neighbor.node);
      }
    }
  }

  return visited;
};

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = file.split('\n');

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    for (let j = 0; j < line.length; j++) {
      let char = line[j];

      graph.addNode({
        x: i,
        y: j,
        symbol: char,
        equivalentSymbol: char === 'S' ? EQUIVALENT_SYMBOL : char,
        cost: 0,
      });
    }
  }

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    for (let j = 0; j < line.length; j++) {
      const currentIndex = i * line.length + j;
      let node = graph.nodes[currentIndex];

      if (j < line.length - 1) {
        let rightNode = graph.nodes[currentIndex + 1];
        if (['-', 'L', 'F'].includes(node.value.equivalentSymbol)) {
          node.addNeighbor(rightNode, undefined);
        }
      }

      if (j > 0) {
        let leftNode = graph.nodes[currentIndex - 1];
        if (['-', 'J', '7'].includes(node.value.equivalentSymbol)) {
          node.addNeighbor(leftNode, undefined);
        }
      }

      if (i < lines.length - 1) {
        let bottomNode = graph.nodes[currentIndex + line.length];
        if (['|', '7', 'F'].includes(node.value.equivalentSymbol)) {
          node.addNeighbor(bottomNode, undefined);
        }
      }

      if (i > 0) {
        let topNode = graph.nodes[currentIndex - line.length];
        if (['|', 'L', 'J'].includes(node.value.equivalentSymbol)) {
          node.addNeighbor(topNode, undefined);
        }
      }
    }
  }

  const SNode = graph.nodes.find(({ value: { symbol } }) => symbol === 'S')!;

  const loopValues = [...search(SNode, SNode)].map(v => v.value);

  let count = 0;
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    for (let j = 0; j < line.length; j++) {
      let char = line[j];

      if (loopValues.find(l => l.x === i && l.y === j) === undefined) {
        const horizontalLoopValues = loopValues.filter(
          l => l.x === i && l.symbol !== '-',
        );
        const verticalLoopValues = loopValues.filter(
          l => l.y === j && l.symbol !== '|',
        );

        const leftLoopValues = horizontalLoopValues
          .filter(v => v.y < j)
          .sort((v1, v2) => v1.y - v2.y)
          .map(v => v.equivalentSymbol)
          .join('')
          .replace(/F7/g, '')
          .replace(/LJ/g, '')
          .replace(/FJ/g, '|')
          .replace(/L7/g, '|');

        const rigtLoopValues = horizontalLoopValues
          .filter(v => v.y > j)
          .sort((v1, v2) => v1.y - v2.y)
          .map(v => v.equivalentSymbol)
          .join('')
          .replace(/F7/g, '')
          .replace(/LJ/g, '')
          .replace(/FJ/g, '|')
          .replace(/L7/g, '|');

        const topLoopValues = verticalLoopValues
          .filter(v => v.x < i)
          .sort((v1, v2) => v1.x - v2.x)
          .map(v => v.equivalentSymbol)
          .join('')
          .replace(/FL/g, '')
          .replace(/7J/g, '')
          .replace(/FJ/g, '-')
          .replace(/7L/g, '-');

        const bottomLoopValues = verticalLoopValues
          .filter(v => v.x > i)
          .sort((v1, v2) => v1.x - v2.x)
          .map(v => v.equivalentSymbol)
          .join('')
          .replace(/FL/g, '')
          .replace(/7J/g, '')
          .replace(/FJ/g, '-')
          .replace(/7L/g, '-');

        console.log(JSON.stringify({ i, j, char }));

        console.log(
          JSON.stringify({
            leftL: leftLoopValues.length,
            rightL: rigtLoopValues.length,
            topL: topLoopValues.length,
            bottomL: bottomLoopValues.length,
          }),
        );

        console.log(
          JSON.stringify({
            left: leftLoopValues,
            right: rigtLoopValues,
            top: topLoopValues,
            bottom: bottomLoopValues,
          }),
        );
        console.log('---');

        if (
          leftLoopValues.length % 2 === 1 &&
          topLoopValues.length % 2 === 1 &&
          rigtLoopValues.length % 2 === 1 &&
          bottomLoopValues.length % 2 === 1
        ) {
          count += 1;
        }
      }
    }
  }

  return count;
};

const response = exercise1();

console.log(response);
