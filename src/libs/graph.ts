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
}

export class Graph<NodeType, EdgeType> {
  nodes: Node<NodeType, EdgeType>[];

  constructor() {
    this.nodes = [];
  }

  addNode(value: NodeType) {
    const node = new Node<NodeType, EdgeType>(value);
    this.nodes.push(node);
  }

  addEdge(
    source: Node<NodeType, EdgeType>,
    destination: Node<NodeType, EdgeType>,
    weight: EdgeType,
  ) {
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
