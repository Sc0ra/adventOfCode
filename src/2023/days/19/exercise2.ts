import { readFileSync } from 'fs';
import { sum } from 'lodash';
import path from 'path';

interface Operation {
  condition: '>' | '<' | 'default';
  leftValue?: 'x' | 'm' | 'a' | 's';
  rightValue?: number;
  destination: string;
}

interface Part {
  x: [number, number];
  m: [number, number];
  a: [number, number];
  s: [number, number];
}

interface Workflow {
  name: string;
  operations: Operation[];
}

const applyOperation = (
  part: Part,
  workflows: Record<string, Workflow>,
  operations: Operation[],
  operationIndex: number,
): Part[] => {
  const { condition, leftValue, rightValue, destination } =
    operations[operationIndex];

  const dest =
    destination === 'A' ? true : destination === 'R' ? false : destination;
  if (condition === 'default') {
    if (typeof dest === 'string') {
      return appplyWorkflow(part, workflows, dest);
    }
    return dest ? [part] : [];
  }
  if (
    condition === '<' &&
    leftValue !== undefined &&
    rightValue !== undefined
  ) {
    const leftPart: Part = {
      ...part,
      [leftValue]: [part[leftValue][0], rightValue - 1],
    };
    const leftResultParts =
      typeof dest === 'string'
        ? appplyWorkflow(leftPart, workflows, dest)
        : dest
        ? [leftPart]
        : [];
    const rightPart: Part = {
      ...part,
      [leftValue]: [rightValue, part[leftValue][1]],
    };
    const rightResultParts = applyOperation(
      rightPart,
      workflows,
      operations,
      operationIndex + 1,
    );

    return [...leftResultParts, ...rightResultParts];
  }
  if (
    condition === '>' &&
    leftValue !== undefined &&
    rightValue !== undefined
  ) {
    const leftPart: Part = {
      ...part,
      [leftValue]: [rightValue + 1, part[leftValue][1]],
    };
    const leftResultParts =
      typeof dest === 'string'
        ? appplyWorkflow(leftPart, workflows, dest)
        : dest
        ? [leftPart]
        : [];
    const rightPart: Part = {
      ...part,
      [leftValue]: [part[leftValue][0], rightValue],
    };
    const rightResultParts = applyOperation(
      rightPart,
      workflows,
      operations,
      operationIndex + 1,
    );

    return [...leftResultParts, ...rightResultParts];
  }
  throw new Error();
};

const appplyWorkflow = (
  part: Part,
  workflows: Record<string, Workflow>,
  currentWorkflow: string,
): Part[] => {
  const { operations } = workflows[currentWorkflow];
  return applyOperation(part, workflows, operations, 0);
};

const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const [workflowsString] = file.split('\n\n');

  const workflows = workflowsString
    .split('\n')
    .reduce<Record<string, Workflow>>((acc, line) => {
      const [name, rest] = line.split('{');
      const operationStrings = rest.substring(0, rest.length - 1).split(',');
      const operations = operationStrings.map(operationString => {
        const infIndex = operationString.indexOf('<');
        const supIndex = operationString.indexOf('>');
        const destIndex = operationString.indexOf(':');

        if (infIndex !== -1) {
          const leftValue = operationString.slice(0, infIndex);
          const rightValue = Number.parseInt(
            operationString.slice(infIndex + 1, destIndex),
          );
          const destination = operationString.slice(destIndex + 1);

          return {
            condition: '<',
            leftValue,
            rightValue,
            destination,
          } as unknown as Operation;
        }

        if (supIndex !== -1) {
          const leftValue = operationString.slice(0, supIndex);
          const rightValue = Number.parseInt(
            operationString.slice(supIndex + 1, destIndex),
          );
          const destination = operationString.slice(destIndex + 1);

          return {
            condition: '>',
            leftValue,
            rightValue,
            destination,
          } as unknown as Operation;
        }

        return {
          condition: 'default',
          destination: operationString,
        } as Operation;
      });
      return {
        ...acc,
        [name]: {
          name,
          operations,
        },
      };
    }, {});

  // console.log(workflows);

  const acceptedParts = appplyWorkflow(
    {
      x: [1, 4000],
      m: [1, 4000],
      a: [1, 4000],
      s: [1, 4000],
    },
    workflows,
    'in',
  );

  return sum(
    acceptedParts.map(
      ({ x, m, a, s }) =>
        (x[1] - x[0] + 1) *
        (m[1] - m[0] + 1) *
        (a[1] - a[0] + 1) *
        (s[1] - s[0] + 1),
    ),
  );
};

const response = exercise1();
console.log(response);
