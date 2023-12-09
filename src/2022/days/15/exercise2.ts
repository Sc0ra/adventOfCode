import { readFileSync } from 'fs';
import { countBy, mapKeys, range } from 'lodash';
import path from 'path';

// Sensor at x=2, y=18: closest beacon is at x=-2, y=15
const parseLine = (
  line: string,
): {
  sensor: { x: number; y: number };
  closestBeacon: { x: number; y: number };
} => {
  const [sensor, closestBeacon] = line.split(': closest beacon is at x=');
  const sensorPosition = sensor.split('Sensor at x=')[1].split(', y=');
  const closestBeaconPosition = closestBeacon.split(', y=');
  return {
    sensor: {
      x: parseInt(sensorPosition[0]),
      y: parseInt(sensorPosition[1]),
    },
    closestBeacon: {
      x: parseInt(closestBeaconPosition[0]),
      y: parseInt(closestBeaconPosition[1]),
    },
  };
};

export const exercise1 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const inputs = file.split('\n').map(parseLine);

  const map: Record<number, Record<number, number>> = {};

  let maxVal = 1;
  let solX = 3157535;
  let solY = 3363767;

  console.log(solX * 4000000 + solY);

  const deepSet = (y: number, x: number) => {
    if (map[y] === undefined) {
      map[y] = {
        [x]: 1,
      };
    } else if (map[y][x] === undefined) {
      map[y][x] = 1;
    } else {
      map[y][x] += 1;
    }
    if (map[y][x] > maxVal) {
      maxVal = map[y][x];
      solX = x;
      solY = y;
      console.log({ val: map[y][x], x, y });
    }
  };

  for (let input of inputs) {
    console.log(input);

    let yDist = Math.abs(input.sensor.y - input.closestBeacon.y);

    let xDist = Math.abs(input.sensor.x - input.closestBeacon.x);

    let dist = yDist + xDist + 1;

    for (let i = 0; i < dist; i++) {
      const distX = dist - i;
      const distY = i;
      deepSet(input.sensor.y - distY, input.sensor.x - distX);
      deepSet(input.sensor.y + distY, input.sensor.x + distX);
      deepSet(input.sensor.y - distY, input.sensor.x + distX);
      deepSet(input.sensor.y + distY, input.sensor.x - distX);
    }
  }

  console.log('---');

  return solX * 4000000 + solY;
};

const response = exercise1();
console.log(response);
