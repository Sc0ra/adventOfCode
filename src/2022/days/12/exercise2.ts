import { readFileSync } from 'fs';
import path from 'path';
import { Node, Graph } from '../../../libs/graph';
import { orderBy } from 'lodash';

type GraphNodeValue = {
  x: number;
  y: number;
  height: number;
  isEntry: boolean;
  isExit: boolean;
  cost?: number;
  heuristic: number;
};

const graph = new Graph<GraphNodeValue, undefined>();

type GraphNode = Node<GraphNodeValue, undefined>;

export const search = (startNode: GraphNode, exitNode: GraphNode) => {
  const visited: Set<GraphNode> = new Set();
  let queue: GraphNode[] = [];

  visited.add(startNode);
  queue.push(startNode);

  while (queue.length > 0) {
    queue = orderBy(queue, ['heuristic'], ['asc']);
    const currentNode = queue.shift()!;
    const {
      value: { x, y },
    } = currentNode;

    if (currentNode.value.isExit) {
      return visited;
    }

    for (const neighbor of orderBy(
      currentNode.neighbors,
      ['heuristic'],
      ['asc'],
    )) {
      if (!visited.has(neighbor.node)) {
        neighbor.node.value.cost = (currentNode.value.cost ?? 0) + 1;
        neighbor.node.value.heuristic =
          (currentNode.value.cost ?? 0) +
          1 +
          Math.abs(neighbor.node.value.x - exitNode.value.x) +
          Math.abs(neighbor.node.value.y - exitNode.value.y) +
          (neighbor.node.value.height - exitNode.value.height);
        visited.add(neighbor.node);
        queue.push(neighbor.node);
      }
    }
  }

  return undefined;
};

export const exercise2 = () => {
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
        isEntry: char === 'S' || char === 'a',
        isExit: char === 'E',
        cost: char === 'S' || char === 'a' ? 0 : undefined,
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

  const entryNodes = graph.nodes.filter(({ value: { isEntry } }) => isEntry);

  const exitNode = graph.nodes.find(({ value: { isExit } }) => isExit);

  if (exitNode === undefined) {
    throw new Error();
  }

  let minCost = 10000000;

  for (let entryNode of entryNodes) {
    graph.nodes.forEach(node => {
      node.value.heuristic = 0;
      node.value.cost = undefined;
    });
    search(entryNode, exitNode);

    minCost = Math.min(minCost, exitNode?.value.cost ?? 10000000);
  }

  return minCost;
};

const response = exercise2();

console.log(response);
