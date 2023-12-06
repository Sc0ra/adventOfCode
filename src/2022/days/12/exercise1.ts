import { readFileSync } from 'fs';
import path from 'path';
import { Node, Graph } from '../../../libs/graph';

type GraphNodeValue = {
  x: number;
  y: number;
  height: number;
  isEntry: boolean;
  isExit: boolean;
  cost: number;
  heuristic: number;
};

const graph = new Graph<GraphNodeValue, undefined>();

type GraphNode = Node<GraphNodeValue, undefined>;

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

    if (currentNode.value.isExit) {
      return visited;
    }

    for (const neighbor of currentNode.neighbors) {
      if (!visited.has(neighbor.node)) {
        neighbor.node.value.cost = currentNode.value.cost + 1;
        visited.add(neighbor.node);
        queue.push(neighbor.node);
      }
    }
  }

  throw new Error();
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
        height:
          char === 'S'
            ? 0
            : char === 'E'
            ? 25
            : char.charCodeAt(0) - 'a'.charCodeAt(0),
        isEntry: char === 'S',
        isExit: char === 'E',
        cost: 0,
        heuristic: 0,
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
        if (rightNode.value.height - node.value.height < 2) {
          node.addNeighbor(rightNode, undefined);
        }
      }

      if (j > 0) {
        let leftNode = graph.nodes[currentIndex - 1];
        if (leftNode.value.height - node.value.height < 2) {
          node.addNeighbor(leftNode, undefined);
        }
      }

      if (i < lines.length - 1) {
        let bottomNode = graph.nodes[currentIndex + line.length];
        if (bottomNode.value.height - node.value.height < 2) {
          node.addNeighbor(bottomNode, undefined);
        }
      }

      if (i > 0) {
        let topNode = graph.nodes[currentIndex - line.length];
        if (topNode.value.height - node.value.height < 2) {
          node.addNeighbor(topNode, undefined);
        }
      }
    }
  }

  const entryNode = graph.nodes.find(({ value: { isEntry } }) => isEntry);
  const exitNode = graph.nodes.find(({ value: { isExit } }) => isExit);

  if (entryNode === undefined || exitNode === undefined) {
    throw new Error();
  }

  const visited = search(entryNode, exitNode);

  console.log(exitNode?.value.cost);

  return [...visited].length;
};

const response = exercise1();

console.log(response);
