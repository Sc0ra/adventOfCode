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

export const search = (startNode: GraphNode, exitNode: GraphNode) => {
  const visited: Set<GraphNode> = new Set();
  const queue: GraphNode[] = [];

  visited.add(startNode);
  queue.push(startNode);

  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    const {
      value: { x, y },
    } = currentNode;
    console.log({ x, y });

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

  const visited = search(SNode, SNode);

  console.log([...visited].map(v => v.value));

  return [...visited].length;
};

const response = exercise1();

console.log(response);
