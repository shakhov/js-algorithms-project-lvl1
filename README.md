# Поисковый движок

Данное приложение выполнено в рамках обучения на [Hexlet](https://ru.hexlet.io) в качестве итогового проекта по курсу [JS: Алгоритмы и структуры данных](https://ru.hexlet.io/programs/js-algorithms).


### Hexlet tests and linter status:
[![Hexlet actions Status](https://github.com/shakhov/js-algorithms-project-lvl1/workflows/hexlet-check/badge.svg)](https://github.com/shakhov/js-algorithms-project-lvl1/actions)
[![CI github action status](https://github.com/shakhov/js-algorithms-project-lvl1/workflows/Node%20CI/badge.svg)](https://github.com/shakhov/js-algorithms-project-lvl1/actions)

[![Maintainability](https://api.codeclimate.com/v1/badges/9392299dcda8cc525d6c/maintainability)](https://codeclimate.com/github/shakhov/js-algorithms-project-lvl1/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/9392299dcda8cc525d6c/test_coverage)](https://codeclimate.com/github/shakhov/js-algorithms-project-lvl1/test_coverage)

## Архитектура

В основе поискового движка лежит подход с использованием инвертированного индекса. Он сокращает время на поиск в несколько раз.
Ранжирование результатов основано на метрике [TF-IDF](https://ru.wikipedia.org/wiki/TF-IDF).

## Пример использования:

``` js
import buildSearchEngine from '@hexlet-code';

const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
const doc2 = { id: 'doc2', text: "Don't shoot shoot shoot that thing at me." };
const doc3 = { id: 'doc3', text: "I'm your shooter." };
const docs = [doc1, doc2, doc3];

const searchEngine = buildSearchEngine(docs);

searchEngine.search('shoot'); // ['doc1', 'doc2']
```

---

![Hexlet Ltd. logo](https://raw.githubusercontent.com/Hexlet/assets/master/images/hexlet_logo128.png)
