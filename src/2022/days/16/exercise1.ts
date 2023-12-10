import { cp, readFileSync } from 'fs';
import { countBy, mapKeys, range } from 'lodash';
import path from 'path';
import { Graph } from '../../../libs/graph';

interface Valve {
  name: string;
  flowRate: number;
  tunnels: string[];
}

const maxTime = 30;

// Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
const parseLine = (line: string): Valve => {
  const splitS = line.includes('tunnels')
    ? '; tunnels lead to valves '
    : '; tunnel leads to valve ';
  const [valveString, tunnelsString] = line.split(splitS);
  const [valve, flowRateString] = valveString.split(' has flow rate=');

  return {
    name: valve.split(' ')[1],
    flowRate: Number.parseInt(flowRateString),
    tunnels: tunnelsString.split(', '),
  };
};

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input-test.txt'), 'utf8');
  const inputs = file.split('\n').map(parseLine);

  console.log(inputs);

  const graph = new Graph<
    { name: string; flowRate: number; opened: boolean },
    number
  >();

  for (let input of inputs) {
    graph.addNode({
      name: input.name,
      flowRate: input.flowRate,
      opened: false,
    });
  }

  for (let input of inputs) {
    const sourceNode = graph.nodes.find(node => node.value.name === input.name);
    sourceNode?.addNeighbor(sourceNode, input.flowRate);
    for (let tunnel of input.tunnels) {
      const directionNode = graph.nodes.find(
        node => node.value.name === tunnel,
      );
      sourceNode?.addNeighbor(directionNode!, 0);
    }
  }

  const result = undefined;
  return result;
};

const response = exercise1();
console.log(response);
