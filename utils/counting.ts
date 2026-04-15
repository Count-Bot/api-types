import { CountingMode } from '../payloads/Channel.js';

const arithmeticStepSizes: Partial<Record<CountingMode, number>> = {
  [CountingMode.Default]: 1,
  [CountingMode.Even]: 2,
  [CountingMode.Odd]: 2,
  [CountingMode.Three]: 3,
  [CountingMode.Four]: 4,
  [CountingMode.Five]: 5,
  [CountingMode.Six]: 6,
  [CountingMode.Seven]: 7,
  [CountingMode.Eight]: 8,
  [CountingMode.Nine]: 9,
  [CountingMode.Ten]: 10,
};

export enum CountAttemptKind {
  Valid = 'valid',
  WrongNumeric = 'wrong-numeric',
  NonCounting = 'non-counting',
}

export interface CountAttemptEvaluation {
  kind: CountAttemptKind;
  parsedCount?: number;
  expectedCount?: number;
}

export interface EvaluateCountAttemptOptions {
  allowedInputFormMask?: number;
}

type CountInputParser = (raw: string) => number | null;

export const CountInputFormPlainDecimal = 1 << 0;
export const CountInputFormReverseDecimal = 1 << 1;
export const CountInputFormHex = 1 << 2;
export const CountInputFormBinary = 1 << 3;
export const CountInputFormScientific = 1 << 4;

const countInputFormValues: readonly number[] = [
  CountInputFormPlainDecimal,
  CountInputFormReverseDecimal,
  CountInputFormHex,
  CountInputFormBinary,
  CountInputFormScientific,
];

export const DefaultCountInputFormMask = CountInputFormPlainDecimal;
export const AllCountInputFormMask = countInputFormValues.reduce((mask, form) => mask | form, 0);

function parseInputAsPlainDecimal(raw: string): number | null {
  const trimmed = raw.trim();

  if (!/^\d+$/.test(trimmed)) {
    return null;
  }

  const value = Number(trimmed);

  return Number.isSafeInteger(value) ? value : null;
}

function parseInputAsReverseDecimal(raw: string): number | null {
  const trimmed = raw.trim();

  if (!/^\d+$/.test(trimmed)) {
    return null;
  }

  const reversed = trimmed.split('').reverse().join('');
  const value = Number(reversed);

  return Number.isSafeInteger(value) ? value : null;
}

function parseInputAsHex(raw: string): number | null {
  const trimmed = raw.trim();

  if (!/^0x[\da-f]+$/i.test(trimmed)) {
    return null;
  }

  const value = Number.parseInt(trimmed.slice(2), 16);

  return Number.isSafeInteger(value) ? value : null;
}

function parseInputAsBinary(raw: string): number | null {
  const trimmed = raw.trim();

  if (!/^0b[01]+$/i.test(trimmed)) {
    return null;
  }

  const value = Number.parseInt(trimmed.slice(2), 2);

  return Number.isSafeInteger(value) ? value : null;
}

function parseInputAsScientific(raw: string): number | null {
  const trimmed = raw.trim();

  // Restricted to integer-mantissa scientific notation for now (e.g. 1e3).
  if (!/^\d+e[+-]?\d+$/i.test(trimmed)) {
    return null;
  }

  const value = Number(trimmed);

  if (!Number.isFinite(value) || !Number.isSafeInteger(value)) {
    return null;
  }

  return value;
}

const countInputParsers: Record<number, CountInputParser> = {
  [CountInputFormPlainDecimal]: parseInputAsPlainDecimal,
  [CountInputFormReverseDecimal]: parseInputAsReverseDecimal,
  [CountInputFormHex]: parseInputAsHex,
  [CountInputFormBinary]: parseInputAsBinary,
  [CountInputFormScientific]: parseInputAsScientific,
};

function normalizeInputFormMask(inputFormMask?: number): number {
  if (!isValidCountInputFormMask(inputFormMask)) {
    return DefaultCountInputFormMask;
  }

  return inputFormMask;
}

export function isValidCountInputFormMask(inputFormMask: number | undefined): inputFormMask is number {
  if (!Number.isInteger(inputFormMask) || inputFormMask === undefined || inputFormMask <= 0) {
    return false;
  }

  const hasUnknownInputFormBits = (inputFormMask & ~AllCountInputFormMask) !== 0;

  if (hasUnknownInputFormBits) {
    return false;
  }

  return true;
}

export function hasCountInputForm(inputFormMask: number, form: number): boolean {
  return (inputFormMask & form) === form;
}

export function countInputFormsFromMask(inputFormMask?: number): number[] {
  const normalizedMask = normalizeInputFormMask(inputFormMask);
  const forms = countInputFormValues.filter(form => hasCountInputForm(normalizedMask, form));

  if (forms.length === 0) {
    return [CountInputFormPlainDecimal];
  }

  return forms;
}

