import { cp, readFileSync } from 'fs';
import { countBy, mapKeys, mapValues, pick, range } from 'lodash';
import path from 'path';
import { Node, Graph } from '../../../libs/graph';

interface Valve {
  name: string;
  flowRate: number;
}

interface State {
  graph: Graph<Valve, number>;
  position: string;
  currentTime: number;
  pressure: number;
  openValves: string[];
}

const maxTime = 30;

const allDistances: Record<string, Record<string, number>> = {};

export const getDistances = (state: State): Record<string, number> => {
  if (allDistances[state.position] !== undefined) {
    return allDistances[state.position];
  }
  const visited: Set<Node<Valve, number>> = new Set();
  const queue: Node<Valve, number>[] = [];

  visited.add(state.graph.nodes[state.position]);
  queue.push(state.graph.nodes[state.position]);

  const distances = {
    [state.position]: 0,
  };

  while (queue.length > 0) {
    const currentNode = queue.shift()!;

    for (const neighbor of currentNode.neighbors) {
      if (!visited.has(neighbor.node)) {
        visited.add(neighbor.node);
        queue.push(neighbor.node);
        distances[neighbor.node.value.name] = Math.min(
          distances[currentNode.value.name] + 1,
          distances[neighbor.node.value.name] ?? 1000,
        );
      }
    }
  }

  allDistances[state.position] = distances;

  return distances;
};

const getRewards = (
  state: State,
): { name: string; cost: number; reward: number }[] => {
  const stack: Node<Valve, number>[] = [];

  stack.push(state.graph.nodes[state.position]);

  const distances = getDistances(state);

  const rewards = Object.entries(distances)
    .map(([key, value]) => ({
      name: key,
      cost: value + 1,
      reward:
        (maxTime - state.currentTime - value - 1) *
        state.graph.nodes[key].value.flowRate,
    }))
    .filter(r => r.reward > 0)
    .filter(r => !state.openValves.includes(r.name))
    .sort((r1, r2) => r2.reward - r1.reward);

  return rewards;
};

const findBestState = (state: State): State => {
  let bestState = { ...state };

  // console.log('---');
  // console.log(
  //   pick(bestState, 'position', 'currentTime', 'pressure', 'openValves'),
  // );

  let rewards = getRewards(state);

  // console.log(rewards);

  for (let reward of rewards) {
    let nextState: State = {
      currentTime: state.currentTime + reward.cost,
      graph: state.graph,
      openValves: [
        ...state.openValves,
        state.graph.nodes[reward.name].value.name,
      ],
      position: reward.name,
      pressure: state.pressure + reward.reward,
    };

    nextState = findBestState(nextState);

    if (nextState.pressure > bestState.pressure) {
      bestState = nextState;
    }
  }

  return bestState;
};

const parseLine = (line: string) => {
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
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const inputs = file.split('\n').map(parseLine);

  const graph = new Graph<Valve, number>();

  for (let input of inputs) {
    graph.addNode({
      name: input.name,
      flowRate: input.flowRate,
    });
  }

  for (let input of inputs) {
    const sourceNode = graph.nodes[input.name];
    for (let tunnel of input.tunnels) {
      const directionNode = graph.nodes[tunnel];
      graph.addEdge(sourceNode, directionNode, 1);
    }
  }

  const bestFinalState = findBestState({
    currentTime: 0,
    graph,
    openValves: [],
    position: 'AA',
    pressure: 0,
  });

  console.log(allDistances);
  console.log(bestFinalState);

  return bestFinalState.pressure;
};

const response = exercise1();
console.log(response);
