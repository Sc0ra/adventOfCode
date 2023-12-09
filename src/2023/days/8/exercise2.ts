import { readFileSync } from 'fs';
import path from 'path';
import { Node, Graph } from '../../../libs/graph';
import { mapValues } from 'lodash';

type NodeValue = {
  name: string;
  isEntry: boolean;
  isExit: boolean;
};

type Edge = undefined;

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = file.split('\n');

  const graph = new Graph<NodeValue, Edge>();

  const directions: string[] = lines[0].split('');

  for (let line of lines.slice(2)) {
    graph.addNode({
      name: line.slice(0, 3),
      isEntry: line.slice(2, 3) === 'A',
      isExit: line.slice(2, 3) === 'Z',
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

  let currentNodes = graph.nodes.filter(node => node.value.isEntry);

  let i = 0;

  const dict: Record<string, string> = {};

  const nodesAfterAllDirections = [...graph.nodes];

  for (let direction of directions) {
    for (let k = 0; k < nodesAfterAllDirections.length; k++) {
      if (direction === 'L') {
        nodesAfterAllDirections[k] =
          nodesAfterAllDirections[k]?.neighbors[0].node;
        dict[graph.nodes[k].value.name] = nodesAfterAllDirections[k].value.name;
      } else if (direction === 'R') {
        nodesAfterAllDirections[k] =
          nodesAfterAllDirections[k]?.neighbors[1].node;
        dict[graph.nodes[k].value.name] = nodesAfterAllDirections[k].value.name;
      }
    }
  }

  const entryNodes: string[] = graph.nodes
    .filter(val => val.value.isEntry)
    .map(node => node.value.name);
  const exitNodes: string[] = graph.nodes
    .filter(val => val.value.isExit)
    .map(node => node.value.name);

  console.log({ entryNodes, exitNodes });

  console.log('---');

  for (let exitNode of exitNodes) {
    let currentNode = exitNode;
    let count = 0;
    do {
      currentNode = dict[currentNode];
      count++;
    } while (!exitNodes.includes(currentNode));

    console.log({ exitNode, currentNode, count });
  }

  console.log('---');

  for (let entryNode of entryNodes) {
    let currentNode = entryNode;
    let count = 0;
    do {
      currentNode = dict[currentNode];
      count++;
    } while (!exitNodes.includes(currentNode));

    console.log({ entryNode, currentNode, count });
  }

  console.log('---');

  console.log(directions.length);

  console.log('---');

  console.log(BigInt(71683294841) * BigInt(293));

  // console.log(JSON.stringify(mapValues(dict, val => val.value.name)));

  // const graph2 = new Graph<NodeValue, Edge>();
  // for (let oldNode of graph.nodes) {
  //   graph2.addNode({ ...oldNode.value });
  // }
  // for (let [sourceName, destination] of Object.entries(dict)) {
  //   const sourceNode = graph2.nodes.find(
  //     node => node.value.name === sourceName,
  //   );
  //   sourceNode?.addNeighbor(
  //     graph2.nodes.find(node => node.value.name === destination.value.name)!,
  //     undefined,
  //   );
  // }

  // console.log(
  //   graph2.nodes.map(node => ({
  //     name: node.value.name,
  //     neighbor: node.neighbors[0].node.value.name,
  //   })),
  // );

  // while (currentNodes.some(node => !node.value.isExit)) {
  //   for (let k = 0; k < currentNodes.length; k++) {
  //     currentNodes[k] = dict[currentNodes[k].value.name];
  //   }

  //   i += directions.length;
  // }

  // console.log(currentNodes.map(node => node.value.name));

  return i;
};

console.log(exercise1());