export function countInputFormMaskFromForms(forms: readonly number[]): number {
  if (forms.length === 0) {
    return DefaultCountInputFormMask;
  }

  const unique = Array.from(new Set(forms));

  return unique.reduce((mask, form) => mask | form, 0);
}

export function parseCountInputCandidates(raw: string, allowedInputFormMask?: number): number[] {
  const forms = countInputFormsFromMask(allowedInputFormMask);

  const candidates: number[] = [];
  const seen = new Set<number>();

  for (const form of forms) {
    const parser = countInputParsers[form];
    const candidate = parser(raw);

    if (candidate === null || seen.has(candidate)) {
      continue;
    }

    seen.add(candidate);
    candidates.push(candidate);
  }

  return candidates;
}

export function parsePlainCountInput(raw: string): number | null {
  const [candidate] = parseCountInputCandidates(raw, CountInputFormPlainDecimal);

  return candidate ?? null;
}

export function evaluateCountAttempt(
  raw: string,
  current: number,
  mode: CountingMode,
  options?: EvaluateCountAttemptOptions,
): CountAttemptEvaluation {
  const candidates = parseCountInputCandidates(raw, options?.allowedInputFormMask);

  if (candidates.length === 0) {
    return {
      kind: CountAttemptKind.NonCounting,
    };
  }

  const expectedCount = getExpectedCount(current, mode);
  const validCandidate = candidates.find(candidate => candidate === expectedCount);

  return {
    kind: validCandidate !== undefined ? CountAttemptKind.Valid : CountAttemptKind.WrongNumeric,
    parsedCount: validCandidate ?? candidates[0],
    expectedCount,
  };
}

export function getExpectedCount(current: number, mode: CountingMode) {
  return moveCountForward(current, mode, 1);
}

export function getFirstCount(mode: CountingMode): number {
  const modeMap: Record<CountingMode, number> = {
    [CountingMode.Default]: 1,
    [CountingMode.Odd]: 1,
    [CountingMode.Even]: 2,
    [CountingMode.Three]: 3,
    [CountingMode.Four]: 4,
    [CountingMode.Five]: 5,
    [CountingMode.Six]: 6,
    [CountingMode.Seven]: 7,
    [CountingMode.Eight]: 8,
    [CountingMode.Nine]: 9,
    [CountingMode.Ten]: 10,
    [CountingMode.Prime]: 2,
  };

  return modeMap[mode];
}

export function moveCountForward(current: number, mode: CountingMode, steps = 1): number {
  if (steps < 0) {
    return moveCountBackward(current, mode, Math.abs(steps));
  }

  let result = current;

  for (let i = 0; i < steps; i++) {
    result = getNextCount(result, mode);
  }

  return result;
}

export function moveCountBackward(current: number, mode: CountingMode, steps = 1): number {
  if (steps < 0) {
    return moveCountForward(current, mode, Math.abs(steps));
  }

  let result = current;

  for (let i = 0; i < steps; i++) {
    result = getPreviousCount(result, mode);
  }

  return result;
}

export function clampCountBeforeTarget(current: number, mode: CountingMode, target: number): number {
  let result = current;

  while (result >= target) {
    const previous = getPreviousCount(result, mode);

    if (previous === result) {
      break;
    }

    result = previous;
  }

  return result;
}

export function getNextCount(count: number, mode: CountingMode): number {
  switch (mode) {
    case CountingMode.Prime:
      return getNextPrime(count);
    default: {
      const stepSize = arithmeticStepSizes[mode];

      if (stepSize === undefined) {
        throw new Error(`Unsupported counting mode: ${mode}`);
      }

      if (mode === CountingMode.Even) {
        if (count % 2 === 0) {
          return count + 2;
        }

        return count + 1;
      }

      if (mode === CountingMode.Odd) {
        if (count % 2 === 0) {
          return count + 1;
        }

        return count + 2;
      }

      return count + stepSize;
    }
  }
}

export function getPreviousCount(count: number, mode: CountingMode): number {
  switch (mode) {
    case CountingMode.Prime:
      return getPreviousPrime(count);

    case CountingMode.Default:
      return count - 1;

    case CountingMode.Even:
      return count % 2 === 0 ? count - 2 : count - 1;

    case CountingMode.Odd:
      if (count <= 1) {
        return 0;
      }

      return count % 2 === 0 ? count - 1 : count - 2;

    default: {
      const stepSize = arithmeticStepSizes[mode];

      if (stepSize === undefined) {
        throw new Error(`Unsupported counting mode: ${mode}`);
      }

      return count - stepSize;
    }
  }
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

export function getPreviousPrime(number: number): number {
  if (number <= 2) {
    return 1;
  }

  let num = number - 1;

  while (num > 1) {
    if (isPrime(num)) {
      return num;
    }

    num--;
  }

  return 1;
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
