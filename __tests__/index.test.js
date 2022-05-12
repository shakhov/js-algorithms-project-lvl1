import { test, expect } from '@jest/globals';
import buildSearchEngine from '../src/index.js';

test('has search', () => {
  expect(buildSearchEngine()).toHaveProperty('search');
});
