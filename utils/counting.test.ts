import { describe, expect, it } from 'vitest';
import {
  AllCountInputFormMask,
  clampCountBeforeTarget,
  countInputFormMaskFromForms,
  countInputFormsFromMask,
  CountAttemptKind,
  DefaultCountInputFormMask,
  evaluateCountAttempt,
  getFirstCount,
  getExpectedCount,
  hasCountInputForm,
  isValidCountInputFormMask,
  moveCountBackward,
  moveCountForward,
  parseCountInputCandidates,
  parsePlainCountInput,
} from './counting.ts';
import { CountInputForm, CountingMode } from '../payloads/Channel.ts';

describe('parsePlainCountInput', () => {
  it('accepts plain decimal input', () => {
    expect(parsePlainCountInput('42')).toBe(42);
    expect(parsePlainCountInput(' 42 ')).toBe(42);
  });

  it('rejects prefixed and formatted input', () => {
    expect(parsePlainCountInput('0x2a')).toBeNull();
    expect(parsePlainCountInput('0b101010')).toBeNull();
    expect(parsePlainCountInput('4.2')).toBeNull();
    expect(parsePlainCountInput('1e3')).toBeNull();
    expect(parsePlainCountInput('hello')).toBeNull();
  });
});

describe('parseCountInputCandidates', () => {
  it('parses reverse decimal when enabled', () => {
    expect(parseCountInputCandidates('42', CountInputForm.ReverseDecimal)).toEqual([24]);
  });

  it('parses hex when enabled', () => {
    expect(parseCountInputCandidates('0x2a', CountInputForm.Hex)).toEqual([42]);
  });

  it('parses binary when enabled', () => {
    expect(parseCountInputCandidates('0b101010', CountInputForm.Binary)).toEqual([42]);
  });

  it('parses scientific notation when enabled', () => {
    expect(parseCountInputCandidates('1e3', CountInputForm.Scientific)).toEqual([1000]);
    expect(parseCountInputCandidates('1e-1', CountInputForm.Scientific)).toEqual([]);
  });
});

describe('input form masks', () => {
  it('encodes and decodes mask values', () => {
    const mask = countInputFormMaskFromForms([CountInputForm.PlainDecimal, CountInputForm.ReverseDecimal]);

    expect(mask).toBe(CountInputForm.PlainDecimal | CountInputForm.ReverseDecimal);
    expect(countInputFormsFromMask(mask)).toEqual([CountInputForm.PlainDecimal, CountInputForm.ReverseDecimal]);
  });

  it('supports mask checks and defaults', () => {
    const mask = CountInputForm.Hex | CountInputForm.Binary;

    expect(hasCountInputForm(mask, CountInputForm.Hex)).toBe(true);
    expect(hasCountInputForm(mask, CountInputForm.PlainDecimal)).toBe(false);
    expect(countInputFormsFromMask(0)).toEqual([CountInputForm.PlainDecimal]);
    expect(DefaultCountInputFormMask).toBe(CountInputForm.PlainDecimal);
    expect(AllCountInputFormMask).toBe(
      CountInputForm.PlainDecimal |
        CountInputForm.ReverseDecimal |
        CountInputForm.Hex |
        CountInputForm.Binary |
        CountInputForm.Scientific,
    );
  });

  it('validates mask policy consistently', () => {
    expect(isValidCountInputFormMask(undefined)).toBe(false);
    expect(isValidCountInputFormMask(0)).toBe(false);
    expect(isValidCountInputFormMask(99)).toBe(false);
    expect(isValidCountInputFormMask(CountInputForm.ReverseDecimal)).toBe(true);
    expect(isValidCountInputFormMask(CountInputForm.PlainDecimal)).toBe(true);
  });
});

describe('evaluateCountAttempt', () => {
  it('classifies valid counts', () => {
    expect(evaluateCountAttempt('11', 10, CountingMode.Default)).toEqual({
      kind: CountAttemptKind.Valid,
      parsedCount: 11,
      expectedCount: 11,
    });
  });

  it('classifies wrong numeric counts', () => {
    expect(evaluateCountAttempt('12', 10, CountingMode.Default)).toEqual({
      kind: CountAttemptKind.WrongNumeric,
      parsedCount: 12,
      expectedCount: 11,
    });
  });

  it('classifies non-counting input', () => {
    expect(evaluateCountAttempt('hello', 10, CountingMode.Default)).toEqual({
      kind: CountAttemptKind.NonCounting,
    });
  });

  it('supports reverse form when enabled', () => {
    expect(
      evaluateCountAttempt('42', 23, CountingMode.Default, {
        allowedInputFormMask: CountInputForm.PlainDecimal | CountInputForm.ReverseDecimal,
      }),
    ).toEqual({
      kind: CountAttemptKind.Valid,
      parsedCount: 24,
      expectedCount: 24,
    });
  });

  it('supports reverse-only counting channels', () => {
    expect(
      evaluateCountAttempt('42', 23, CountingMode.Default, {
        allowedInputFormMask: CountInputForm.ReverseDecimal,
      }),
    ).toEqual({
      kind: CountAttemptKind.Valid,
      parsedCount: 24,
      expectedCount: 24,
    });

    expect(
      evaluateCountAttempt('24', 23, CountingMode.Default, {
        allowedInputFormMask: CountInputForm.ReverseDecimal,
      }),
    ).toEqual({
      kind: CountAttemptKind.WrongNumeric,
      parsedCount: 42,
      expectedCount: 24,
    });
  });
});

describe('count movement', () => {
  it('returns first count per mode', () => {
    expect(getFirstCount(CountingMode.Default)).toBe(1);
    expect(getFirstCount(CountingMode.Odd)).toBe(1);
    expect(getFirstCount(CountingMode.Even)).toBe(2);
    expect(getFirstCount(CountingMode.Five)).toBe(5);
    expect(getFirstCount(CountingMode.Prime)).toBe(2);
  });

  it('advances arithmetic and prime sequences correctly', () => {
    expect(getExpectedCount(10, CountingMode.Default)).toBe(11);
    expect(getExpectedCount(1, CountingMode.Even)).toBe(2);
    expect(getExpectedCount(2, CountingMode.Even)).toBe(4);
    expect(getExpectedCount(5, CountingMode.Five)).toBe(10);
    expect(getExpectedCount(11, CountingMode.Prime)).toBe(13);
  });

  it('moves forward by sequence positions', () => {
    expect(moveCountForward(15, CountingMode.Five, 3)).toBe(30);
    expect(moveCountForward(1, CountingMode.Even, 3)).toBe(6);
    expect(moveCountForward(11, CountingMode.Prime, 3)).toBe(19);
  });

  it('moves backward by sequence positions', () => {
    expect(moveCountBackward(30, CountingMode.Five, 3)).toBe(15);
    expect(moveCountBackward(6, CountingMode.Even, 3)).toBe(0);
    expect(moveCountBackward(19, CountingMode.Prime, 3)).toBe(11);
  });

  it('clamps to the last valid count below the target', () => {
    expect(clampCountBeforeTarget(30, CountingMode.Five, 29)).toBe(25);
    expect(clampCountBeforeTarget(30, CountingMode.Default, 29)).toBe(28);
    expect(clampCountBeforeTarget(19, CountingMode.Prime, 18)).toBe(17);
  });
});
