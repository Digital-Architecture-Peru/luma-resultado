import { describe, expect, it } from 'vitest';
import {
  MAX_TITLE_LENGTH,
  countTasks,
  formatCounter,
  validateTitle,
} from '../src/features/tasks/taskModel.js';

describe('validateTitle', () => {
  it('given a title with extra spaces, when validated, then it is normalized', () => {
    expect(validateTitle('  hola   mundo ')).toEqual({ valid: true, value: 'hola mundo', error: '' });
  });

  it('given an empty or non-string title, when validated, then it is invalid', () => {
    expect(validateTitle('   ').valid).toBe(false);
    expect(validateTitle(null).valid).toBe(false);
  });

  it('given a title too long, when validated, then it is invalid', () => {
    expect(validateTitle('a'.repeat(MAX_TITLE_LENGTH + 1)).valid).toBe(false);
    expect(validateTitle('a'.repeat(MAX_TITLE_LENGTH)).valid).toBe(true);
  });
});

describe('countTasks / formatCounter', () => {
  it('given mixed tasks, when counted, then totals are right', () => {
    const counts = countTasks([{ done: true }, { done: false }, { done: false }]);
    expect(counts).toEqual({ total: 3, done: 1, pending: 2 });
    expect(formatCounter(counts)).toBe('2 pendientes · 1 completada · 3 en total');
  });

  it('given no tasks, when formatted, then says no tasks', () => {
    expect(formatCounter(countTasks([]))).toBe('Sin tareas');
  });

  it('given one pending, when formatted, then uses singular', () => {
    expect(formatCounter(countTasks([{ done: false }]))).toBe('1 pendiente · 0 completadas · 1 en total');
  });
});
