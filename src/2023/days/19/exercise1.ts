import { readFileSync } from 'fs';
import path from 'path';

interface Operation {
  condition: '>' | '<' | 'default';
  leftValue?: 'x' | 'm' | 'a' | 's';
  rightValue?: number;
  destination: string;
}

interface Part {
  x: number;
  m: number;
  a: number;
  s: number;
}

interface Workflow {
  name: string;
  operations: Operation[];
}

const applyOperations = (
  part: Part,
  operations: Operation[],
): string | boolean => {
  for (let { condition, leftValue, rightValue, destination } of operations) {
    // console.log({ condition, leftValue, rightValue, destination });
    const dest =
      destination === 'A' ? true : destination === 'R' ? false : destination;
    if (condition === 'default') {
      console.log(`-> ${dest}`);
      return dest;
    }
    if (
      condition === '<' &&
      leftValue !== undefined &&
      rightValue !== undefined
    ) {
      if (part[leftValue] < rightValue) {
        console.log(`-> ${dest}`);
        return dest;
      }
      continue;
    }
    if (
      condition === '>' &&
      leftValue !== undefined &&
      rightValue !== undefined
    ) {
      if (part[leftValue] > rightValue) {
        console.log(`-> ${dest}`);
        return dest;
      }
      continue;
    }
  }
  throw new Error();
};

const appplyWorkflow = (
  part: Part,
  workflows: Record<string, Workflow>,
  currentWorkflow: string,
): boolean => {
  const workflow = workflows[currentWorkflow];
  const res = applyOperations(part, workflow.operations);

  if (typeof res === 'boolean') {
    return res;
  }

  return appplyWorkflow(part, workflows, res);
};

const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const [workflowsString, partsString] = file.split('\n\n');

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
          const rightValue = operationString.slice(infIndex + 1, destIndex);
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
          const rightValue = operationString.slice(supIndex + 1, destIndex);
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

  const parts: Part[] = partsString.split('\n').map(line => {
    line = line.substring(1, line.length - 1);
    const [xPart, mPart, aPart, sPart] = line.split(',');
    return {
      x: Number.parseInt(xPart.split('=')[1]),
      m: Number.parseInt(mPart.split('=')[1]),
      a: Number.parseInt(aPart.split('=')[1]),
      s: Number.parseInt(sPart.split('=')[1]),
    };
  });

  let result = 0;

  for (let part of parts) {
    console.log(part);
    const res = appplyWorkflow(part, workflows, 'in');

    if (res) {
      result += part.x + part.m + part.a + part.s;
    }
  }

  return result;
};

const response = exercise1();
console.log(response);
