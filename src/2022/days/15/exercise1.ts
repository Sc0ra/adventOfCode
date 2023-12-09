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

  const lineToCheck = 2000000;

  const map: Record<number, Record<number, string>> = {};

  const deepSet = (y: number, x: number, value: string) => {
    if (map[y] === undefined) {
      map[y] = {};
    }
    map[y][x] = value;
  };

  for (let input of inputs) {
    console.log(input);
    deepSet(input.sensor.y, input.sensor.x, 'S');
    deepSet(input.closestBeacon.y, input.closestBeacon.x, 'B');

    let yDist = Math.abs(input.sensor.y - input.closestBeacon.y);

    let yDistLineToCheck = Math.abs(input.sensor.y - lineToCheck);

    let xDist = Math.abs(input.sensor.x - input.closestBeacon.x);

    let dist = yDist + xDist;

    for (let i = -dist; i <= dist; i++) {
      const pointDist = Math.abs(i) + yDistLineToCheck;
      if (
        pointDist <= dist &&
        pointDist !== 0 &&
        map[lineToCheck]?.[input.sensor.x + i] === undefined
      ) {
        deepSet(lineToCheck, input.sensor.x + i, '#');
      }
    }
  }

  const result = countBy(Object.values(map[lineToCheck]));

  return result;
};

const response = exercise1();
console.log(response);
