import { test, expect } from '@jest/globals';
import buildSearchEngine from '../src/index.js';

const emptySearchEngine = buildSearchEngine();

const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
const doc2 = { id: 'doc2', text: "Don't shoot shoot shoot that thing at me." };
const doc3 = { id: 'doc3', text: "I'm your shooter." };
const docs = [doc1, doc2, doc3];

let searchEngine;

beforeAll(() => {
  searchEngine = buildSearchEngine(docs);
});

test('has search', () => {
  expect(emptySearchEngine).toHaveProperty('search');
  expect(emptySearchEngine.search).toBeInstanceOf(Function);
  expect(emptySearchEngine.search('')).toEqual([]);
});

test('word search', () => {
  const word = 'shoot';
  expect(searchEngine.search(word)).toEqual(['doc1', 'doc2']);
});
