import { CountingMode } from '../v1.js';

const multiples = {
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  NINE: 9,
  TEN: 10,
};

export function getExpectedCount(current: number, mode: CountingMode) {
  switch (mode) {
    case 'DEFAULT': {
      return current + 1;
    }

    case 'EVEN': {
      if (current % 2 === 0) {
        return current + 2;
      }

      return current + 1;
    }

    case 'ODD': {
      if (current % 2 === 0) {
        return current + 1;
      }

      return current + 2;
    }

    case 'PRIME': {
      return getNextPrime(current);
    }

    default:
      return getNextMultiple(current, mode);
  }
}

export function getNextMultiple(
  count: number,
  mode: Exclude<CountingMode, 'DEFAULT' | 'ODD' | 'EVEN' | 'PRIME'>,
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
