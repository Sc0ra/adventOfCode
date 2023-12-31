export class Node<NodeType, EdgeType> {
  value: NodeType;
  neighbors: { node: Node<NodeType, EdgeType>; weight: EdgeType }[];

  constructor(value: NodeType) {
    this.value = value;
    this.neighbors = [];
  }

  addNeighbor(node: Node<NodeType, EdgeType>, weight: EdgeType) {
    this.neighbors.push({ node, weight });
  }

  toString() {
    return JSON.stringify(
      {
        value: this.value,
        neighbors: this.neighbors.map(({ weight, node }) => ({
          weight,
          value: node.value,
        })),
      },
      null,
      2,
    );
  }
}

export class Graph<NodeType extends { name: string }, EdgeType> {
  nodes: Record<string, Node<NodeType, EdgeType>>;
  edges: { a: string; b: string }[];

  constructor() {
    this.nodes = {};
    this.edges = [];
  }

  addNode(value: NodeType) {
    const node = new Node<NodeType, EdgeType>(value);
    this.nodes[value.name] = node;
  }

  addEdge(
    source: Node<NodeType, EdgeType>,
    destination: Node<NodeType, EdgeType>,
    weight: EdgeType,
  ) {
    this.edges.push({ a: source.value.name, b: destination.value.name });
    source.addNeighbor(destination, weight);
  }
}

export const bfs = <NodeType, EdgeType>(
  startNode: Node<NodeType, EdgeType>,
) => {
  const visited: Set<Node<NodeType, EdgeType>> = new Set();
  const queue: Node<NodeType, EdgeType>[] = [];

  visited.add(startNode);
  queue.push(startNode);

  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    console.log(currentNode.value);

    for (const neighbor of currentNode.neighbors) {
      if (!visited.has(neighbor.node)) {
        visited.add(neighbor.node);
        queue.push(neighbor.node);
      }
    }
  }
};

export const dfs = <NodeType, EdgeType>(
  startNode: Node<NodeType, EdgeType>,
) => {
  const visited: Set<Node<NodeType, EdgeType>> = new Set();
  const stack: Node<NodeType, EdgeType>[] = [];

  stack.push(startNode);

  while (stack.length > 0) {
    const currentNode = stack.pop()!;
    if (!visited.has(currentNode)) {
      console.log(currentNode.value);
      visited.add(currentNode);

      for (const neighbor of currentNode.neighbors) {
        stack.push(neighbor.node);
      }
    }
  }
};
