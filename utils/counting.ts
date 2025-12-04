import { CountingMode } from '../v1.js';

const multiples = {
  [CountingMode.Three]: 3,
  [CountingMode.Four]: 4,
  [CountingMode.Five]: 5,
  [CountingMode.Six]: 6,
  [CountingMode.Seven]: 7,
  [CountingMode.Eight]: 8,
  [CountingMode.Nine]: 9,
  [CountingMode.Ten]: 10,
};

export function getExpectedCount(current: number, mode: CountingMode) {
  switch (mode) {
    case CountingMode.Default: {
      return current + 1;
    }

    case CountingMode.Even: {
      if (current % 2 === 0) {
        return current + 2;
      }

      return current + 1;
    }

    case CountingMode.Odd: {
      if (current % 2 === 0) {
        return current + 1;
      }

      return current + 2;
    }

    case CountingMode.Prime: {
      return getNextPrime(current);
    }

    default:
      return getNextMultiple(current, mode);
  }
}

export function getNextMultiple(
  count: number,
  mode: Exclude<CountingMode, CountingMode.Default | CountingMode.Odd | CountingMode.Even | CountingMode.Prime>,
): number {
  return count + (multiples[mode] - (count % multiples[mode]));
}

export function getNextPrime(number: number): number {
  let num = number + 1;

  let prime = true;

  while (prime) {
    if (isPrime(num)) {
      prime = false;
    } else {
      num++;
    }
  }

  return num;
}

export function isPrime(number: number): boolean {
  if (number <= 1) {
    return false;
  }

  if (number <= 3) {
    return true;
  }

  if (number % 2 === 0 || number % 3 === 0) {
    return false;
  }

  for (let i = 5; i * i <= number; i += 6) {
    if (number % i === 0 || number % (i + 2) === 0) {
      return false;
    }
  }

  return true;
}
