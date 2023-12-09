import { readFileSync } from 'fs';
import path from 'path';
import { Graph } from '../../../libs/graph';

type Node = {
  name: string;
  isEntry: boolean;
  isExit: boolean;
};

type Edge = undefined;

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = file.split('\n');

  const graph = new Graph<Node, Edge>();

  const directions: string[] = lines[0].split('');

  for (let line of lines.slice(2)) {
    graph.addNode({
      name: line.slice(0, 3),
      isEntry: line.slice(0, 3) === 'AAA',
      isExit: line.slice(0, 3) === 'ZZZ',
    });
  }

  for (let line of lines.slice(2)) {
    const source = graph.nodes.find(
      node => node.value.name === line.slice(0, 3),
    );
    const left = graph.nodes.find(
      node => node.value.name === line.slice(7, 10),
    );
    const right = graph.nodes.find(
      node => node.value.name === line.slice(12, 15),
    );

    source?.addNeighbor(left!, undefined);
    source?.addNeighbor(right!, undefined);
  }

  let currentNode = graph.nodes.find(node => node.value.isEntry);

  let i = 0;

  while (!currentNode!.value.isExit) {
    for (let direction of directions) {
      console.log(currentNode?.value.name);
      if (direction === 'L') {
        currentNode = currentNode?.neighbors[0].node;
      } else if (direction === 'R') {
        currentNode = currentNode?.neighbors[1].node;
      }
      i++;
    }
  }

  return i;
};

console.log(exercise1());
